/* host */
var host=location.hostname + (location.port ? ':'+location.port: '');
var full_url=window.location.href;
var virtuoso_url = "http://vt." + host;
var api_url = "http://api." + host;
var sparql_url = virtuoso_url + "/sparql";
var fct_url = virtuoso_url + "/fct";
var describe_url = virtuoso_url + "/describe";


/* HEADER fun */
var toggleHeader = function() {
  $('#header').toggle();
}
var hideHeader = function() {
  $('#header').hide();
}
var showHeader = function() {
  $('#header').show()
}

/* SEARCH */
var load_search = function() {
  var submitIcon = $('.searchbox-icon');
  var inputBox = $('.searchbox-input');
  var searchBox = $('.searchbox');
  var isOpen = false;
  submitIcon.click(function(){
    if(isOpen == false){
      searchBox.addClass('searchbox-open');
      inputBox.focus();
      isOpen = true;
    } else {
      searchBox.removeClass('searchbox-open');
      inputBox.focusout();
      isOpen = false;
    }
  });
  submitIcon.mouseup(function(){
    return false;
  });
  searchBox.mouseup(function(){
    return false;
  });
  inputBox.mouseup(function(){
    return false;
  });
  $(window).mouseup(function(){
    if(isOpen == true){
      searchBox.removeClass('searchbox-open');
      inputBox.focusout();
      isOpen = false;
    }
  });
};

var xhr = null;
var labels_uri = {}

var autocomplete = new autoComplete({
  selector: '#myinput',
  minChars: 1,
  source: function(term, suggest){
    term = term.toLowerCase();
    try { xhr.abort(); } catch(e){}
    $("#searchload").show();
    xhr = $.ajax({
      url: api_url + '/v1/search?q=' + term,
      type: 'GET',
      dataType: 'json'
    })
      .success(function(data) {
        var choices = [];
        labels_uri = {};
        $.each(data['results']['bindings'], function(key,value) {
          // current_search_results[value['l']['value']] = value['s']['value'];
          // list.push(value['l']['value']);#
          choices.push(value['l']['value'])
          labels_uri[value['l']['value']] = value['s']['value'];
        });
        if (choices.length > 0 && choices != []) {
          var suggestions = [];
          for (i=0;i<choices.length;i++)
            if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
          suggest(suggestions);
        }
        $("#searchload").hide();
      })
      .error(function(){
        $("#searchload").hide();
      })
  },
  onSelect: function(e, term, item){
    $('.searchbox-input').val(item.getAttribute('data-val'));
    $('#virtuosoiframe').attr('src', describe_url+"/?url="+labels_uri[item.getAttribute('data-val')])
    $("#main_tabs a[href='#browse']").tab("show");
    // hideHeader();
    window.setTimeout(function (){
      $('.searchbox-icon').click();
    }, 1500);
  }
});



/* Network graph */
// Add a method to the graph model that returns an
// object with every neighbors of a node inside:
var graphInstance = {container:'mold_sigma'};
var load_mold_network = function(){
  sigma.classes.graph.addMethod('neighbors', function(nodeId) {
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};
    for (k in index)
      neighbors[k] = this.nodesIndex[k];
    return neighbors;
  });

  sigma.parsers.gexf(
    '../config/mold-network.gexf',
    graphInstance,
    function(s) {
      // We first need to save the original colors of our
      // nodes and edges, like this:
      s.graph.nodes().forEach(function(n) {
        n.originalColor = n.color;
      });
      s.graph.edges().forEach(function(e) {
        e.originalColor = e.color;
      });
      // When a node is clicked, we check for each node
      // if it is a neighbor of the clicked one. If not,
      // we set its color as grey, and else, it takes its
      // original color.
      // We do the same for the edges, and we only keep
      // edges that have both extremities colored.
      s.bind('clickNode', function(e) {
        var nodeId = e.data.node.id,
            toKeep = s.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;
        s.graph.nodes().forEach(function(n) {
          if (toKeep[n.id])
            n.color = n.originalColor;
          else
            n.color = '#eee';
        });
        s.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#eee';
        });
        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s.refresh();
      });
      // When the stage is clicked, we just color each
      // node and edge with its original color.
      s.bind('clickStage', function(e) {
        s.graph.nodes().forEach(function(n) {
          n.color = n.originalColor;
        });
        s.graph.edges().forEach(function(e) {
          e.color = e.originalColor;
        });
        // Same as in the previous event:
        s.refresh();
      });
    }
  );
};

var refresh_mold_network = function() {
  sigma.parsers.gexf(
    '../config/mold-network.gexf',
    graphInstance,
    function(s){
      s.refresh();
    })
}

// hack to load yasqe correctly :
//    first tab is query the move to about tab
$(document).ready(function(){
  $("#main_tabs a[href='#about']").tab("show");
  $('#virtuosoiframe').attr('src', fct_url);
  load_search();
  $("#searchload").hide();
  window.setTimeout(function (){
    load_mold_network();
  }, 1000);
})

var queryExecuted = false;
var refreshAbout = function() {
  // showHeader()
  // weird this timeout below and bool setting remove the glitch WebGL/SVG(d3)
  if (queryExecuted) {
    window.setTimeout(function (){
      queryExecuted = false;
    }, 1000);
  }
}

/* YASQE & YASR SPARQL */
var yasqe = YASQE(document.getElementById("yasqe"), {
  createShareLink: null,
  sparql: {
    showQueryButton: true,
    endpoint: sparql_url,
    requestMethod: "GET"
  }
});
var yasr = YASR(document.getElementById("yasr"), {
  //this way, the URLs in the results are prettified using the defined prefixes in the query
  getUsedPrefixes: yasqe.getPrefixesFromQuery
});
var queryCallback =   function () {
  queryExecuted = true;
  return yasr.setResponse;
}
//link both together
yasqe.options.sparql.callbacks.complete = queryCallback();

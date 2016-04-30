/* host */
var host=window.location.hostname;
var virtuoso_url = "http://" + host + ":9000"
var sparql_url = virtuoso_url + "/sparql";
var fct_url = virtuoso_url + "/fct";
var describe_url = virtuoso_url + "/describe";
var api_url = "http://" + host + ":9393";

/* YASQE & YASR SPARQL */
var yasqe = YASQE(document.getElementById("yasqe"), {
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

//link both together
yasqe.options.sparql.callbacks.complete = yasr.setResponse;

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
  $(document).mouseup(function(){
    if(isOpen == true){
      $('.searchbox-icon').css('display','block');
      submitIcon.click();
    }
  });
};

var current_search_results = {}
var current_ajax_call = null;

function buttonUp(){

  var inputVal = $('.searchbox-input').val();

  inputValLen = $.trim(inputVal).length;

  if( inputValLen !== 0){
    $('.searchbox-icon').css('display','none');
    if(inputValLen > 3){

      current_ajax_call = $.ajax({
        url: api_url + '/v1/search?q=' + inputVal,
        type: 'GET',
        dataType: 'json',
        beforeSend : function()    {
          if(current_ajax_call != null) {
            current_ajax_call.abort();
          }
        },
      })
        .success(function(data) {
          var list = [];
          current_search_results={};
          $.each(data['results']['bindings'], function(key,value) {
            current_search_results[value['l']['value']] = value['s']['value'];
            list.push(value['l']['value']);
          });
          $( "#myinput" ).autocomplete({
            source: list
          });
        })
        .error(function(){
        })
    }

  } else {
    $('.searchbox-input').val('');
    $('.searchbox-icon').css('display','block');
  }
}

$('#mysearch').submit(function(e) {
  e.preventDefault();
  var inputVal = $('.searchbox-input').val();
  if (inputVal in current_search_results) {
    $('#virtuosoiframe').attr('src', describe_url+"/?url="+current_search_results[inputVal])
    $("#main_tabs a[href='#browse']").tab("show");
    $('.searchbox-input').val('');
    hideHeader();
  } else {
    console.log("no object found !! ") // TODO submit post to virtuoso
  }
});

/* Network graph */
// Add a method to the graph model that returns an
// object with every neighbors of a node inside:

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
    {
      container: 'mold_sigma'
    },
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

// hack to load yasqe correctly :
//    first tab is query the move to about tab
$(document).ready(function(){
  $("#main_tabs a[href='#about']").tab("show");
  $('#virtuosoiframe').attr('src', fct_url);
  load_search();
  window.setTimeout(function (){  load_mold_network() }, 500);
})

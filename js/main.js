/* YASQE & YASR SPARQL */
var yasqe = YASQE(document.getElementById("yasqe"), {
  sparql: {
    showQueryButton: true,
    endpoint: "http://localhost:9000/sparql",
    requestMethod: "GET"
  }
});
var yasr = YASR(document.getElementById("yasr"), {
  //this way, the URLs in the results are prettified using the defined prefixes in the query
  getUsedPrefixes: yasqe.getPrefixesFromQuery
});

//link both together
yasqe.options.sparql.callbacks.complete = yasr.setResponse;

// hack to load yasqe correctly :
//    first tab is query the move to about tab
$(document).ready(function(){
  $("#main_tabs a[href='#about']").tab("show");
})

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
$(document).ready(function(){
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
});

var current_search_results = {}
var current_ajax_call = null;

function buttonUp(){

  var inputVal = $('.searchbox-input').val();
  
  inputValLen = $.trim(inputVal).length;

  if( inputValLen !== 0){
    $('.searchbox-icon').css('display','none');
    if(inputValLen > 3){

      current_ajax_call = $.ajax({
        url: 'http://localhost:9393/v1/search?q=' + inputVal,
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
    console.log("find the object!!")
    console.log("http://localhost:9000/describe/?url="+current_search_results[inputVal])
    $('#virtuosoiframe').attr('src', "http://localhost:9000/describe/?url="+current_search_results[inputVal])
    $("#main_tabs a[href='#browse']").tab("show");
    $('.searchbox-input').val('');
    hideHeader();
  } else {
    console.log("no object found !! ") // TODO submit post to virtuoso
  }
});

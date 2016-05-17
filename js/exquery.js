// TODO incorporate this in Virtuoso + API
/* Query examples*/
var loadQuery = function(query) {
  window.location.replace(queries[query]['queryURL']);
  $('#queryexample').modal('toggle');
}
var loadImg = function(query) {
  // console.log(queries[query]['img']);
  return queries[query]['img'];
}

var queries = {
  'exquery-001': {
    'img': 'img/exquery/exquery-001.png',
    'queryURL': "#query=PREFIX+mine_vocab%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0ASELECT+COUNT+DISTINCT+%3FpantherOrtholog%0AWHERE+%7B%0A++%7B%0A++++GRAPH+%3Chttp%3A%2F%2Fhuman.mo-ld.org%3E+%7B%0A++++++%3Fshuman+skos%3AexactMatch+%3FpantherOrtholog+.%0A++++++%3Fshuman+mine_vocab%3AhasDataSource+%3Fdatasource+.%0A++++++%3Fdatasource+rdfs%3Alabel+%3Fdslabel+.%0A++++++FILTER+(lcase(str(%3Fdslabel))+%3D+%22panther%22)%0A++++%7D%0A++++GRAPH+%3Chttp%3A%2F%2Fyeast.mo-ld.org%3E+%7B%0A++++++%3Fsyeast+skos%3AexactMatch+%3FpantherOrtholog+.%0A++++%7D%0A++%7D%0A%7D%0A"
  },
  'exquery-002': {
    'img': 'img/exquery/exquery-002.png',
    'queryURL': '#query=PREFIX+mine_vocab%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+b2f_go%3A+%3Chttp%3A%2F%2Fbio2rdf.org%2Fgo%3A%3E%0APREFIX+b2f_keyvoc%3A+%3Chttp%3A%2F%2Fbio2rdf.org%2Fkegg_vocabulary%3A%3E%0APREFIX+void%3A+%3Chttp%3A%2F%2Frdfs.org%2Fns%2Fvoid%23%3E%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0ASELECT+%3Fgene_entity+%3Fkegg+%3Fkegg_rx_label%0AWHERE+%7B%0A++%3FoTerm+skos%3AexactMatch+b2f_go%3A0019898+.%0A++%3FoTerm+mine_vocab%3AhasOntologyAnnotation+%3Fgene_annotation+.%0A++%3Fgene_annotation+mine_vocab%3AhasBioEntity+%3Fgene_entity+.%0A++%3Fgene_entity+mine_vocab%3AhasCrossReference+%3Fxref+.%0A++%3Fxref+mine_vocab%3AhasDataSource+%3Fds+.%0A++%3Fxref+skos%3AexactMatch+%3Fbio2rdf_ec+.%0A++FILTER+(%3Fds+%3D+%3Chttp%3A%2F%2Fmo-ld.org%2Fmousemine%3A9331717%3E)%0A++SERVICE+%3Chttp%3A%2F%2Fbio2rdf.org%2Fsparql%3E+%7B%0A++++%3Fkegg+b2f_keyvoc%3Ax-ec+%3Fbio2rdf_ec+.%0A++++%3Fkegg+b2f_keyvoc%3Areaction+%3Fkegg_rx+.%0A++++%3Fkegg_rx+rdfs%3Alabel+%3Fkegg_rx_label+.%0A++%7D%0A%7D%0A'
  }

}


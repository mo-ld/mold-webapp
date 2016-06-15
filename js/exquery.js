// TODO incorporate this in Virtuoso + API
/* Query examples*/
var loadQuery = function(query,org) {
  window.location.replace(get_query(query,org));
  $('#queryexample').modal('toggle');
  setTimeout(function(){
    window.history.pushState("", "Query Template", "/");
  }, 500);
}

var loadImg = function(query) {
  // console.log(queries[query]['img']);
  return queries[query]['img'];
}

var get_query = function(query,org) {
  return queries[query].replace('_organism_',org);
}

var queries = {
  'subject-type': '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0ASELECT+%24type+(COUNT+(%24type)+as+%24count)%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++%09%24s+rdf%3Atype+%24type+.%0A++%7D%0A%7D+ORDER+BY+DESC(%24count)',
  'gene-go': '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+mine_voc%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT+%24gene+%24gene_label+%24bio2rdf_go%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++%09%24gene+rdfs%3Alabel+%24gene_label+.%0A++++%24gene+mine_voc%3AhasGOAnnotation+%24go_annotation+.%0A++++%24go_annotation+mine_voc%3AhasOntologyTerm+%24go_term+.%0A++++%24go_term+skos%3AexactMatch+%24bio2rdf_go+.%0A++%7D+FILTER+(%24bio2rdf_go+%3D+%3Chttp%3A%2F%2Fbio2rdf.org%2Fgo%3A0005515%3E)%0A%7D+LIMIT+5000',
  'crossreference-datasource' : '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+mine_voc%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0ASELECT+%24datasource+%24datasource_label+(count(distinct+%24dbxref)+as+%24count)%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++++%24dbxref+mine_voc%3AhasDataSource+%24datasource+.%0A++++%24datasource+rdfs%3Alabel+%24datasource_label+.%0A++%7D%0A%7D+ORDER+BY+DESC(%24count)',
  'ontology-source' : '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+mine_voc%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0ASELECT+%24ontology+%24ontology_label+(count(distinct+%24dbxref)+as+%24count)%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++++%24dbxref+mine_voc%3AhasOntology+%24ontology+.%0A++++%24ontology+rdfs%3Alabel+%24ontology_label+.%0A++%7D%0A%7D+ORDER+BY+DESC(%24count)',
  'gene-disease' : '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+mine_voc%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT+%24gene+%24gene_label+%24disease+%24disease_label+%24disease_id%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++++%24gene+rdfs%3Alabel+%24gene_label+.%0A++++%24gene+mine_voc%3AhasDisease+%24disease+.%0A++++%24disease+rdfs%3Alabel+%24disease_label+.%0A++++OPTIONAL+%7B%0A++++++%24disease+mine_voc%3AhasIdentifier+_%3Aid+.%0A++++++_%3Aid+rdf%3Avalue+%24disease_id%0A++++%7D%0A++%7D%0A%7D+LIMIT+5000',
  'gene-pathway' : '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+mine_voc%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT+%24gene+%24gene_label+%24pathway+%24pathway_label+%24pathway_id%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++++%24gene+rdfs%3Alabel+%24gene_label+.%0A++++%24gene+mine_voc%3AhasPathway+%24pathway+.%0A++++%24pathway+rdfs%3Alabel+%24pathway_label+.%0A++++OPTIONAL+%7B%0A++++++%24pathway+mine_voc%3AhasIdentifier+_%3Aid+.%0A++++++_%3Aid+rdf%3Avalue+%24pathway_id+.%0A++++%7D%0A++%7D%0A%7D+LIMIT+5000',
  'interaction-gene-gene' : '#query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+mine_voc%3A+%3Chttp%3A%2F%2Fmo-ld.org%2Fmine_vocabulary%3A%3E%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0ASELECT+%24gene+%24gene_label+%24interaction_detail+%24gene2+%24gene2_label%0AWHERE+%7B%0A++GRAPH+%3Chttp%3A%2F%2F_organism_.mo-ld.org%3E+%7B%0A++++%24gene+rdfs%3Alabel+%24gene_label+.%0A++++%24gene+mine_voc%3AhasInteraction+%24interaction+.%0A++++%24interaction+mine_voc%3AhasInteractionDetail+%24interaction_detail+.%0A++++%24interaction+mine_voc%3AhasBioEntity+%24gene2+.%0A++++FILTER+(%24gene2+!%3D+%24gene)+.%0A++++OPTIONAL+%7B%0A++++++%24gene2+rdfs%3Alabel+%24gene2_label+.+%0A++++%7D%0A++%7D%0A%7D+LIMIT+5000%0A'
}

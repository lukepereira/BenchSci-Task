function plot (graph) {
  svg = d3.select("svg"),
     width = +svg.attr("width"),
     height = +svg.attr("height");

  svg.selectAll("*").remove();
  color = d3.scaleOrdinal(d3.schemeCategory10);

  simulation = d3.forceSimulation()
     .force("link", d3.forceLink().id(function(d) { return d.id; }))
     .force("charge", d3.forceManyBody())
     .force("center", d3.forceCenter(width / 2, height / 2));

  link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return 0.7 });

  node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.technique); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  console.log(d);



  $(".geneTable").html("");
  if (d.gene) $(".geneTable").append("<tr><th>Gene:  </th><td>" + d.gene + "</td></tr>");
  if (d.technique) $(".geneTable").append("<tr><th>Technique: </th><td>" + d.technique + "</td></tr>");
  if (d.title) $(".geneTable").append("<tr><th>Title: </th><td>" + d.title + "</td>"
    + "<td><input type='button' onClick='map.handleSave("+ d.id +")'} value='save'/></td></tr>");
  if (d.publisher) $(".geneTable").append("<tr><th> Publisher: </th><td>" + d.publisher + "</td></tr>");
  if (d.figure) $(".geneTable").append("<tr><th>Figure: </th><td>" + d.figure + "</td></tr>");

}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

import React, { Component } from 'react';

class GeneItem extends Component {
  constructor(){
    super();
    this.initializeState();
  }
  initializeState() {
    this.state = {
      raw : [],
      graph : {"nodes":[], "links":[]},
      groups : {}
    };
  }

  // TODO: Refactor and clean
  prepareGraph(raw){
    this.initializeState();
    for (var i=0; i < raw.length; i++){
      // Insert gene object into graph.nodes array
      this.state.graph.nodes[i] = {
        "id": raw[i].id,
        "technique": raw[i].technique_group,
        "gene": raw[i].gene,
        "title": raw[i].title,
        "figure": raw[i].figure_number,
        "publisher": raw[i].publisher,
        "pubdate": raw[i].pub_date,
        "author": raw[i].author
      };
      // Record all groups that occured in raw into groups object
      // if group already exists, add to members
      if (this.state.groups.hasOwnProperty(raw[i].technique_group)) {
        this.state.groups[raw[i].technique_group].push(raw[i].id);
      } else {
        this.state.groups[raw[i].technique_group] = [raw[i].id];
      }
    }
    var rand = null;
    var nodeLength = this.state.graph.nodes.length;
    // Only executed on inital visit
    if (this.props.home === "true"){
      this.state.graph.nodes.push({
        "id": "BenchSci",
        "technique": "Welcome to BenchSci"
      });
      for (var n=0 ; n < nodeLength; n++) {
        rand = Math.floor(Math.random() * (nodeLength + 1));
        this.state.graph.links.push({
          "source": this.state.graph.nodes[n],
          "target": this.state.graph.nodes[rand]
        });
        this.state.graph.links.push({
          "source": this.state.graph.nodes[n],
          "target": "BenchSci",
        });
      }
    } else {
      var groupCount = Object.keys(this.state.groups).length;
      for (var j=0; j < groupCount; j++) {
        var groupName = Object.keys(this.state.groups)[j];
        // Make a new node for each group with id = technique_group
        this.state.graph.nodes.push({
          "id": groupName,
          "technique": groupName
        });
       // Begin making links between nodes with shared technique_group node made above
        for (var k=0; k < this.state.groups[groupName].length; k++){
          rand = Math.floor(Math.random() * (nodeLength + 1));
          this.state.graph.links.push({
            "source": this.state.groups[groupName][k],
            "target": groupName
          });
          this.state.graph.links.push({
            "source": this.state.graph.nodes[j],
            "target": this.state.graph.nodes[rand],
          });
        }
      }
    }
  }

  render() {
    if (this.props.geneData){
      this.state.raw = this.props.geneData;
      this.prepareGraph(this.state.raw);
      window.plot(this.state.graph);
      return (
        <div >
          <table className="geneTable fixed" width="550" style={{textAlign:"left"}}>
          </table>
        </div>
      );
    } else {
      return(<div></div>);
    }
  }
}

export default GeneItem;

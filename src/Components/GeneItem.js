import React, { Component } from 'react';
import BarChart from 'react-d3-basic';
import GenePlot from './GenePlot';

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

  prepareGraph(raw){
    this.initializeState();
    for (var i=0; i < raw.length; i++){
      // Insert raw gene object into graph.nodes array
      this.state.graph.nodes[i] = {
        "id": raw[i].id,
        "technique": raw[i].technique_group
      };
      // Record all groups that occured in raw into groups object
      // if group already exists, add to members
      if (this.state.groups.hasOwnProperty(raw[i].technique_group)) {
        this.state.groups[raw[i].technique_group].push(raw[i].id);
      } else {
        this.state.groups[raw[i].technique_group] = [raw[i].id];
      }
    }
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
        this.state.graph.links.push({
          "source": this.state.groups[groupName][k],
          "target": groupName,
        });
      }
    }
  }

  render() {
    if (this.props.geneData){
      this.state.raw = this.props.geneData;
      this.prepareGraph(this.state.raw);
      console.log(this.state.graph);
      return (
        <div className="GenePlot">
          <GenePlot graph={this.state.graph} raw={this.state.raw}/>
        </div>
      );
    } else {
      return(<div></div>);
    }
  }
}
/*
GenePlot.propTypes = {
  genes: React.PropTypes.array
}
*/
export default GeneItem;

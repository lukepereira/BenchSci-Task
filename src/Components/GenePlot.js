import React, { Component } from 'react';
import * as d3 from "d3";
import ReactDOM from 'react-dom'

class GenePlot extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.initializeState();
    //console.log(this.state);
    this.plot();
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.graph != this.props.graph){
      //console.log(this.state);
      this.plot();
    }
  }
  initializeState(){
    this.state = {
      canvas: ReactDOM.findDOMNode(this.refs.myCanvas),
      context: ReactDOM.findDOMNode(this.refs.myCanvas).getContext("2d"),
      width: 400,
      height: 600,
      graph: this.props.graph,
      simulation: d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(this.width / 2, this.height / 2))
    };
  }
  plot () {
    console.log(this.state);
    this.state.simulation
        .nodes(this.state.graph.nodes)
        .on("tick", function () {
          this.state.context.clearRect(0, 0, 400, 600);

          this.state.context.beginPath();
          this.state.graph.links.forEach(this.drawLink);
          this.state.context.strokeStyle = "#aaa";
          this.state.context.stroke();

          this.state.context.beginPath();
          this.state.graph.nodes.forEach(this.drawNode);
          this.state.context.fill();
          this.state.context.strokeStyle = "#fff";
          this.state.context.stroke();
        });

    this.state.simulation.force("link")
        .links(this.state.graph.links);

    d3.select(this.state.canvas)
        .call(d3.drag()
            .container(this.state.canvas)
            .subject(function(){
                return this.state.simulation.find(d3.event.x, d3.event.y);
            })
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended));
  }

  dragstarted() {
    if (!d3.event.active) this.state.simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  dragended() {
    if (!d3.event.active) this.state.simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  drawLink(d) {
    this.context.moveTo(d.source.x, d.source.y);
    this.context.lineTo(d.target.x, d.target.y);
  }

  drawNode(d) {
    this.context.moveTo(d.x + 3, d.y);
    this.context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }
  render() {
    return (
      <canvas ref="myCanvas"></canvas>
    );
  }
}
/*
GenePlot.propTypes = {
  gene: React.PropTypes.object
}
*/
export default GenePlot;

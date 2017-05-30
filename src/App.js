import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import $ from 'jquery';
import Genes from './Components/Genes';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      genes:[]
    }
  }

  getGenes(){
    $.ajax({
      url: 'http://cslinux.utm.utoronto.ca:10675/api/genes',
      dataType:'json',
      cache: false,
      success: function(data){
        this.setState({genes: data}, function(){
          console.log(this.state);
        });
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

  searchGene(){
    event.preventDefault();
    let gene = {name: this.refs.gene_name.value }
  }


  componentWillMount(){
    this.getGenes();
  }

  componentDidMount(){
    this.getGenes();
  }

  render() {
    return (

      <div className="App">
        <Genes genes={this.state.genes} />
        <hr />
      </div>
    );
  }
}

export default App;

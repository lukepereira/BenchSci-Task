import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import $ from 'jquery';

import Projects from './Components/Projects';
import AddProject from './Components/AddProject';
import Genes from './Components/Genes';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      projects: [],
      genes:[]
    }
  }

  getGenes(){
    $.ajax({
      url: 'https://localhost:1065/api/genes',
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
    this.getProjects();
    this.getGenes();
  }

  componentDidMount(){
    this.getGenes();
  }

  render() {
    return (
      <div className="App">
        <SearchGene searchGene={this.handleSearchGene.bind(this)} />
        <hr />
        <Genes genes={this.state.genes} />
      </div>
    );
  }
}

export default App;

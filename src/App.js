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
      url: 'https://jsonplaceholder.typicode.com/todos',
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

  getProjects(){
    this.setState({projects: [
      {
        id:uuid.v4(),
        title: 'Business Website',
        category: 'Web Deisgn'
      },
      {
        id:uuid.v4(),
        title: 'Social App',
        category: 'Mobile Development'
      },
      {
        id:uuid.v4(),
        title: 'Ecommerce Shopping Cart',
        category: 'Web Development'
      }
    ]});
  }

  componentWillMount(){
    this.getProjects();
    this.getGenes();
  }

  componentDidMount(){
    this.getGenes();
  }

  handleAddProject(project){
    let projects = this.state.projects;
    projects.push(project);
    this.setState({projects:projects});
  }

  handleDeleteProject(id){
    let projects = this.state.projects;
    let index = projects.findIndex(x => x.id === id);
    projects.splice(index, 1);
    this.setState({projects:projects});
  }

  render() {
    return (
      <div className="App">
        <AddProject addProject={this.handleAddProject.bind(this)} />
        <Projects projects={this.state.projects} onDelete={this.handleDeleteProject.bind(this)} />
        <hr />
        <Genes genes={this.state.genes} />
      </div>
    );
  }
}

export default App;

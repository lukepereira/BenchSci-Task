import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Genes from './Components/Genes';
import NavBar from './Components/NavBar';
import Account from './Components/Account';

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated:"",
      username: "",
      password: "",
      bookmarks:[]
    }
    this.stateHandler = this.stateHandler.bind(this)
  }

  renderGenes = () => {
      return <Genes />;
  }

  renderAccount = () => {
      return <Account state={this.state} stateHandler={this.stateHandler}/>;
  }

  stateHandler(childState) {
    this.setState(childState);
  }
  render() {
    return (
      <Router>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <NavBar />
          <div style={{padding: 20}} >
            <Route exact path="/" render={this.renderGenes} />
            <Route path="/park" render={this.renderGenes}/>
            <Route path="/account" render={this.renderAccount}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

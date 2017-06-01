import React, { Component } from 'react';
import $ from 'jquery';
import Login from './Login';
import Bookmarks from './Bookmarks';

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      username: "",
      password: "",
      bookmarks:[]
    }
    this.stateHandler = this.stateHandler.bind(this)
  }

  stateHandler(childState) {
    this.setState(childState);
  }

  render() {
    if (this.state.authenticated){
      var el = <Bookmarks state={this.state} stateHandler={this.stateHandler}/>
    } else {
      var el = <Login state={this.state} stateHandler={this.stateHandler}/>
    }
    return <div className="Account"> {el} </div>

  }
}
export default Account;

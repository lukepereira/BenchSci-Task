import React, { Component } from 'react';
import Login from './Login';
import Bookmarks from './Bookmarks';

class Account extends Component {

  render() {
    let el = null;
    if (this.props.state.authenticated){
      el = <Bookmarks state={this.props.state} stateHandler={this.props.stateHandler}/>
    } else {
      el = <Login stateHandler={this.props.stateHandler}/>
    }
    return <div className="Account"> {el} </div>

  }
}
export default Account;

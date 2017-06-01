import React, { Component } from 'react';
import $ from 'jquery';

class Login extends Component {

  handleLogin() {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: 'http://cslinux.utm.utoronto.ca:10675/login',
      data: $("#loginForm").serialize(),
      dataType:'json',
      success: function(data){
        if (data){
            this.props.stateHandler({
              "authenticated": true,
              "username": $("#loginUser").val(),
              "password": $("#loginPassword").val(),
              "bookmarks": []
            });
            //this.props.history.push('/some/path');
        }
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

  handleCreate () {
    $.ajax({
      method: "POST",
      url: 'http://cslinux.utm.utoronto.ca:10675/create',
      data: $("#createForm").serialize(),
      dataType:'json',
      success: function(data){
          this.props.stateHandler({
            "authenticated": true,
            "username": $("#createUser").val(),
            "password": $("#createPassword").val(),
            "bookmarks": []
          });
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }


  render() {
    return (
      /* simple login page from https://news.ycombinator.com/login?goto=news */
      // TODO: Make forms into classes
      <div style={{ marginTop:250, marginLeft:550/2 -200}}>
      <hr />

        <b>Login</b><br/><br/>
        <form id="loginForm" onSubmit={this.handleLogin.bind(this)}>
          <table>
            <tr>
              <td>username:</td>
              <td><input type="text" name="username" size="50"
              autoCorrect="off" spellCheck="false" autoCapitalize="off"
              autoFocus="true" id="loginUser" /></td>
            </tr>
            <tr>
              <td>password:</td>
              <td><input type="password" id="loginPassword"name="password"
              size="50" /></td>
            </tr>
          </table><br/>
          <input type="button" onClick={this.handleLogin.bind(this)} value="login" />
        </form><br/><hr /><br/>

        <b>Create Account</b><br/><br/>
        <form id="createForm"  onSubmit={this.handleCreate.bind(this)}>
          <table>
            <tr>
              <td>username:</td>
              <td><input type="text" name="username" size="50" autoCorrect="off"
                spellCheck="false" autoCapitalize="off" id="createUser"/></td>
            </tr>
            <tr>
              <td>password:</td>
              <td><input type="password" id="createPassword" name="password"
              size="50" /></td>
            </tr>
          </table><br/>
          <input type="button" onClick={this.handleCreate.bind(this)}
            value="create account" />
          </form>
          <hr />
        </div>

    );
  }
}

export default Login;

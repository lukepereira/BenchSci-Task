import React, { Component } from 'react';
import $ from 'jquery';

class Bookmarks extends Component {

  componentDidMount () {
    window.map = this;
    if (this.props.state.authenticated === false) {
      var bookmarks = this.refs.bookmarks;
      $(bookmarks).append("<p>Please login to view your bookmarks.</p>")
    } else {
      this.getBookmarks();
      this.renderBookmarks();
    }
  }

  getBookmarks() {
    $.ajax({
      method: "GET",
      url: 'http://cslinux.utm.utoronto.ca:10675/api/users/' +
          this.props.state.username + "/publications",
      dataType:'json',
      success: function(data){
        if (data){
            this.props.stateHandler({"bookmarks": data});
        }
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

  handleSave(pub_id){
    if (pub_id){
      $.ajax({
        method: "POST",
        url: 'http://cslinux.utm.utoronto.ca:10675/api/users/' +
            this.props.state.username + "/publications",
        data: {'pub_id': pub_id, 'username': this.props.state.username,
            'password': this.props.state.password},
        dataType:'json',
        success: function(data){
          alert("Successful save");
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
        }
      });
    } else {
      alert("Save failed");
    }
  }

  renderBookmarks(){
    var bm = this.props.state.bookmarks;
    var el = this.refs.bookmarks;
    if (bm && bm.length > 0){
      $(el).html("");
      for (var i = 0; i < bm.length; i++) {
        if (bm.gene) $(el).append("<tr><th>Gene:  </th><td>" + bm.gene + "</td></tr>");
        if (bm.technique) $(el).append("<tr><th>Technique: </th><td>" + bm.technique + "</td></tr>");
        if (bm.title) $(el).append("<tr><th>Title: </th><td>" + bm.title + "</td></tr>");
        if (bm.figure) $(el).append("<tr><th>Figure: </th><td>" + bm.figure + "</td></tr>");
        if (bm.publisher) $(el).append("<tr><th> Publisher: </th><td>" + bm.publisher + "</td></tr>");
      }
    } else {
      $(el).append("<h3> No bookmarks to display</h3>");
    }
  }

  render() {
    let el = <div ><h2>Bookmarks</h2><br/><hr width="550"/>
      <table ref="bookmarks"></table></div>;
    return (
      <div> {el} </div>
    );
  }
}

export default Bookmarks;

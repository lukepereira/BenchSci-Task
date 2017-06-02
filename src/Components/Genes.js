import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import $ from 'jquery';
import GeneItem from './GeneItem';

const PORT = 10675;

class Genes extends Component {

  constructor(){
    super();
    this.state = {
      selectValue: "",
      allGenes: "",
      geneData:"",
      home:"true"
    };
    //this.handleSave = this.handleSave().bind(this);
  }

  componentWillMount(){
    this.getGenes();
  }

getInitialState(){
  return this.state;
}
	updateValue (newValue) {
    this.setState({home:"false"});
    if (newValue && newValue.value != null) {
      $.ajax({
        method: "GET",
        url: 'http://cslinux.utm.utoronto.ca:'+PORT+'/api/genes/'+newValue.value,
        dataType:'json',
        //cache: true,
        success: function(data){
          this.setState({selectValue: newValue, geneData: data})
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
        }
      });
    }
	}
  getGenes(){
    $.ajax({
      method: "GET",
      url: 'http://cslinux.utm.utoronto.ca:'+PORT+'/api/genes',
      dataType:'json',
      //cache: true,
      success: function(data){
        this.setState({allGenes: data});
        if (this.state.home === "true"){
          //this.updateValue({"value":"PARK7"})
          this.setState({geneData:this.state.allGenes});
        }
        if (this.state.home =="park"){
          this.updateValue({"value":"PARK7"});
          this.setState({selectValue: "PARK7"});
        }
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

  render() {
    let geneItems;
    if(this.state.allGenes !== ""){
      geneItems = this.state.allGenes.map(
        gene => ({value: gene.gene, label: gene.gene})
      );
    }

    return (
      <div className="Genes">
        <h2>Gene Park</h2>
        <Select
          ref="geneSelect"
          name="form-field-name"
          options={geneItems}
          onChange={this.updateValue.bind(this)}
          value={this.state.selectValue}
        />
        <hr />
        <svg id="svg-canvas" width="1000" height="550">></svg>
        <hr />
        <center>
          <GeneItem geneData={this.state.geneData} home={this.state.home}/>
        </center>

      </div>
    );
  }
}

export default Genes;

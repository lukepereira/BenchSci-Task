import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import $ from 'jquery';
import GeneItem from './GeneItem';

class Genes extends Component {

  constructor(){
    super();
    this.state = { selectValue: "", gene_data:"" };
  }

	updateValue (newValue) {
    if (newValue.value != null) {
      $.ajax({
        url: 'http://cslinux.utm.utoronto.ca:10675/api/genes/' + newValue.value,
        dataType:'json',
        cache: true,
        success: function(data){
          this.setState({selectValue: newValue, gene_data: data});
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
        }
      });
    }
	}

  render() {
    let geneItems;
    if(this.props.genes){
      geneItems = this.props.genes.map(
        gene => ({value: gene.gene, label: gene.gene})
          //<GeneItem key={gene.gene} gene={gene} />
      );
    }
    return (
      <div className="Genes">
        <h3>Gene List</h3>
        <Select
          ref="geneSelect"
          name="form-field-name"
          options={geneItems}
          onChange={this.updateValue.bind(this)}
          value={this.state.selectValue}
        />
        <hr />
        <GeneItem geneData={this.state.gene_data}/>
      </div>
    );
  }
}
/*
Genes.propTypes = {
  genes: React.PropTypes.array
}
*/
export default Genes;

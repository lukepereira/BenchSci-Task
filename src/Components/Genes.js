import React, { Component } from 'react';
import GeneItem from './GeneItem';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class Genes extends Component {

  constructor(){
    super();
    this.state = { selectValue: "" };
  }

  switchGene (e) {
		var newGene = e.target.value;
		this.setState({
			gene: newGene,
			selectValue: null
		});
	}

	updateValue (newValue) {
		this.setState({
			selectValue: newValue
		});
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
      </div>
    );
  }
}

Genes.propTypes = {
  genes: React.PropTypes.array
}

export default Genes;

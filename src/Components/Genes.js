import React, { Component } from 'react';
import GeneItem from './GeneItem';

class Genes extends Component {
  render() {
    let geneItems;
    if(this.props.genes){
      geneItems = this.props.genes.map(gene => {
        //console.log(project);
        return (
          <GeneItem key={gene.title} gene={gene} />
        );
      });
    }
    return (
      <div className="Genes">
        <h3>Gene List</h3>
        {geneItems}
      </div>
    );
  }
}

Genes.propTypes = {
  genes: React.PropTypes.array
}

export default Genes;

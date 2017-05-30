import React, { Component } from 'react';
import {ReactSelectize, SimpleSelect, MultiSelect} from 'react-selectize';

class GeneItem extends Component {
  render() {
    return (
      <option value = {this.props.gene.gene}>
        {this.props.gene.gene}
      </option>
    );
  }
}

GeneItem.propTypes = {
  gene: React.PropTypes.object
}

export default GeneItem;

import React, { Component } from 'react';

class GeneItem extends Component {
  render() {
    return (
      <li className="Gene">
        <strong>{this.props.gene.title}</strong>
      </li>
    );
  }
}

GeneItem.propTypes = {
  gene: React.PropTypes.object
}

export default GeneItem;

import React from 'react';
import PropTypes from 'prop-types';

export default class SearchResult extends React.Component {
  static propTypes = {
    selection: PropTypes.arrayOf(PropTypes.string),
  };

  get isEmpty() {
    return this.props.selection.length === 0;
  }

  get emptyMessage() {
    if (this.isEmpty) {
      return <span>No Data Points Selected</span>;
    }

    return null;
  }

  get listItems() {
    return this.props.selection
      .map(selected => (
        <span 
          key={`selection-${selected}`}
          className="selection-item"
        >
          {selected}
        </span>
      ));
  }

  render() {
    return (
      <div className="selection">
        {this.emptyMessage}
        {this.listItems}
      </div>
    );
  }
}

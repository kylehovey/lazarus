import React from 'react';
import PropTypes from 'prop-types';

export default class SearchResult extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onSelect: PropTypes.func,
  };

  onClick = (e) => {
    const { onSelect, value } = this.props;

    e.preventDefault();

    this.props.onSelect(value);

    return false;
  }

  render() {
    const { value } = this.props;

    return <a href="#" onClick={this.onClick}>{value}</a>;
  }
}

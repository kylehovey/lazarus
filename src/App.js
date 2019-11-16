import React from 'react';
import './App.css';
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart
} from "react-timeseries-charts";

import miners from './miners/miners';
import SearchResult from './components/search_result';
import Selection from './components/selection';

const available = miners.map(({ title }) => title);
const lookup = new Map(
  miners.map(({ title, ...rest }) => [ title, rest ]),
);

class App extends React.Component {
  state = {
    value: '',
    selection: [],
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  select = (value) => {
    const { selection } = this.state;

    if (!selection.includes(value)) {
      this.setState({
        selection: [ ...selection, value ],
      });
    }
  }

  clear = () => this.setState({
    value: '',
    selection: [],
  });

  resultsFor(term) {
    if (term === '') return null;

    return available
      .filter(
        (title) => title.toLowerCase().includes(term.toLowerCase())
      ).map(
        (title, i) => (
          <React.Fragment key={`result-${i}`}>
            <br />
            <SearchResult value={title} onSelect={this.select} />
          </React.Fragment>
        )
      );
  }

  render() {
    const { value, selection } = this.state;

    return (
      <div>
        <Selection selection={selection} />
        <br />
        <input onChange={this.onChange} value={value} />
        <button onClick={this.clear}>Clear</button>
        {this.resultsFor(value)}
      </div>
    );
  }
}

export default App;

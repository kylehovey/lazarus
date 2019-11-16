import React from 'react';
import './App.css';

import miners from './miners/miners';
import SearchResult from './components/search_result';

const available = miners.map(({ title }) => title);
const lookup = new Map(
  miners.map(({ title, ...rest }) => [ title, rest ]),
);

class App extends React.Component {
  state = {
    value: '',
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  select = (value) => {
    console.log(lookup.get(value).maker());
  }

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
    const { value } = this.state;

    return (
      <div>
        <input onChange={this.onChange} value={value} />
        <button onClick={this.select}>Add</button>
        {this.resultsFor(value)}
      </div>
    );
  }
}

export default App;

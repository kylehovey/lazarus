import React from 'react';
import './App.css';

import Chart from './components/chart';

const uuid = () => parseInt(Math.random()*1e7, 27).toString();

class App extends React.Component {
  state = {
    charts: [
      {
        key: 'chart-initial',
        element: (
          <Chart
            onRemove={() => this.removeChart('chart-initial')}
            key="chart-initial"
          />
        ),
      },
    ],
  };

  removeChart = (removeKey) => {
    const { charts } = this.state;

    this.setState({
      charts: charts.filter(({ key }) => key !== removeKey),
    });
  }

  addChart = () => {
    const key = `chart-${uuid()}`;

    this.setState(
      ({ charts }) => ({
        charts: [
          ...charts,
          {
            key,
            element: (
              <Chart onRemove={() => this.removeChart(key)} key={key} />
            )
          },
        ],
      })
    )
  }

  render() {
    return (
      <div>
        {this.state.charts.map(({ element }) => element)}
        <button onClick={this.addChart}>Add</button>
      </div>
    );
  }
}

export default App;

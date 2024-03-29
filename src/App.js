import React from 'react';
import './App.css';

import Chart from './components/chart';

const uuid = () => parseInt(Math.random()*1e7, 27).toString();

class App extends React.Component {
  state = {
    charts: [
      { key: 'chart-initial' },
    ],
    timerange: null,
  };

  handleTimeRangeChange = (timerange) => {
    this.setState({ timerange });
  }

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
          { key },
        ],
      })
    )
  }

  resetTimeRange = () => this.setState({ timerange: null });

  render() {
    const { timerange } = this.state;

    return (
      <div>
        <h1>Lazarus Health Visualizer</h1>
        <button onClick={this.resetTimeRange}>Reset Time Range</button>
        {this.state.charts.map(({ key }) => (
          <Chart
            onRemove={() => this.removeChart(key)} key={key}
            handleTimeRangeChange={this.handleTimeRangeChange}
            timerange={timerange}
          />
        ))}
        <button onClick={this.addChart}>Add</button>
      </div>
    );
  }
}

export default App;

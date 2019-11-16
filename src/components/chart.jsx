import React from 'react';
import PropTypes from 'prop-types';

import { TimeSeries } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
} from "react-timeseries-charts";

import miners from '../miners/miners';
import SearchResult from './search_result';
import Selection from './selection';

// TODO: Implement time picker
const oneYearAgo = (new Date) - (60 * 60 * 24 * 360) * 1e3;
const threeMonthsAgo = (new Date) - (60 * 60 * 24 * 90) * 1e3;

const available = miners.map(({ title }) => title);
const lookup = new Map(
  miners.map(({ title, ...rest }) => [ title, rest ]),
);
const serializePoints = (data) => Object.entries(data)
  .map(
    ([ timeString, value ]) => [
      +(new Date(timeString)),
      value,
    ],
  )
  .sort(([ A ], [ B ]) => A - B)
  .filter(([ A ]) => A > oneYearAgo);

class Chart extends React.Component {
  static propTypes = {
    onRemove: PropTypes.func,
    onTimeRangeChanged: PropTypes.func,
    timerange: PropTypes.object,
  };

  state = {
    value: '',
    selection: [],
    min: 0,
    max: 100,
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

  get series() {
    const { timerange } = this.props;
    const { selection } = this.state;

    const series = selection.map(
      selected => ({
        key: selected,
        values: serializePoints(lookup.get(selected).maker()),
      })
    ).map(
      ({ key, values }) => new TimeSeries({
        name: key,
        columns: ["time", "value"],
        points: values,
      })
    );

    return (timerange !== null)
      ? series.map(s => s.crop(timerange))
      : series;
  }

  get charts() {
    return this.series.map(
      series => (
        <LineChart
          axis="value"
          series={series}
          columns={["time", "value"]}
          interpolation="curveBasis"
          width={60}
        />
      )
    );
  }

  get display() {
    const { handleTimeRangeChange } = this.props;
    const { min, max } = this.state;
    const [ series ] = this.series;

    if (series === undefined) return null;

    return (
      <Resizable>
        <ChartContainer
          timeRange={series.range()}
          enableDragZoom
          onTimeRangeChanged={handleTimeRangeChange}
        >
          <ChartRow height="200">
            <YAxis
              id="value"
              min={min}
              max={max}
              showGrid
            />
            <Charts>
              {this.charts}
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>
    );
  }

  changeMin = ({ target: { value } }) => this.setState({
    min: parseFloat(value),
  });

  changeMax = ({ target: { value } }) => this.setState({
    max: parseFloat(value),
  });

  render() {
    const { onRemove } = this.props;
    const { value, selection, min, max } = this.state;

    return (
      <div>
        <Selection selection={selection} />
        <br />
        <input onChange={this.onChange} value={value} />
        <button onClick={this.clear}>Clear</button>
        <span>Min:</span>
        <input onChange={this.changeMin} value={min} />
        <span>Max:</span>
        <input onChange={this.changeMax} value={max} />
        {this.resultsFor(value)}
        {this.display}
        <button onClick={onRemove}>Remove</button>
      </div>
    );
  }
}

export default Chart;

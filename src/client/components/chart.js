import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Switch, Route } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import chart_options from './static_props/chart_options'

const ChartId = (props) => {

  let { chart_id } = useParams();

  const [state, setState] = useState({
    chart_id: 'events',
    data_occurrence: 'daily'
  });

  const [data, setData] = useState({});

  useEffect(() => {
    let chartData = getChartData(props.api_data, state.chart_id, state.data_occurrence);
    setData(chartData);
  }, []);

  useEffect(() => {
    setState({ ...state, chart_id: chart_id });
  }, [chart_id]);

  useEffect(() => {
    axios.get(`/api/${state.chart_id}${state.chart_id === 'poi' ? '' : `/${state.data_occurrence}`}`)
      .then((res) => {
        let chartData = getChartData(res.data, state.chart_id, state.data_occurrence, true);
        setData(chartData);
      }).catch(err => {
        setData({});
        alert(err);
      });
  }, [state]);

  const scaleNumber = (str, impressions = false) => {
    let result = impressions ? (str / 1000).toFixed(3) : str;
    return result;
  }

  const transformDate = (dateStr, hour) => {
    let res = new Date(dateStr);
    res = res.getTime() + (hour * 1000 * 60 * 60);
    return res;
  }

  const getChartData = (rawData, chartId, dataOccurrence, update = false) => {
    const obj = {
      chart_data: {
        datasets: []
      },
      chart_options: chart_options.default
    };

    const statsBoiler = [
      {
        id: 'revenue',
        label: 'Revenue',
        color: "green",
      },
      {
        id: 'impressions',
        label: 'Impressions in 1,000s',
        color: "blue",
      },
      {
        id: 'clicks',
        label: 'Clicks',
        color: "purple",
      }
    ];

    switch (chartId) {
      case 'events':
        if (dataOccurrence === 'daily') {
          obj.chart_options.title.text = 'Daily Events'
          obj.chart_type = 'bar';
          const arrLabels = [];
          const arrData = [];
          for (let item of (update ? rawData : rawData[chartId][dataOccurrence])) {
            arrLabels.push(item.date.slice(0, 10))
            arrData.push(item.events);
          }
          obj.chart_data.labels = arrLabels;
          obj.chart_data.datasets.push({});
          obj.chart_data.datasets[0].data = arrData;
          obj.chart_data.datasets[0].label = "Events";
          obj.chart_data.datasets[0].backgroundColor = "orange";
        } else {
          obj.chart_options = { ...obj.chart_options, ...chart_options.events_hourly };
          obj.chart_options.title.text = 'Hourly Events';
          obj.chart_type = 'line';
          const arrData = [];
          for (let item of (update ? rawData : rawData[chartId][dataOccurrence])) {
            arrData.push({ x: transformDate(item.date, item.hour), y: item.events });
          }
          obj.chart_data.datasets.push({});
          obj.chart_data.datasets[0].data = arrData;
          obj.chart_data.datasets[0].type = 'line';
          obj.chart_data.datasets[0].pointRadius = 0;
          obj.chart_data.datasets[0].lineTension = 0;
          obj.chart_data.datasets[0].borderWidth = 2;
          obj.chart_data.datasets[0].fill = false;
          obj.chart_data.datasets[0].label = "Events";
          obj.chart_data.datasets[0].borderColor = "orange";
          obj.chart_data.datasets[0].backgroundColor = "orange";
        }
        break;
      case 'stats':
        obj.chart_options = { ...obj.chart_options, ...chart_options.stats_daily };
        if (dataOccurrence === 'daily') {
          obj.chart_options.title.text = 'Daily Stats'
          obj.chart_type = 'bar';
          const arrLabels = [];
          const objData = {
            impressions: [],
            clicks: [],
            revenue: []
          };
          for (let item of (update ? rawData : rawData[chartId][dataOccurrence])) {
            arrLabels.push(item.date.slice(0, 10))
            objData.impressions.push(scaleNumber(item.impressions, true));
            objData.clicks.push(item.clicks);
            objData.revenue.push(item.revenue);
          }
          obj.chart_data.labels = arrLabels;
          statsBoiler.forEach((item, ix) => {
            obj.chart_data.datasets.push({});
            obj.chart_data.datasets[ix].data = objData[item.id];
            obj.chart_data.datasets[ix].label = statsBoiler[ix].label;
            obj.chart_data.datasets[ix].backgroundColor = statsBoiler[ix].color;
            obj.chart_data.datasets[ix].yAxisID = ix ? 'y-axis-2' : 'y-axis-1';
          });
        } else {
          obj.chart_options.title.text = 'Hourly Stats';
          obj.chart_type = 'line';
          obj.chart_options.scales = { ...obj.chart_options.scales, xAxes: chart_options.events_hourly.scales.xAxes };
          obj.chart_options.tooltips.intersect = false;
          obj.chart_options.tooltips.mode = 'index';
          const objData = {
            impressions: [],
            clicks: [],
            revenue: []
          };
          for (let item of (update ? rawData : rawData[chartId][dataOccurrence])) {
            objData.impressions.push({ x: transformDate(item.date, item.hour), y: scaleNumber(item.impressions, true) });
            objData.clicks.push({ x: transformDate(item.date, item.hour), y: item.clicks });
            objData.revenue.push({ x: transformDate(item.date, item.hour), y: item.revenue });
          }
          statsBoiler.forEach((item, ix) => {
            obj.chart_data.datasets.push({});
            obj.chart_data.datasets[ix].data = objData[item.id];
            obj.chart_data.datasets[ix].label = statsBoiler[ix].label;
            obj.chart_data.datasets[ix].borderColor = statsBoiler[ix].color;
            obj.chart_data.datasets[ix].backgroundColor = statsBoiler[ix].color;
            obj.chart_data.datasets[ix].yAxisID = ix ? 'y-axis-2' : 'y-axis-1';
            obj.chart_data.datasets[ix].type = 'line';
            obj.chart_data.datasets[ix].pointRadius = 0;
            obj.chart_data.datasets[ix].lineTension = 0;
            obj.chart_data.datasets[ix].borderWidth = 2;
            obj.chart_data.datasets[ix].fill = false;
          });
        }
        break;
      case 'poi':
        break;
    }
    return obj;
  }

  const handleClick = (e) => {
    e.preventDefault();
    setState({ ...state, data_occurrence: e.target.innerText });
  }

  return (
    <div className='chart'>
      <Switch>
        <Route exact path="/charts/poi">
          <h2>POI</h2>
          <p>please refer to GeoNav to display the POI data</p>
        </Route>
        <Route exact path={`/charts/${chart_id}`}>
          {data.chart_type && <Chart data={data} />}
          <button onClick={handleClick} className='button'>daily</button>
          <button onClick={handleClick} className='button'>hourly</button>
        </Route>
      </Switch>
    </div>
  )
}

export default ChartId

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chart_data: props.data.chart_data,
      chart_options: props.data.chart_options
    }
    this.count = 0;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      console.log(this.props, 'b4')
      this.setState({ ...this.state, chart_data: this.props.data.chart_data, chart_options: this.props.data.chart_options });
      console.log(this.props, 'after')
    }
  }

  render() {
    this.count++;
    return (
      <div className="chart">
        <Bar
          key={`${this.props.data.chart_type}--${this.count}`}
          data={this.state.chart_data}
          options={this.state.chart_options}
        />
      </div>
    );
  }

}

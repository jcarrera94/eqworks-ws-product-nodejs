import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

const chart_options = {
  default: {
    title: {
      display: true,
      fontSize: 25
    },
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltips: {
      intersect: true,
      mode: 'point',
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || '';
          if (label) {
            switch (label) {
              case 'Revenue':
                label += ': $' + parseFloat(tooltipItem.value).toFixed(2);
                break;
              case 'Impressions':
                label += ': ' + (parseFloat(tooltipItem.value) * 1000).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3);
                break;
              default:
                label += ': ' + parseFloat(tooltipItem.value);
            }
          }
          return label;
        }
      }
    }
  },
  stats: {
    yAxes: [
      {
        type: 'linear',
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Revenue - in Dollars ($)',
        },
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      },
      {
        type: 'linear',
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Impressions (in 1000s) & Clicks'
        },
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
}

const ChartId = (props) => {

  let { chart_id } = useParams();

  const [state, setState] = useState({
    chart_id: 'events',
    data_occurrence: 'daily'
  });

  const [data, setData] = useState({});
  
  useEffect(() => {
    let chartData = getChartData(props.api_data, state.chart_id, state.occurrence);
    setData({ ...data, ...chartData });
  }, []);

  useEffect(() => {
    setState({ ...state, chart_id: chart_id });
  }, [chart_id]);

  useEffect(() => {
    //axios calls
    axios
    let chartData = getChartData(props.api_data, state.chart_id, state.data_occurrence);
    setData({ ...data, ...chartData });
  }, [state]);

  const scaleNumber = (str, impressions = false) => {
    let result = impressions ? (str / 1000).toFixed(3) : str;
    return result;
  }

  const getChartData = (rawData, chartId, dataOccurrence) => {
    const obj = {
      chart_data: {
        datasets: []
      },
      chart_options: chart_options.default
    };

    const hourlyBoiler = [
      {
        id: 'revenue',
        label: 'Revenue',
        color: "green",
      },
      {
        id: 'impressions',
        label: 'Impressions',
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
          for (let item of rawData[chartId][dataOccurrence]) {
            arrLabels.push(item.date.slice(0, 10))
            arrData.push(item.events);
          }
          obj.chart_data.labels = arrLabels;
          obj.chart_data.datasets.push({});
          obj.chart_data.datasets[0].data = arrData;
          obj.chart_data.datasets[0].label = "Events";
          obj.chart_data.datasets[0].backgroundColor = "orange";
        }
        break;
      case 'stats':
        if (dataOccurrence === 'daily') {
          obj.chart_options.title.text = 'Daily Stats'
          obj.chart_type = 'bar';
          const arrLabels = [];
          const objData = {
            impressions: [],
            clicks: [],
            revenue: []
          };
          for (let item of rawData[chartId][dataOccurrence]) {
            arrLabels.push(item.date.slice(0, 10))
            objData.impressions.push(scaleNumber(item.impressions, true));
            objData.clicks.push(item.clicks);
            objData.revenue.push(item.revenue);
          }
          obj.chart_data.labels = arrLabels;
          hourlyBoiler.forEach((item, ix) => {
            obj.chart_data.datasets.push({});
            obj.chart_data.datasets[ix].data = objData[item.id];
            obj.chart_data.datasets[ix].label = hourlyBoiler[ix].label;
            obj.chart_data.datasets[ix].backgroundColor = hourlyBoiler[ix].color;
            obj.chart_data.datasets[ix].yAxisID = ix ? 'y-axis-2' : 'y-axis-1';
          })
          obj.chart_options.scales = chart_options.stats;
        }
        break;
      case 'poi':
        break;
    }

    return obj;
  }

  const handleClick = (e) => {
    e.preventDefault();
    console.log('ESO', e.target.innerText);
  }

  return (
    <div className='chart'>
      {data.chart_type && <Chart data={data} />}
      <button onClick={handleClick} className='button'>daily</button>
      <button onClick={handleClick} className='button'>hourly</button>
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
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Prev', prevProps);
    console.log('This', this.props);

    if (prevProps !== this.props) {
      this.setState({ ...this.state, chart_data: this.props.data.chart_data, chart_options: this.props.data.chart_options });
    }
  }

  render() {
    return (
      <div className="chart">
        <Bar
          data={this.state.chart_data}
          options={this.state.chart_options}
        />
      </div>
    );
  }

}

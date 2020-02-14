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
  },
  stats_daily: {
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
              case 'Impressions in 1,000s':
                label += ': ' + (parseFloat(tooltipItem.value) * 1000).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3);
                break;
              default:
                label += ': ' + parseFloat(tooltipItem.value);
            }
          }
          return label;
        }
      }
    },
    scales: {
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
            labelString: 'Impressions (in 1,000s) & Clicks'
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
  },
  events_hourly: {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'hour',
          },
          distribution: 'linear',
          ticks: {
            major: {
              enabled: true,
            },
            source: 'auto',
          }
        }
      ],
      yAxes: [
        {
          type: 'linear',
          gridLines: {
            drawBorder: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Events hourly'
          }
        }
      ]
    },
    tooltips: {
      intersect: false,
      mode: 'index'
    }
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
    let chartData = getChartData(props.api_data, state.chart_id, state.data_occurrence);
    setData(chartData);
  }, []);

  useEffect(() => {
    setState({ ...state, chart_id: chart_id });
  }, [chart_id]);

  useEffect(() => {
    //axios calls
    axios.get(`/api/${state.chart_id}${state.chart_id === 'poi' ? '' : `/${state.data_occurrence}`}`)
      .then((res) => {
        console.log('@!@!@BEFORECALL', data.chart_options);
        let chartData = getChartData(res.data, state.chart_id, state.data_occurrence, true);
        setData(chartData);
      }).catch(err => console.error(err));
  }, [state]);

  const scaleNumber = (str, impressions = false) => {
    let result = impressions ? (str / 1000).toFixed(3) : str;
    return result;
  }

  const transformDate = (dateStr, hour) => {
    if (hour < 10) {
      return dateStr.slice(0, -12) + hour + ':00:00.000Z';
    } else {
      return dateStr.slice(0, -11) + hour + ':00:00.000Z';
    }
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
          const arrLabels = [];
          const arrData = [];
          for (let item of (update ? rawData : rawData[chartId][dataOccurrence])) {
            arrLabels.push(transformDate(item.date, item.hour));
            arrData.push(item.events);
          }
          obj.chart_data.labels = arrLabels;
          obj.chart_data.datasets.push({});
          obj.chart_data.datasets[0].data = arrData;
          obj.chart_data.datasets[0].type = 'line';
          obj.chart_data.datasets[0].pointRadius = 0;
          obj.chart_data.datasets[0].lineTension = 0;
          obj.chart_data.datasets[0].borderWidth = 2;
          obj.chart_data.datasets[0].fill = false;
          obj.chart_data.datasets[0].label = "Events";
          obj.chart_data.datasets[0].borderColor = "orange";
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
          })
        } else {
        }
        break;
      case 'poi':
        break;
    }
    console.log('AFTERCAL', obj)
    return obj;
  }

  const handleClick = (e) => {
    e.preventDefault();
    setState({ ...state, data_occurrence: e.target.innerText });
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
    this.count = 0;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      console.log(this.props, 's')
      this.setState({ ...this.state, chart_data: this.props.data.chart_data, chart_options: this.props.data.chart_options });
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

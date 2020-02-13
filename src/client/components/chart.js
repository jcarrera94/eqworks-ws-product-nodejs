import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

const ChartId = (props) => {

  let { chart_id } = useParams();

  const [state, setState] = useState({
    chart_id: chart_id,
    data_type: 'daily'
  });

  const [data, setData] = useState({});

  useEffect(() => {
    setState({ ...state, chart_id: chart_id });
  }, [chart_id]);


  useEffect(() => {
    if (chart_id === 'poi') {
      setState({ ...state, data_type: null });
      //get data for poi
    } else {
      let chartData = getChartData(props.api_data, state.chart_id, state.data_type);
      setData({ ...data, ...chartData });
    }
  }, []);

  const scaleNumber = (str, impressions = false) => {
    // let res = parseFloat(str).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    // res = money ? res : res.slice(0, -3);
    let result = impressions ? (str / 1000).toFixed(3) : str;

    return result;
  }

  const getChartData = (rawData, chartId, dataType) => {
    const obj = {
      chart_data: {
        datasets: []
      },
      chart_options: {
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
      }
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
        if (dataType === 'daily') {
          obj.chart_options.title.text = 'Daily Events'
          obj.chart_type = 'bar';
          const arrLabels = [];
          const arrData = [];
          for (let item of rawData[chartId][dataType]) {
            arrLabels.push(item.date.slice(0, 10))
            arrData.push(item.events);
          }
          obj.chart_data.labels = arrLabels;
          obj.chart_data.datasets.push({});
          obj.chart_data.datasets[0].data = arrData;
          obj.chart_data.datasets[0].label = "Events";
          obj.chart_data.datasets[0].backgroundColor = "orange";
          obj.chart_data.datasets[0].hoverBorderWidth = 1,
            obj.chart_data.datasets[0].hoverBorderColor = "#000";
        }
        break;
      case 'stats':
        if (dataType === 'daily') {
          obj.chart_options.title.text = 'Daily Stats'
          obj.chart_type = 'bar';
          const arrLabels = [];
          const objData = {
            impressions: [],
            clicks: [],
            revenue: []
          };
          for (let item of rawData[chartId][dataType]) {
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
            // obj.chart_data.datasets[ix].hoverBorderWidth = 1;
            // obj.chart_data.datasets[ix].hoverBorderColor = "#000";
            obj.chart_data.datasets[ix].yAxisID = ix ? 'y-axis-2' : 'y-axis-1';
          })
          obj.chart_options.scales = {
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
          };
        }
        break;
      case 'poi':
        break;
    }

    return obj;
  }
  // let data = {
  //   labels: ['1', '2', '3', '4', '5', '6', '7'],
  //   datasets: [
  //     {
  //       label: 'Events',
  //       data: [22, 29, '31', '40', '35', '36', '33'],
  //       backgroundColor: "green",
  //       hoverBorderWidth: 3,
  //       hoverBorderColor: "#000"
  //     },
  //     {
  //       label: 'clicks',
  //       data: ['3300', '2900', '3100', '4000', '3500', '3600', '3300'],
  //       backgroundColor: "blue",
  //       hoverBorderWidth: 3,
  //       hoverBorderColor: "#000"
  //     },
  //   ]
  // };


  return (
    <div>
      <h2>{state.chart_id}</h2>
      {data.chart_type && <Chart data={data} />}
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
    console.log('@@@chartpropsoptions', this.state.chart_options)
    console.log('@@@chartpropsdata', this.state.chart_data)
  }

  // static defaultProps = {
  //   displayTitle: true,
  //   displayLegend: true,
  //   legendPosition: 'right'
  // }

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

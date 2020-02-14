export default {
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
    tooltips: {
      mode: 'point',
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM D hA'
            }
          },
          distribution: 'series',
          ticks: {
            major: {
              enabled: true,
            },
            source: 'auto',
            autoSkip: true,
            autoSkipPadding: 75
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
            labelString: '# of Events'
          },
          ticks: {
            suggestedMax: 30
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
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
    setState({ ...state, chart_id: chart_id});
  }, [chart_id]);
  
  
  useEffect(async () => {
    if (chart_id === 'poi') {
      setState({ ...state, data_type: null});
      //get data for poi
      console.log('first mount', state.chart_id, state.data_type);
    } else {
      let chartData = await getChartData(props.api_data, state.chart_id, state.data_type);
      setData({ ...data, chartData });
      console.log('!!!!!whats the data', data);
    }
  }, []);

  const getChartData = (rawData, chartId, dataType) => {
    console.log('@@@@@Did i make it here?????', rawData, chartId, dataType);
    const obj = {
      chart_data: {
        datasets: [{}]
      }
    };

    switch (chartId) {
      case 'events':
        if (dataType === 'daily') {
          console.log('Inside switch', obj)
          obj.chart_type = 'bar';
          const arr = [];
          for (let item of rawData[chartId][dataType]) {
            arr.push({x: item.date.slice(0,10), y: item.events});
          }
          obj.chart_data.datasets[0].data = arr;
          obj.chart_data.datasets[0].label = "Events";
          obj.chart_data.datasets[0].backgroundColor = "orange";
          obj.chart_data.datasets[0].hoverBorderWidth = 3,
          obj.chart_data.datasets[0].hoverBorderColor= "#000";
        }
        break;
      case 'stats':
        break;
      case 'poi': 
        break;
    }

    console.log('@@@@@obj after', obj)

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
      {data.chart_type === 'bar' ? <Chert chartData={data.chart_data}/> : <div>Nope</div>}
    </div>
  )
}

export default ChartId

class Chert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    }
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }

  render() {
    return (
      <div className="chart">
        <Bar 
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Daily Events',
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        />
      </div>
    );
  }

}

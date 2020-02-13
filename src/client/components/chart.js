import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

const Chart = (props) => {

  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        label: 'Events',
        data: ['33', '29', '31', '40', '35', '36', '33'],
        backgroundColor: "green",
        hoverBorderWidth: 3,
        hoverBorderColor: "#000"
      },
      {
        label: 'clicks',
        data: ['3300', '2900', '3100', '4000', '3500', '3600', '3300'],
        backgroundColor: "blue",
        hoverBorderWidth: 3,
        hoverBorderColor: "#000"
      },
    ]
  };


  let { chart_id } = useParams();

  return (
    <div>
      <Chert chartData={data}/>
    </div>
  )
}

export default Chart

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

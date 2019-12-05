import React, { Component } from 'react';
import '../App.css';
import { Chart, Tooltip, Axis, Line, View, Point, Area } from 'viser-react';
import { Card } from 'antd';
const formatDate = require('../javascripts/functions');

const DataSet = require('@antv/data-set');

const label = {
  textStyle: {
    fill: '#aaaaaa'
  }
};

const labelFormat = {
  textStyle: {
    fill: '#aaaaaa'
  },
  formatter: function formatter(text) {
    return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
};
/*
const formatDate = date => {
  var dt = new Date(date);
  return dt.getDate() + '/' + dt.getMonth() + '/' + dt.getFullYear();
};
*/
class Progress extends Component {
  constructor() {
    super();
    this.state = {
      status: []
    };
  }

  componentDidMount() {
    console.log('progress componentDidMount');

    fetch(`http://localhost:3000/status`)
      .then(response => response.json())
      .then(data => {
        console.log('Dans mon fetch: Get Status-->', data);
        this.setState({ status: data.status });
      });
  }

  render() {
    var progressList = [];

    console.log('Progress render');

    for (var i = 0; i < this.state.status.length; i++) {
      var status = this.state.status[i];
      var data = status.progress;
      var dtstatus = formatDate(status.dtstatus);

      console.log('progress', i, data);

      var ds = new DataSet();
      var dv = ds
        .createView()
        .source(data)
        .transform({
          type: 'fold',
          fields: ['tasks_closed', 'tasks_created'],
          key: 'type',
          value: 'value',
          retains: ['dtstat']
        });

      var dv2 = ds
        .createView()
        .source(data)
        .transform({
          type: 'map',
          callback: function callback(row) {
            row.range = [row['tasks_closed'], row['tasks_created']];
            return row;
          }
        });

      progressList.push(
        <div key={i} style={{ background: '#ECECEC', padding: '30px' }}>
          <Card
            title={`Status ${dtstatus}`}
            bordered={false}
            style={{ width: 600 }}
          >
            <Chart
              forceFit
              data={data}
              height={400}
              padding='auto'
              scale={[
                {
                  dataKey: 'dtstat',
                  range: [0, 1],
                  tickCount: 10,
                  type: 'timeCat'
                }
              ]}
            >
              <Tooltip crosshairs='y' />
              <Axis dataKey='value' label={labelFormat} />
              <Axis dataKey='dtstat' label={label} />
              <View data={dv2.rows}>
                <Axis show={false} dataKey='range' />
                <Area position='dtstat*range' color='#8d8d8d' opacity={0.1} />
              </View>
              <View data={dv.rows}>
                <Line position='dtstat*value' color='type' opacity={1} />
                <Point
                  position='dtstat*value'
                  color='type'
                  opacity={1}
                  shape='circle'
                />
              </View>
            </Chart>
          </Card>
        </div>
      );
    }
    if (progressList.length === 0) {
      progressList.push(<h1 key='0'>No project status available</h1>);
    }
    return <div>{progressList}</div>;
  }
}

export default Progress;

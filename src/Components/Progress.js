import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Chart, Tooltip, Axis, Line, View, Point, Area } from 'viser-react';
import { Card } from 'antd';
import Conversation from './Conversation';

var functions = require('../javascripts/functions');
var formatDate = functions.formatDate;
var retrieveidproject = functions.retrieveidproject;

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

class Progress extends Component {
  constructor() {
    super();
    this.state = {
      status: []
    };
  }

  handleConversation = value => {};

  componentDidMount() {
    //console.log('Progress - componentDidMount');
    var idproject = this.props.idprojectFromStore;
    if (idproject && idproject !== '0' && idproject !== this.state.idproject) {
      fetch(`http://localhost:3000/status/${idproject}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ status: data.status, idproject });
        });
    }
  }

  render() {
    var progressList = [];

    for (var i = 0; i < this.state.status.length; i++) {
      var status = this.state.status[i];
      var data = status.progress;
      var dtstatus = formatDate(status.dtstatus);

      var colorTitleCard;
      switch (status.status) {
        case 'On track':
          colorTitleCard = '#56BF8E';
          break;
        case 'At risk':
          colorTitleCard = '#E69167';
          break;
        case 'Off track':
          colorTitleCard = '#FF524F';
          break;
        default:
          break;
      }

      var comments = [];
      var idconversation;
      if (status.idconversation) {
        idconversation = status.idconversation._id;
        comments = status.idconversation.comment;
      }

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
            title={`Status on ${dtstatus} - ${status.status}`}
            bordered={false}
            headStyle={{ backgroundColor: colorTitleCard, color: 'white' }}
            style={{ width: 600 }}
          >
            <Conversation
              idconversation={idconversation}
              savecommentsInDb='true'
              comments={comments}
              handleClickParent={this.handleConversation}
            />
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
      if (this.state.idproject)
        progressList.push(<h1 key='0'>No project status available</h1>);
      else
        progressList.push(
          <h1 key='0' style={{ color: 'red' }}>
            Select a project ...
          </h1>
        );
    }
    return <div>{progressList}</div>;
  }
}

function mapStateToProps(state) {
  //console.log('Progress - mapStateToProps : ', state.appli);

  return { idprojectFromStore: retrieveidproject(state) };
}

export default connect(mapStateToProps, null)(Progress);

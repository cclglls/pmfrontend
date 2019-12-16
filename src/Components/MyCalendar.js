import React, { Component } from 'react';
import '../App.css';
import { Calendar, Badge } from 'antd';
import { connect } from 'react-redux';
var functions = require('../javascripts/functions');
var retrievetaskList = functions.retrievetaskList;

class MyCalendar extends Component {
  constructor() {
    super();
    this.state = {
      //taskList: []
    };
  }

  getListData = value => {
    var date = new Date(value);

    var duedate;
    var listData = [];
    if (this.state.taskList)
      for (var i = 0; i < this.state.taskList.length; i++) {
        duedate = new Date(this.state.taskList[i].duedate);

        if (
          date.getDate() === duedate.getDate() &&
          date.getMonth() === duedate.getMonth() &&
          date.getFullYear() === duedate.getFullYear()
        ) {
          listData.push({
            type: 'success',
            content: this.state.taskList[i].name
          });
        }
      }
    return listData;
  };

  dateCellRender = value => {
    const listData = this.getListData(value);
    return (
      <ul className='events'>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  refreshCalendar = () => {
    if (
      this.props.taskListFromStore &&
      this.props.taskListFromStore !== this.state.taskList
    ) {
      var taskList = this.props.taskListFromStore;
      this.setState({ taskList });
    }
  };

  componentDidMount() {
    //console.log('MyCalendar - componentDidMount', this.props.appliFromStore);
    this.refreshCalendar();
  }

  componentDidUpdate() {
    //console.log('MyCalendar - componentDidUpdate', this.props.appliFromStore);
    this.refreshCalendar();
  }

  render() {
    return (
      <div>
        <Calendar dateCellRender={this.dateCellRender} />,
      </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log('Mycalendar mapStateToProps : ', state.appli);

  return { taskListFromStore: retrievetaskList(state) };
}

export default connect(mapStateToProps, null)(MyCalendar);

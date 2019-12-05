import React, { Component } from 'react';
import '../App.css';
import { Calendar, Badge } from 'antd';
import { connect } from 'react-redux';

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
          //console.log('egalite --->', date, duedate);
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

  componentDidUpdate() {
    console.log('componentDidUpdate MyCalendar');

    if (!this.state.taskList) {
      var finalData;
      var appli = this.props.appliFromStore;
      console.log('myCalendar', appli);
      if (appli) {
        for (var i = 0; i < appli.length; i++) {
          if (appli[i].type === 'savesections') {
            finalData = appli[i].finalData;
            break;
          }
        }
      }

      if (finalData) {
        var taskList = finalData.taskList;
        console.log('taskList', taskList);
        this.setState({ taskList });
      }
    }
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
  console.log('Mycalendar reducer : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, null)(MyCalendar);

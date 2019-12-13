import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from 'antd';
import NewTask from './NewTask';
var formatDate = require('../javascripts/functions');

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'skyblue' : 'white')};
`;

const MyDiv = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
`;

class Task extends React.PureComponent {
  state = {
    idtask: undefined,
    task: {}
  };

  handleClick = async () => {
    console.log('Task - Click détecté');
    var body = {
      dtclosure: new Date()
      // iduser: userId
    };

    try {
      var response;
      if (this.state.idtask) {
        response = await fetch(
          `http://localhost:3000/tasks/task/${this.state.idtask}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }
        );
        console.log('New Task - Save BD', response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  refreshTask = () => {
    if (
      this.props.taskListFromStore &&
      this.props.task.idtask !== this.state.idtask
    ) {
      var taskList = this.props.taskListFromStore;
      var task;

      if (taskList && this.props.task.idtask) {
        task = taskList.find(task => task._id === this.props.task.idtask);
      }

      if (task) {
        this.setState({
          idtask: task._id,
          task: task
        });
      }
    }
  };

  componentDidMount() {
    //console.log('task - componentDidMount');
    this.refreshTask();
  }

  componentDidUpdate() {
    //console.log('task - componentDidMount');
    this.refreshTask();
  }

  render() {
    console.log('Task - render', this.state);

    var style = {
      marginRight: '8.725em'
    };

    if (this.state.task && this.state.task.dtclosure) {
      style.backgroundColor = '#5b8c00';
      style.color = 'white';
    }

    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <Button
              onClick={this.handleClick}
              size='small'
              icon='check-circle'
              style={style}
            />
            <MyDiv>{this.props.task.content}</MyDiv>
            <MyDiv>{this.props.task.assignee}</MyDiv>
            <MyDiv>{formatDate(this.props.task.duedate)}</MyDiv>
            <NewTask text='...' idtask={this.props.task.idtask} />
          </Container>
        )}
      </Draggable>
    );
  }
}

function mapStateToProps(state) {
  console.log('Task - mapStateToProps : ', state.appli);

  var appli = state.appli;
  var finalData;
  var taskList;

  if (appli) {
    for (var i = 0; i < appli.length; i++) {
      if (appli[i].type === 'savesections') {
        finalData = appli[i].finalData;
        break;
      }
    }
  }

  if (finalData) taskList = finalData.taskList;

  return { taskListFromStore: taskList };
}

export default connect(mapStateToProps, null)(Task);

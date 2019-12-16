import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from 'antd';
import NewTask from './NewTask';
var functions = require('../javascripts/functions');
var formatDate = functions.formatDate;
var retrievetaskList = functions.retrievetaskList;
var retrieveuser = functions.retrieveuser;

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
  constructor() {
    super();
    this.state = {
      idtask: undefined,
      dtclosure: undefined,
      iduser: undefined
    };
  }

  handleClick = async () => {
    //console.log('Task - Click détecté');

    if (!this.state.dtclosure) {
      var dtclosure = new Date();

      var body = {
        dtclosure,
        iduser: this.props.userFromStore._id
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
          this.setState({ dtclosure });
        }
      } catch (error) {
        console.log(error);
      }
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
        //console.log('task - refreshTask', task);
        this.setState({
          idtask: task._id,
          dtclosure: task.dtclosure
        });
      }
    }
  };

  componentDidMount() {
    //console.log('task - componentDidMount');
    this.refreshTask();
  }

  componentDidUpdate() {
    //console.log('task - componentDidUpdate');
    this.refreshTask();
  }

  render() {
    //console.log('Task - render', this.state);

    var style = {
      marginRight: '8px'
    };

    if (this.state.dtclosure) {
      style.backgroundColor = '#56BF8E';
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
  //console.log('Task - mapStateToProps : ', state.appli);

  return {
    taskListFromStore: retrievetaskList(state),
    userFromStore: retrieveuser(state)
  };
}

export default connect(mapStateToProps, null)(Task);

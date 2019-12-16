import React, { Component } from 'react';
import '../App.css';

import { connect } from 'react-redux';

import Column from './column';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

var functions = require('../javascripts/functions');
var retrieverefreshTasks = functions.retrieverefreshTasks;
var retrieveuser = functions.retrieveuser;

const Title = styled.div`
    display:flex
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 16px;
    padding: 8px;
    margin-bottom: 8px;
    font-weight: bold;
    border: 1px solid lightgrey;
    border-radius: 5px;
    width: 100wh;
    background-color: white;
`;
const MyDiv = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

function initializeData(sections) {
  var tasks = {};
  var columns = {};
  var columnOrder = [];
  var taskList = [];

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];

    var taskIds = [];
    for (var j = 0; j < section.task.length; j++) {
      var task = section.task[j];
      var duedate;
      if (task.duedate) duedate = task.duedate;
      var assignee;
      if (task.idassignee) assignee = task.idassignee.initials;
      tasks[`tasks-${task._id}`] = {
        id: `tasks-${task._id}`,
        content: task.name,
        assignee,
        duedate,
        idtask: task._id
      };
      taskList.push(task);
      var taskId = `tasks-${task._id}`;
      taskIds.push(taskId);
    }

    columns[`column-${section._id}`] = {
      id: `column-${section._id}`,
      title: section.name,
      taskIds: taskIds
    };

    columnOrder.push(`column-${section._id}`);
  }

  var initialData = {};
  initialData.tasks = tasks;
  initialData.columns = columns;

  initialData.columnOrder = columnOrder;
  initialData.taskList = taskList;

  return initialData;
}

class List extends Component {
  constructor() {
    super();
    this.state = {};
  }

  onDragEnd = result => {
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder
      };
      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTasksIds = Array.from(start.taskIds);
      newTasksIds.splice(source.index, 1);
      newTasksIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTasksIds
      };
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
      return;
    }

    //Moving from one list to another :
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    this.setState(newState);
  };

  refreshTasks = () => {
    var refreshTasks = this.props.refreshTasksFromStore;
    var user = this.props.userFromStore;

    var iduser = this.props.match.params.iduser;
    var idproject = this.props.match.params.idproject;

    if (!iduser && !idproject) {
      if (user) {
        iduser = user._id;
        idproject = '0';
      }
    }

    /*
    console.log(
      'RefreskTasks',
      this.state.iduser,
      iduser,
      this.state.idproject,
      idproject
    );
    */

    if (
      refreshTasks === true ||
      this.state.iduser !== iduser ||
      this.state.idproject !== idproject
    ) {
      if (this.state.columns) this.saveSectionsToDb(false);

      if (refreshTasks) {
        this.props.refreshtasks(false);
      }

      var url;
      if (idproject !== '0')
        url = `http://localhost:3000/workspace/${idproject}/0`;
      if (iduser && iduser !== '0')
        url = `http://localhost:3000/workspace/${idproject}/${iduser}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          var initialData = initializeData(data.section);
          initialData.iduser = iduser;
          initialData.idproject = idproject;
          this.setState(initialData);
          this.props.savesections(initialData);
        });
    }
  };

  componentDidMount() {
    //console.log('List - componentDidMount', this.props.appliFromStore);
    this.refreshTasks();
  }

  componentDidUpdate() {
    //console.log('List - componentDidUpdate', this.props.appliFromStore);
    this.refreshTasks();
  }

  saveSectionsToDb = dispatch => {
    //console.log('List saveSectionsToDb');
    var sections = [];

    for (const property in this.state.columns) {
      var idsection = property.slice(7);

      var taskIds = this.state.columns[property].taskIds.map(function(task) {
        var idtask = { _id: task.slice(6) };

        return idtask;
      });

      var section = { _id: idsection, task: taskIds };
      sections.push(section);
    }

    var body = JSON.stringify({
      sections
    });

    fetch(`http://localhost:3000/workspace/sections`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })
      .then(response => response.json())
      .then(data => {
        if (dispatch) {
          var finalData = {};
          finalData.tasks = this.state.tasks;
          finalData.columns = this.state.columns;
          finalData.columnOrder = this.state.columnOrder;
          finalData.taskList = this.state.taskList;
          finalData.iduser = this.state.iduser;
          finalData.idproject = this.state.idproject;
          this.props.savesections(finalData);
        }
      });
  };

  componentWillUnmount() {
    //console.log('List - componentWillUnmount');
    this.saveSectionsToDb(true);
  }

  render() {
    if (!this.state.columnOrder) {
      return <div></div>;
    }
    return (
      <div>
        <Title>
          <MyDiv style={{ marginLeft: '32px' }}>Task</MyDiv>
          <MyDiv>Assignee</MyDiv>
          <MyDiv style={{ marginRight: '26px' }}>Due Date</MyDiv>
        </Title>
        <DragDropContext
          // onDragStart={this.onDragStart}
          // onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
        >
          <Droppable
            droppableId='all-columns'
            direction='horizontal'
            type='column'
          >
            {provided => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {this.state.columnOrder.map((columnId, index) => {
                  const column = this.state.columns[columnId];
                  const tasks = column.taskIds.map(
                    taskId => this.state.tasks[taskId]
                  );

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      index={index}
                    />
                  );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    savesections: function(finalData) {
      //console.log('List - mapDispatchToProps: ', finalData);
      dispatch({ type: 'savesections', finalData });
    },
    refreshtasks: function(refreshTasks) {
      //console.log('List - mapDispatchToProps', refreshTasks);
      dispatch({ type: 'refreshtasks', refreshTasks });
    }
  };
}

function mapStateToProps(state) {
  //console.log('List - mapStateToProps : ', state.appli);

  return {
    refreshTasksFromStore: retrieverefreshTasks(state),
    userFromStore: retrieveuser(state)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);

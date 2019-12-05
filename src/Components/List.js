import React, { Component } from 'react';
import '../App.css';
//import { Card } from 'antd';
import { connect } from 'react-redux';
//import initialData from './initial-data';
import Column from './column';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

function initializeData(sections) {
  //console.log('initializeData deb', sections);

  /*
  sections.map(function(section) {
    var taskIds = section.task.map(function(task) {
      var taskId = `tasks-${task._id}`;
      return taskId;
    });
    //console.log(taskIds);
    columns[`column-${section._id}`] = {
      id: `column-${section._id}`,
      title: section.name,
      taskIds: taskIds
    };
    columnOrder.push(`column-${section._id}`);
  });
*/
  //console.log('columns',columns);
  //console.log('columnOrder',columnOrder);

  var tasks = {};
  var columns = {};
  var columnOrder = [];
  var taskList = [];

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];

    var taskIds = [];
    for (var j = 0; j < section.task.length; j++) {
      var task = section.task[j];
      tasks[`tasks-${task._id}`] = {
        id: `tasks-${task._id}`,
        content: task.name
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

  //console.log('tasks',tasks);

  var initialData = {};
  initialData.tasks = tasks;
  initialData.columns = columns;

  initialData.columnOrder = columnOrder;
  initialData.taskList = taskList;
  console.log('initializeData fin', initialData);

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

  componentDidMount() {
    console.log(
      'List - componentDidMount: props de ma page List --> ',
      this.props.match.params
    );

    fetch(`http://localhost:3000/workspace/5de236e8f407761f2c36d06f`)
      .then(response => response.json())
      .then(data => {
        console.log('Dans mon fetch: Get Sections-->', data);
        /* this.setState({ sections: data.section }); */
        var initialData = initializeData(data.section);
        this.setState(initialData);
        //this.props.savesections(data.section);
      });
  }

  componentWillUnmount() {
    console.log('sortie de List');
    var sections = [];

    for (const property in this.state.columns) {
      //console.log(property);

      var idsection = property.slice(7);
      //console.log('idsection',idsection);

      //console.log(this.state.columns[property].taskIds);
      var taskIds = this.state.columns[property].taskIds.map(function(task) {
        var idtask = { _id: task.slice(6) };
        //console.log(idtask);
        return idtask;
      });
      //console.log(taskIds);
      var section = { _id: idsection, task: taskIds };
      sections.push(section);
    }

    console.log('sections', sections);

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
        console.log('Dans mon fetch: Put workspace Sections-->', data);
        /* stocker dans le store */
        var finalData = {};
        finalData.tasks = this.state.tasks;
        finalData.columns = this.state.columns;
        finalData.columnOrder = this.state.columnOrder;
        finalData.taskList = this.state.taskList;
        this.props.savesections(finalData);
      });
  }

  render() {
    if (!this.state.columnOrder) {
      return <div>Page List</div>;
    }
    return (
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
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    savesections: function(finalData) {
      console.log('mapDispatchToProps - Sections', finalData);
      dispatch({ type: 'savesections', finalData });
    }
  };
}

export default connect(null, mapDispatchToProps)(List);

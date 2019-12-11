import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import NewTask from './NewTask';

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

export default class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <MyDiv>{this.props.task.content}</MyDiv>
            <MyDiv>{this.props.task.assignee}</MyDiv>
            <MyDiv>{this.props.task.duedate}</MyDiv>
            <NewTask text='...' idtask={this.props.task.idtask} />
          </Container>
        )}
      </Draggable>
    );
  }
}

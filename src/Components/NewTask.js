import React from 'react';
import '../App.css';
import { connect } from 'react-redux';

import { Modal, Button, Input, Divider, Timeline } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';

import Owner from './Owner';
import Conversation from './Conversation';

import ProjectSelector from './ProjectSelector';

var functions = require('../javascripts/functions');
var formatDate = functions.formatDate;
var retrievetaskList = functions.retrievetaskList;
var retrieveuser = functions.retrieveuser;

const { TextArea } = Input;

class NewTask extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      idtask: '',
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      project: '',
      idproject: undefined,
      idconversation: undefined,
      comments: [],
      completed: false,
      error: '',
      visible: false
    };
  }

  showModal = () => {
    //console.log('Show modal');
    this.setState({
      idtask: '',
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      project: '',
      idproject: undefined,
      idconversation: undefined,
      comments: [],
      completed: false,
      error: '',
      visible: true
    });
  };

  // bouton Croix
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // fonction qui gere le selector owner comme task Rajouter l'id
  handleOwner = (value, id) => {
    this.setState({ owner: value, idowner: id });
  };

  // fonction qui gere le selector project comme project MANQUE l'ID du projet
  handleProject = (value, id) => {
    this.setState({ project: value, idproject: id });
  };

  handleConversation = value => {
    this.setState({ comments: value });
  };

  // fonction qui gere le DatePicker :
  onChange = (date, dateString) => {
    var duedate = date;
    if (date !== null) duedate = new Date(dateString);

    this.setState({ duedate });
  };

  //fonction qui va gerer le bouton submit
  handleSubmit = async () => {
    //console.log('handleSubmit', this.state);

    var error = '';
    if (this.state.name === '') error = 'Name';

    if (this.state.owner === '') {
      if (error) error = error + ', ';
      error = error + 'Assignee';
    }

    if (this.state.project === '') {
      if (error) error = error + ', ';
      error = error + 'Project';
    }

    if (this.state.duedate === null) {
      if (error) error = error + ', ';
      error = error + 'Due date';
    }

    //console.log('error', error);

    if (error !== '') {
      error = 'Mandatory fields: ' + error;
      this.setState({ error });
      return;
    }

    var idproject;
    if (this.state.idproject) idproject = this.state.idproject;

    var iduser;
    if (this.props.userFromStore) iduser = this.props.userFromStore._id;

    if (idproject) {
      var body = {
        name: this.state.name,
        description: this.state.description,
        duedate: this.state.duedate,
        idassignee: this.state.idowner,
        comment: this.state.comments,
        idproject,
        iduser
      };

      //console.log('New Task - comments', this.state.comments);

      try {
        var response;
        if (!this.props.idtask) {
          response = await fetch(`http://localhost:3000/tasks/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
        } else {
          response = await fetch(
            `http://localhost:3000/tasks/task/${this.props.idtask}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            }
          );
          console.log('New Task - Save BD', response);
        }

        /* 
      Demander à List de se raffraichir par une varibale Redux
      */
        this.props.refreshtasks(true);
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ visible: false });
  };

  refreshTask = () => {
    if (
      this.props.taskListFromStore &&
      this.props.idtask !== this.state.idtask
    ) {
      var taskList = this.props.taskListFromStore;
      var task;

      if (taskList && this.props.idtask) {
        task = taskList.find(task => task._id === this.props.idtask);
      }

      if (task) {
        this.setState({
          idtask: task._id,
          name: task.name,
          description: task.description,
          duedate: task.duedate,
          project: task.idproject.name,
          idproject: task.idproject,
          owner: task.idassignee.initials,
          idowner: task.idassignee._id,
          idconversation: task.idconversation._id,
          comments: task.idconversation.comment,
          event: task.event,
          dtclosure: task.dtclosure,
          completed: task.dtclosure ? true : false
        });
      }
    }
  };

  handleError = () => {
    var error = this.state.error;
    if (this.state.error.indexOf('Name') < 0 || this.state.name !== '') {
      error = error.replace('Name,', '');
      error = error.replace('Name', '');
    }
    if (this.state.error.indexOf('Assignee') < 0 || this.state.owner !== '') {
      error = error.replace('Assignee,', '');
      error = error.replace('Assignee', '');
    }
    if (this.state.error.indexOf('Project') < 0 || this.state.project !== '') {
      error = error.replace('Project,', '');
      error = error.replace('Project', '');
    }
    if (
      this.state.error.indexOf('Due date') < 0 ||
      this.state.duedate !== null
    ) {
      error = error.replace('Due date,', '');
      error = error.replace('Due date', '');
    }
    if (
      error.indexOf('Name') < 0 &&
      error.indexOf('Assignee') < 0 &&
      error.indexOf('Project') < 0 &&
      error.indexOf('Due date') < 0
    )
      error = '';

    if (error !== this.state.error) this.setState({ error });
  };

  componentDidMount() {
    //console.log('NewTask - componentDidMount');
    this.refreshTask();
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('NewTask - componentDidUpdate');
    if (
      prevState.name !== this.state.name ||
      prevState.owner !== this.state.owner ||
      prevState.duedate !== this.state.duedate ||
      prevState.project !== this.state.project
    ) {
      this.handleError();
    }

    this.refreshTask();
  }

  render() {
    const { visible } = this.state;
    var timelineList = [];
    if (this.state.event) {
      var z = 'Created on ' + formatDate(this.state.event[0].dtevent);
      if (this.state.event[0].user) {
        z = z + ' by ' + this.state.event[0].user.initials;
      }
      timelineList.push(
        <Timeline.Item key='0' color='green'>
          {z}
        </Timeline.Item>
      );
      if (this.state.dtclosure) {
        z = 'Completed on ' + formatDate(this.state.dtclosure);
        timelineList.push(
          <Timeline.Item key='1' color='green'>
            {z}
          </Timeline.Item>
        );
      }
    }

    var stylename = { marginBottom: '1.25em', width: '80%' };
    if (this.state.error.indexOf('Name') >= 0 && this.state.name === '') {
      stylename.borderColor = '#FF524F';
    }

    var styledatepicker = { border: 'none' };
    if (
      this.state.error.indexOf('Due date') >= 0 &&
      this.state.duedate === null
    ) {
      styledatepicker.border = '1px solid #FF524F';
    }

    return (
      <div>
        {this.props.idtask ? (
          <Button icon='export' size='small' onClick={this.showModal} />
        ) : (
          <span
            style={{ height: '50px', width: '100px' }}
            onClick={this.showModal}
          >
            {this.props.text}
          </span>
        )}
        <Modal
          visible={visible}
          title='Task'
          width='700px'
          onCancel={this.handleCancel}
          footer={[
            <Button key='submit' type='primary' onClick={this.handleSubmit}>
              Submit
            </Button>
          ]}
        >
          <div className='Input'>
            <p style={{ marginRight: '3.2em' }}>Name</p>
            <Input
              style={stylename}
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.name}
            />
          </div>

          <div className='AssignedTo-DueDate'>
            <div className='Input' style={{ marginBottom: '1.25em' }}>
              <p style={{ marginRight: '0.6em' }}>Assigned to</p>
              <Owner
                error={this.state.error}
                initials={this.state.owner}
                handleClickParent={this.handleOwner}
              />
            </div>

            <div
              className='Input'
              style={{ marginBottom: '1.25em', marginRight: '3.5em' }}
            >
              <p style={{ marginRight: '1em' }}>Due date</p>
              <DatePicker
                style={styledatepicker}
                value={
                  this.state.duedate !== null
                    ? moment(this.state.duedate)
                    : null
                }
                onChange={this.onChange}
              />
            </div>
          </div>

          <div className='Input'>
            <p style={{ marginRight: '3.6em' }}>Desc</p>
            <TextArea
              style={{ marginBottom: '1.25em', width: '80%' }}
              rows={4}
              onChange={e => this.setState({ description: e.target.value })}
              placeholder='Description'
              value={this.state.description}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p style={{ marginRight: '2.6em' }}>Project</p>
            <ProjectSelector
              error={this.state.error}
              style={{ marginLeft: '1.5em' }}
              projectname={this.state.project}
              handleClickParent={this.handleProject}
            />
            {this.state.completed ? (
              <Button
                style={{
                  backgroundColor: '#56BF8E',
                  color: 'white',
                  marginLeft: '8.725em'
                }}
              >
                Completed
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: '#FF524F',
                  color: 'white',
                  marginLeft: '8.725em'
                }}
              >
                Incomplete
              </Button>
            )}
          </div>

          <Divider />

          <Timeline>{timelineList}</Timeline>
          <Conversation
            idconversation={this.state.idconversation}
            comments={this.state.comments}
            handleClickParent={this.handleConversation}
          />
          <div className='Input'>
            <p
              style={{
                marginTop: '1.25em',
                marginBottom: '0px',
                color: '#FF524F'
              }}
            >
              {this.state.error}
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    refreshtasks: function(refreshTasks) {
      //console.log('New task - mapDispatchToProps', refreshTasks);
      dispatch({ type: 'refreshtasks', refreshTasks });
    }
  };
}

function mapStateToProps(state) {
  //console.log('New Task - mapStateToProps : ', state.appli);

  return {
    taskListFromStore: retrievetaskList(state),
    userFromStore: retrieveuser(state)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);

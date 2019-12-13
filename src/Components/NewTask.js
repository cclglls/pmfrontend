import React from 'react';
import '../App.css';
import { connect } from 'react-redux';

import { Modal, Button, Input, Divider, Timeline } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';

import Owner from './Owner';
import Conversation from './Conversation';
import Followers from './Followers';
import ProjectSelector from './ProjectSelector';

const { TextArea } = Input;

class NewTask extends React.PureComponent {
  state = {
    idtask: '',
    name: '',
    description: '',
    duedate: new Date(),
    owner: '',
    idowner: '',
    project: '',
    idproject: undefined,
    idconversation: '',
    comments: [],
    visible: false
  };

  showModal = () => {
    this.setState({
      idtask: '',
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      project: '',
      idproject: undefined,
      idconversation: '',
      comments: [],
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
    var duedate = new Date(dateString);

    this.setState({ duedate });
  };

  //fonction qui va gerer le bouton submit
  handleSubmit = async () => {
    var idproject;

    if (this.state.idproject) idproject = this.state.idproject;

    if (idproject) {
      var body = {
        name: this.state.name,
        description: this.state.description,
        dtuedate: this.state.duedate,
        idassignee: this.state.idowner,
        comment: this.state.comments,
        idproject
        // iduser: userId
      };

      console.log('New Task - comments', this.state.comments);

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
    if (this.props.idtask !== this.state.idtask) {
      var appli = this.props.appliFromStore;
      var finalData;
      var taskList;
      var task;

      if (appli) {
        for (var i = 0; i < appli.length; i++) {
          if (appli[i].type === 'savesections') {
            finalData = appli[i].finalData;
            break;
          }
        }
      }

      if (finalData) taskList = finalData.taskList;

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
          comments: task.idconversation.comment
        });
      }
    }
  };

  componentDidMount() {
    //console.log('NewTask - componentDidMount');
    this.refreshTask();
  }

  componentDidUpdate() {
    //console.log('NewTask - componentDidUpdate');
    this.refreshTask();
  }

  render() {
    const { visible } = this.state;

    return (
      <div>
        {this.props.idtask ? (
          <Button icon='export' size='small' onClick={this.showModal} />
        ) : (
          <span onClick={this.showModal}>{this.props.text}</span>
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
              style={{ marginBottom: '1.25em', width: '80%' }}
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.name}
            />
          </div>

          <div className='AssignedTo-DueDate'>
            <div className='Input'>
              <p style={{ marginRight: '0.6em' }}>Assigned to</p>
              <Owner
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
                value={moment(this.state.duedate)}
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

          <div className='AssignedTo-DueDate'>
            <ProjectSelector
              projectname={this.state.project}
              handleClickParent={this.handleProject}
            />
            <Button
              style={{
                backgroundColor: '#5b8c00',
                color: 'white',
                marginRight: '3.5em'
              }}
            >
              Completed
            </Button>
          </div>

          <Divider />

          <Timeline>
            <Timeline.Item color='green'>
              Create a services site 2019-04-01
            </Timeline.Item>
          </Timeline>
          <Conversation
            comments={this.state.comments}
            handleClickParent={this.handleConversation}
          />
          <Followers />
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

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);

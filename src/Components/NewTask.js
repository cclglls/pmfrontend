import React from 'react';
import '../App.css';
import { connect } from 'react-redux';

import { Modal, Button, Input, Divider, Timeline } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';

import Owner from './Owner';
import NewComment from './NewComment';
import Followers from './Followers';

const { TextArea } = Input;

class NewTask extends React.Component {
  state = {
    idtask: '',
    name: '',
    description: '',
    duedate: new Date(),
    owner: '',
    idowner: '',
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
      visible: true
    });
  };

  // bouton Croix
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // fonction qui gere le selector owner comme task Rajouter l'id
  handleOwner = (value, id) => {
    console.log(' ');
    console.log('nom récupéré --> ', this.state.name);
    console.log('description récupérée --> ', this.state.description);
    console.log(' ');
    console.log('Composant NewTask fonction handleOwner:');
    console.log('Owner recupéré --> ', value);
    this.setState({ owner: value, idowner: id });
  };
  // fonction qui gere le DatePicker :
  onChange = (date, dateString) => {
    console.log(date, dateString);
    var duedate = new Date(dateString);
    console.log('due date', duedate, date._d);
    this.setState({ duedate });
  };
  //************************************** */

  //fonction qui va gerer le bouton submit
  handleSubmit = async () => {
    //console.log('Bouton Submit --> execution du fetch');

    var body = {
      name: this.state.name,
      description: this.state.description,
      dtuedate: this.state.duedate,
      idassignee: this.state.idowner
      // iduser: userId
    };

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
      }
      console.log('response', response);

      /* 
      Demander à List de se raffraichir par une varibale Redux
      */
      this.props.refreshtasks(true);
    } catch (error) {
      console.log(error);
    }

    this.setState({ visible: false });
  };

  refreshTask = () => {
    if (this.props.idtask !== this.state.idtask) {
      var appli = this.props.appliFromStore;
      var finalData;
      var taskList;
      var task;
      var users;

      //console.log('New Task appli', appli);

      if (appli) {
        for (var i = 0; i < appli.length; i++) {
          if (appli[i].type === 'savesections') {
            finalData = appli[i].finalData;
            break;
          }
          if (appli[i].type === 'saveusers') {
            users = appli[i].users;
          }
        }
      }

      //console.log('props', this.props.idtask);

      if (finalData) taskList = finalData.taskList;

      console.log('taskList', taskList);

      if (taskList && this.props.idtask) {
        task = taskList.find(task => task._id === this.props.idtask);
      }

      if (task) {
        console.log('taskDetail', task);

        var owner;
        if (task.idassignee && users) {
          var user = users.find(user => user._id === task.idassignee._id);
          console.log('user', user);
          owner = user.initials;
        }

        //console.log(task.duedate);

        this.setState({
          idtask: task._id,
          name: task.name,
          description: task.description,
          duedate: task.duedate,
          owner,
          idowner: task.idassignee._id
        });
      }
    }
  };

  componentDidMount() {
    console.log('componentDidMount NewTask');
    this.refreshTask();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate NewTask');
    this.refreshTask();
  }

  render() {
    const { visible } = this.state;
    console.log('idtask', this.props.idtask);

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

          <Button style={{ backgroundColor: '#5b8c00', color: 'white' }}>
            Completed
          </Button>

          <Divider />

          <Timeline>
            <Timeline.Item color='green'>
              Create a services site 2019-04-01
            </Timeline.Item>
          </Timeline>
          {/* composant NewComment ci dessous à changer par ton composant conversation */}
          <NewComment />

          <Followers />
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    refreshtasks: function(refreshTasks) {
      console.log('New task - mapDispatchToProps', refreshTasks);
      dispatch({ type: 'refreshtasks', refreshTasks });
    }
  };
}

function mapStateToProps(state) {
  console.log('New Task - mapStateToProps : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);

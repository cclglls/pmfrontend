import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import moment from 'moment';

import { DatePicker } from 'antd';
import Owner from './Owner';

import { Modal, Button, Input } from 'antd';

const { TextArea } = Input;

class Project extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      idproject: '',
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      visible: false
    };
  }

  // Traitement pour la modal
  showModal = () => {
    this.setState({
      idproject: '',
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      visible: true
    });
  };

  handleOwner = (value, id) => {
    //console.log(' ');
    //console.log('Composant Project fonction handleOwner:');
    //console.log('Owner recupéré --> ', value, id);
    this.setState({ owner: value, idowner: id });
  };

  //fonction qui va gerer le bouton submit
  handleSubmit = async () => {
    //console.log('Bouton Submit --> execution du fetch');

    var response;

    try {
      if (!this.props.idproject) {
        response = await fetch(`http://localhost:3000/projects/project`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `name=${this.state.name}&description=${this.state.description}&idowner=${this.state.idowner}&duedate=${this.state.duedate}`
        });
      } else {
        response = await fetch(
          `http://localhost:3000/projects/project/${this.props.idproject}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${this.state.name}&description=${this.state.description}&idowner=${this.state.idowner}&duedate=${this.state.duedate}`
          }
        );
      }

      response = await fetch(`http://localhost:3000/projects`);
      var data = await response.json();
      this.props.saveprojects(data.project);
    } catch (error) {
      console.log(error);
    }

    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onChange = (date, dateString) => {
    //console.log(date, dateString);
    var duedate = new Date(dateString);
    //console.log('due date', duedate, date._d);
    this.setState({ duedate });
  };

  componentDidUpdate() {
    if (this.props.idproject !== this.state.idproject) {
      console.log('componentDidUpdate Project');
      var projects;
      var users;
      var appli = this.props.appliFromStore;
      //console.log('Project appli', appli);
      if (appli) {
        for (var i = 0; i < appli.length; i++) {
          if (appli[i].type === 'saveprojects') {
            projects = appli[i].projects;
          }
          if (appli[i].type === 'saveusers') {
            users = appli[i].users;
          }
        }
      }

      //console.log('props', this.props.idproject);

      var project;
      if (projects && this.props.idproject) {
        project = projects.find(
          project => project._id === this.props.idproject
        );
      }

      if (project) {
        //console.log('project', project);
        var owner;
        if (project.idowner) {
          var user = users.find(user => user._id === project.idowner._id);
          //console.log('user', user);
          owner = user.initials;
        }

        //console.log(project.duedate);

        this.setState({
          idproject: project._id,
          name: project.name,
          description: project.description,
          duedate: project.duedate,
          owner,
          idowner: project.idowner._id
        });
      }
    }
  }

  render() {
    //console.log('from Project render : contenu state -->', this.state);

    return (
      <div>
        {this.props.idproject ? (
          <Button type='link' onClick={this.showModal}>
            {this.props.text}
          </Button>
        ) : (
          <span onClick={this.showModal}>{this.props.text}</span>
        )}
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key='submit'
              type='primary'
              size='large'
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          ]}
        >
          <div className='Input'>
            <p style={{ marginRight: '1.25em' }}>Name</p>
            <Input
              style={{ marginBottom: '1.25em', width: '80%' }}
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.name}
              placeholder='Project'
            />
          </div>

          <div className='Input'>
            <p style={{ marginRight: '1.8em' }}>Desc</p>
            <TextArea
              style={{ marginBottom: '1.25em', width: '80%' }}
              rows={4}
              onChange={e => this.setState({ description: e.target.value })}
              value={this.state.description}
              placeholder='Description'
            />
          </div>

          <div className='Owner-Date'>
            <div className='Input'>
              <p style={{ marginRight: '1em' }}>Owner</p>
              <Owner
                initials={this.state.owner}
                handleClickParent={this.handleOwner}
              />
            </div>

            <div className='Input'>
              <p style={{ marginLeft: '2.4em', marginRight: '1em' }}>
                Due date
              </p>
              <DatePicker
                value={moment(this.state.duedate)}
                onChange={this.onChange}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveprojects: function(projects) {
      //console.log('Project - mapDispatchToProps - Projects', projects);
      dispatch({ type: 'saveprojects', projects });
    }
  };
}

function mapStateToProps(state) {
  //console.log('Project reducer : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);

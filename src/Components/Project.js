import React from 'react';
import '../App.css';
import { connect } from 'react-redux';

import moment from 'moment';

import { DatePicker } from 'antd';
import Owner from './Owner';

import { Modal, Button, Input } from 'antd';
var functions = require('../javascripts/functions');
var retrieveprojects = functions.retrieveprojects;

const { TextArea } = Input;

class Project extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      idproject: undefined,
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      error: '',
      visible: false
    };
  }

  // Traitement pour la modal
  showModal = () => {
    this.setState({
      idproject: undefined,
      name: '',
      description: '',
      duedate: new Date(),
      owner: '',
      idowner: '',
      error: '',
      visible: true
    });
  };

  handleOwner = (value, id) => {
    this.setState({ owner: value, idowner: id });
  };

  //fonction qui va gerer le bouton submit
  handleSubmit = async () => {
    var error = '';
    if (this.state.name === '') error = 'Name';
    if (this.state.owner === '') {
      if (error) error = error + ', ';
      error = error + 'Owner';
    }
    if (this.state.duedate === null) {
      if (error) error = error + ', ';
      error = error + 'Due date';
    }

    if (error !== '') {
      error = 'Mandatory fields: ' + error;
      this.setState({ error });
      return;
    }

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
    var duedate = date;
    if (date !== null) duedate = new Date(dateString);

    this.setState({ duedate });
  };

  componentDidUpdate(prevProps, prevState) {
    //console.log('componentDidUpdate', prevState, this.state);

    if (
      prevState.name !== this.state.name ||
      prevState.owner !== this.state.owner ||
      prevState.duedate !== this.state.duedate
    ) {
      this.handleError();
    }

    if (this.props.idproject !== this.state.idproject) {
      var projects = this.props.projectsFromStore;

      var project;
      if (projects && this.props.idproject) {
        project = projects.find(
          project => project._id === this.props.idproject
        );
      }

      if (project) {
        this.setState({
          idproject: project._id,
          name: project.name,
          description: project.description,
          duedate: project.duedate,
          owner: project.idowner.initials,
          idowner: project.idowner._id
        });
      }
    }
  }

  handleError = () => {
    var error = this.state.error;
    if (this.state.error.indexOf('Name') < 0 || this.state.name !== '') {
      error = error.replace('Name,', '');
      error = error.replace('Name', '');
    }
    if (this.state.error.indexOf('Owner') < 0 || this.state.owner !== '') {
      error = error.replace('Owner,', '');
      error = error.replace('Owner', '');
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
      error.indexOf('Owner') < 0 &&
      error.indexOf('Due date') < 0
    )
      error = '';

    if (error !== this.state.error) this.setState({ error });
  };

  render() {
    //console.log('from Project render : contenu state -->', this.state);

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
        {this.props.idproject ? (
          <Button icon='export' type='link' onClick={this.showModal} />
        ) : (
          <div>
            <span
              style={{ height: '50px', width: '100px' }}
              onClick={this.showModal}
            >
              {this.props.text}
            </span>
          </div>
        )}
        <Modal
          title='Project'
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
              style={stylename}
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
                error={this.state.error}
                initials={this.state.owner}
                handleClickParent={this.handleOwner}
              />
            </div>

            <div className='Input'>
              <p style={{ marginLeft: '2.4em', marginRight: '1em' }}>
                Due date
              </p>
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
    saveprojects: function(projects) {
      //console.log('Project - mapDispatchToProps - Projects', projects);
      dispatch({ type: 'saveprojects', projects });
    }
  };
}

function mapStateToProps(state) {
  //console.log('Project - mapStateToProps : ', state.appli);

  return { projectsFromStore: retrieveprojects(state) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);

import React from 'react';
import '../App.css';

import ProjectSelector from './ProjectSelector';

import { Modal, Button, Input, Divider } from 'antd';

import Conversation from './Conversation';

class NewConversation extends React.Component {
  // Traitement pour la modal
  state = {
    name: '',
    project: '',
    idproject: undefined,
    comments: [],
    idconversation: undefined,
    error: '',
    visible: false
  };

  showModal = () => {
    this.setState({
      name: '',
      project: '',
      idproject: undefined,
      comments: [],
      idconversation: undefined,
      error: '',
      visible: true
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.name !== this.state.name ||
      prevState.project !== this.state.project
    ) {
      this.handleError();
    }
  }

  handleOk = async () => {
    var error = '';
    if (this.state.name === '') error = 'Name';

    if (this.state.project === '') {
      if (error) error = error + ', ';
      error = error + 'Project';
    }

    if (error !== '') {
      error = 'Mandatory fields: ' + error;
      this.setState({ error });
      return;
    }

    /* Save Conversation in DB */
    if (this.state.name && this.state.idproject && this.state.comments) {
      var comments = this.state.comments;
      console.log('New Conversation - comments', comments);

      var name = this.state.name;
      var idproject = this.state.idproject;

      var body = {
        name,
        idproject,
        type: 'conversation',
        comment: comments
      };

      try {
        var response = await fetch(
          `http://localhost:3000/conversations/conversation`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }
        );

        console.log('New Conversation - Save DB', response);
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleProject = (value, id) => {
    this.setState({ project: value, idproject: id });
  };

  handleConversation = value => {
    this.setState({ comments: value });
  };

  handleError = () => {
    var error = this.state.error;

    if (this.state.error.indexOf('Name') < 0 || this.state.name !== '') {
      error = error.replace('Name,', '');
      error = error.replace('Name', '');
    }

    if (this.state.error.indexOf('Project') < 0 || this.state.project !== '') {
      error = error.replace('Project,', '');
      error = error.replace('Project', '');
    }

    if (error.indexOf('Name') < 0 && error.indexOf('Project') < 0) error = '';

    if (error !== this.state.error) this.setState({ error });
  };

  render() {
    const { visible } = this.state;

    var stylename = { marginBottom: '1.4em', width: '80%' };
    if (this.state.error.indexOf('Name') >= 0 && this.state.name === '') {
      stylename.borderColor = '#FF524F';
    }

    return (
      <div>
        <span
          style={{ height: '50px', width: '100px' }}
          onClick={this.showModal}
        >
          Conversation
        </span>
        <Modal
          title='Conversation'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key='submit'
              type='primary'
              size='large'
              onClick={this.handleOk}
            >
              Post
            </Button>
          ]}
        >
          <div className='Input'>
            <p style={{ marginRight: '1.4em' }}>Name</p>
            <Input
              style={stylename}
              placeholder='Conversation subject'
              onChange={e => this.setState({ name: e.target.value })}
            />
          </div>

          <div className='Input'>
            <p style={{ marginRight: '1em' }}>Project</p>
            <ProjectSelector
              error={this.state.error}
              projectname={this.state.project}
              handleClickParent={this.handleProject}
            />
          </div>

          <Divider style={{ width: '100%' }} />

          <Conversation
            idconversation={this.state.idconversation}
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

export default NewConversation;

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
    visible: false
  };

  showModal = () => {
    this.setState({
      name: '',
      project: '',
      idproject: undefined,
      comments: [],
      visible: true
    });
  };

  handleOk = async () => {
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

  render() {
    const { visible } = this.state;

    return (
      <div>
        <span onClick={this.showModal}>Conversation</span>
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
              style={{ marginBottom: '1.4em', width: '80%' }}
              placeholder='Conversation subject'
              onChange={e => this.setState({ name: e.target.value })}
            />
          </div>

          <div className='Input'>
            <p style={{ marginRight: '1em' }}>Project</p>
            <ProjectSelector
              projectname={this.state.project}
              handleClickParent={this.handleProject}
            />
          </div>

          <Divider style={{ width: '100%' }} />

          <Conversation handleClickParent={this.handleConversation} />
        </Modal>
      </div>
    );
  }
}

export default NewConversation;

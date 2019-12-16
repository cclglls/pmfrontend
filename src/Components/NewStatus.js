import React from 'react';
import '../App.css';
import { Modal, Button, Divider, Switch } from 'antd';

import StatusSelector from './StatusSelector';
import Conversation from './Conversation';
import ProjectSelector from './ProjectSelector';

class NewStatus extends React.PureComponent {
  state = {
    visible: false,
    idconversation: undefined,
    comments: [],
    checked: true,
    status: '',
    project: '',
    idproject: undefined
  };

  // switch button
  onChange = checked => {
    this.setState({
      checked: !checked
    });
  };

  // Traitement pour la modal
  showModal = () => {
    this.setState({
      visible: true,
      idconversation: undefined,
      comments: [],
      checked: true,
      status: '',
      project: '',
      idproject: undefined
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.status !== this.state.status ||
      prevState.project !== this.state.project
    ) {
      this.handleError();
    }
  }

  handlePost = async () => {
    var error = '';
    if (this.state.status === '') error = 'Status';

    if (this.state.project === '') {
      if (error) error = error + ', ';
      error = error + 'Project';
    }

    if (error !== '') {
      error = 'Mandatory fields: ' + error;
      this.setState({ error });
      return;
    }

    console.log('New Status - handlePost', this.state);
    /* Save Status in DB */
    if (this.state.status && this.state.idproject && this.state.comments) {
      console.log('New Status - comments', this.state.comments);

      var body = {
        dtstatus: new Date(),
        status: this.state.status,
        idproject: this.state.idproject,
        type: 'status',
        comment: this.state.comments,
        chartProgress: this.state.checked
      };

      try {
        var response = await fetch(`http://localhost:3000/status/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        console.log('New Status - Save DB', response);
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSelector = value => {
    this.setState({ status: value });
  };

  handleConversation = value => {
    this.setState({ comments: value });
  };

  handleProject = (value, id) => {
    console.log('New Status - HandleProject', value, id);
    this.setState({ project: value, idproject: id });
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

    return (
      <div>
        <span
          style={{ height: '50px', width: '100px' }}
          onClick={this.showModal}
        >
          Status
        </span>
        <Modal
          title='Status'
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key='submit'
              type='primary'
              size='large'
              onClick={this.handlePost}
            >
              Post
            </Button>
          ]}
        >
          <div className='Input'>
            <p style={{ marginRight: '1.4em' }}>New status update</p>
            <StatusSelector
              error={this.state.error}
              status={this.state.status}
              handleClickParent={this.handleSelector}
            />
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='Input'>
            <p style={{ marginRight: '1em' }}>Project</p>
            <ProjectSelector
              error={this.state.error}
              projectname={this.state.project}
              handleClickParent={this.handleProject}
            />
          </div>

          <Conversation
            idconversation={this.state.idconversation}
            comments={this.state.comments}
            handleClickParent={this.handleConversation}
          />

          <div className='Input'>
            <p style={{ marginRight: '1em' }}>Generate progress chart</p>
            <Switch checked={this.state.checked} onChange={this.onChange} />
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

export default NewStatus;

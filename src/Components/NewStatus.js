import React from 'react';
import '../App.css';
import { Modal, Button, Divider, Switch } from 'antd';

import StatusSelector from './StatusSelector';
import Conversation from './Conversation';
import ProjectSelector from './ProjectSelector';

class NewStatus extends React.PureComponent {
  state = {
    visible: false,
    comments: [],
    checked: '',
    status: '',
    project: '',
    idproject: undefined
  };

  // switch button
  onChange = checked => {
    this.setState({
      checked: checked
    });
  };

  // Traitement pour la modal
  showModal = () => {
    this.setState({
      visible: true,
      comments: [],
      checked: '',
      status: '',
      project: '',
      idproject: undefined
    });
  };

  handlePost = async () => {
    console.log('New Status - handlePost', this.state);
    /* Save Status in DB */
    if (this.state.status && this.state.idproject && this.state.comments) {
      console.log('New Status - comments', this.state.comments);

      var body = {
        dtstatus: new Date(),
        status: this.state.status,
        idproject: this.state.idproject,
        type: 'status',
        comment: this.state.comments
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

  render() {
    const { visible } = this.state;

    return (
      <div>
        <span onClick={this.showModal}>Status</span>
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
            <StatusSelector status='' handleClickParent={this.handleSelector} />
          </div>

          <Divider style={{ width: '100%' }} />

          <div className='Input'>
            <p style={{ marginRight: '1em' }}>Project</p>
            <ProjectSelector
              projectname={this.state.project}
              handleClickParent={this.handleProject}
            />
          </div>

          <Conversation handleClickParent={this.handleConversation} />

          <div className='Input'>
            <p style={{ marginRight: '1em' }}>Generate progress chart</p>
            <Switch defaultChecked onChange={this.onChange} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default NewStatus;

import React from 'react';
import '../App.css';

import { Modal, Button, Input } from 'antd';

class UpdateConv extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      idconversation: undefined,
      name: '',
      error: '',
      visible: false
    };
  }

  // Traitement pour la modal
  showModal = () => {
    this.setState({
      idconversation: undefined,
      name: '',
      error: '',
      visible: true
    });
  };

  //fonction qui va gerer le bouton submit
  handleSubmit = async () => {
    var error = '';

    if (this.state.name === '') error = 'Name';
    if (this.state.owner === '') {
      if (error) error = error + ', ';
      error = error + 'Owner';
    }

    if (error !== '') {
      error = 'Mandatory fields: ' + error;
      this.setState({ error });
      return;
    }

    var response;

    try {
      if (this.props.idconversation) {
        response = await fetch(
          `http://localhost:3000/conversations/conversation/${this.props.idconversation}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${this.state.name}`
          }
        );
      }
      console.log('response', response);
    } catch (error) {
      console.log(error);
    }

    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.name !== this.state.name) {
      this.handleError();
    }
    if (this.props.idconversation !== this.state.idconversation) {
      fetch(
        `http://localhost:3000/conversations/0/${this.props.idconversation}`
      )
        .then(response => response.json())
        .then(data => {
          console.log(
            'fetch',
            this.props.idconversation,
            data,
            data.conversation[0].name
          );
          this.setState({
            name: data.conversation[0].name,
            idconversation: data.conversation[0]._id
          });
        });
    }
  }

  handleError = () => {
    var error = this.state.error;
    if (this.state.error.indexOf('Name') < 0 || this.state.name !== '') {
      error = error.replace('Name,', '');
      error = error.replace('Name', '');
    }

    if (this.state.error.indexOf('Name') < 0) error = '';

    if (error !== this.state.error) this.setState({ error });
  };

  render() {
    console.log('from UpdateConv render : contenu state -->', this.state);

    var stylename = { marginBottom: '1.25em', width: '80%' };
    if (this.state.error.indexOf('Name') >= 0 && this.state.name === '') {
      stylename.borderColor = '#FF524F';
    }

    return (
      <div>
        <Button icon='export' type='link' onClick={this.showModal} />

        <Modal
          title='Conversation'
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
              Update
            </Button>
          ]}
        >
          <div className='Input'>
            <p style={{ marginRight: '1.25em' }}>Name</p>
            <Input
              style={stylename}
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.name}
              placeholder='Conversation subject'
            />
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

export default UpdateConv;

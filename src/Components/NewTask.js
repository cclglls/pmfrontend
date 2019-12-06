
import React from 'react';
import '../App.css';

import { Modal, Button, Input } from 'antd';

import Owner from './Owner'
import Datepicker from './Datepicker';

const { TextArea } = Input;

class NewTask extends React.Component {
  state = {
    visible: false,
    name: '',
    description: ''
  };


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = () => {
  
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {

    const { visible } = this.state;

    return (
      <div>
        <Button type="link" onClick={this.showModal}>
          Task
        </Button>
        <Modal
          visible={visible}
          title="Title"
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary"  onClick={this.handleSubmit}>
              Submit
            </Button>,
          ]}
        >
          <div className="Input">
              <p style={{marginRight: '1.25em'}}>Name</p> 
              <Input style={{marginBottom: '1.25em',width: '80%' }} 
              onChange={(e) => this.setState({name: e.target.value})}
              placeholder="Project" />
            </div>

            <div>
              <Owner/>
              <Datepicker/>
            </div>

            <div className="Input">
              <p style={{marginRight: '1.8em' }}>Desc</p>
              <TextArea style={{marginBottom: '1.25em',width: '80%'}} rows={4} 
              onChange={(e) => this.setState({description: e.target.value})}
              placeholder="Description" />
            </div>

        </Modal>
      </div>
    );
  }
}

export default NewTask;  
import React from 'react';
import '../App.css';

import Datepicker from './Datepicker';
import Owner from './Owner';

import { Modal, Button, Input } from 'antd';

const { TextArea } = Input;

class Project extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      date: 'Date vide',
      owner: '',
      visible: false,
      size: 'large'
    };
  }

  // Traitement pour la modal
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  // fonction qui gere les données qui proviennent des composants enfants
  handleDate = date => {
    console.log(' ');
    console.log('Composant Project fonction handleDate:');
    console.log('nom récupéré --> ', this.state.name);
    console.log('description récupérée --> ', this.state.description);
    console.log(' ');
    console.log('date récupérée --> ', date);
    this.setState({ date: date });
  };

  handleOwner = value => {
    console.log(' ');
    console.log('Composant Project fonction handleOwner:');
    console.log('Owner recupéré --> ', value);
    this.setState({ owner: value });
  };

  //fonction qui va gerer le bouton submit
  handleSubmit = () => {
    console.log('Bouton Submit --> execution du fetch');

    fetch(`http://localhost:3000/projects/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=${this.state.name}&description=${this.state.description}&owner=${this.state.owner}&date${this.state.date}`
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  /***************************************/

  //Submit button :
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };
  /***************************************/

  render() {
    console.log('from Project render : contenu state -->', this.state);

    return (
      <div>
        <Button type='link' onClick={this.showModal}>
          Project
        </Button>

        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key='submit'
              type='primary'
              size={this.state.size}
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
              placeholder='Project'
            />
          </div>

          <div className='Input'>
            <p style={{ marginRight: '1.8em' }}>Desc</p>
            <TextArea
              style={{ marginBottom: '1.25em', width: '80%' }}
              rows={4}
              onChange={e => this.setState({ description: e.target.value })}
              placeholder='Description'
            />
          </div>

          <div className='Owner-Date'>
            <div className='Input'>
              <p style={{ marginRight: '1em' }}>Owner</p>
              <Owner handleClickParent={this.handleOwner} />
            </div>

            <div className='Input'>
              <p style={{ marginLeft: '2.4em', marginRight: '1em' }}>
                Due date
              </p>
              <Datepicker handleClickParent={this.handleDate} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Project;

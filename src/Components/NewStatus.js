import React from "react";
import "../App.css";
import { Modal, Button, Divider, Switch } from "antd";


import StatusSelector from './StatusSelector'
import NewComment from "./NewComment";




// switch button
function onChange(checked) {
    console.log(`switch to ${checked}`);
  }

class NewStatus extends React.Component {

   
 
// Traitement pour la modal
  state = {
    loading: false,
    visible: false,
    size: 'large',
    comments : [],
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
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

    const { visible, size } = this.state;

    return (
      <div>
        <Button type="link" onClick={this.showModal}>
        Status
        </Button>
        <Modal
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[ 
            <Button key="submit" type="primary" size={size} onClick={this.handleOk} >
              Post
            </Button>
        ]}>

            <div className="Input">
              <p style={{marginRight: '1.4em'}}>New status update</p> 
              <StatusSelector />
              
            </div>
          
            
            
            <Divider style={{width : '100%'}}/>

            <NewComment/>
         
                <div className="Input">
                <p style={{marginRight: '1em'}} >Generate progress chart</p>
                <Switch defaultChecked onChange={onChange} />             
                </div>


        
        </Modal>
      </div>
    );
  }
}

export default NewStatus;
import React from 'react';
import '../App.css';
import { DatePicker } from 'antd';





  class Datepicker extends React.Component {

    constructor(props){
      super(props)
      this.onChangeDate = this.onChangeDate.bind(this)
     
    }
    //fonction qui remonte l'info au parent, Bug lorsque je clique sur cancel
    onChangeDate(date, dateString) {
      this.props.handleClickParent(date._d);
      console.log(" ")
      console.log("from enfant Datepicker :")
      console.log("date choisie --->", date._d, "date string -->", dateString)
      console.log("log pour trouver ce qui actionne le btn annuler--> ", date);
    }
    
    render() {
        return (

          <div>
                <DatePicker onChange={this.onChangeDate} />          
          </div>

          )
        }    
    }
    
export default Datepicker;
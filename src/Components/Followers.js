import React from 'react';
import '../App.css';
import { Select } from 'antd';

const { Option } = Select;

// Exemple d'Array et de boucle qui generent les initiales utisateurs au clic
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={(i+1).toString(36) + i.toString(36)}>{((i+1).toString(36) + i.toString(36)).toUpperCase()}</Option>);
}

// function qui gere les clics
function handleChange(value) {
  console.log(`selected ${value}`);
}

class Followers extends React.Component {

    render() {
        return (
        <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={['CD', 'GM']}
            onChange={handleChange}
        >
            {children}
        </Select>
        )
    }    
}

export default Followers;
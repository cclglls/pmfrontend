import React from 'react';
import '../App.css';
import { Select } from 'antd';

const { Option } = Select;

// fonction qui gere la valeur saisie dans champ ATTENTION value en dur pour le moment
function onSearch(val) {
  console.log('search:', val);
}

class Owner extends React.Component {
  constructor(props) {
    super();
    this.onChange = this.onChange.bind(this);
  }

  // fonction qui gere le noms du responsable du projet
  onChange(value) {
    console.log(' ');
    console.log(`from composant enfant Owner : Personne choisie -> ${value}`);
    this.props.handleClickParent(value);
  }

  render() {
    return (
      <Select
        showSearch
        style={{ width: 100 }}
        placeholder='Select a person'
        optionFilterProp='children'
        onChange={this.onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value='jack'>Jack</Option>
        <Option value='lucy'>Lucy</Option>
        <Option value='tom'>Tom</Option>
      </Select>
    );
  }
}

export default Owner;

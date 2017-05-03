import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChildComponent from './child-component';

export default class FirstComponent extends Component {
  static propTypes = {
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'copy text'
  }
  constructor(props) {
    super(props);
    this.state = {
      copyText: 'copy text',
    };
  }

  textFromInput(e) {
     this.setState({ copyText: e.target.value });
  }
  
  renderItem(copyText){
    return (
      <ChildComponent copyText={ copyText }/>
    )
  }

  render() {
    const { copyText } = this.state;


    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  placeholder="to text" value = { this.state.copyText } readOnly="readonly" /><br />
        <ChildComponent copyText={ copyText }/>
        {this.renderItem(copyText)}
      </div>
    );
  }
}

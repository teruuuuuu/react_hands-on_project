import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChildComponent from './child-component';

import * as SampleAction from '../actions/sample-action';

function mapStateToProps(state) {
  const { text } = state.sampleReducer
  return {
    text: text
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FirstComponent extends Component {
  static propTypes = {
    change_text: PropTypes.func.isRequired,
    text: PropTypes.string
  }
  constructor(props) {
    super(props);
  }

  textFromInput(e) {
    this.props.change_text(e.target.value)
  }

  renderItem(text){
    return (
      <ChildComponent copyText={ text }/>
    )
  }

  render() {
    const { text } = this.props;
    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  placeholder="to text" value = { text } readOnly="readonly" /><br />
        <ChildComponent copyText={ text }/>
      </div>
    );
  }
}

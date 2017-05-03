import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SampleAction from '../actions/sample-action';

function mapStateToProps() {
  return {}
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ChildComponent extends Component {
  static propTypes = {
    change_text: PropTypes.func.isRequired,
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'init val'
  }
  constructor(props) {
    super(props);
  }

  clearText() {
    this.props.change_text("")
  }

  render() {
    const { copyText } = this.props;
    return (
      <div>
        <label>{ copyText }</label><br />
        <button onClick = { this.clearText.bind(this) }>クリア</button>
      </div>
    );
  }
}

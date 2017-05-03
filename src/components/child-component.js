import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ChildComponent extends Component {
  static propTypes = {
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'init val'
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { copyText } = this.props;
    return (
      <div>
        <label>{ copyText }</label>
      </div>
    );
  }
}

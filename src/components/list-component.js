import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../style/sample.css.js';
import * as SampleApiAction from '../actions/api/sample-api-action'

function mapStateToProps(state) {
  const { user_list } = state.userListReducer
  return {
    user_list: user_list
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleApiAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ListComponent extends Component {
  static propTypes = {
    user_list: PropTypes.array,
    callApi: PropTypes.func.isRequired,
  }
  static defaultProps = {
    user_list: [{}]
  }
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.callApi(SampleApiAction.user_list_init());
  }

  render() {
    const user_list = this.props.user_list
    console.info(user_list)
    return (
      <ul style={styles.ul}>
        {user_list.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={styles.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}

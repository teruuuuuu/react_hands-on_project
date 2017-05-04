import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../style/sample.css.js';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ]
    }
  }

  render() {
    const listData = this.state.listData
    return (
      <ul style={styles.ul}>
        {listData.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={styles.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}

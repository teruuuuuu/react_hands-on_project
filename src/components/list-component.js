import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      <ul className="user-list">
        {listData.map((user, i) =>
          <div key={i}><li>{ user.name } </li></div>
        )}
      </ul>
    );
  }
}

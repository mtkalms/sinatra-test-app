import React, { Component } from 'react';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <h1>Counter</h1>
        <p style={{ fontSize: '2rem' }}>{count}</p>
        <button onClick={() => this.setState({ count: count + 1 })}>+</button>{' '}
        <button onClick={() => this.setState({ count: count - 1 })}>−</button>{' '}
        <button onClick={() => this.setState({ count: 0 })}>Reset</button>
      </div>
    );
  }
}

import React from 'react';

interface State {
  count: number;
}

interface Param {
}

class Counter extends React.Component<Param, State> {
  state = { count: 0 };
  interval: NodeJS.Timeout = null;

  componentDidMount() {
    this.interval = setInterval(() => this.setState(prevState => ({ count: prevState.count + 1 })), 200);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return this.state.count;
  }
}

export default Counter;

export function useExternalHook() {
  React.useEffect(() => {});
}
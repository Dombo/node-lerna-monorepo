import React, { Component } from 'react';
import { Counter } from '@dombo/react-counter';
import * as test from '@dombo/react-counter';

class App extends Component {
  render() {
    console.log(Counter);
    console.log(test);
    return <Counter />;
  }
}

export default App;

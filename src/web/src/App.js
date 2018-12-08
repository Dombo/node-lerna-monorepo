import React, { Component } from 'react';
import { Counter } from '@incodocs/react-counter';
import * as test from '@incodocs/react-counter';

class App extends Component {
  render() {
    console.log(Counter);
    console.log(test);
    return <Counter />;
  }
}

export default App;

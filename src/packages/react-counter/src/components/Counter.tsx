import * as React from 'react';
import { add, subtract } from '@incodocs/math';

interface CounterProps {
  /**
   * Default value for counter
   */
  defaultValue?: number;
  /**
   * The value to override the internal counter value
   */
  value?: number;
  /**
   * When the counter value has changed
   */
  onCountChange: (count: number) => void;
}

interface State {
  count: number;
}

export class Counter extends React.Component<CounterProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.value || 0
    };
  }

  onPlusClick = () => {
    this.setState(
      state => ({ ...state, count: add(state.count, 1) }),
      this.raiseCountChange
    );
  };

  raiseCountChange = () => {
    if (this.props.onCountChange) {
      this.props.onCountChange(this.state.count);
    }
  };

  onMinusClick = () => {
    this.setState(
      state => ({ ...state, count: subtract(state.count, 1) }),
      this.raiseCountChange
    );
  };

  render() {
    return (
      <div>
        {this.props.value || this.state.count}
        <div>
          <button onClick={this.onMinusClick}>-</button>
          <button onClick={this.onPlusClick}>+</button>
        </div>
      </div>
    );
  }
}

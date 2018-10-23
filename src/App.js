import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Style from './css/style.js';
import InputButton from './component/InputButton';

const inputButtons = [
    ["C","CE"],
    ["MC", "MR", "MS"],
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '.', '=', '+']
];

export default class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          previousInputValue: 0,
          inputValue: 0,
          selectedSymbol: null,
          isDecimal : null,
          memorizedNumber: 0,
          history : ''
      };

  }

  render() {
    return (
      <View style={Style.rootContainer}>
          <View style={Style.displayContainer}>
            <Text style={Style.displayText}>{this.state.inputValue}</Text>
          </View>
          <View style={Style.inputContainer}>
            {this._renderInputButtons()}
          </View>
      </View>
    );
  }

  _renderInputButtons() {
      let views = [];

      for (var r = 0; r < inputButtons.length; r ++) {
          let row = inputButtons[r];

          let inputRow = [];
          for (var i = 0; i < row.length; i ++) {
              let input = row[i];

              inputRow.push(
                  <InputButton
                      value={input}
                      highlight={this.state.selectedSymbol === input}
                      onPress={this._onInputButtonPressed.bind(this, input)}
                      key={r + "-" + i}/>
              );
          }

          views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
      }

      return views;
  }

  _onInputButtonPressed(input) {
      switch (typeof input) {
          case 'number':
              return this._handleNumberInput(input)
          case 'string':
              return this._handleStringInput(input)
      }
  }

  _handleNumberInput(num) {

    let inputValue = this.state.inputValue,
        isDecimal = this.state.isDecimal;

    if(isDecimal) {
        inputValue += num;
    } else {
      inputValue = (inputValue * 10) + num;
    }
      this.setState({
          inputValue: inputValue,
          isDecimal: isDecimal,
      })
  }

  getCalculate () {
      const {selectedSymbol, inputValue, previousInputValue} = this.state;
      let result = 0;

      switch(selectedSymbol) {
          case '+':
              result = previousInputValue + inputValue;
              break;
          case '-':
              result = previousInputValue - inputValue;
              break;
          case '*':
              result = previousInputValue * inputValue;
              break;
          case '/':
              result = previousInputValue / inputValue;
              break;
          default:
              break;

      }
      return result;
  }

  _handleStringInput(str) {
    switch (str) {
        case '/':
        case '*':
        case '+':
        case '-':
            this.setState({
                selectedSymbol: str,
                previousInputValue: this.state.inputValue,
                inputValue: 0,
                isDecimal: null,
            });
            break;
        case '=':
            const {selectedSymbol} = this.state;

            if (!selectedSymbol) {
                return;
            }

            this.setState({
                previousInputValue: 0,
                inputValue: this.getCalculate(),
                selectedSymbol: null,
                isDecimal: null,
            });
            break;
        case 'C':
            this.setState({
                isDecimal: null,
                selectedSymbol: null,
                previousInputValue: 0,
                inputValue: 0
            });
            break;
        case 'CE':
            this.setState({
                isDecimal: this.state.isDecimal,
                selectedSymbol: this.state.selectedSymbol,
                previousInputValue: this.state.previousInputValue,
                inputValue: this.state.inputValue,
            });
            break;
        case '.':
            const {isDecimal } = this.state;
            if(isDecimal) break;
            this.setState({
                isDecimal: true,
                inputValue: this.state.inputValue + str,
            });
            break;
        case 'MC':
            this.setState({
                memorizedNumber: 0
            });
            break;
        case 'MR':
            this.setState({
                inputValue: this.state.memorizedNumber
            });
            break;
        case 'MS':
            this.setState({
                memorizedNumber: this.state.inputValue,
                inputValue: 0
            });
            break;
        }
    }
}

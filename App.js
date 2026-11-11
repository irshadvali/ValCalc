import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const rows = [
  ['AC', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['±', '0', '.', '='],
];

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const formatNumber = (value) => {
    if (!Number.isFinite(value)) return 'Error';
    const rounded = Number.parseFloat(value.toPrecision(12));
    return String(rounded);
  };

  const inputDigit = (digit) => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }
    setDisplay(display === '0' ? digit : display + digit);
  };

  const inputDecimal = () => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = (left, right, op) => {
    switch (op) {
      case '+': return left + right;
      case '−': return left - right;
      case '×': return left * right;
      case '÷': return right === 0 ? NaN : left / right;
      default: return right;
    }
  };

  const chooseOperator = (nextOperator) => {
    if (display === 'Error') return;
    const inputValue = Number(display);

    if (operator && !waitingForOperand && storedValue !== null) {
      const result = calculate(storedValue, inputValue, operator);
      const resultText = formatNumber(result);
      setDisplay(resultText);
      setStoredValue(Number.isFinite(result) ? result : null);
    } else {
      setStoredValue(inputValue);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const performEquals = () => {
    if (operator === null || storedValue === null || display === 'Error') return;
    const result = calculate(storedValue, Number(display), operator);
    setDisplay(formatNumber(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handlePress = (key) => {
    if (/^\d$/.test(key)) return inputDigit(key);
    if (key === '.') return inputDecimal();

    switch (key) {
      case 'AC':
        setDisplay('0');
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        break;
      case '⌫':
        if (display === 'Error' || waitingForOperand) {
          setDisplay('0');
          setWaitingForOperand(false);
        } else {
          const next = display.length > 1 ? display.slice(0, -1) : '0';
          setDisplay(next === '-' ? '0' : next);
        }
        break;
      case '%':
        if (display !== 'Error') setDisplay(formatNumber(Number(display) / 100));
        break;
      case '±':
        if (display !== 'Error' && Number(display) !== 0) {
          setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
        }
        break;
      case '+':
      case '−':
      case '×':
      case '÷':
        chooseOperator(key);
        break;
      case '=':
        performEquals();
        break;
    }
  };

  const buttonColor = (key) => {
    if (key === 'AC' || key === '⌫' || key === '%' || key === '±') return '#A5A5A5';
    if (['÷', '×', '−', '+', '='].includes(key)) return '#FF9F0A';
    return '#333333';
  };

  const textColor = (key) =>
    ['AC', '⌫', '%', '±'].includes(key) ? '#111111' : '#FFFFFF';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Calculator</Text>
          <Text style={styles.subheading}>Simple • Fast • Easy</Text>
        </View>

        <View style={styles.displayContainer}>
          {operator ? (
            <Text style={styles.expression}>
              {formatNumber(storedValue)} {operator}
            </Text>
          ) : null}
          <Text
            style={styles.display}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
          >
            {display}
          </Text>
        </View>

        <View style={styles.keypad}>
          {rows.map((row, rowIndex) => (
            <View style={styles.row} key={`row-${rowIndex}`}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.7}
                  onPress={() => handlePress(key)}
                  style={[
                    styles.button,
                    { backgroundColor: buttonColor(key) },
                    key === '0' && styles.zeroButton,
                  ]}
                >
                  <Text style={[styles.buttonText, { color: textColor(key) }]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.footer}>Built with React Native + Expo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111111',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  header: {
    paddingTop: 12,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
  },
  subheading: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },
  expression: {
    color: '#999999',
    fontSize: 22,
    marginBottom: 8,
  },
  display: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '300',
    textAlign: 'right',
    width: '100%',
  },
  keypad: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    // Keep the zero key the same size for a balanced four-column layout.
  },
  buttonText: {
    fontSize: 29,
    fontWeight: '500',
  },
  footer: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 14,
  },
});

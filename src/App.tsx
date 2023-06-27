import './App.css';
import { useEffect, useRef, useState } from 'react';

type PasscodeValidationState = 'CORRECT' | 'INCORRECT' | undefined;
type PasscodeState = [number?, number?, number?, number?];

const CORRECT = 'CORRECT' as const;
const INCORRECT = 'INCORRECT' as const;
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const LETTERS = ['placeholder', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', ''];
const PASSCODE = '1111';

function App() {
  const [pressedNumbersArray, setPressedNumbersArray] = useState<PasscodeState>([]);
  const [passcodeValidationState, setPasscodeValidationState] = useState<PasscodeValidationState>(undefined);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleKeypadEnter = (number: number) => {
    setPasscodeValidationState(undefined);

    if (pressedNumbersArray.length >= 4) {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      return setPressedNumbersArray([number] as PasscodeState);
    }

    const newPasscodeArray = [...pressedNumbersArray, number].slice(0, 4) as PasscodeState;
    setPressedNumbersArray(newPasscodeArray);

    if (newPasscodeArray.length === 4) {
      const isPasscodeCorrect = PASSCODE === newPasscodeArray.join('');
      setPasscodeValidationState(isPasscodeCorrect ? CORRECT : INCORRECT);
      timeoutId.current = setTimeout(() => setPressedNumbersArray([]), isPasscodeCorrect ? 1000 : 100);
    }
  };

  useEffect(() => {
    console.log('pressedNumbersArray', pressedNumbersArray);
  }, [pressedNumbersArray]);

  return (
    <>
      <div className='iphone'>
        <div className='background'>
          <div className='dynamic-island' />

          <div className='user-interface-container'>
            <div className='passcode-prompt'>Enter Passcode</div>
            <div className='pin-container' data-is-passcode-wrong={passcodeValidationState === INCORRECT}>
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className='pin'>
                    <svg
                      data-passcode-entered={pressedNumbersArray[index] !== undefined}
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='4'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='empty-circle-svg-icon'
                    >
                      <circle cx='12' cy='12' r='10' />
                    </svg>
                  </div>
                ))}
            </div>

            <div className='keypad-container'>
              {NUMBERS.map((number, index) => {
                return (
                  <button key={index} className='keypad' onClick={() => handleKeypadEnter(number)}>
                    <div className='keypad-number'>{number}</div>
                    <div className='keypad-letters'>{LETTERS[index]}</div>
                  </button>
                );
              })}
            </div>

            <button className='delete-or-cancel-button'>
              {pressedNumbersArray.length === 0 ? 'Cancel' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

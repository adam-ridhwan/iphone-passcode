import './App.css';
import { useEffect, useState } from 'react';
import EmptyCircleSvgIcon from '@/assets/svg/EmptyCircleSvgIcon';
import FilledCircleSvgIcon from '@/assets/svg/FilledCircleSvgIcon';

type PasscodeState = [number?, number?, number?, number?];

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const LETTERS = ['placeholder', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', ''];
const PASSCODE = '1234';

function App() {
  const [enteredPasscode, setEnteredPasscode] = useState<PasscodeState>([]);
  const [isPasscodeWrong, setIsPasscodeWrong] = useState<boolean>();

  const checkPasscode = (newPasscode: PasscodeState) => {
    setIsPasscodeWrong(PASSCODE === newPasscode.join(''));
  };

  const handlePasscodeEnter = (number: number) => {
    setIsPasscodeWrong(undefined);

    const newPasscode = [...enteredPasscode, number];

    setEnteredPasscode(newPasscode as PasscodeState);

    if (newPasscode.length === 4) {
      checkPasscode(newPasscode as PasscodeState);
      setTimeout(() => setEnteredPasscode([]), 1000);
    }
  };

  useEffect(() => {
    console.log('enteredPasscode', enteredPasscode);
    console.log('isPasscodeWrong', isPasscodeWrong);
  }, [isPasscodeWrong, enteredPasscode]);

  return (
    <>
      <div className='iphone'>
        <div className='background'>
          <div className='dynamic-island' />

          <div className='passcode-entry-container'>
            <div className='passcode-prompt'>Enter Passcode</div>
            <div className='pin-container' data-ispasscodewrong={isPasscodeWrong}>
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className='pin'>
                    {enteredPasscode[index] ? <FilledCircleSvgIcon /> : <EmptyCircleSvgIcon />}
                  </div>
                ))}
            </div>

            <div className='keypad-container'>
              {NUMBERS.map((number, index) => {
                return (
                  <button key={index} className='keypad' onClick={() => handlePasscodeEnter(number)}>
                    <div className='keypad-number'>{number}</div>
                    <div className='keypad-letters'>{LETTERS[index]}</div>
                  </button>
                );
              })}
            </div>

            <button className='delete-or-cancel-button'>{enteredPasscode.length === 0 ? 'Cancel' : 'Delete'}</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

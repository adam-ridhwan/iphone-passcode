import { useEffect, useRef, useState, MouseEvent, TouchEvent } from 'react';
import RICK_ASTLEY from './assets/img/rick-astley.gif';
import './App.css';

type PasscodeValidationState = 'CORRECT' | 'INCORRECT' | undefined;
type PasscodeState = [number?, number?, number?, number?];

const CORRECT = 'CORRECT' as const;
const INCORRECT = 'INCORRECT' as const;
const NUMBERS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;
const LETTERS: readonly string[] = ['xxx', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', ''] as const;
const PASSCODE = '1987' as const;

const formatDate = (): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = new Date();
  return currentDate.toLocaleString('en-US', options);
};

const formatTime = (): string => {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

function App() {
  const [pressedNumbersArray, setPressedNumbersArray] = useState<PasscodeState>([]);
  const [passcodeValidationState, setPasscodeValidationState] = useState<PasscodeValidationState>(undefined);
  const [isLockScreenSwipedUp, setIsLockScreenSwipedUp] = useState<boolean>(false);

  const iphoneRef = useRef<HTMLDivElement>(null);

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

  const handleCancelOrDelete = () => {
    if (pressedNumbersArray.length === 0) return setIsLockScreenSwipedUp(false);
    setPressedNumbersArray(pressedNumbersArray.slice(0, pressedNumbersArray.length - 1) as PasscodeState);
  };

  const [currentTime, setCurrentTime] = useState(formatTime());
  const [currentDate, setCurrentDate] = useState(formatDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
      setCurrentDate(formatDate());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    touchStartRef.current = { x: clientX, y: clientY };

    document.addEventListener('touchmove', handleTouchMove as any);
    document.addEventListener('touchend', handleTouchEnd as any);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0],
      touchEnd = { x: clientX, y: clientY },
      swipeDirection = getSwipeDirection(touchStartRef.current, touchEnd);
    if (swipeDirection === 'up') {
      const containerElement = swipeContainerRef.current;
      if (containerElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;

        if (touchEnd.y < containerTop || touchEnd.y > containerTop + containerHeight) {
          setIsLockScreenSwipedUp(true);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove as any);
    document.removeEventListener('touchend', handleTouchEnd as any);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    touchStartRef.current = { x: clientX, y: clientY };

    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp as any);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const touchEnd = { x: clientX, y: clientY };
    const swipeDirection = getSwipeDirection(touchStartRef.current, touchEnd);

    if (swipeDirection === 'up') {
      const containerElement = swipeContainerRef.current;
      if (containerElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;

        if (touchEnd.y < containerTop || touchEnd.y > containerTop + containerHeight) {
          console.log('swiped up');
          setIsLockScreenSwipedUp(true);
        }
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove as any);
    document.removeEventListener('mouseup', handleMouseUp as any);
  };

  const getSwipeDirection = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const slope = Math.abs(dy / dx);
    if (slope > 1 && dy < 0) return 'up';
    return 'none';
  };

  return (
    <>
      <div ref={iphoneRef} className='iphone'>
        <div className='dynamic-island' />

        <div className='lock-screen' data-is-lockscreen-swiped-up={isLockScreenSwipedUp}>
          <div className='current-date'>{currentDate}</div>
          <div className='current-time'>{currentTime}</div>
          <div
            ref={swipeContainerRef}
            className='swipe-container'
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
          <div className='swipe-indicator' data-is-lockscreen-swiped-up={isLockScreenSwipedUp} />
          <div className='swipe-prompt' data-is-lockscreen-swiped-up={isLockScreenSwipedUp}>
            Swipe up to unlock
          </div>
        </div>

        <div
          className='passcode-screen'
          data-is-lockscreen-swiped-up={isLockScreenSwipedUp}
          data-phone-unlocked={passcodeValidationState === CORRECT}
        >
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

            <button className='delete-or-cancel-button' onClick={() => handleCancelOrDelete()}>
              {pressedNumbersArray.length === 0 ? 'Cancel' : 'Delete'}
            </button>
          </div>
        </div>

        <div className='content' data-is-rick-rolled={passcodeValidationState === CORRECT}>
          <img src={RICK_ASTLEY} alt='Rick Astley dancing' className='rick-astley-gif' />
        </div>
      </div>
    </>
  );
}

export default App;

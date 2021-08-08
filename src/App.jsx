import { BehaviorSubject, interval, EMPTY } from 'rxjs';
import { useState, useEffect } from 'react';

import { map, switchMap } from 'rxjs/operators';

const paused = new BehaviorSubject(false);

function App() {
  const [сountValue, setCountValue] = useState(0);
  const [isCount, setIsCount] = useState(false);

  useEffect(() => {
    // const timerInterval$ = interval(1000).pipe(
    //   map(value => value * 1000)
    // );
    //  const sub = timerInterval$.subscribe(res => isCount && setCountValue(res));

    const timerInterval$ = interval(1000).pipe(map(value => value * 1000));
    const p = paused.pipe(switchMap(paused => (paused ? EMPTY : timerInterval$)));

    const sub = p.subscribe(res => {
      console.log(res);
      isCount && setCountValue(res);
    });

    return () => {
      sub.unsubscribe();
      sub.complete();
    };
  }, [isCount]);

  const handleStartStopClick = e => {
    setIsCount(!isCount);
    paused.next(false);
    // if (!isCount) {
    //   setCountValue(0);
    // }
  };

  const handleWaitClick = e => {
    paused.next(true);
    setIsCount(false);
  };

  const handleResetClick = e => {
    setCountValue(0);
    setIsCount(false);
  };

  const getTimeComponents = time => {
    function pad(value) {
      return String(value).padStart(2, '0');
    }
    const hours = pad(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = pad(Math.floor((time % (1000 * 60)) / 1000));
    return ` ${hours}:${mins}:${secs}`;
  };

  return (
    <div>
      <div>{getTimeComponents(сountValue)}</div>
      <button type="button" onClick={handleStartStopClick} id="start">
        {isCount ? 'Stop' : 'Start'}
      </button>
      <button type="button" onClick={handleWaitClick} id="wait">
        Wait
      </button>
      <button type="button" onClick={handleResetClick} id="reset">
        Reset
      </button>
    </div>
  );
}

export default App;

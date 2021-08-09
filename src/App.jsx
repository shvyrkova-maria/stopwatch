import { BehaviorSubject, interval, EMPTY, fromEvent } from 'rxjs';
import { useState, useEffect } from 'react';
import { map, switchMap, debounceTime, buffer, filter } from 'rxjs/operators';
import { getTimeComponents } from 'utils/getTimeComponents';

const pause = new BehaviorSubject(false);

function App() {
  const [сountValue, setCountValue] = useState(0);
  const [isCount, setIsCount] = useState(false);

  useEffect(() => {
    const timerInterval$ = interval(1000).pipe(map(value => value * 1000));
    const paused = pause.pipe(switchMap(pause => (pause ? EMPTY : timerInterval$)));

    const timerSub = paused.subscribe(res => {
      isCount && setCountValue(prev => prev + res);
    });

    return () => {
      timerSub.unsubscribe();
      timerSub.complete();
    };
  }, [isCount]);

  const handleStartStopClick = () => {
    setIsCount(!isCount);
    pause.next(false);
    if (isCount) {
      setCountValue(0);
    }
  };

  const handleWaitClick = e => {
    const clickEvent$ = fromEvent(e.target, 'click');
    const debounce$ = clickEvent$.pipe(debounceTime(250));
    const click$ = clickEvent$.pipe(
      buffer(debounce$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    );

    click$.subscribe(() => {
      pause.next(true);
      setIsCount(false);
    });
  };

  const handleResetClick = () => {
    setCountValue(0);
    setIsCount(false);
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

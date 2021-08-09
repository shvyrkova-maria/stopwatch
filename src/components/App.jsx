import { BehaviorSubject, interval, EMPTY, fromEvent } from 'rxjs';
import { useState, useEffect } from 'react';
import { map, switchMap, debounceTime, buffer, filter } from 'rxjs/operators';
import { getTimeComponents } from 'utils/getTimeComponents';
import s from 'components/App.module.css';

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
    handleStartStopClick();
    setIsCount(true);
  };

  return (
    <div className={s.container}>
      <div className={s.display}>{getTimeComponents(сountValue)}</div>
      <div className={s.controls}>
        <button type="button" onClick={handleStartStopClick} className={s.button}>
          {isCount ? 'Stop' : 'Start'}
        </button>
        <button type="button" onClick={handleWaitClick} className={s.button}>
          Wait
        </button>
        <button type="button" onClick={handleResetClick} className={s.button}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;

import { Subject } from 'rxjs';
import { useState, useEffect } from 'react';
import { fromEvent, interval } from 'rxjs';
import { map, mapTo, mergeMapTo, takeUntil } from 'rxjs/operators';

const subject = new Subject();

const initialState = {
  value: 0,
  step: 1000,
  isCount: false,
};

let state = initialState;

const store = {
  init: () => subject.next(state),
  subscribe: setState => subject.subscribe(setState),
  start: () => {
    state = {
      ...state,
      isCount: !state.isCount,
    };
    subject.next(state);
  },
  wait: () => {
    state = {
      ...state,
      isCount: false,
    };
    subject.next(state);
  },
  reset: () => {
    state = initialState;
    subject.next(state);
  },
  initialState,
};

function App() {
  const [stopWatch, setStopWatch] = useState(store.initialState);

  useEffect(() => {
    store.subscribe(setStopWatch);
    store.init();
  }, []);

  const handleStartStopClick = e => {
    store.start();
    // const clicks = fromEvent(e.target, 'click');
    // console.log(clicks);
    interval(1000)
      .pipe(
        // takeUntil(clicks),
        map(value => value * stopWatch.step),
      )
      .subscribe(res => setStopWatch({ ...state, value: res }));

    // const seconds = interval(1000);
    // const clicks = fromEvent(document, 'click');
    // const secondsBeforeClick = seconds.pipe(takeUntil(clicks));
    // const result = secondsBeforeClick.pipe(count());
    // result.subscribe(x => console.log(x));
  };
  const handleWaitClick = e => {
    store.wait();
  };
  const handleResetClick = e => {
    store.reset();
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
      <div>{getTimeComponents(stopWatch.value)}</div>
      <button type="button" onClick={handleStartStopClick}>
        {!stopWatch.isCount ? 'Start' : 'Stop'}
      </button>
      <button type="button" onClick={handleWaitClick}>
        Wait
      </button>
      <button type="button" onClick={handleResetClick}>
        Reset
      </button>
    </div>
  );
}

export default App;

// const useObservable = observable => {
//   const [state, setState] = useState();

//   useEffect(() => {
//     const sub = observable.subscribe(setState);
//     return () => sub.unsubscribe();
//   }, [observable]);

//   return state;
// };

// const useObservable = ({ observable, setter }) => {
//   useEffect(() => {
//     const sub = observable.subscribe(result => setter(result));
//     return () => sub.unsubscribe();
//   }, [observable, setter]);
// };

// import Container from 'components/Container/Container';
// import Display from 'components/Display/Display';
// import Controls from 'components/Controls/Controls';

// return (
//   <Container>
//     <Display />
//     <Controls />
//   </Container>
// );

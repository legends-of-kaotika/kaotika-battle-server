import { clearInterval } from 'timers';
import { sendTimerDataToAll } from '../sockets/emits/user';
import { io } from '../..';
import { TURN_TIMER } from '../constants/constants';

export let turnTime: number = TURN_TIMER;
let intervalId: NodeJS.Timeout;
const decreaseTimer = (): void => {
  turnTime--;
  console.log('Time:' , turnTime);
  sendTimerDataToAll(io ,turnTime);
};

export const startTimer = () => {
  console.log('Turn started');
  turnTime = TURN_TIMER;
  console.log('turn time', turnTime);
  // set an interval to decrease timer every second
  intervalId = setInterval(() => {
    decreaseTimer();
  }, 1000);
};

export const clearTimer = () => {
  clearInterval(intervalId);
};

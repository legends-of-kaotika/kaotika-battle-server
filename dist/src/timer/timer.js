import { clearInterval } from 'timers';
import { sendTimerDataToAll } from '../sockets/emits/user.ts';
import { io } from '../../index.ts';
import { TURN_TIMER } from '../constants/constants.ts';
export let turnTime = TURN_TIMER;
let intervalId;
const decreaseTimer = () => {
    turnTime--;
    console.log('Time:', turnTime);
    sendTimerDataToAll(io, turnTime);
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

import { clearInterval } from 'timers';
import { TURN_TIMER } from '../constants/game.ts';
import { changeTurn } from '../helpers/game.ts';
import { sleep } from '../helpers/utils.ts';
import { sendWebTurnFinished } from '../sockets/emits/game.ts';
import { sendTimerDataToWeb } from '../sockets/emits/user.ts';

export let turnTime: number = TURN_TIMER;
let intervalId: NodeJS.Timeout;

const decreaseTimer = (): void => {
  turnTime--;
  console.log('Time:' , turnTime);
  sendTimerDataToWeb(turnTime);
  handleTurnTimerExpiration(turnTime);
};

export const startTimer = () : void => {
  console.log('Turn started');
  turnTime = TURN_TIMER;
  console.log('turn time', turnTime);
  // set an interval to decrease timer every second
  intervalId = setInterval(() => {
    decreaseTimer();
  }, 1000);
};

export const clearTimer = () : void => {
  clearInterval(intervalId);
};

export const resetTimer = () : void => {
  turnTime = TURN_TIMER;
};

export const handleTurnTimerExpiration = async (turnTime: number) => {
  if (turnTime === 0) {
    sendWebTurnFinished();
    await sleep(1000);
    changeTurn();
  }
};
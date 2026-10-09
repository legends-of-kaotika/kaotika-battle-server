import { clearInterval } from 'timers';
import { TURN_TIMER } from '../constants/game.ts';
import { changeTurn } from '../helpers/game.ts';
import { sleep } from '../helpers/utils.ts';
import { sendWebTurnFinished } from '../sockets/emits/game.ts';
import { sendTimerDataToWeb } from '../sockets/emits/user.ts';
import { claimTurnAdvance, turnGeneration } from '../game.ts';

export let turnTime: number = TURN_TIMER;
let intervalId: NodeJS.Timeout;
let timerGeneration = 0;

const decreaseTimer = (expectedTurnGeneration: number): void => {
  turnTime--;
  console.log('Time:' , turnTime);
  sendTimerDataToWeb(turnTime);
  void handleTurnTimerExpiration(turnTime, expectedTurnGeneration)
    .catch((error) => console.error('Turn timer expiration failed:', error));
};

export const startTimer = () : void => {
  clearTimer();
  const activeTimerGeneration = timerGeneration;
  const activeTurnGeneration = turnGeneration;
  console.log('Turn started');
  turnTime = TURN_TIMER;
  console.log('turn time', turnTime);
  sendTimerDataToWeb(turnTime);
  // set an interval to decrease timer every second
  intervalId = setInterval(() => {
    if (activeTimerGeneration === timerGeneration) decreaseTimer(activeTurnGeneration);
  }, 1000);
};

export const clearTimer = () : void => {
  timerGeneration++;
  clearInterval(intervalId);
};

export const resetTimer = () : void => {
  turnTime = TURN_TIMER;
};

export const handleTurnTimerExpiration = async (turnTime: number, expectedTurnGeneration = turnGeneration) => {
  if (turnTime === 0 && claimTurnAdvance(expectedTurnGeneration)) {
    clearTimer();
    sendWebTurnFinished();
    await sleep(1000);
    await changeTurn(expectedTurnGeneration, true);
  }
};

import { clearInterval } from "timers";
import { sendTimerDataToAll } from "../sockets/emits/user";
import { io } from "../..";

export let turnTime: number = 30;

const decreaseTimer = (intervalId: NodeJS.Timeout): void => {
  turnTime--;
  console.log('Time:' , turnTime);
  sendTimerDataToAll(io ,turnTime)
  if (turnTime <= 0) {
    console.log("Turn ended");
    clearInterval(intervalId);
  }
};

export const startTimer = () => {
  console.log("Turn started");
  turnTime = 30;
  console.log("turn time", turnTime);
  // set an interval to decrease timer every second
  const intervalId = setInterval(() => {
    decreaseTimer(intervalId);
  }, 1000);
};

export const clearTimer = (intervalId: any) => {
  clearInterval(intervalId);
};

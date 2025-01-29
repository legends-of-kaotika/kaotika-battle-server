import { clearInterval } from "timers";

export let turnTime: number = 30;
let date1: Date;
let date2: Date;

const checkDates = (): number => {
    date2 = new Date();
    let millisecondsDiff =  date1.getTime() - date2.getTime();
    const totalSeconds = Math.round(millisecondsDiff/1000)
    console.log('total seconds compare', totalSeconds);
    date1 = date2;
    return totalSeconds
}

const decreaseTimer = (totalSeconds:number, intervalId: NodeJS.Timeout): void => {
    if (totalSeconds <= -1) {
        turnTime += totalSeconds;
        console.log(turnTime , 'seconds left');
        
    } else {
        console.log('Not enough time has passed');
    }
    if (turnTime <= 0) {
        console.log('Turn ended');
        clearInterval(intervalId)
    }
}

export const startTimer = () => {
    console.log('Turn started');
    turnTime = 30;
    console.log('turn time',turnTime);
    
    date1 = new Date();
    // set an interval to decrease timer every second
    const intervalId = setInterval(() => {
        const totalSeconds = checkDates();
        decreaseTimer(totalSeconds, intervalId);
    } ,1000);
}

export const clearTimer = (intervalId:any) => {
    clearInterval(intervalId)
}
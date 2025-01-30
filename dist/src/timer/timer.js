"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTimer = exports.startTimer = exports.turnTime = void 0;
const timers_1 = require("timers");
const user_1 = require("../sockets/emits/user");
const __1 = require("../..");
exports.turnTime = 30;
const decreaseTimer = (intervalId) => {
    exports.turnTime--;
    console.log('Time:', exports.turnTime);
    (0, user_1.sendTimerDataToAll)(__1.io, exports.turnTime);
    if (exports.turnTime <= 0) {
        console.log("Turn ended");
        (0, timers_1.clearInterval)(intervalId);
    }
};
const startTimer = () => {
    console.log("Turn started");
    exports.turnTime = 30;
    console.log("turn time", exports.turnTime);
    // set an interval to decrease timer every second
    const intervalId = setInterval(() => {
        decreaseTimer(intervalId);
    }, 1000);
};
exports.startTimer = startTimer;
const clearTimer = (intervalId) => {
    (0, timers_1.clearInterval)(intervalId);
};
exports.clearTimer = clearTimer;

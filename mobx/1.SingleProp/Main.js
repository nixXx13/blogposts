const { TimerView } = require('./TimerView');
const { Timer } = require('./Timer');

const myTimer = new Timer()

TimerView(myTimer);
myTimer.tick();
myTimer.tick();

/*

SecondsPassed: 0
SecondsPassed: 1
SecondsPassed: 2

*/
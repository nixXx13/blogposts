const { TimerView } = require('./TimerView');
const { Timer } = require('./Timer');

const myTimer = new Timer()
const title = { text:"Hi" };

TimerView({timer: myTimer, title});                          
// console.log(myTimer.secondsPassed, myTimer.format);
myTimer.tick();                                            
myTimer.changeFormat('12h');                                          

myTimer.tick();         
myTimer.changeName('mySuperTimer');     // nothing happens                                
TimerView({timer: myTimer, title: {...title, text:"Bye"} });
myTimer.tick();                                            
// console.log(myTimer.secondsPassed, myTimer.format);

/*

Title: Hi | secondsPassed: 0 | format: 24h
Title: Hi | secondsPassed: 1 | format: 24h
Title: Hi | secondsPassed: 1 | format: 12h
Title: Hi | secondsPassed: 2 | format: 12h
Title: Bye | secondsPassed: 2 | format: 12h
Title: Bye | secondsPassed: 3 | format: 12h

*/
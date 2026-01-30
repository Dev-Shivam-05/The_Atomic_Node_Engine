let greets = require("./greet");
console.log(greets);


const greetEntrance = () => {
  console.log(`${greets.welcome},${greets.question}`);
};

greetEntrance();
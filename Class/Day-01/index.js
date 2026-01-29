// console.log("Hello World !");

let count = 0;

let intervalID = setInterval(() => {
    console.log("Hello Devloper's");
    count++;

    if (count >= 5) {
        console.log(`Set Interval is destroying.... with Interval Id ${count}`);
        clearInterval(intervalID);
    }
});

console.log("These Message Is Sent After Interval BUt Gonna Execute Before Interval....");

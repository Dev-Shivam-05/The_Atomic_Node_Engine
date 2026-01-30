const greetings = {
    welcome: "Welcome To The Engine of Node Js",
    question: "How Are You",
    greetEntrance: () => {
        console.log(`${welcome},${question}`);
    }
}

module.exports = greetings;
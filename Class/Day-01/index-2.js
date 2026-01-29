let x = 2;
let y = 4;

const add = ((num1, num2) => {
    return num1 + num2;
})

const sub = ((num1, num2) => {
    return num1 - num2;
})

const product = ((num1, num2) => {
    return num1 * num2;
})

const div = ((num1, num2) => {
    return num1 / num2;
})

const module = ((num1, num2) => {
    return num1 % num2;
})

let choice = 4;

switch (choice) {
    case 0:
        console.log("The Program Is Successfully executed");
        break;

    case 1:
        console.log(`The Addition Of ${x} And ${y} :- ${add(x,y)}`);
        break;

    case 2:
        console.log(`The Subtraction Of ${x} And ${y} :- ${sub(x,y)}`);
        break;

    case 3:
        console.log(`The Multiplication Of ${x} And ${y} :- ${product(x,y)}`);
        break;

    case 4:
        console.log(`The Division Of ${x} And ${y} :- ${div(x,y)}`);
        break;

    case 5:
        console.log(`The Modules Of ${x} And ${y} :- ${module(x,y)}`);
        break;

    default:
        console.log("Wrong Choice User Please Try Again.....");
        break;
}
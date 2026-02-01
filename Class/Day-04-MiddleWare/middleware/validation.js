const validation = (req,res,next) => {
    console.log(`Hello Form MiddleWare!!! from validation.js`);
    next();
}

export default validation;
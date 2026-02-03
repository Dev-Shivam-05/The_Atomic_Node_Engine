import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URL);

const database = mongoose.connection;

// database.on('connected',(err) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log(`DataBase Is Successfully Connected At ${process.env.MONGODB_URL}`);
//     }
// });

// 1 line
mongoose.connection.once("open", (err) => {
  if (!err) return console.log(`DataBase Is Successfully Connected At ${process.env.MONGODB_URL}`);
  console.log(err);
});

export default database;

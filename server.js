const app = require("./app");
// 0eIiE49AsMwOxRBe
const mongoose = require("mongoose");
const DB_HOST =
  "mongodb+srv://prosecutor:0eIiE49AsMwOxRBe@cluster0.nsqvl8g.mongodb.net/contacts_reader?retryWrites=true&w=majority";
mongoose.set(`strictQuery`, true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connect success");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

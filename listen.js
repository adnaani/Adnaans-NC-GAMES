const app = require("./app");
const PORT = 8090;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening to ${PORT} ...`);
  }
});

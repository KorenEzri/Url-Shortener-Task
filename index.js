const app = require("./routes/app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} I am from main :)`);
});

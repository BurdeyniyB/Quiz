// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Статичні файли (HTML, CSS, JS) в папці "public"
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

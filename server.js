const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/hello", (req, res) => {
    res.json({message: "Hello World%%%%"});
})


app.listen(PORT, () => {
    console.log("Сервер запущен на порту " + PORT);
})
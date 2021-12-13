/* eslint-env node */

const express = require('express')
const app = express()
const port = 3001

app.get('/hi', (req, res) => {
    res.send('Hello World!');
})


app.use(express.json());
app.disable("x-powered-by");
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
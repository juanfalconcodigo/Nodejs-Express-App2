require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors/safe')

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw console.log(colors.blue(err));
    console.log(colors.yellow('Base de datos ONLINE'));
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(require('./routes/usuario'));




app.listen(process.env.PORT, () => {
    console.log(`Se esta corriendo en el puerto : ${process.env.PORT}`);
});
require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('get');
})

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El name es obligatorio'
        })
    } else {
        res.status(201).json({
            usuario: body
        });
    }

})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id });
})

app.delete('/usuario', (req, res) => {
    res.json('delete');
})




app.listen(process.env.PORT, () => {
    console.log(`Se esta corriendo en el puerto : ${process.env.PORT}`);
});
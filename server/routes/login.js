const express = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.post('/login', (req, res) => {

    let { email, password } = req.body;
    Usuario.findOne({ email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El (usuario) o contraseña es incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario o (contraseña) es  incorrecto'
                }
            });
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(202).json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    });
})

module.exports = app;
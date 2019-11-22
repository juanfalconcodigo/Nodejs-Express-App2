const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();


app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ status: true }, 'name email role status google photo').skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.countDocuments({ status: true }, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                activos: conteo
            })

        });


    });



});

app.post('/usuario', (req, res) => {
    let { name, email, password, role } = req.body;
    let usuario = new Usuario({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        })

    });


})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'photo', 'role', 'status']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(202).json({
            ok: true,
            usuario: usuarioDB
        });

    });

})

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        status: false
    }


    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });

        }

        res.status(202).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });




})

module.exports = app;
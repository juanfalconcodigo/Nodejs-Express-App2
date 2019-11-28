const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaRolAdmin } = require('../middlewares/authentication');
const app = express();

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        description: body.description,
        user: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al hacer la petición'
                }
            })
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

app.get('/categoria', verificaToken, (req, res) => {


    Categoria.find({}).sort('description').populate('user', 'name email').exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categorias
        })

    })

});

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe una categoria con el id : ${id}`
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
})

app.delete('/categoria/:id', [verificaToken, verificaRolAdmin], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe una categoria con el id : ${id}`
                }
            })
        }

        res.status(202).json({
            ok: true,
            message: 'Categoria eliminada exitosamente'
        });



    });



});

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let data = {
        description: body.description
    }

    Categoria.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No existe una categoria con el id : ${id}`
                }
            });
        }

        res.status(202).json({
            ok: true,
            categoria: categoriaDB
        });

    });

});



module.exports = app;
const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/authentication')
const app = express();

app.post('/producto', verificaToken, (req, res) => {

    let { nombre, precioUni, descripcion, disponible, categoria } = req.body;
    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario: req.usuario
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al hacer la petición'
                }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});


app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let { nombre, precioUni, descripcion, disponible, categoria } = req.body;
    let data = {
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario: req.usuario //depende de ti papu
    }

    Producto.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto'
                }
            });
        }

        res.status(202).json({
            ok: true,
            producto: productoDB
        });

    });



});






app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }).sort('nombre').populate('usuario', 'name email').populate('categoria', 'description').skip(desde).limit(limite).exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        Producto.countDocuments({ disponible: true }, (err, total) => {
            res.json({
                ok: true,
                productos,
                cantidad: total
            });

        });

    });

});


app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id).populate('usuario', 'name email').populate('categoria', 'description').exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'gi');

    Producto.find({ nombre: regex }).populate('usuario', 'name email').populate('categoria', 'description').exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productos

        })

    });

})

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let data = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto'
                }
            });
        }

        res.status(202).json({
            ok: true,
            producto: productoDB,
            message: 'Producto Borrado'
        });

    });

});


module.exports = app;
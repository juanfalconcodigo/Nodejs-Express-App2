const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const path = require('path');
const fs = require('fs');
const { verificaToken } = require('../middlewares/authentication');
const app = express();


app.use(fileUpload({ useTempFiles: true }));

app.put('/photo/:tipo/:id', verificaToken, (req, res) => {

    let { tipo, id } = req.params;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No ah seleccionado ningun archivo'
            }
        });
    }

    let tipoValidos = ['productos', 'usuarios'];

    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos válidos son : ${tipoValidos.join(', ')}`
            }
        });
    }







    let archivo = req.files.archivo;
    let extraccionFormato = archivo.name.split('.');
    let formato = extraccionFormato[extraccionFormato.length - 1];
    let formatosValidos = ['gif', 'png', 'jpeg', 'jpg'];

    if (formatosValidos.indexOf(formato) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los formatos válidos son los siguientes : ${formatosValidos.join(', ')}`
            }
        });
    }


    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${formato}`;

    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo)
        }



        /* res.status(202).json({
            ok: true,
            message: 'Archivo creado exitosamente'
        }); */

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarImagen(usuarioDB.photo, 'usuarios');
        usuarioDB.photo = nombreArchivo;

        usuarioDB.save((err, usuario) => {
            res.json({
                ok: true,
                usuario,
                photo: nombreArchivo,
                message: 'Imagen de usuario registrado exitosamente'
            });

        });
    });
}


function imagenProducto(id, res, nombreArchivo) {


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarImagen(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto'
                }
            });
        }
        borrarImagen(productoDB.photo, 'productos')
        productoDB.photo = nombreArchivo;
        productoDB.save((err, producto) => {
            res.json({
                ok: true,
                producto,
                photo: nombreArchivo,
                message: 'Imagen de producto registrado exitosamente'
            });
        });
    });

}





function borrarImagen(nombreArchivo, tipo) {
    let pathNameImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathNameImagen)) {
        fs.unlinkSync(pathNameImagen);
    }
}


module.exports = app;
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificaTokenImg } = require('../middlewares/authentication')
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let { tipo, img } = req.params;

    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImage);
    }
});



module.exports = app;
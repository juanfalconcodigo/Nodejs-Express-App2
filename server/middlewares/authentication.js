const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, encoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = encoded.usuario;
        next();
    });

}
let verificaRolAdmin = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === "USER_ADMIN") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'No es administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaRolAdmin
}
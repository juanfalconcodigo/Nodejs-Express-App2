const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

let valoresValidos = {
    values: ['USER_ROLE', 'USER_ADMIN'],
    message: '{VALUE} no es valor válido'
}

let usuarioSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    photo: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'El rol es necesario'],
        enum: valoresValidos
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe es unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);
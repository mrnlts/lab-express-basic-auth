// User model here
const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const userSchema = new Schema({
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    },
},
    {
        timestamps: true
    }
)

const User = model('User', userSchema);
module.exports = User;
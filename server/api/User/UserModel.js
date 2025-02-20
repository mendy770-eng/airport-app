const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  birthday: {
    type: Date,
    required: true
  },
  permission: {
    type: String,
    enum: ['technicion', 'supervisor', 'admin', 'ground_attendant'],
    default: 'ground_attendant',
    required: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next){
  console.log("Saving user", this);
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});



const User = mongoose.model('User', userSchema);

module.exports = User;
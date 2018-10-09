const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
})

UserSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = async function() {
  try {
    const user = this
    const access = 'auth'
    const token = jwt
      .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
      .toString()

    user.tokens.push({ access, token })
    await user.save()
    return token
  } catch (e) {}
}

UserSchema.methods.removeToken = function(token) {
  const user = this

  return user.update({
    $pull: {
      tokens: { token }
    }
  })
}

UserSchema.statics.findByToken = async function(token) {
  try {
    const User = this

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return User.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    })
  } catch (e) {}
}

UserSchema.statics.findByCredentials = async function(email, password) {
  try {
    const User = this

    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('user not found')
    }

    const res = await bcrypt.compare(password, user.password)
    if (res) {
      return user
    } else {
      throw new Error('invalid password')
    }
  } catch (e) {}
}

UserSchema.pre('save', function(next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }

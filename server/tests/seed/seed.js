const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

const { Todo } = require('./../../models/todo')
const { User } = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const users = [
  {
    _id: userOneId,
    email: 'test1@test.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'test2@test.com',
    password: 'userTwoPass'
  }
]

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      const userOne = new User(users[0]).save()
      const userTwo = new User(users[1]).save()

      return Promise.all([userOne, userTwo])
    })
    .then(() => done())
}

const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo'
  },
  {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 123
  }
]

const populateTodos = done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos)
    })
    .then(() => done())
}

module.exports = { users, populateUsers, todos, populateTodos }
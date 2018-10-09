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
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'test2@test.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  }
]

const populateUsers = async () => {
  await User.deleteMany({})

  const userOne = await new User(users[0]).save()
  const userTwo = await new User(users[1]).save()

  await Promise.all([userOne, userTwo])
}

const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 123,
    _creator: userTwoId
  }
]

const populateTodos = async () => {
  await Todo.deleteMany({})
  await Todo.insertMany(todos)
}

module.exports = { users, populateUsers, todos, populateTodos }

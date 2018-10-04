const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

const id = '5bb66379bf05ba4bec0449a7'

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({ _id: id }).then(todos => {
//   console.log('Todos', todos)
// })

// Todo.findOne({ _id: id }).then(todo => {
//   console.log('Todo', todo)
// })

Todo.findById(id)
  .then(
    todo => {
      if (!todo) {
        return console.log('Id not found')
      }
      console.log('Todo By Id', todo)
    },
    e => console.log(e)
  )
  .catch(e => console.log(e))

User.findById('5bb652b77f98323cb83caede')
  .then(
    user => {
      if (!user) {
        return console.log('Unable to find user')
      }
      console.log('User By Id', user)
    },
    e => console.log(e)
  )
  .catch(e => console.log(e))

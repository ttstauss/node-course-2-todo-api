const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// Todo.deleteMany({}).then(result => {
//   console.log(result)
// })

// Todo.findOneAndRemove({ _id: '5bb67850250b6541ecb06e8e' })

// Todo.findByIdAndRemove('5bb67850250b6541ecb06e8e').then(todo => {
//   console.log(todo)
// })

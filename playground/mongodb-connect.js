// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // db.collection('Todos').insertOne(
    //   {
    //     text: 'Something to do',
    //     completed: false
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log('Unable to insert todo', err)
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2))
    //   }
    // )

    // db.collection('Users').insertOne(
    //   {
    //     name: 'Taylor',
    //     age: 33,
    //     location: 'Provo'
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log('Unable to insert user', err)
    //     }

    //     console.log(
    //       JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2)
    //     )
    //   }
    // )

    client.close()
  }
)

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

    // db.collection('Todos')
    //   .find({ _id: new ObjectID('5bb641e707f858cd2b940eac') })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log('Todos')
    //       console.log(JSON.stringify(docs, undefined, 2))
    //     },
    //     err => {
    //       console.log('Unable to fetch todos', err)
    //     }
    //   )

    // db.collection('Todos')
    //   .find()
    //   .count()
    //   .then(
    //     count => {
    //       console.log(`Todos count: ${count}`)
    //     },
    //     err => {
    //       console.log('Unable to fetch todos', err)
    //     }
    //   )

    db.collection('Users')
      .find({ name: 'Taylor' })
      .toArray()
      .then(
        docs => {
          console.log('Users')
          console.log(JSON.stringify(docs, undefined, 2))
        },
        err => {
          console.log('Unable to fetch todos', err)
        }
      )

    // client.close()
  }
)

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
    //   .deleteMany({ text: 'Eat lunch' })
    //   .then(result => {
    //     console.log(result)
    //   })

    // db.collection('Todos')
    //   .deleteOne({ text: 'Eat lunch' })
    //   .then(result => {
    //     console.log(result)
    //   })

    // db.collection('Todos')
    //   .findOneAndDelete({ completed: false })
    //   .then(result => {
    //     console.log(result)
    //   })

    // db.collection('Users')
    //   .deleteMany({ name: 'Taylor' })
    //   .then(result => {
    //     console.log(result)
    //   })

    // db.collection('Users')
    //   .findOneAndDelete({
    //     _id: new ObjectID('5bb64408bee8864a18aa9c5e')
    //   })
    //   .then(result => {
    //     console.log(result)
    //   })

    // client.close()
  }
)

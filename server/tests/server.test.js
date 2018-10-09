const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const { users, populateUsers, todos, populateTodos } = require('./seed/seed')

// higher order function for handling rejections
// https://labs.chiedo.com/blog/async-mocha-tests/
const mochaAsync = fn => {
  return done => {
    fn.call().then(done, err => {
      done(err)
    })
  }
}

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
  it(
    'should create a new todo',
    mochaAsync(async () => {
      expect.assertions(4)
      const text = 'Test todo text'

      const response = await request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({ text })

      expect(response.status).toBe(200)
      expect(response.body.text).toBe(text)

      const todos = await Todo.find({ text })
      expect(todos.length).toBe(1)
      expect(todos[0].text).toBe(text)
    })
  )

  it(
    'should not create todo with invalid body data',
    mochaAsync(async () => {
      const response = await request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})

      expect(response.status).toBe(400)

      const todos = await Todo.find()

      expect(todos.length).toBe(2)
    })
  )
})

describe('GET /todos', () => {
  it(
    'should get all todos',
    mochaAsync(async () => {
      const response = await request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(200)
      expect(response.body.todos.length).toBe(1)
    })
  )
})

describe('GET /todos/:id', () => {
  it(
    'should return todo doc',
    mochaAsync(async () => {
      const response = await request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(200)
      expect(response.body.todo.text).toBe(todos[0].text)
    })
  )

  it(
    'should not return todo doc created by other user',
    mochaAsync(async () => {
      const response = await request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(404)
    })
  )

  it(
    'should return a 404 if todo not found',
    mochaAsync(async () => {
      const hexId = new ObjectID().toHexString()

      const response = await request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(404)
    })
  )

  it(
    'should return 404 for non-object ids',
    mochaAsync(async () => {
      const response = await request(app)
        .get('/todos/abc123')
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(404)
    })
  )
})

describe('DELETE /todos/:id', () => {
  it(
    'should remove a todo',
    mochaAsync(async () => {
      const hexId = todos[1]._id.toHexString()

      const response = await request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)

      expect(response.status).toBe(200)
      expect(response.body.todo._id).toBe(hexId)

      const todo = await Todo.findById(hexId)

      expect(todo).toBeFalsy()
    })
  )

  it(
    'should not remove a todo created by other user',
    mochaAsync(async () => {
      const hexId = todos[0]._id.toHexString()

      const response = await request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)

      expect(response.status).toBe(404)

      const todo = await Todo.findById(hexId)

      expect(todo).toBeTruthy()
    })
  )

  it(
    'should return 404 if todo not found',
    mochaAsync(async () => {
      const hexId = new ObjectID().toHexString()

      const response = await request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)

      expect(response.status).toBe(404)
    })
  )

  it(
    'should return 404 if object id is invalid',
    mochaAsync(async () => {
      const response = await request(app)
        .get('/todos/abc123')
        .set('x-auth', users[1].tokens[0].token)

      expect(response.status).toBe(404)
    })
  )
})

describe('PATCH /todos/:id', () => {
  it(
    'should update the todo',
    mochaAsync(async () => {
      const hexId = todos[0]._id.toHexString()
      const text = 'This should be the new text'

      const response = await request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({ text, completed: true })

      expect(response.status).toBe(200)
      expect(response.body.todo.text).toBe(text)
      expect(response.body.todo.completed).toBe(true)
      expect(typeof response.body.todo.completedAt).toBe('number')
    })
  )

  it(
    'should not update todo created by other user',
    mochaAsync(async () => {
      const hexId = todos[0]._id.toHexString()
      const text = 'This should be the new text'

      const response = await request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({ text, completed: true })

      expect(response.status).toBe(404)
    })
  )

  it(
    'should clear completedAt when todo is not completed',
    mochaAsync(async () => {
      const hexId = todos[1]._id.toHexString()
      const text = 'This should be the new text'

      const response = await request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({ text, completed: false })

      expect(response.status).toBe(200)
      expect(response.body.todo.text).toBe(text)
      expect(response.body.todo.completed).toBe(false)
      expect(response.body.completedAt).toBeFalsy()
    })
  )
})

describe('GET /users/me', () => {
  it(
    'should return user if authenticated',
    mochaAsync(async () => {
      const response = await request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(200)
      expect(response.body._id).toBe(users[0]._id.toHexString())
      expect(response.body.email).toBe(users[0].email)
    })
  )

  it(
    'should return 401 if not authenticated',
    mochaAsync(async () => {
      const response = await request(app).get('/users/me')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({})
    })
  )
})

describe('POST /users', () => {
  it(
    'should create a user',
    mochaAsync(async () => {
      const email = 'test3@test.com'
      const password = 'abc123!'

      const response = await request(app)
        .post('/users')
        .send({ email, password })

      expect(response.status).toBe(200)
      expect(response.headers['x-auth']).toBeTruthy()
      expect(response.body._id).toBeTruthy()
      expect(response.body.email).toBe(email)

      const user = await User.findOne({ email })

      expect(user).toBeTruthy()
      expect(user.password).not.toBe(password)
    })
  )

  it(
    'should return validation errors if request invalid',
    mochaAsync(async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: 'bademail', password: 'abc' })

      expect(response.status).toBe(400)
    })
  )

  it(
    'should not create user if email in use',
    mochaAsync(async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: users[0].email, password: 'abc123!' })

      expect(response.status).toBe(400)
    })
  )
})

describe('POST /users/login', () => {
  it(
    'should login user and return auth token',
    mochaAsync(async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: users[1].email, password: users[1].password })

      expect(response.status).toBe(200)
      expect(response.header['x-auth']).toBeTruthy()

      const user = await User.findById(users[1]._id)

      expect(user.toObject().tokens[1]).toMatchObject({
        access: 'auth',
        token: response.headers['x-auth']
      })
    })
  )

  it(
    'should reject invalid login',
    mochaAsync(async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: users[1].email, password: users[1].password + '123' })

      expect(response.status).toBe(400)
      expect(response.header['x-auth']).toBeFalsy()

      const user = await User.findById(users[1]._id)

      expect(user.tokens.length).toBe(1)
    })
  )
})

describe('DELETE /users/me/token', () => {
  it(
    'should remove auth token on logout',
    mochaAsync(async () => {
      const response = await request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)

      expect(response.status).toBe(200)

      const user = await User.findById(users[0]._id)

      expect(user.tokens.length).toBe(0)
    })
  )
})

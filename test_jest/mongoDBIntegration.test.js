const { MongoClient } = require('mongodb')
require('dotenv').config()

describe('insert', () => {
  let connection
  let db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db('Cluster0')
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should insert a doc into collection', async () => {
    const users = db.collection('users')
    const email_test = `user_${new Date().getTime()}@example.com`
    const newUser = { email: email_test, passwordHash: '1234' } // Ensure password hashing in practice
    await users.insertOne(newUser)

    const insertedUser = await users.findOne({ email: email_test })
    expect(insertedUser).toEqual(newUser)
  })
})

const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt=require("bcrypt")
const databasePath = path.join(__dirname, 'userData.db');

 
const app = express()

app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

  
app.post('/register', async (request, response) => {
  let {username, name, password, gender, location} = request.body

  let hashedPassword = await bcrypt.hash(password, 10)

  let checkTheUsername = `
SELECT
*
FROM 
user
WHERE 
username='${username}';`;

  let userData = await database.get(checkTheUsername)
  if (userData === undefined) {
    let postNewUserQuery = `
    INSERT INTO 
    user 
    (username,name,password,gender,location)
    VALUES 
    '${username}'
    '${name}'
    '${password}'
    '${gender}'
    '${location}'
    );`
    if (password.length < 5) {
      response.status(400)
      response.send('Password is too short')
    } else {
      let newUserDetails = await db.run(postNewUserQuery)
      response.status(400)
      response.send('User created successfully')
    }
  } else {
    response.status(400)
    response.send('User already exists ')
  }
})

app.post('/login', async (request, response) => {
  let {username, password} = request.body

  let hashedPassword = await bcrypt.hash(password, 10)

  let checkLoginUserName = `
SELECT
*
FROM 
user
WHERE 
username='${username}';`

  let userData = await db.get(checkLoginUserName)
  if (userData === undefined) {
    let postForUserQuery = `
    INSERT INTO 
    user 
    (username,password)
    VALUES 
    '${username}'
    '${password}'
     );`
    if (password.length < 5) {
      response.status(400)
      response.send('Invalid user')
    } else {
      let newUserDetails = await db.run(postForUserQuery)
      response.status(400)
      response.send('Inavalid password')
    }
  } else {
    response.status(400)
    response.send('Login Success! ')
  }
})

app.put('/change-password', async (request, response) => {
  const {username, oldPassword, newPassword} = request.body
  const checkForUserQuery = `
SELECT*
FROM user
WHERE 
username='${username}'`
  const dbUser = await db.get(checkForUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('User not registered')
  } else {
    const isValidPassword = await bcrypt.compare(oldPassword, dbUser.password)
    if (isValidPassword === undefined) {
      const lengthOfNewPassword = newPassword.length
      if (lengthOfNewPassword < 5) {
        response.send(400)
        response.send('Password is too short')
      } else {
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatePasswordQuery = `
        UPDATE user 
        SET  password='${encryptedPassword}'
        WHERE username='${username}'`
        await db.run(updatePasswordQuery)
        request.send('Password updated')
      }
    } else {
      response.status(400)
      response.send('Invalid current password')
    }
  }
})

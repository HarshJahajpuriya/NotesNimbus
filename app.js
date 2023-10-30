const express = require('express')
const connectToMongo = require('./db')
const authRouter = require("./router/auth")
const notesRouter = require('./router/notes')

const app = express()
const port = 4500;

connectToMongo();

app.use(express.json())

app.use("/api/auth", authRouter) 
app.use("/api/notes", notesRouter) 

app.listen(port, () => {
  console.log(`Server started listening on port:  ${port}`)
})
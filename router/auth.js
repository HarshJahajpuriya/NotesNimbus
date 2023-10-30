const express = require('express')
const router = express.Router();
const User = require('../models/User')

router.post("/", async (req, res) => {
  try {
    // creating a user using the model
    const user = new User(req.body);
    // trying to save the newly created user
    await user.save()
    res.send(user)
  } catch (err) {
    // error code will be 11000 if the unique index fails
    if(err.code === 11000) {
      // status code 422 means : Unprocessable Entity
      res.status(422).send(`${Object.keys(err.keyValue)} already exists.`)
    }
  }
})

module.exports = router;
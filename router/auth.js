const express = require('express')
const router = express.Router();
const bcrypt = require(`bcryptjs`);
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Error = require('../utils/Error');
const JWT_SECRET = require('../utils/CONSTANTS');
const fetchUserIdFromToken = require('../middleware/fetchUserIdFromToken');

// ROUTE 1: Create a user using: POST "/api/auth/createuser", No Login Required
router.post(
  "/createUser",
  // Applying Validation
  [
    body("name").isLength({ min: 3 }).withMessage("Name requires atleast 3 characters"),
    body("email").isEmail().withMessage("Enter valid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password must contain atleast 6 characters")
  ],
  async (req, res) => {

    // If Validation Fails
    const resultErr = validationResult(req);
    if (!resultErr.isEmpty()) {
      let errors = resultErr['errors']
      res.status(422).send(errors.map(e => new Error(e.path, e.msg)));
      return;
    }


    try {
      // creating a user object using the model
      const user = new User(req.body);

      // generating salt
      const salt = bcrypt.genSaltSync(10);
      // generating hash of the password using salt
      const secretHash = bcrypt.hashSync(user.password, salt);

      // Trying to save the new user
      const resUser = await User.create({
        name: user.name,
        email: user.email,
        password: secretHash
      })

      const data = {
        'user': {
          id: resUser.id
        }
      }

      // Generating authToken
      const authToken = jwt.sign(data, JWT_SECRET)

      res.send({ authToken })
    } catch (err) {
      // error code will be 11000 if the unique index fails
      if (err.code === 11000) {
        // status code 422 means : Unprocessable Entity
        res.status(422).send(Object.keys(err.keyValue).map(e => new Error(e, "Email Already Exists")))
      } else {
        res.status(500).send(err);
      }
    }
  }
)


// ROUTE 2: Authenticate a user using: POST "/api/auth/login", No Login Required
router.post(
  "/login",
  // Applying Validation
  [
    body("email").isEmail().withMessage("Enter valid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password must contain atleast 6 characters")
  ],
  async (req, res) => {
    
    // If Validation Fails
    const resultErr = validationResult(req);
    if (! resultErr.isEmpty()) {
      let errors = resultErr['errors']
      res.status(422).send(errors.map(e => new Error(e.path, e.msg)));
      return;
    }

    const {email, password} = req.body;

    // Trying to fetch user by email
    const user = await User.findOne({email: email})
    
    // If user does not exists with this email
    if(!user) {
      return res.status(400).send(new Error("Credentials", "Enter valid credentials"));
    }
    
    let isPasswordValid = bcrypt.compareSync(password, user.password)
    // If the password does not matches with the stored hash of that password
    if(!isPasswordValid) {
      return res.status(400).send(new Error("Credentials", "Enter valid credentials"));
    }

    // If everything is correct, creating object to put in the authToken
    const data = {
      user: {
        id: user.id
      }
    }
    // Generating authToken
    const authToken = jwt.sign(data, JWT_SECRET);

    res.send({authToken});
  }
)


// ROUTE 3: Get logged in user data: POST "/api/auth/getuser", Login Required
router.post(
  "/getuser",
  fetchUserIdFromToken,
  async (req, res) => {
    try {
      let user = req.user;
      user = await User.findById(user.id).select("-password")
      res.send(user);
    } catch(err) {
      console.log(err)
      res.status(500).send(new Error("getuser Endpoint", "Internal Server Error"));
    }
  }
)


module.exports = router;
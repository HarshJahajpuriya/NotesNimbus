const express = require('express');
const fetchUserIdFromToken = require('../middleware/fetchUserIdFromToken');
const { body, validationResult } = require('express-validator');
const Note = require("../models/Note");
const Error = require('../utils/Error');
const router = express.Router();

// ROUTE 1: Get all notes: GET "/api/notes/fetchallnotes", Login Required
router.get(
  "/fetchallnotes",
  fetchUserIdFromToken,
  async (req, res) => {
    try {
      const notes = await Note.find({ user: req.user.id })
      res.send(notes)
    } catch (err) {
      res.status(500).send(new Error("fetchallnotes error", "Internal Server Error"));
    }
  }
)


// ROUTE 2: Add a note: POST "/api/notes/addnote", Login Required
router.post(
  "/addnote",
  fetchUserIdFromToken,
  [
    body("title").isLength({ min: 3 }).withMessage("Title must be of 3 characters"),
    body('description').isLength({ min: 5 }).withMessage("Description must be of 5 characters")
  ],
  async (req, res) => {

    try {

      // If Validation Fails
      const resultErr = validationResult(req);
      if (!resultErr.isEmpty()) {
        let errors = resultErr['errors']
        res.status(422).send(errors.map(e => new Error(e.path, e.msg)));
        return;
      }

      // Destructuring data from the request body
      const { title, description, tag } = req.body;

      // creating new note
      let note = new Note({ title, description, tag, user: req.user.id });
      // trying to save it 
      note = await note.save();
      res.send(note)
    } catch (err) {
      res.status(500).send(new Error("addanote error", "Internal Server Error"));
    }
  }
)


// ROUTE 3: Update an existing note: PUT "/api/notes/updatenote/:noteId", Login Required
router.put(
  "/updatenote/:noteId",
  fetchUserIdFromToken,
  async (req, res) => {

    try {
      // Destructuring data from the request body
      const { title, description, tag } = req.body;

      // finding if the note exists.
      let note = await Note.findById(req.params.noteId);

      // if the note does not exists.
      if(!note) {
        return res.status(404).send(new Error("note", "Not Found"));
      }

      // if the note does not belong to the user
      if(note.user.toString()!==req.user.id) {
        return res.status(404).send(new Error("usernote", "Not Found"));
      }

      // updating values in note
      if(title) note.title = title;
      if(description) note.description = description;
      if(tag) note.tag = tag;

      note = await Note.findByIdAndUpdate(req.params.noteId, note, { new: true });

      res.send(note)
    } catch (err) {
      res.status(500).send(new Error("updateanote error", "Internal Server Error"));
    }
  }
)


// ROUTE 4: Delete an existing note: DELETE "/api/notes/deletenote/:noteId", Login Required
router.delete(
  "/deletenote/:noteId",
  fetchUserIdFromToken,
  async (req, res) => {

    try {
      // finding if the note exists.
      let note = await Note.findById(req.params.noteId);

      // if the note does not exists.
      if(!note) {
        return res.status(404).send(new Error("note", "Not Found"));
      }

      // if the note does not belong to the user
      if(note.user.toString()!==req.user.id) {
        return res.status(404).send(new Error("usernote", "Not Found"));
      }

      note = await Note.findByIdAndDelete(req.params.noteId, note, { new: true });

      res.send({ deleted: true, note })
    } catch (err) {
      res.status(500).send(new Error("deleteanote error", "Internal Server Error"));
    }
  }
)

module.exports = router;
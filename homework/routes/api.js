var express = require('express');
var router = express.Router();

var { getCombinedExternalData } = require('../services/externalApiService');
var {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../data/notesStore');

router.get('/summary', async function (req, res, next) {
  try {
    const data = await getCombinedExternalData();

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/notes', function (req, res) {
  res.json(getAllNotes());
});

router.post('/notes', function (req, res) {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({
      message: 'Title and text are required',
    });
  }

  const note = createNote({ title, text });

  return res.status(201).json(note);
});

router.put('/notes/:id', function (req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: 'Invalid note id',
    });
  }

  const note = updateNote(id, req.body);

  if (!note) {
    return res.status(404).json({
      message: 'Note not found',
    });
  }

  return res.json(note);
});

router.delete('/notes/:id', function (req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: 'Invalid note id',
    });
  }

  const note = deleteNote(id);

  if (!note) {
    return res.status(404).json({
      message: 'Note not found',
    });
  }

  return res.json({
    message: 'Note deleted',
    note,
  });
});

module.exports = router;
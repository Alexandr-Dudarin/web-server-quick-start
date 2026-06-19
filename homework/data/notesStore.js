let notes = [
  {
    id: 1,
    title: 'First note',
    text: 'This is an example note',
  },
];

let nextId = 2;

function getAllNotes() {
  return notes;
}

function createNote({ title, text }) {
  const note = {
    id: nextId,
    title,
    text,
  };

  nextId += 1;
  notes.push(note);

  return note;
}

function updateNote(id, data) {
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return null;
  }

  note.title = data.title ?? note.title;
  note.text = data.text ?? note.text;

  return note;
}

function deleteNote(id) {
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return null;
  }

  notes = notes.filter((item) => item.id !== id);

  return note;
}

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
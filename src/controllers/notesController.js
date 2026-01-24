import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const filter = {};

    if (tag) {
      filter.tag = tag;
    }

    if (typeof search === 'string' && search.trim() !== '') {
      filter.$text = { $search: search.trim() };
    }

    const skip = (pageNumber - 1) * perPageNumber;

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = totalNotes === 0 ? 0 : Math.ceil(totalNotes / perPageNumber);

    let query = Note.find(filter);

    if (filter.$text) {
      query = query
        .select({
          score: { $meta: 'textScore' },
          title: 1,
          content: 1,
          tag: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const notes = await query.skip(skip).limit(perPageNumber);

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    // ✅ краще 204 без тіла (але якщо у вас перевірка хоче 200 — скажеш, підлаштуємо)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

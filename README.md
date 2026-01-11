# Node.js HW 01 — Express

This project is a simple Express server for working with notes.

## 📌 Features

- Uses `dotenv` for environment variables
- Runs on `PORT` from `.env` (or 3000 by default)
- Includes middleware:
  - `cors`
  - `express.json()`
  - `pino-http` logger
- Error handling:
  - 404 middleware (`Route not found`)
  - 500 middleware (returns error message)

## 📌 Available routes

- `GET /notes`  
  Returns:
  ```json
  {
    "message": "Retrieved all notes"
  }
  ```

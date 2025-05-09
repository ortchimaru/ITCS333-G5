
# 📄 API Documentation – Phase 3: Course Notes Backend

This document outlines all available API endpoints used in the Course Notes system.

---

## 📥 1. GET /notes.php

Returns a list of course notes.

### 🔗 Endpoint
```
GET /notes.php
```

### 🔸 Query Parameters
- `search` – Filter notes by title (partial match)
- `course` – Filter notes by course (e.g., ITCS333)
- `page` – Page number (default: 1)
- `limit` – Number of notes per page (default: 10)

### ✅ Sample Request
```
GET /notes.php?search=week&course=ITCS333&page=1&limit=5
```

### ✅ Sample Response
```json
[
  {
    "id": 5,
    "title": "Week 3 - Loops",
    "course": "ITCS333",
    "description": "Intro to loops",
    "uploader": "Ali",
    "downloads": 12,
    "file_path": "week3_loops.pdf",
    "created_at": "2024-09-22 11:45:00"
  }
]
```
## ➕ 2. POST /notes.php

Adds a new course note.

### 🔗 Endpoint
```
POST /notes.php
```

### 🔸 Request Body (JSON)
```json
{
  "title": "Week 1 - Intro",
  "course": "ITCS333",
  "description": "First lecture summary",
  "uploader": "Ali",
  "file_path": "week1.pdf"
}
```

### ✅ Sample Response
```json
{ "message": "✅ Note created successfully!" }
```

### ❌ Error Response
```json
{ "error": "⚠️ Missing required fields." }
```

## ✏️ 3. PUT /notes.php?id={id}

Updates a note by ID.

### 🔗 Endpoint
```
PUT /notes.php?id=5
```

### 🔸 Request Body (JSON)
```json
{
  "title": "Updated Title",
  "course": "MATH201",
  "description": "Updated description"
}
```

### ✅ Sample Response
```json
{ "message": "✅ Note updated successfully." }
```

---

## 🗑️ 4. DELETE /notes.php?id={id}

Deletes a note by ID.

### 🔗 Endpoint
```
DELETE /notes.php?id=5
```

### ✅ Sample Response
```json
{ "message": "🗑️ Note deleted" }
```

---

## 🔎 5. GET /get-note.php?id={id}

Returns a single note by ID.

### 🔗 Endpoint
```
GET /get-note.php?id=5
```

### ✅ Sample Response
```json
{
  "id": 5,
  "title": "Week 3 - Loops",
  "course": "ITCS333",
  "description": "Intro to loops",
  "uploader": "Ali",
  "downloads": 12,
  "file_path": "week3_loops.pdf",
  "created_at": "2024-09-22 11:45:00"
}
```

### ❌ Error Response
```json
{ "error": "Note not found" }
```

---

## 🔐 Security

- Input sanitized via `PDO` prepared statements
- File uploads not implemented yet
- CORS enabled for frontend development

---

## 📦 Author
Abdulla Jalal – 202100452 - Phase 3 (ITCS333)

# Resume AI Assistant

A full-stack application that allows users to upload their resumes and interact with them using AI-powered chat. Built with React, Express, and Google's Gemini AI for intelligent resume analysis and career advice.

## Features

- **User Authentication**: Secure authentication using Clerk
- **Resume Upload**: Upload and parse PDF resumes
- **AI-Powered Chat**: Interact with your resume using natural language queries
- **Career Advice**: Get personalized career suggestions based on your resume
- **Semantic Search**: Advanced vector-based search for relevant resume content
- **Modern UI**: Clean, responsive interface built with React and TailwindCSS

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Clerk** - Authentication
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **LangChain** - AI framework
- **Google Generative AI** - LLM for resume analysis
- **PDF-parse-new** - PDF text extraction
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google AI API key
- Clerk API keys

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Clerk_Project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
GEMINI_API_KEY=your_google_gemini_api_key
PORT=8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Database Setup

Create a PostgreSQL database and run the following SQL to create the resume table:

```sql
CREATE TABLE resume (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    filedata JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Project

### Start the Backend

```bash
cd backend
npm start
```

The backend will run on `http://localhost:8000`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### POST /api/user/resume
Upload and process a PDF resume.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - `document`: PDF file
  - `client_id`: User ID from Clerk

**Response:**
```json
{
  "totalChunks": 10,
  "chunks": ["chunk1", "chunk2", ...],
  "result": {...}
}
```

### POST /api/user/query
Query the resume with natural language.

**Request:**
- Method: POST
- Content-Type: application/json
- Body:
  ```json
  {
    "query": "What are my skills?",
    "userId": "user_id"
  }
  ```

**Response:**
```json
{
  "response": "Based on your resume, you have skills in..."
}
```

### GET /api/user/verify/:id
Check if a user has uploaded a resume.

**Request:**
- Method: GET
- Params: `id` - User ID from Clerk

**Response:**
```json
{
  "message": true
}
```

## Project Structure

```
Clerk_Project/
├── backend/
│   ├── src/
│   │   ├── db.js              # PostgreSQL connection
│   │   ├── index.js           # Express server entry point
│   │   ├── models/
│   │   │   └── user.model.js  # User models
│   │   └── routes/
│   │       └── user.routes.js # API routes
│   ├── package.json
│   └── .env                  # Backend environment variables
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images and icons
│   │   ├── pages/
│   │   │   ├── HomePage.tsx  # Main landing page
│   │   │   ├── UploadResume.tsx # Resume upload page
│   │   │   └── ChatResume.tsx   # Chat interface
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── .env                  # Frontend environment variables
└── README.md
```

## How It Works

1. **Authentication**: Users sign in/sign up using Clerk
2. **Resume Upload**: Users upload their PDF resumes, which are parsed and split into chunks
3. **Vector Storage**: Resume chunks are embedded using Google's embedding model and stored in memory
4. **AI Query**: When users ask questions, the system retrieves relevant chunks using semantic search
5. **Response Generation**: Google Gemini generates contextual responses based on the retrieved resume content

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Generative AI API key
- `PORT` - Server port (default: 8000)

### Frontend (.env)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for authentication

## Getting API Keys

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

### Clerk API Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key to your frontend `.env` file

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

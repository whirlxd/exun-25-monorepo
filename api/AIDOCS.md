# AI GEN DOCS BELOW !!!!!

> IDK MENE PADHE NAHI DEKHLENA THO

A complete multi-component fictional mission-request ecosystem (simulated/game-like system) with hiring services, gambling contracts, and real-time chat communication. This project consists of a Go backend API, TypeScript frontend, and Python CLI tool.

## 🎯 Overview

This system allows users to:
- **Hire services** (Hitman missions and Gambling contracts) via web interface
- **Work as contractors** (Workers) via CLI interface
- **Communicate** between hirers and workers through a real-time chat system

## 📁 Project Structure

```
exun/
├── backend-go/          # Go backend API (Gin + MongoDB)
│   ├── controllers/     # Request handlers
│   ├── models/          # Data models
│   ├── routes/          # Route definitions
│   ├── database/        # MongoDB connection
│   └── utils/           # Utility functions
├── frontend-ts/         # TypeScript frontend (Vite + React)
│   └── src/
│       ├── App.tsx      # Main application component
│       └── App.css      # Styling
├── cli-python/          # Python CLI tool
│   └── hitman_cli/
│       └── cli.py       # CLI implementation
└── README.md
```

## 🏗️ System Architecture

### User Types

1. **Hirers (Users)**: People who create hiring requests
   - Sign up via web interface
   - Create missions/contracts
   - Chat with workers via web interface

2. **Workers**: People who are hired for jobs
   - Sign up via CLI
   - Login via CLI
   - View and respond to jobs
   - Chat with hirers via CLI

### Data Flow

```
Hirer (Web) → Backend API → MongoDB
                    ↓
Worker (CLI) ← Backend API ← MongoDB
```

## 🚀 Components

### 1. Go Backend API

RESTful API built with Gin framework and MongoDB for persistent storage.

**Key Features:**
- User authentication (Hirers and Workers)
- Mission/Contract creation and retrieval
- Real-time chat system
- Auto-generated encrypted-looking IDs and hashes
- Password hashing with bcrypt

**Architecture:**
- `/controllers` - Request handlers (auth, mission, gambling, worker, chat)
- `/routes` - Route definitions
- `/models` - Data models (user, worker, mission, gambling, message)
- `/utils` - Utility functions (ID/Hash generators)
- `/database` - MongoDB connection and collections

**MongoDB Collections:**
- `users` - Hirer accounts
- `workers` - Worker accounts
- `missions` - Hitman mission requests
- `gambling_contracts` - Gambling hire contracts
- `messages` - Chat messages between users and workers

### 2. TypeScript Frontend

Modern web interface built with Vite and React for hirers.

**Features:**
- User signup/login for hirers
- Mission creation (Hitman hiring)
- Gambling contract creation
- Real-time chat interface
- Cyberpunk/hacker themed UI
- Auto-refresh chat (polls every 2 seconds)
- Unread message badges

**Views:**
- **HIRING Tab**: Create missions and gambling contracts
- **CHAT Tab**: Communicate with workers

### 3. Python CLI Tool

Command-line interface for workers to interact with the system.

**Features:**
- Worker signup and login
- View missions and gambling contracts
- Real-time chat with hirers
- Interactive terminal mode
- Formatted output
- Command parsing and validation

## 📋 API Endpoints

### Authentication

#### POST /auth/signup
Create a new hirer account.

**Request:**
```json
{
  "username": "agent47",
  "email": "agent@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "agent47",
    "email": "agent@example.com",
    "hash": "1A2B3C4D5E6F"
  }
}
```

#### POST /auth/worker/signup
Create a new worker account.

**Request:**
```json
{
  "username": "worker123",
  "email": "worker@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Worker account created successfully",
  "worker": {
    "id": "507f1f77bcf86cd799439012",
    "username": "worker123",
    "email": "worker@example.com",
    "hash": "2B3C4D5E6F7A"
  }
}
```

#### POST /auth/worker/login
Login as a worker.

**Request:**
```json
{
  "email": "worker@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "2B3C4D5E6F7A",
  "worker": {
    "id": "507f1f77bcf86cd799439012",
    "username": "worker123",
    "email": "worker@example.com",
    "hash": "2B3C4D5E6F7A"
  }
}
```

### Missions (Hitman Hiring)

#### POST /mission
Create a new mission operation.

**Request:**
```json
{
  "user_hash": "1A2B3C4D5E6F",
  "date": "2024-01-15",
  "time": "14:30",
  "location": "Downtown Plaza"
}
```

**Response:**
```json
{
  "message": "Mission created successfully",
  "mission": {
    "id": "507f1f77bcf86cd799439012",
    "mission_id": "A3F1-91BC",
    "hash": "FA10B9C211EE",
    "user_hash": "1A2B3C4D5E6F",
    "date": "2024-01-15",
    "time": "14:30",
    "location": "Downtown Plaza",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /mission/latest
Get the latest mission.

#### GET /mission/:hash
Get mission by hash.

#### GET /mission/:hash?attr=<attribute>
Get specific attribute from mission.

**Attributes:** `id`, `hash`, `date`, `time`, `location`, `user_hash`

### Gambling Contracts

#### POST /gambling
Create a new gambling hire contract.

**Request:**
```json
{
  "user_hash": "1A2B3C4D5E6F",
  "venue": "Monaco Royale",
  "game_type": "Texas Hold'em",
  "buy_in": "50000",
  "date": "2024-01-20",
  "start_time": "20:00",
  "duration": "3 hours",
  "payment_type": "gold_coins",
  "agree_to_terms": true
}
```

**Response:**
```json
{
  "message": "Gambling contract created successfully",
  "contract": {
    "contract_id": "B7D2-44AF",
    "hash": "EA21CC00F3AC",
    "user_hash": "1A2B3C4D5E6F",
    "venue": "Monaco Royale",
    "game_type": "Texas Hold'em",
    "buy_in": "50000",
    "date": "2024-01-20",
    "start_time": "20:00",
    "duration": "3 hours",
    "payment_type": "gold_coins",
    "agree_to_terms": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /gambling/latest
Get the latest gambling contract.

#### GET /gambling/:hash
Get gambling contract by hash.

#### GET /gambling/:hash?attr=<attribute>
Get specific attribute from gambling contract.

**Attributes:** `contract_id`, `hash`, `venue`, `game_type`, `buy_in`, `date`, `start_time`, `duration`, `payment_type`, `agree_to_terms`, `user_hash`

### Chat System

#### POST /chat/send
Send a message between users/workers.

**Request:**
```json
{
  "from_hash": "1A2B3C4D5E6F",
  "to_hash": "2B3C4D5E6F7A",
  "content": "Hello, I'm interested in the job!"
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "from_hash": "1A2B3C4D5E6F",
    "to_hash": "2B3C4D5E6F7A",
    "from_type": "user",
    "to_type": "worker",
    "content": "Hello, I'm interested in the job!",
    "read": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /chat/messages/:hash?with=<hash>
Get all messages between two users/workers.

**Example:** `GET /chat/messages/1A2B3C4D5E6F?with=2B3C4D5E6F7A`

**Response:**
```json
{
  "messages": [
    {
      "id": "507f1f77bcf86cd799439013",
      "from_hash": "1A2B3C4D5E6F",
      "to_hash": "2B3C4D5E6F7A",
      "from_type": "user",
      "to_type": "worker",
      "content": "Hello!",
      "read": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /chat/conversations/:hash
Get all conversations for a user/worker.

**Response:**
```json
{
  "conversations": [
    {
      "participant_hash": "2B3C4D5E6F7A",
      "participant_type": "worker",
      "last_message": "Hello!",
      "last_message_time": "2024-01-15T10:30:00Z",
      "unread_count": 2
    }
  ]
}
```

## 🛠️ Setup Instructions

### Prerequisites

- **Go 1.21+** - [Install Go](https://golang.org/dl/)
- **Node.js 18+** - [Install Node.js](https://nodejs.org/)
- **Python 3.8+** - [Install Python](https://www.python.org/downloads/)
- **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas)

### 1. Go Backend Setup

```bash
cd backend-go

# Install dependencies
go mod download

# Run the server (make sure MongoDB is running)
go run main.go
```

The backend will start on `http://localhost:8080` and connect to MongoDB.

**Note:** The first time you run it, Go will download all dependencies automatically.

### 2. TypeScript Frontend Setup

```bash
cd frontend-ts

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

**Production Build:**
```bash
npm run build
npm run preview
```

### 3. Python CLI Setup

```bash
cd cli-python

# Install the package
pip install .

# Or install in development mode
pip install -e .
```

**Verify Installation:**
```bash
hitman+
# Or on Windows:
hitman
```

If you see "Error: Could not connect to backend server", make sure the Go backend is running.

## 📖 Usage Guide

### For Hirers (Web Interface)

#### 1. Sign Up
1. Open `http://localhost:3000` in your browser
2. Click "SIGN UP"
3. Fill in username, email, and password
4. Save your **User Hash** (displayed after signup)

#### 2. Create a Mission/Contract
1. Click the **HIRING** tab
2. Choose between **HITMAN HIRING** or **GAMBLING HIRE**
3. Fill in the required fields:
   - **Hitman**: Location, Date, Time
   - **Gambling**: Venue, Game Type, Buy-in, Date, Start Time, Duration, Payment Type, Terms
4. Click "SUBMIT"
5. Save the generated **Hash** for reference

#### 3. Chat with Workers
1. Click the **CHAT** tab
2. Select a conversation from the list
3. Type and send messages
4. Messages auto-refresh every 2 seconds

### For Workers (CLI)

#### 1. Sign Up
```bash
worker signup <email> <username> <password>
```

**Example:**
```bash
worker signup worker@example.com worker123 mypassword
```

#### 2. Login
```bash
worker login <email> <password>
```

**Example:**
```bash
worker login worker@example.com mypassword
```

#### 3. View Missions/Contracts
```bash
# Get latest mission
parin goat latest

# Get mission by hash
parin goat FA10B9C211EE

# Get specific attribute
parin goat FA10B9C211EE location

# Get latest gambling contract
gambling+ latest

# Get gambling contract by hash
gambling+ EA21CC00F3AC

# Get specific attribute
gambling+ EA21CC00F3AC venue
```

#### 4. Chat with Hirers
```bash
# List all conversations
chat conversations

# View messages with a specific user
chat messages 1A2B3C4D5E6F

# Send a message
chat send 1A2B3C4D5E6F Hello, I'm interested in the job!
```

## 💻 CLI Commands Reference

### Mission Commands
- `parin goat latest` - Get latest mission
- `parin goat <hash>` - Get mission by hash
- `parin goat <hash> <attribute>` - Get specific attribute

**Available Attributes:** `id`, `date`, `time`, `location`, `hash`, `user_hash`

### Gambling Commands
- `gambling+ latest` - Get latest gambling contract
- `gambling+ <hash>` - Get gambling contract by hash
- `gambling+ <hash> <attribute>` - Get specific attribute

**Available Attributes:** `contract_id`, `hash`, `venue`, `game_type`, `buy_in`, `date`, `start_time`, `duration`, `payment_type`, `agree_to_terms`, `user_hash`

### Worker Commands
- `worker signup <email> <username> <password>` - Sign up as worker
- `worker login <email> <password>` - Login as worker

### Chat Commands
- `chat conversations` - List all conversations
- `chat messages <hash>` - View messages with a user/worker
- `chat send <to_hash> <message>` - Send a message

### Utility Commands
- `help` - Show help message
- `exit` - Exit the terminal

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  hash: String (unique identifier),
  created_at: Date
}
```

### Workers Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  hash: String (unique identifier),
  created_at: Date
}
```

### Missions Collection
```javascript
{
  _id: ObjectId,
  mission_id: String (format: A3F1-91BC),
  hash: String (unique identifier),
  user_hash: String,
  date: String,
  time: String,
  location: String,
  created_at: Date
}
```

### Gambling Contracts Collection
```javascript
{
  _id: ObjectId,
  contract_id: String (format: B7D2-44AF),
  hash: String (unique identifier),
  user_hash: String,
  venue: String,
  game_type: String,
  buy_in: String,
  date: String,
  start_time: String,
  duration: String,
  payment_type: String (gold_coins or gems),
  agree_to_terms: Boolean,
  created_at: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  from_hash: String,
  to_hash: String,
  from_type: String (user or worker),
  to_type: String (user or worker),
  content: String,
  read: Boolean,
  created_at: Date
}
```

## 🔄 How It Works

### Authentication Flow

1. **Hirer Signup (Web)**:
   - User fills form → Frontend sends POST to `/auth/signup`
   - Backend creates user, generates hash, stores in MongoDB
   - Frontend displays hash to user

2. **Worker Signup (CLI)**:
   - Worker runs `worker signup` command
   - CLI sends POST to `/auth/worker/signup`
   - Backend creates worker, generates hash
   - CLI displays hash to worker

3. **Worker Login (CLI)**:
   - Worker runs `worker login` command
   - CLI sends POST to `/auth/worker/login`
   - Backend verifies credentials, returns hash as token
   - CLI stores hash for session

### Mission/Contract Creation Flow

1. Hirer fills form on web interface
2. Frontend sends POST to `/mission` or `/gambling`
3. Backend:
   - Validates user hash exists
   - Generates mission_id/contract_id and hash
   - Stores in MongoDB
   - Returns created object
4. Frontend displays success message with hash

### Chat Flow

1. **Sending Messages**:
   - User/Worker sends message via web/CLI
   - POST to `/chat/send` with from_hash, to_hash, content
   - Backend stores message in MongoDB
   - Returns success

2. **Receiving Messages**:
   - Frontend polls `/chat/conversations/:hash` every 2 seconds
   - CLI can query `/chat/messages/:hash?with=<hash>` on demand
   - Backend returns messages, marks as read when fetched

3. **Conversation List**:
   - GET `/chat/conversations/:hash`
   - Backend groups messages by participant
   - Returns list with last message, timestamp, unread count

## 🎨 Frontend Features

### UI Components

- **Main Tabs**: Switch between HIRING and CHAT
- **Service Tabs**: Switch between Hitman and Gambling (within HIRING)
- **Chat Interface**:
  - Left sidebar: Conversations list with unread badges
  - Right panel: Message view with send input
  - Auto-scroll to latest message
  - Real-time updates (2-second polling)

### Styling

- Cyberpunk/hacker theme
- Dark background (#0a0a0a)
- Neon green (#00ff88) and cyan (#00d4ff) accents
- Monospace font (Courier New)
- Glowing borders and shadows

## 🐛 Troubleshooting

### Backend won't start
- Check if port 8080 is available
- Verify Go is installed: `go version`
- Check dependencies: `go mod download`
- Ensure MongoDB is running

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify API endpoint URL in `App.tsx`

### CLI command not found
- Verify installation: `pip list | grep hitman`
- Check PATH includes Python scripts directory
- Reinstall: `pip install -e .`

### CLI can't connect to backend
- Ensure backend is running
- Check backend URL in `cli.py` (default: `http://localhost:8080`)
- Verify no firewall blocking connection

### Chat not working
- Ensure you're logged in (for workers: `worker login`)
- Verify user/worker hash is correct
- Check MongoDB connection
- Check browser console for errors (frontend)

## 📝 Notes

- All data is stored in MongoDB (persisted)
- Users must sign up to get a user hash
- Workers must sign up and login to use chat
- Missions/Contracts are associated with user hashes
- Chat messages are bidirectional (users ↔ workers)
- The CLI supports interactive terminal mode
- Frontend chat auto-refreshes every 2 seconds
- This is a fictional simulation system - all operations are simulated

## 🔐 Security Notes

- Passwords are hashed using bcrypt
- User/Worker hashes are used as identifiers (not tokens)
- No JWT tokens (hash-based authentication)
- CORS enabled for development
- Input validation on all endpoints

## 🚧 Future Enhancements

Potential improvements:
- WebSocket support for real-time chat (instead of polling)
- JWT token-based authentication
- File attachments in chat
- Notification system
- Search functionality
- Admin dashboard
- Rate limiting
- Message encryption

## 📄 License

This project is for educational and entertainment purposes only.

## 🤝 Contributing

This is a demo project. Feel free to fork and modify for your own purposes.

---

**Built with:** Go, Gin, MongoDB, React, TypeScript, Vite, Python

# How to Start the Backend Server

## Prerequisites
1. Node.js and npm installed
2. MongoDB running (local or remote)

## Setup Steps

### 1. Install Dependencies
```bash
cd Server
npm install
```

### 2. Create .env File
Create a `.env` file in the `Server` directory with the following content:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Example MongoDB URI:**
- Local: `mongodb://localhost:27017/student_tracker`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/student_tracker?retryWrites=true&w=majority`

### 3. Start the Server
```bash
npm start
```

The server should start on port 5000 and you should see:
```
Server is running on port 5000
MongoDB connected successfully
```

### 4. Verify Server is Running
Open your browser and go to: `http://localhost:5000`

You should see: `API is running...`

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify MongoDB connection string is correct
- Make sure all dependencies are installed

### MongoDB Connection Error
- Verify MongoDB is running
- Check the MONGO_URI in your .env file
- Ensure network access is allowed (for remote MongoDB)

### Frontend can't connect
- Verify server is running on port 5000
- Check CORS settings in server.js
- Ensure CLIENT_URL matches your frontend URL



import * as dotenv from 'dotenv';
import express from 'express';
import { ChatController } from './controllers/index.js';

// Initialize express server
const app = express();

// Set up JSON parsing
app.use(express.json());

// Initialize dotenv
dotenv.config();

// Initialize chat controller
const chatController = new ChatController();

// Add post API endpoint
app.post('/chat', chatController.handleUserInput)

// Set up listening port
const port = process.env.PORT || 8000;

// Initialize server listening port
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
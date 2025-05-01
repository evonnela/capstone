/**
 * OpenAI API Proxy Server
 * This server proxies requests to OpenAI API to avoid exposing the API key in frontend code.
 */

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Proxy endpoint for OpenAI chat completions
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Bad request: messages array is required' 
      });
    }

    // Forward request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    // Return the response
    return res.json({
      message: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ 
      error: 'Error calling OpenAI API', 
      details: error.message 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`OpenAI proxy server running on port ${port}`);
});

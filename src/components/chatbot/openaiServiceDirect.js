/**
 * OpenAI API Service - Direct Implementation
 * This file handles communication with the OpenAI API using a directly provided API key.
 * Incorporates prompt tuning for book-focused educational assistance.
 */

import OpenAI from 'openai';
import { prepareMessages} from './promptConfig';

// IMPORTANT: Replace this with your actual OpenAI API key 
// NOTE: This method is NOT secure for production use - only for local testing!
const API_KEY = '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';

// Create the OpenAI client with the direct API key
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
  timeout: 30000,
  maxRetries: 3
});

/**
 * Sends a message to the OpenAI API and gets a response
 * @param {Array} messages - Array of message objects in the format: {role: 'user' | 'assistant', content: string}
 * @returns {Promise<string>} - The assistant's response text
 */
export const sendMessage = async (messages) => {
  try {
    // Filter out any undefined messages and ensure each has proper format
    const validMessages = messages.filter(msg => 
      msg && typeof msg === 'object' && 
      msg.role && typeof msg.role === 'string' && 
      msg.content && typeof msg.content === 'string'
    );
    
    // Make sure there's at least one valid message
    if (validMessages.length === 0) {
      throw new Error("No valid messages to send to OpenAI API");
    }
    
    // Apply the system prompt to the valid messages
    const messagesWithPrompt = prepareMessages(validMessages);
    
    console.log('Attempting to send message to OpenAI with messages:', JSON.stringify(messagesWithPrompt, null, 2));
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: validMessages,
      temperature: 0.7,
      max_tokens: 150,
    });

    console.log('Received response from OpenAI:', response);
    
    if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
      throw new Error("Invalid response structure from OpenAI API");
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("API Error Status:", error.response.status);
    }
    
    throw new Error(error.message || "Failed to get response from chatbot. Please try again.");
  }
};

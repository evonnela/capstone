/**
 * OpenAI API Service - Proxy Implementation
 * This file handles communication with the OpenAI API via backend proxy.
 * This is the more secure approach for production deployment.
 */

import { prepareMessages } from './promptConfig';

// Backend API URL - adjust based on your deployment environment
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api/chat';

/**
 * Sends a message to the backend proxy which then communicates with OpenAI API
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
    
    console.log('Attempting to send message to proxy with messages:', JSON.stringify(messagesWithPrompt, null, 2));
    
    // Send request to backend proxy
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: messagesWithPrompt }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from backend');
    }
    
    const data = await response.json();
    
    console.log('Received response from proxy:', data);
    
    return data.message;
  } catch (error) {
    console.error("Error calling proxy API:", error);
    throw new Error(error.message || "Failed to get response from chatbot. Please try again.");
  }
};

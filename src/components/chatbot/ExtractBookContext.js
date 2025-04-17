/**
 * Dynamic Book Context Handler
 * 
 * This file handles the detection of book discussions and dynamically enhances
 * the prompt with contextual information about the detected book.
 */

/**
 * Analyzes the conversation to detect if a specific book is being discussed
 * and enhances the system prompt accordingly.
 * 
 * @param {Array} messages - The conversation history
 * @returns {Array} - Updated messages with enhanced system prompt if a book is detected
 */
export const enhanceWithBookContext = (messages) => {
  // First, check if we already have book context in the system message
  const systemMessage = messages.find(msg => msg.role === 'system');
  if (systemMessage && systemMessage.content.includes('[BOOK_CONTEXT]')) {
    // We already have book context, no need to modify
    return messages;
  }
  
  // Look for book mentions in user messages
  const userMessages = messages.filter(msg => msg.role === 'user');
  if (userMessages.length === 0) return messages;
  
  // Extract any book title mentions from the latest user message
  const lastUserMessage = userMessages[userMessages.length - 1].content;
  const bookMention = extractBookMention(lastUserMessage);
  
  if (!bookMention) return messages;
  
  // Add book context instruction to the system prompt
  return addBookContextToPrompt(messages, bookMention);
};

/**
 * Attempts to extract book mentions from the user message
 * 
 * @param {string} userMessage - The user's message content
 * @returns {string|null} - The detected book title or null if none detected
 */
function extractBookMention(userMessage) {
  // Simple pattern matching for common book title mentions
  // This could be enhanced with NLP techniques or a more robust approach
  
  // Look for phrases like "in the book X", "about the novel X", etc.
  const bookPhrases = [
    /(?:in|about|from|reading|finished|the book|the novel|the story) ["']([^"']+)["']/i,
    /["']([^"']+)["'] (?:book|novel|story)/i,
    /(?:^|\s)(?:the|a) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/
  ];
  
  for (const pattern of bookPhrases) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Adds book context instruction to the system prompt
 * 
 * @param {Array} messages - The conversation messages
 * @param {string} bookTitle - The detected book title
 * @returns {Array} - Updated messages with book context
 */
function addBookContextToPrompt(messages, bookTitle) {
  const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
  
  // Book context instruction that leverages the LLM's existing knowledge
  const bookContextPrompt = `
[BOOK_CONTEXT]
I've detected that the user is asking about the book "${bookTitle}". 
Use your knowledge about this book to provide accurate information about:
- Key vocabulary and terminology specific to this book
- Important characters, settings, and plot elements
- Themes and literary techniques used by the author
- Grammar and language patterns in the text

If you're uncertain about aspects of this book, acknowledge that and focus on the user's specific questions.
`;
  
  if (systemMessageIndex >= 0) {
    // Add book context to existing system message
    const updatedMessages = [...messages];
    updatedMessages[systemMessageIndex] = {
      ...updatedMessages[systemMessageIndex],
      content: updatedMessages[systemMessageIndex].content + bookContextPrompt
    };
    return updatedMessages;
  }
  
  // If no system message exists, add one with book context
  return [
    { role: 'system', content: bookContextPrompt },
    ...messages
  ];
}

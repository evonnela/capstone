import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoSend, IoClose, IoChatbubbleEllipses } from 'react-icons/io5';
import { sendMessage } from './openaiService';

// Styled components for the chatbot
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: 'Comic Sans MS', sans-serif;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6f61, #ffb6b9);
  color: white;
  border: 3px solid #ffe6a7;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #ffc7c4, #ff6f61);
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 450px;
  background-color: #fff8e8;
  border-radius: 20px;
  border: 4px solid #ffb6b9;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #ff6f61, #ffb6b9);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #ffe6a7;
  
  h3 {
    font-family: 'Comic Sans MS', sans-serif;
    font-size: 1.5rem;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 5px;
  line-height: 1.4;
  word-wrap: break-word;
  
  /* Align and style based on message type */
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? 'linear-gradient(135deg, #ff6f61, #ffb6b9)' : '#ffe6a7'};
  color: ${props => props.isUser ? 'white' : '#333'};
  border: ${props => props.isUser ? 'none' : '1px solid #ffb6b9'};
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eaeaea;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #ffb6b9;
  border-radius: 20px;
  outline: none;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    border-color: #ff6f61;
    box-shadow: 0 0 5px rgba(255, 111, 97, 0.3);
  }
  
  &::placeholder {
    color: #ffb6b9;
    font-family: 'Comic Sans MS', sans-serif;
  }
`;

// Create a forwarded ref component
const ChatInput = React.forwardRef((props, ref) => (
  <StyledInput {...props} ref={ref} />
));

const SendButton = styled.button`
  background: none;
  border: none;
  color: #ff6f61;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover:not(:disabled) {
    transform: scale(1.15);
  }
  
  &:disabled {
    color: #cccccc;
    cursor: not-allowed;
  }
`;

const ThinkingIndicator = styled.div`
  align-self: flex-start;
  background-color: #ffe6a7;
  color: #ff6f61;
  padding: 10px 15px;
  border-radius: 18px;
  border: 1px solid #ffb6b9;
  display: ${props => props.isThinking ? 'block' : 'none'};
  font-weight: bold;
`;
const WELCOME_MESSAGE = 'Hi there! I\'m your Reading Assistant. I can help with vocabulary, grammar, and context questions about books you\'re reading. What book are you reading right now?';

/**
 * Chatbot Component
 * A floating chat interface that communicates with OpenAI
 */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus the input field when the chat window opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isThinking) {
      // Short timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen, isThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsThinking(true);
    
    try {
      // Prepare the messages for the API (including conversation history)
      const apiMessages = [...messages, userMessage];
      
      // Send to OpenAI and get response
      const response = await sendMessage(apiMessages);
      
      // Add assistant response to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: response }
      ]);
      
      // Focus back on the input field after receiving a response
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Display a simplified error message to the user
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error connecting to my brain. Please try again or check the console for details.' }
      ]);
      
      // Focus back on the input field after error
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatbotContainer>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <h3>Book Helper</h3>
            <CloseButton onClick={toggleChat}>
              <IoClose />
            </CloseButton>
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((message, index) => (
              <MessageBubble 
                key={index} 
                isUser={message.role === 'user'}
              >
                {message.content}
              </MessageBubble>
            ))}
            <ThinkingIndicator isThinking={isThinking}>
              Thinking...
            </ThinkingIndicator>
            <div ref={messagesEndRef} />
          </ChatMessages>
          
          <ChatInputContainer>
            <ChatInput 
              ref={inputRef}
              type="text" 
              value={input} 
              onChange={handleInputChange} 
              onKeyPress={handleKeyPress}
              placeholder="Ask about vocabulary, grammar, or context..." 
              disabled={isThinking}
            />
            <SendButton 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isThinking}
            >
              <IoSend />
            </SendButton>
          </ChatInputContainer>
        </ChatWindow>
      )}
      
      <ChatButton onClick={toggleChat}>
        <IoChatbubbleEllipses size={24} />
      </ChatButton>
    </ChatbotContainer>
  );
};

export default ChatBot;

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoSend, IoClose, IoChatbubbleEllipses } from 'react-icons/io5';
// Import the direct service instead of the env variable based one
import { sendMessage } from './openaiServiceDirect';

// Styled components for the chatbot
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: ${props => props.isUser ? '#007bff' : '#f1f0f0'};
  color: ${props => props.isUser ? 'white' : 'black'};
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eaeaea;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 1rem;
  
  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    color: #cccccc;
    cursor: not-allowed;
  }
`;

const ThinkingIndicator = styled.div`
  align-self: flex-start;
  background-color: #f1f0f0;
  color: #666;
  padding: 10px 15px;
  border-radius: 18px;
  display: ${props => props.isThinking ? 'block' : 'none'};
`;

/**
 * Chatbot Component
 * A floating chat interface that communicates with OpenAI
 */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Display a simplified error message to the user
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error connecting to my brain. Please try again or check the console for details.' }
      ]);
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
            <h3>Chat Assistant</h3>
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
              type="text" 
              value={input} 
              onChange={handleInputChange} 
              onKeyPress={handleKeyPress}
              placeholder="Type your message..." 
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

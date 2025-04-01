import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever the chat history updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateResponse = async () => {
    if (question.trim() === '') return; // Don't send empty messages

    // Add user's question to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: 'user', content: question },
    ]);

    setQuestion(''); // Clear the input field

    // Add a temporary "Generating answer" message
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: 'bot', content: 'Generating answer...' },
    ]);

    const apiKey = import.meta.env.VITE_API_KEY;
    const url_gemini = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await axios({
        url: url_gemini,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const botResponse =
        response.data.candidates[0].content.parts[0].text;

      // Replace "Generating answer" with the actual response
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].content = botResponse;
        return newHistory;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Replace "Generating answer" with an error message
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].content =
          'Error generating response. Please try again.';
        return newHistory;
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="app-container">
      <h1>Chat AI</h1>
      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user' : 'bot'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything"
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <button onClick={generateResponse}>Send</button>
      </div>
    </div>
  );
}

export default App;

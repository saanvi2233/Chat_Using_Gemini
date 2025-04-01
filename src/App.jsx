import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// Axios is used for API calls
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState("");
  const [responseData, setResponseData] = useState(""); // State to store the response data

  async function generateResponse() {
    // console.log("Generating response...");
    setResponseData("Genearting answer"); // Set the response data to "Generating answer"
    const apiKey = import.meta.env.VITE_API_KEY; // Access the API key 
     const url_gemini = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; // Use template literals for the URL

    try {
      const response = await axios({
        url: url_gemini,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        data: {
          "contents": [{
            "parts": [{ "text":question }] // Use the question state variable
          }]
        }
      });
      setResponseData(response['data']['candidates'][0]['content']['parts'][0]['text']); // Log the response data
    } catch (error) {
      console.error('Error fetching data:', error); // Handle errors
    }
  }

  return (
    <>
    
      <h1>Chat AI</h1>
      <textarea value={question} 
      onChange={(e)=>setQuestion(e.target.value)} // Update the question state
      cols="30" rows="10" placeholder="Ask me anything" />
      <button onClick={generateResponse}>Generate Ans</button>
      {responseData && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre> {/* Display the response data */}
        </div>
      )}

      <p>{responseData}</p>
    </>
  );
}

export default App;
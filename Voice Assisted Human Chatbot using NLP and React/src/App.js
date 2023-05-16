import './App.css';
import React, { useState, useEffect, useRef } from "react";

const API_KEY = "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"; 

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function App() {
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  function processUserInput() {
    setOutput("Wait, I am thinking...");
    fetch(`https://api.openai.com/v1/completions`, {
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: " " + userInput,
        temperature: 0,
        max_tokens: 200,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            console.log(json);
            setOutput("");
            setBotResponse(json.choices[0].text);
            setIsSpeaking(true);
          });
        } else {
          setOutput(
            "There was some error when connecting GPT-3. Check your API key or retry later."
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setOutput(
          "There was some error when connecting GPT-3. Check your API key or retry later."
        );
      });
  }

  useEffect(() => {
    if (botResponse) {
      synthRef.current = window.speechSynthesis;
      const botSpeech = new SpeechSynthesisUtterance(botResponse);
      synthRef.current.speak(botSpeech);
      botSpeech.onend = () => {
        setIsSpeaking(false);
      };
    }
  }, [botResponse]);

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    setUserInput(speechToText);
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
    processUserInput();
  };

  const handleMicClick = () => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      recognition.start();
    } else {
      recognition.start();
    }
  };


  return (
    <div className='wrapper'>
      <div className='chatbot-container'>
        <h1>Voice Assisted Human ChatBot using NLP </h1>    
        <p>
          <input
            type="text"
            id="userInput"
            size="100"
            placeholder="Type your message here; for example Hello! Tell me about the Ramones."
            value={userInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                processUserInput();
              }
            }}
            onChange={(event) => setUserInput(event.target.value)}
          />
          
          <button onClick={processUserInput}>Send to bot</button>
        </p>
        <button onClick={handleMicClick}>Speak</button>
        {botResponse && (
          <>
            <p>Bot response: {botResponse}</p>
            <hr/>
          </>
          )}
        <p>{output}</p>
      </div>
    </div>
  );

}

export default App;






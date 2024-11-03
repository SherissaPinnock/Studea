import React, { useState, useEffect } from 'react';
import Conversation from './Conversation';
import Summary from './Summary';
import {assets} from '../assets/assets.js'
import '../css/Main.css'
import Navbar from './Navbar.js';

function Scenario() {
    const [scenario, setScenario] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showSummary, setShowSummary]= useState(false);
    const [buttonVisible, setButtonVisible] = useState(true);
    const [scenarioGenerated, setScenarioGenerated] = useState(false);
    const [timer, setTimer] = useState(30); // Timer for the round

    useEffect(() => {
        // Fetch a scenario when the component loads
        if (scenarioGenerated) {
            generateScenario();
        }
    }, [scenarioGenerated]);


    const generateScenario = async () => {
      try {
          const res = await fetch('/api/scenario', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ prompt: "Generate a 30 word or less scenario for a beginning Spanish speaker to practice conversation skills. The scenario should describe a situation, not a dialogue. The user will create their own dialogue based on the scenario." 
                // Clear cached scenario
              })
          });
          if (!res.ok) {
              throw new Error(`Server responded with ${res.status}`);
          }
          const data = await res.json();
          console.log(data);
          setScenario(data.scenario);
          setConversationHistory([]);
          setUserInput(''); 
          setInProgress(false);
          setShowSummary(false);


      } catch (error) {
          console.error('Failed to generate scenario', error);
      }
  };
  

    const handleUserResponse = async (userInput, scenario) => {
        if (!userInput) return;
    
        try {
            const response = await fetch('/api/conversation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userResponse: userInput,
                    scenario: scenario, // Pass scenario context to help with role-play
                    prompt: `Please role-play as if you are part of this scenario: ${scenario}. Respond as if you're a native Spanish speaker helping the user with their request.
                    Keep it friendly and in context` 
                })
            });
    
            if (response.status === 429) {
                alert('Rate limit exceeded. Please try again later.');
                return;
            }
    
            if (response.ok) {
                const data = await response.json();
                setConversationHistory([...conversationHistory, { user: userInput, ai: data.aiResponse }]);
                setUserInput(''); // Clear the input
            } else {
                console.error('Failed to get AI response');
            }
        } catch (error) {
            console.error('Error submitting user response:', error);
        }
    };    
    
    // Timer function to count down the round
    useEffect(() => {
        if (inProgress && timer > 0) {
            const countdown = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0) {
            setInProgress(false); // Stop interaction when time is up
            setShowSummary(true);
        }
    }, [inProgress, timer]);

    return (
        <div className="layout">
           <Navbar/>
            <div className="main">
               <div className='main-container'> 
                {/* Greeting Section */}
                {!scenarioGenerated && (
                    <div className='greeting'>
                    <div className="carousel">
                        <div className="pre"></div>
                        <div className="change_outer">
                            <div className="change_inner">
                                <div className="element">Conversing</div>
                                <div className="element">Listening</div>
                                <div className="element">Writing</div>
                                <div className="element">Reading</div>
                            </div>
                        </div>
                        <div className="post px-2">makes perfect...</div>
                    </div>
                
                    <h4>Your AI Spanish Role Player</h4>
                    <button className="button-74" role="button" onClick={() => setScenarioGenerated(true)}>Generate a Scenario</button>
                    <img className='lineart mt-5' src={assets.lineart2} alt="Lineart"/>
                </div>
                )}

                {/* Scenario Section: Only appears after generating the scenario */}
                {scenarioGenerated && (
                    <div className='scenario'>
                        <h2>Scenario</h2>
                        <p>{scenario}</p>

                        {buttonVisible && !inProgress ? (
                            <button
                                className="button-74"
                                onClick={() => {
                                    setInProgress(true);
                                    setTimer(30);
                                    setButtonVisible(false);
                                    setShowSummary(false);
                                }}>
                                Start Conversation
                            </button>
                        ) : (
                            <div>
                                <h3>Time Left: {timer}s</h3>
                                <Conversation
                                    conversationHistory={conversationHistory}
                                    handleUserResponse={handleUserResponse}
                                />
                            </div>
                        )}

                        {/* Show summary component when the timer reaches zero */}
                        {showSummary && (
                            <div>
                                <Summary conversationHistory={conversationHistory} />
                                <button onClick={() => generateScenario()}>New Scenario</button>
                            </div>
                        )}
                    </div>
                )}
            </div></div>
            <div className='footer'>Created by Sherissa Pinnock</div>
        </div>
    );
}

export default Scenario;

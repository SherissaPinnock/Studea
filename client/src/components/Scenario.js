import React, { useState, useEffect } from 'react';
import Conversation from './Conversation';
import Summary from './Summary';

function Scenario() {
    const [scenario, setScenario] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showSummary, setShowSummary]= useState('false');
    const [timer, setTimer] = useState(30); // Timer for the round

    useEffect(() => {
        // Fetch a scenario when the component loads
        generateScenario();
    }, []);


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
    }, [inProgress, timer, showSummary]);

    

    return (
        <div>
            <h2>Scenario</h2>
            <p>{scenario}</p>

            {!inProgress ? (
                <button className="startConversation" onClick={() => {setInProgress(true); setTimer(30); setShowSummary(false);}}>Start Conversation</button>
            ) : (
                <div>
                    <div>
                    <h3>Time Left: {timer}s</h3>
                    <Conversation
                        conversationHistory={conversationHistory}
                        handleUserResponse={handleUserResponse}
                    />
                    </div>
                </div>
            )}

            {/* Show summary component when the timer reaches zero */}
            {!showSummary && (
                <div>
                    <Summary conversationHistory={conversationHistory} />
                    <button onClick={generateScenario}>New Scenario</button>
                </div>
            )}
        </div>
    );
}

export default Scenario;

const express = require("express");
const { Configuration, OpenAIApi } = require("azure-openai");

const router = express.Router();
require('dotenv').config();

const openai = new OpenAIApi(
    new Configuration({
        azure: {
            apiKey: `${process.env.API_KEY}`, 
            endpoint: `${process.env.ENDPOINT}`,
            deploymentName: "gpt-35-turbo", 
        }
    })
    
);


//let cachedScenario = null; // Store the scenario 

router.post('/api/scenario', async (req, res) => {
    const prompt = req.body.prompt; // Pass 'resetCache' to clear cache

    try {
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        
        const response = await openai.createChatCompletion({
            messages: [
                { role: "system", content: "You are a fun, conversational AI assistant." },
                { role: "user", content: prompt }
            ]
        });

        const newScenario = response.data.choices[0].message.content;
        res.json({ scenario: newScenario });

    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.log("Rate limit exceeded. Please try again later.");
            return res.status(429).send("Too many requests. Please try again later.");
        } else {
            console.error('Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
});


// Conversation Route with Scenario Context
router.post('/api/conversation', async (req, res) => {
    const { userResponse, scenario } = req.body;
    if (!userResponse) {
        return res.status(400).json({ error: "User response is required" });
    }

    try {
        const response = await openai.createChatCompletion({
            messages: [
                { role: "system", content: `You are role-playing in the following scenario: "${scenario}". Stay in character and respond as a person in this scenario would (e.g., a vendor, customer, waiter, etc.). Speak in Spanish.` },
                { role: "user", content: userResponse }
            ]
        });

        const aiResponse = response.data.choices[0].message.content;
        res.json({ aiResponse });
    } catch (error) {
        console.error('Error from conversation:', error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

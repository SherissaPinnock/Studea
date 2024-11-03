const express = require('express');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');
const router = express.Router();

const speechKey = `${process.env.SPEECH_KEY}`;
const endpoint = `${process.env.SPEECH_ENDPOINT}`;
const serviceRegion = 'eastus';

router.post('/api/text-to-speech', (req, res) => {
    const text = req.body.text;
    
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechSynthesisLanguage = 'es-ES'; // Spanish (Spain)

    const audioFile = 'ai-audio-output.wav';
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
        text,
        result => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                console.log('Speech synthesized successfully.');
                // Return the audio file to the client
                res.sendFile(`${__dirname}/${audioFile}`);
            } else {
                console.error('Speech synthesis error: ', result.errorDetails);
                res.status(500).send('Error during speech synthesis.');
            }
            synthesizer.close();
        },
        error => {
            console.error('Speech synthesis error: ', error);
            synthesizer.close();
            res.status(500).send('Error during speech synthesis.');
        }
    );
});

module.exports=router;
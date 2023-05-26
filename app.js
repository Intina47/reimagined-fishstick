const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.use(express.json());


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/generate-meme', async (req,res) => {
    try{
        const { joke } = req.body;

        // compose the prompt for the meme generation
        const prompt = `Joke ${joke}\nMeme:`;

        // send a request to the OPENAI API
        const response = await axios.get('https://api.openai.com/v1/engines/davinci/completions', {
            prompt,
            max_tokens:50,
            temperature:0.7,
            n:1,
            stop: '\n',
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type':'application/json',
            },
        });

        // return an error if there is a problem with the api request
        if(response.status !== 200){
            return res.status(500).json({
                APIError: 'Sorry Something went wrong',
            });
        }
        console.log('================================');
        // Extract the generated mem text from the API response
        const generateMeme = response.data.choices[0].text.trim();

        // use the generated meme to create the meme image
        // const meme = await axios.post('https://api.imgflip.com/caption_image', {
        //     template_id: 181913649,
        //     username: 'imgflip_hubot',
        //     password: 'imgflip_hubot',
        //     text0: joke,
        //     text1: generateMeme,
        // });
        // return the generated meme image and meme itself
        res.json({
            // meme: meme.data.data.url,
            memeText: generateMeme,
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            Error: 'Something went wrong',
        });

    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
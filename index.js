require('dotenv').config();
const wppconnect = require('@wppconnect-team/wppconnect');
const { Configuration, OpenAIApi } = require("openai");

const GPT_INITIALIZATOR_RULE = 'gpt:'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handleGptResponse = async (message) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'user',
        content: message
      }
    ],
    temperature: 0.3
  });
  return response.data.choices[0].message.content;
}
wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage(async (message) => {
    if (message.body.slice(0, GPT_INITIALIZATOR_RULE.length).toLowerCase() == GPT_INITIALIZATOR_RULE.toLowerCase()) {
      const response = await handleGptResponse(message.body.slice(GPT_INITIALIZATOR_RULE.length))
      client
        .sendText(message.from, response)
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}
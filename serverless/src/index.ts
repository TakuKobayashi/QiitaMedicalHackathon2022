import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
import twilio from 'twilio';
const tilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VoiceResponse = twilio.twiml.VoiceResponse;

const toPhoneNumbers = ['+...', '+...'];
const fromPhoneNumber = '+...';

const app = fastify();

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.get('/send_message', async (request, reply) => {
  const messageResultPromises = [];
  for (const toPhoneNumber of toPhoneNumbers) {
    messageResultPromises.push(
      tilioClient.messages.create({
        body: 'オッス!!オラ悟空!!',
        from: fromPhoneNumber,
        to: toPhoneNumber,
      }),
    );
  }
  const messageResults = await Promise.all(messageResultPromises);
  return messageResults;
});

app.get('/call', async (request, reply) => {
  const twiml = new VoiceResponse();
  twiml.say(
    {
      language: 'ja-JP',
      voice: 'woman',
    },
    'オッス!!オラゴクウ!!',
  );
  const callResultPromises = [];
  for (const toPhoneNumber of toPhoneNumbers) {
    callResultPromises.push(
      tilioClient.calls.create({
        twiml: twiml.toString(),
        from: fromPhoneNumber,
        to: toPhoneNumber,
      }),
    );
  }
  const callResults = await Promise.all(callResultPromises);
  return callResults;
});

export const handler = awsLambdaFastify(app);

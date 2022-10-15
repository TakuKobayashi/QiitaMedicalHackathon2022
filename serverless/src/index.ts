import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
import twilio from 'twilio';
const tilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VoiceResponse = twilio.twiml.VoiceResponse;

const app = fastify();

app.get('/', async (request, reply) => {
  return { hello: 'world' };
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
  const toPhoneNumbers = ['+...', '+...'];
  for (const toPhoneNumber of toPhoneNumbers) {
    callResultPromises.push(
      tilioClient.calls.create({
        twiml: twiml.toString(),
        from: '+...',
        to: toPhoneNumber,
      }),
    );
  }
  const callResults = await Promise.all(callResultPromises);
  return callResults;
});

export const handler = awsLambdaFastify(app);

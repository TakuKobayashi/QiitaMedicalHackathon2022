import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
import twilio from 'twilio';
const tilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = fastify();

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

export const handler = awsLambdaFastify(app);

import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
// https://www.serverless.com/examples/aws-node-puppeteer

const app = fastify();

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

export const handler = awsLambdaFastify(app);

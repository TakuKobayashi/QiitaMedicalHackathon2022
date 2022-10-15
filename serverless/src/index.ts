import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
import twilio from 'twilio';
import { Sequelize, Model, DataTypes } from 'sequelize';

import { adminRouter } from './routes/admins/crud';
import { twilioRouter } from './routes/webhooks/twilio';

/*
const sequelize = new Sequelize({
  host: "localhost",
  dialect: 'mysql',
  database: "hackathon_portal_development",
  username: "root",
  password: null,
  logging: true,
});

class PromoteUser extends Model {}
PromoteUser.init({
  // Modelの定義 & カラム情報の定義
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
  screen_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  follower_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  follow_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  sequelize,
  // Table名を直接指定する場合はこうする
  tableName: "promote_users",
  // createdAtやupdatedAtを指定したくない場合はtimestamps: falseを指定する
  timestamps: false,
});
*/

const tilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VoiceResponse = twilio.twiml.VoiceResponse;

const toPhoneNumbers = ['+...', '+...'];
const fromPhoneNumber = '+...';

const app = fastify();

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.get('/dbcheck', async (request, reply) => {
//  const promote_user = await PromoteUser.findOne({ where: { id: 1597223525203449 } })
//  console.log(promote_user)
//  console.log(promote_user.id)
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

app.register(adminRouter, { prefix: '/admin' });
app.register(twilioRouter, { prefix: '/webhooks/twilio' });

export const handler = awsLambdaFastify(app);

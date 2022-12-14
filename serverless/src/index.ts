import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
import twilio from 'twilio';
import { Sequelize, Model, DataTypes } from 'sequelize';
import cors from '@fastify/cors'

import { setupFireStore } from './common/firestore';
const firestore = setupFireStore();

import { adminRouter } from './routes/admins';
import { twilioRouter } from './routes/webhooks/twilio';
import { sensorsVitalRouter } from './routes/sensors/vitals';

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

const fromPhoneNumber = '+16293006557';

const app = fastify();
app.register(cors, {
  origin: (origin, cb) => {
    cb(null, true)
  }
});

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
  const toPhoneNumbers = await loadToPhoneNumbers();
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
  const toPhoneNumbers = await loadToPhoneNumbers();
  const callResultPromises = [];
  //const currentBaseUrl = [request.protocol + '://' + request.hostname, request.awsLambda.event.requestContext.stage].join('/');
  const currentBaseUrl = ['https://' + request.hostname, request.awsLambda.event.requestContext.stage].join('/');
  for (const toPhoneNumber of toPhoneNumbers) {
    callResultPromises.push(
      tilioClient.calls.create({
        twiml: twiml.toString(),
        from: fromPhoneNumber,
        to: toPhoneNumber,
        statusCallback: currentBaseUrl + '/webhooks/twilio/call_handler',
        statusCallbackMethod: 'POST',
      }),
    );
  }
  const callResults = await Promise.all(callResultPromises);
  return callResults;
});

async function loadToPhoneNumbers(): Promise<string[]> {
  const currentDocList = await firestore.collection("patient_relation_contacts").get();
  const docsDataList: string[] = []
  const currentDocs = currentDocList.docs
  for(const doc of currentDocs){
    docsDataList.push(doc.data().phone_number.toString())
  }
  return docsDataList;
}

app.register(adminRouter, { prefix: '/admin' });
app.register(sensorsVitalRouter, { prefix: '/sensors/vital' });
app.register(twilioRouter, { prefix: '/webhooks/twilio' });

export const handler = awsLambdaFastify(app);

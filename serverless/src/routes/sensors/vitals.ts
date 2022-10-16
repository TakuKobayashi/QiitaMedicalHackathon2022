import crypto from "crypto"
import { setupFireStore } from '../../common/firestore';
const firestore = setupFireStore();

import twilio from 'twilio';
const tilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VoiceResponse = twilio.twiml.VoiceResponse;
const fromPhoneNumber = '+16293006557';

const tableName = "patient_vital";
let currentBaseUrl = "";

export async function sensorsVitalRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello sensor');
  });
  app.get('/check', async (req, res) => {
    currentBaseUrl = ['https://' + req.hostname, req.awsLambda.event.requestContext.stage].join('/')
    await checkNotification();
    return {status: "ok"}
  });
  app.post('/record', async (req, res) => {
    console.log(req.body);
    currentBaseUrl = ['https://' + req.hostname, req.awsLambda.event.requestContext.stage].join('/')
    const recordId = crypto.randomBytes(12).toString('hex')
    const currentDoc = await firestore.collection(tableName).doc(recordId);
    // vital_type = 1 心拍数
    // 計測するバイタルデータのtypeと値を基本的に記録する
    const newData = {
      ...req.body,
      patient_id: "test-patient-id", id: recordId, created_at: new Date().getTime()
    }
    await currentDoc.set(newData);
    await checkNotification();
    return newData
  });
}

// 直近5分間の心拍数の傾向から
async function checkNotification(){
  const currentDocList = await firestore.collection(tableName).get();
  let alertScore = 0;
  // この数字を下回り続けたらその分だけアラートを飛ばす可能性を上げる
  const alertBaseScore = 100;
  for(const doc of currentDocList.docs){
    const sensorData = doc.data();
    // vital_type = 1 心拍数
    if(sensorData.vital_type == 1){
      // 心拍数が100を下回った
      alertScore = alertScore + Math.max(alertBaseScore - sensorData.value, 0)
    }
  }
  const smsAlertThreshold = 20;
  const callAlertThreshold = 40;
  if(smsAlertThreshold < alertScore && alertScore <= callAlertThreshold){
    await sendSMSMessage("【ちょっとあぶないかも】小林拓さんの心拍数が下がっています!!")
  }else if(callAlertThreshold < alertScore){
    await sendCall("【危険】小林拓さんの心拍数が下がっています!!")
  }
}

async function sendSMSMessage(meesage: string){
  const toPhoneNumbers = await loadToPhoneNumbers();
  const messageResultPromises = [];
  for (const toPhoneNumber of toPhoneNumbers) {
    messageResultPromises.push(
      tilioClient.messages.create({
        body: meesage,
        from: fromPhoneNumber,
        to: toPhoneNumber,
      }),
    );
  }
  const messageResults = await Promise.all(messageResultPromises);
  return messageResults;
};

async function sendCall(meesage: string){
  const twiml = new VoiceResponse();
  twiml.say(
    {
      language: 'ja-JP',
      voice: 'woman',
    },
    meesage,
  );
  const toPhoneNumbers = await loadToPhoneNumbers();
  const callResultPromises = [];
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
}

async function loadToPhoneNumbers(): Promise<string[]> {
  const currentDocList = await firestore.collection("patient_relation_contacts").get();
  const docsDataList: string[] = []
  const currentDocs = currentDocList.docs
  for(const doc of currentDocs){
    docsDataList.push(doc.data().phone_number.toString())
  }
  return docsDataList;
}
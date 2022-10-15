import formbody from '@fastify/formbody'

export async function twilioRouter(app, opts): Promise<void> {
  app.register(formbody);
  app.get('/', async (req, res) => {
    res.send('hello twilio');
  });
  app.post('/call_handler', async (req, res) => {
// req.bodyには以下のようなデータが送られてくる
/*
Empty <[Object: null prototype] {}> {
  Called: '+...',
  ToState: '',
  CallerCountry: 'US',
  Direction: 'outbound-api',
  Timestamp: 'Sat, 15 Oct 2022 19:05:44 +0000',
  CallbackSource: 'call-progress-events',
  SipResponseCode: '200',
  CallerState: 'TN',
  ToZip: '',
  SequenceNumber: '0',
  CallSid: '...',
  To: '+...',
  CallerZip: '',
  ToCountry: 'JP',
  CalledZip: '',
  ApiVersion: '2010-04-01',
  CalledCity: '',
  CallStatus: 'completed',
  Duration: '1',
  From: '+...',
  CallDuration: '4',
  AccountSid: '...',
  CalledCountry: 'JP',
  CallerCity: 'Nashville',
  ToCity: '',
  FromCountry: 'US',
  Caller: '+...',
  FromCity: 'Nashville',
  CalledState: '',
  FromZip: '',
  FromState: 'TN'
}
*/
    console.log(req.body);
    res.send('ok');
  });
}
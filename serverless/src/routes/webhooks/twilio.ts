export async function twilioRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello twilio');
  });
  app.post('/send_handler', async (req, res) => {
    console.log(req.body);
    res.send('ok');
  });
}
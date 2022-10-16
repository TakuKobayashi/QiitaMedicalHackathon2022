export async function sensorsVitalRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello sensor');
  });
  app.get('/list', async (req, res) => {
    res.send('hello admin');
  });
  app.post('/record', async (req, res) => {
    console.log(req.body);
    res.send('ok');
  });
}
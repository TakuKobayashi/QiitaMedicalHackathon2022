export async function userVitalAdminRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello admin');
  });
  app.get('/list', async (req, res) => {
    res.send('hello admin');
  });
}
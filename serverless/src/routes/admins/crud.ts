export async function adminRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello admin');
  });
  // 電話番号の登録
  app.post('/register', async (req, res) => {
    console.log(req.body);
    res.send('ok');
  });
  // 電話番号の削除
  app.post('/remove', async (req, res) => {
    console.log(req.body);
    res.send('ok');
  });
  // 電話番号の変更
  app.post('/update', async (req, res) => {
    console.log(req.body);
    res.send('ok');
  });
}
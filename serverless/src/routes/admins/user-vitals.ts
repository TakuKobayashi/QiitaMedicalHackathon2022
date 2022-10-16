import { setupFireStore } from '../../common/firestore';
const firestore = setupFireStore();

const tableName = "patient_vital";

export async function userVitalAdminRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello admin');
  });
  app.get('/list', async (req, res) => {
    const currentDocList = await firestore.collection(tableName).get();
    const docsDataList = []
    const currentDocs = currentDocList.docs
    for(const doc of currentDocs){
      docsDataList.push(doc.data())
    }
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header("X-Total-Count", docsDataList.length.toString());
    return docsDataList;
  });
}
import crypto from "crypto"
import { setupFireStore } from '../../common/firestore';
const firestore = setupFireStore();

const tableName = "patient_relation_contacts";

export async function userInfoAdminRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    return {status: "ok"}
  });
  app.get('/list', async (req, res) => {
    const currentDocList = await firestore.collection(tableName).get();
    const docsDataList = []
    const currentDocs = currentDocList.docs
    for(const doc of currentDocs){
      docsDataList.push(doc.data())
    }
    res.header("x-total-count", docsDataList.length.toString());
    return docsDataList;
  });
  // 電話番号の登録
  app.post('/create', async (req, res) => {
    console.log(req.body);
    const contactId = crypto.randomBytes(12).toString('hex')
    const currentDoc = await firestore.collection(tableName).doc(contactId);
    const newData = {...req.body,
      contact_id: contactId, created_at: new Date().getTime()
    }
    await currentDoc.set(newData);
    return newData;
  });
  // 電話番号の削除
  app.post('/delete', async (req, res) => {
    console.log(req.body);
    const currentDoc = await firestore.collection(tableName).doc(req.body.contact_id);
    await currentDoc.delete();
    return {status: "ok"}
  });
  // 電話番号の変更
  app.post('/update', async (req, res) => {
    console.log(req.body);
    const currentDoc = await firestore.collection(tableName).doc(req.body.contact_id);
    await currentDoc.set(req.body);
    return req.body
  });
}
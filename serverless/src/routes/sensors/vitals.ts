import crypto from "crypto"
import { setupFireStore } from '../../common/firestore';
const firestore = setupFireStore();

const tableName = "patient_vital";

export async function sensorsVitalRouter(app, opts): Promise<void> {
  app.get('/', async (req, res) => {
    res.send('hello sensor');
  });
  app.post('/record', async (req, res) => {
    console.log(req.body);
    const recordId = crypto.randomBytes(12).toString('hex')
    const currentDoc = await firestore.collection(tableName).doc(recordId);
    // vital_type = 1 心拍数
    // 計測するバイタルデータのtypeと値を基本的に記録する
    const newData = {
      ...req.body,
      patient_id: "test-patient-id", id: recordId, created_at: new Date().getTime()
    }
    await currentDoc.set(newData);
    return newData
  });
}
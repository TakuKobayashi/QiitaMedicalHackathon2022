import { userInfoAdminRouter } from './user-info';
import { userVitalAdminRouter } from './user-vitals';

import cors from '@fastify/cors'

export async function adminRouter(app, opts): Promise<void> {
  app.register(cors, {
    origin: (origin, cb) => {
      cb(null, true)
    }
  });
  app.register(userInfoAdminRouter, { prefix: '/user_info' });
  app.register(userVitalAdminRouter, { prefix: '/user_vital' });
}
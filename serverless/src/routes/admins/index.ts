import { userInfoAdminRouter } from './user-info';
import { userVitalAdminRouter } from './user-vitals';

export async function adminRouter(app, opts): Promise<void> {
  app.register(userInfoAdminRouter, { prefix: '/user_info' });
  app.register(userVitalAdminRouter, { prefix: '/user_vital' });
}
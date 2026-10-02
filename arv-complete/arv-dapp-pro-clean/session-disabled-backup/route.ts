import { authConfigured, hasDevice, isAdminRequest, json } from '@/lib/server/admin-auth';

export async function GET(req: Request) {
  return json({
    admin: isAdminRequest(req),
    device: hasDevice(req),
    configured: authConfigured(),
  });
}

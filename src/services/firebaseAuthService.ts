export interface VerifiedFirebaseIdentity {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export const verifyFirebaseIdToken = async (idToken: string): Promise<VerifiedFirebaseIdentity> => {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is required.');

  const [{ applicationDefault, getApps, initializeApp }, { getAuth }] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/auth'),
  ]);
  const app = getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId,
  });
  const decoded = await getAuth(app).verifyIdToken(idToken);
  if (!decoded.email) throw new Error('Firebase token does not contain an email.');
  return {
    uid: decoded.uid,
    email: decoded.email,
    emailVerified: decoded.email_verified === true,
  };
};

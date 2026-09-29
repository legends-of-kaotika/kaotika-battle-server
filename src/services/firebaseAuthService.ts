export interface VerifiedFirebaseIdentity {
  uid: string;
  email: string;
  emailVerified: boolean;
}

const FIREBASE_PROJECT_ID = 'kaotika-final-battle';

export const verifyFirebaseIdToken = async (idToken: string): Promise<VerifiedFirebaseIdentity> => {
  const [{ applicationDefault, getApps, initializeApp }, { getAuth }] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/auth'),
  ]);
  const app = getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId: FIREBASE_PROJECT_ID,
  });
  const decoded = await getAuth(app).verifyIdToken(idToken);
  if (!decoded.email) throw new Error('Firebase token does not contain an email.');
  return {
    uid: decoded.uid,
    email: decoded.email,
    emailVerified: decoded.email_verified === true,
  };
};

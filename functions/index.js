import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

initializeApp();

export const getWaitlistCount = onCall({ region: 'us-central1' }, async () => {
  try {
    const result = await getFirestore()
      .collection('waitlist')
      .count()
      .get();

    return { count: result.data().count };
  } catch (error) {
    console.error('Unable to retrieve waitlist count:', error);
    throw new HttpsError('internal', 'Unable to load waitlist count.');
  }
});

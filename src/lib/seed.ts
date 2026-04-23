import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function seedMockUsers() {
  const mockUsers = [
    {
      uid: "mock_user_1",
      email: "baker.smith@example.com",
      displayName: "John Baker",
    },
    {
      uid: "mock_user_2",
      email: "cake.queen@example.com",
      displayName: "Sarah Sweet",
    },
    {
      uid: "mock_user_3",
      email: "dough.boy@example.com",
      displayName: "Cookie Dough",
    }
  ];

  for (const user of mockUsers) {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Seeded user: ${user.displayName}`);
    } catch (err) {
      console.error(`Error seeding user ${user.uid}:`, err);
    }
  }
}

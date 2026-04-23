import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    let serviceAccount;
    const rawData = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    
    // Check if it starts with 'var admin' which means user copied the wrong thing
    if (rawData.startsWith('var admin')) {
      throw new Error("You copied the Node.js code snippet instead of the JSON key file. Please download the .json file from Firebase and copy its content.");
    }
    
    serviceAccount = JSON.parse(rawData);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (e: any) {
    console.error("❌ Firebase Admin Initialization Error:");
    console.error(e.message);
    console.error("Tip: Ensure FIREBASE_SERVICE_ACCOUNT contains the RAW JSON content from your service account key file.");
  }
} else {
  // Fallback for local dev if ADC is available
  try {
    admin.initializeApp();
  } catch (e) {
    console.warn("Firebase Admin not initialized. Admin features will be disabled.");
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/admin/reset-password", async (req, res) => {
    const { targetUid, newPassword, adminToken } = req.body;

    if (!targetUid || !newPassword || !adminToken) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Verify the admin token
      const decodedToken = await admin.auth().verifyIdToken(adminToken);
      
      // Check if user is admin (hardcoded for the provided user email or check custom claims)
      const isAdmin = decodedToken.email === "dinethlewkebandara@gmail.com";
      
      // Alternatively, check Firestore for admin rank
      // const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
      // if (!userDoc.data()?.isAdmin) throw new Error("Forbidden");

      if (!isAdmin) {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      // Update user password
      await admin.auth().updateUser(targetUid, {
        password: newPassword
      });

      res.json({ message: "Password updated successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

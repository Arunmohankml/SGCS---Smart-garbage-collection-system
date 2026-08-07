import admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (adminApp) return adminApp;

  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountRaw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT not set. Copy .env.example to .env.local."
    );
  }

  // The env var may contain actual newlines (from copying a JSON file).
  // JSON.parse can't handle literal newlines inside string values, so we
  // normalize them to the \n escape sequence that JSON expects.
  const normalized = serviceAccountRaw.replace(/\r?\n/g, "\\n");
  const parsed = JSON.parse(normalized) as admin.ServiceAccount;

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(parsed),
  });
  return adminApp;
}

export function getMessaging(): admin.messaging.Messaging {
  return getFirebaseAdmin().messaging();
}

export async function sendResolutionNotification(
  token: string,
  issueRef: string
): Promise<string> {
  const message: admin.messaging.Message = {
    token,
    data: {
      issueRef,
      title: "CivicEye Update",
      body: `Your report ${issueRef} has been updated.`,
    },
    webpush: {
      fcmOptions: {
        link: `${process.env.NEXT_PUBLIC_APP_URL}/issues/${issueRef}`,
      },
    },
  };
  return getMessaging().send(message);
}
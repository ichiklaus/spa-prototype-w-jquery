import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import usersConfig from "@/db/db-config.json";

const hostname = location.hostname;
const ENVIROMENT = hostname === "localhost" || hostname === "127.0.0.1" ? "dev" : "prod";
let frebaseConfig = ENVIROMENT === "dev" ? usersConfig.development : usersConfig.production;

// Initialize firebase
const firebaseApp = initializeApp(usersConfig.development);

// Initialize auth && firestore with the 'firebaseApp' property
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage();
export { firebaseApp, auth, db, storage };

import { db, auth } from '@/db/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { processDocument } from "@/libs/helper";
import { isAuthenticatedUser } from "@/libs/auth";

async function setHomeProps() {
  const isSignedIn = await isAuthenticatedUser();
  let props = { isSignedIn };

  return props;
}

export { setHomeProps };

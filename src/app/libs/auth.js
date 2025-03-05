import { auth, db } from '@/db/firebase-config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { redirectUrl } from "@/libs/helper";
import { routePaths } from '@/config/routesDefinition';

import Swal from "sweetalert2";
import "bootstrap";

let idleInterval;
let idleTime = 0;
let pageName = window.location.pathname;

function onInitLoggedInApp() {
  let isOffline = false;

  let signedIn = false;

  if (isOffline) {
    return new Promise((resolve, reject) => {
      // User is signed in
      signedIn = true;
      resolve({ signedIn, username: "John Doe" });

      if (pageName.includes(routePaths.auth)) {
        Swal.fire({
          title: "<strong>Logging In... Please Wait</strong>",
          iconHtml: `<i class="fas fa-spinner fa-spin"></i>`,
          customClass: {
            icon: "no-border",
          },
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      }
    });
  }

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const username = `${userData.firstname} ${userData.lastname}`;
        // User is signed in
        signedIn = true;
        resolve({ signedIn, username });
        if (pageName.includes(routePaths.auth)) {
          Swal.fire({
            title: "<strong>Logging In... Please Wait</strong>",
            iconHtml: `<i class="fas fa-spinner fa-spin"></i>`,
            customClass: {
              icon: "no-border",
            },
            allowOutsideClick: false,
            showConfirmButton: false,
          });
        }

        if (user.email) {
          idleInterval = setInterval(
            function (userPassing) {
              if (userPassing) {
                // console.log("increasing iddle Time" + idleTime);
                idleTime = idleTime + 1;
                if (idleTime >= 60000) {
                  popLogout();
                } else {
                  return;
                }
              }
            },
            2000,
            user
          );
        } else {
          logout(idleInterval);
        }
      } else {
        // No user signed in
        signedIn = false;
        resolve({ signedIn });
        if (!pageName.includes(routePaths.auth)) {
          await redirectUrl(routePaths.login);
        }

        clearInterval(idleInterval);
      }
    });
  });
}

async function isAuthenticatedUser() {
  let isOffline = true;
  if (isOffline) {
    return new Promise((resolve, reject) => {
      let isSignedIn = true;
      resolve(isSignedIn);
    });
  }

  return new Promise((resolve, reject) => {
    let isSignedIn = false;

    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        isSignedIn = true;
        resolve(isSignedIn);
      } else {
        // No user signed in
        isSignedIn = false;
        resolve(isSignedIn);
      }
    });
  });
}

// Sign out
const logout = async () => {
  clearInterval(idleInterval);

  await signOut(auth)
    .then(async () => {
      console.log("User signed out");
      await redirectUrl(routePaths.auth);
    })
    .catch((error) => {
      console.error("There was an error signing out");
    });
};

const popLogout = async () => {
  $("#logoutModal").modal("show");
  setTimeout(function () {
    logout();
  }, 5000);
};

export { onInitLoggedInApp, isAuthenticatedUser, logout, popLogout };

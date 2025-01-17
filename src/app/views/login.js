import $ from "jquery";
import "bootstrap";
import moment from "moment";
import Swal from "sweetalert2";
import { auth, db } from "@/db/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { onInitLoggedInApp } from "@/libs/auth";
import { routePaths } from '@/config/routesDefinition';
import {
  colorConfig as colors,
  validateEmail,
  redirectUrl,
  myToast,
  getFormValidation,
} from "@/libs/helper";

let signedIn = false;
let idleInterval;
let idleTime = 0;
let pageName = window.location.pathname;
let userDetails = {};
let isAutoLogin = true;
const pathSegment = pageName.split("/");
const pathnameLastSegment = pathSegment[pathSegment.length - 1].toString().split(".")[0].toString();

export default function initLogin() {
  const email = $("#email");
  const password = $("#password");
  const loginForm = $("#login-form");

  getFormValidation("#login-form");

  onInitLoggedInApp().then(async ({ signedIn }) => {
    console.log("🚀 ~ onInitLoggedInApp ~ signedIn:", signedIn);
    if (signedIn === true) {
      Swal.fire({
        title: "<strong>You are already logged in. Redirecting...</strong>",
        iconHtml: `<i class="fas fa-spinner fa-spin"></i>`,
        customClass: {
          icon: "no-border",
        },
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      setTimeout(async () => {
        await redirectUrl(routePaths.dashboard);
      }, 1000);
    }
  });

  loginForm.on("submit", function (event) {
    event.preventDefault();
    const isValidFormFields = verifyFormFields({ email, password });
    if (isValidFormFields) {
      signInWithEmail(email.val(), password.val());
    }
  });
}

// Sign in with Email and password
const signInWithEmail = async (email, password) => {
  let currentUser = auth.currentUser;
  if (!currentUser) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("registered user logged in");
      const currentUser = userCredential.user;
      const uid = currentUser.uid;
      isAutoLogin = false;
      userDetails = { lastLoginAt: Timestamp.fromDate(new Date(moment(currentUser.metadata.lastSignInTime))) };
      console.log(": ", currentUser.metadata.lastSignInTime);
      // TODO: Update Firestore user data upon login
      const userRef = doc(db, "users", uid);
      await setDoc(
        userRef,
        { lastLoginAt: Timestamp.fromDate(new Date(moment(currentUser.metadata.lastSignInTime))) },
        { merge: true }
      );
      onInitLoggedInApp().then(async ({ signedIn }) => {
        console.log("🚀 ~ onInitLoggedInApp ~ signedIn:", signedIn);
        if (signedIn === true) {
          await redirectUrl(routePaths.dashboard);
        }
      });

      return currentUser;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "<strong>Error authenticating</strong>",
        text: "Please check that your credentials are correct. Or try creating an account.",
        icon: `error`,
        allowOutsideClick: true,
        showConfirmButton: true,
        confirmButtonText: "Create Account",
        showCancelButton: true,
        cancelButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          location.href = routePaths.register;
        }
      });
    }
  }
};

const verifyFormFields = (props) => {
  let validFields = false;

  if (props.email.val() === "") {
    myToast({ message: "Who are you mister anonymous? 🤔", background: "#DE636F" });
  } else if (validateEmail(props.email.val()) === false) {
    myToast({ message: "Please provide a valid email address.", background: "#DE636F" });
  } else if (props.password.val() === "") {
    myToast({ message: "Hey! I need your password... Promise, I won't share it with anyone🤐", background: "#DE636F" });
  } else {
    myToast({ message: "You are incredible 😉", background: "linear-gradient(to right, #00b09b, #96c93d)" });
    validFields = true;
  }

  return validFields;
};

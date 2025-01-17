import $, { error } from "jquery";
import moment from "moment";
import "bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/db/firebase-config";
import { onInitLoggedInApp } from "@/libs/auth";
import { routePaths } from '@/config/routesDefinition';
import {
  colorConfig as colors,
  validateEmail,
  redirectUrl,
  myToast,
  getFormValidation,
} from "@/libs/helper";
import Swal from "sweetalert2";

let signedIn = false;
let pageName = window.location.pathname;
const pathSegment = pageName.split("/");
const pathnameLastSegment = pathSegment[pathSegment.length - 1].toString().split(".")[0].toString();

export default function initRegister() {
  const firstname = $("#firstname");
  const lastname = $("#lastname");
  const email = $("#email");
  const password = $("#password");
  const confirmPassword = $("#confirm-password");
  const signupForm = $("#signup-form");

  getFormValidation("#signup-form");

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

  signupForm.on("submit", function (event) {
    event.preventDefault();
    const isValidFormFields = verifyFormFields({ firstname, lastname, email, password, confirmPassword });
    if (isValidFormFields) {
      createWithEmailAndPassword({
        email: email.val(),
        password: password.val(),
        firstname: firstname.val(),
        lastname: lastname.val(),
      });
    }
  });
}

const createWithEmailAndPassword = async ({ email, password, firstname, lastname }) => {
  let currentUser = auth.currentUser;
  if (currentUser) {
    Swal.close();
    logout();
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    console.log("🚀 ~ createWithEmailAndPassword ~ currentUser:", currentUser);
    const uid = currentUser.uid;

    await setDoc(doc(db, "users", uid), {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      createdAt: Timestamp.fromDate(new Date(moment(currentUser.metadata.creationTime))),
      lastLoginAt: Timestamp.fromDate(new Date(moment(currentUser.metadata.lastSignInTime))),
    });
    onInitLoggedInApp().then(async ({ signedIn }) => {
      console.log("🚀 ~ onInitLoggedInApp ~ signedIn:", signedIn);
      if (signedIn === true) {
        await redirectUrl(routePaths.dashboard);
      }
    });

    return currentUser;
  } catch (error) {
    console.log(error);
  }
};

const verifyFormFields = (props) => {
  let validFields = false;

  if (props.firstname.val() === "") {
    myToast({ message: "Please give me your first name.", background: "#DE636F" });
  } else if (props.lastname.val() === "") {
    myToast({ message: "Pease give me your last name.", background: "#DE636F" });
  } else if (props.email.val() === "") {
    myToast({ message: "I need your email address to create your account.", background: "#DE636F" });
  } else if (validateEmail(props.email.val()) === false) {
    myToast({ message: "Please provide a valid email address.", background: "#DE636F" });
  } else if (props.password.val() === "") {
    myToast({ message: "Please provide a password.", background: "#DE636F" });
  } else if (props.password.val().length < 8) {
    myToast({ message: "Your password must have at least 8 characters", background: "#DE636F" });
  } else if (props.confirmPassword.val() !== props.password.val()) {
    myToast({ message: "Your passwords don't match", background: "#DE636F" });
  } else {
    myToast({ message: "You are incredible 😉", background: "linear-gradient(to right, #00b09b, #96c93d)" });
    validFields = true;
  }

  return validFields;
};

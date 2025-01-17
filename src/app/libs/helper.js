import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { routePaths } from '@/config/routesDefinition';

const colorConfig = {
  prmColor: "#95a3ea",
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const getFormValidation = (formElement) => {
  "use strict";
  const form = document.querySelector(`${formElement}`);

  // Loop over them and prevent submission
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    },
    false
  );
};

function areAllFieldsNotEmpty(formId) {
  const form = document.querySelector(formId);
  const formElements = form.querySelectorAll("input, select, textarea");

  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];

    if (element.hasAttribute("required") && (!element.value.trim() || formElements[i].value === "null")) {
      return false;
    }
  }

  return true;
}

function resetForm(formId) {
  const form = document.querySelector(formId);
  form.reset();
  form.classList.remove("was-validated");
}

async function redirectUrl(str) {
  location.href = str ?? routePaths.login;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function processDocument(doc) {
  let data = [];
  for (let key in doc) {
    if (Object.prototype.hasOwnProperty.call(doc, key)) {
      if (isObject(doc[key])) {
        let objWithKey = { id: key, data: doc[key] };
        data.push(objWithKey);
      }
    }
  }

  return data;
}

// function Toast
const myToast = ({ message, background = colorConfig.prmColor, duration = 3000 }) => {
  Toastify({
    text: message,
    duration: duration,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background,
    },
  }).showToast();
};

const getCurrentRoute = () => `${location.pathname}${location.hash}`;

const getEmptyInlineMessage = ({ message = "", tag = "p" }) => {

  const _renderMessage = (children, tag) =>  {
    const tags = {
      "p": `<p>${children}</p>`,
      "div": `<div>${children}</div>`,
    };

    return tags[tag];
  };

  return _renderMessage(message, tag);
}

export {
  colorConfig,
  validateEmail,
  getFormValidation,
  areAllFieldsNotEmpty,
  redirectUrl,
  resetForm,
  isObject,
  processDocument,
  myToast,
  getCurrentRoute,
  getEmptyInlineMessage,
};

console.log("init index.js");
import $ from "jquery";
import { Router, Routes } from "@/config/router";
import { redirectUrl } from "@/libs/helper";
import { routePaths, viewsUrls } from "@/config/routesDefinition";
import { onInitLoggedInApp, logout } from "@/libs/auth";

/* Components */
import Header from "@/components/header";

// Custom scripts for views
import initLogin from "@/views/login";
import initRegister from "@/views/register";
import initHome from "@/views/home";

// Props middlewares
import { setHomeProps } from "@/helpers/propHelpers";

let pageName = window.location.pathname;

$(document).ready(function () {
  if (pageName !== "/auth" || pageName === "/auth/") {
    onInitLoggedInApp().then(async ({ signedIn, username }) => {
      // Define the common routes
      initApp({ isSignedIn: signedIn, username });
    });
  }

  const commonRoutes = [
    // Default rroutes (auth views)
    new Routes(
      {
        path: routePaths.index,
        urlView: viewsUrls.login,
      },
      true,
      () => initLogin()
    ),
    new Routes(
      {
        path: routePaths.auth,
        urlView: viewsUrls.login,
      },
      true,
      () => initLogin()
    ),
    new Routes(
      {
        path: routePaths.login,
        urlView: viewsUrls.login,
      },
      true,
      () => initLogin()
    ),
    new Routes(
      {
        path: routePaths.register,
        urlView: viewsUrls.register,
      },
      false,
      () => initRegister()
    ),
    // Routes for dashboard views
    new Routes(
      {
        path: routePaths.dashboard,
        urlView: viewsUrls.home,
      },
      true,
      () => initHome(setHomeProps())
    ),
  ];

  // Adjust the route configuration based on the value of signedIn
  const routeConfig = commonRoutes;

  // Create the router instance
  new Router(routeConfig, "app");
});

function initApp(props) {
  const header = $("#header");
  const headerHTML = Header({ isSignedIn: props.isSignedIn, username: props.username });
  header.html(headerHTML);

  const loginBtn = $(".loginBtn");
  const signupBtn = $(".signupBtn");
  const logoutBtn = $(".logoutBtn");

  if (props.isSignedIn) {
    logoutBtn.on("click", function () {
      console.log("is logging out");
      logout();
    });
  } else {
    loginBtn.on("click", function () {
      redirectUrl(routePaths.login);
    });

    signupBtn.on("click", function () {
      redirectUrl(routePaths.register);
    });
  }
}

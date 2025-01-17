import $ from "jquery";
import { routePaths } from "@/config/routesDefinition";
import { redirectUrl } from "@/libs/helper";

export class Router {
  constructor(routes, routeElement) {
    this.routes = routes;
    this.routeElement = document.getElementById(routeElement);
    this.initialize();
    this.hashChanged();
  }

  initialize() {
    window.addEventListener("hashchange", () => {
      this.hashChanged();
    });
  }

  destroy() {
    window.removeEventListener("hashchange", this.hashChangedHandler);
  }

  hashChanged() {
    const locationHash = `${window.location.pathname}${window.location.hash}`;
    console.log(locationHash);
    if (locationHash === routePaths.notFound) {
        return;
    }
    
    let isRouteMatched = false;
    let routesDict = {};
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      routesDict[route.viewObj.path] = true;
      let isActiveRoute = route.isActiveRoute(locationHash);
      if (isActiveRoute) {
        isRouteMatched = true;
        console.log("isRouteMatched: ", isRouteMatched);
        this.navigate(route.viewObj.urlView, route.init);
        break; // Stop looping once the route is found
      }
    }

    console.log("routesDict: ", routesDict[locationHash])
    if ((routesDict).hasOwnProperty("/")) {
        redirectUrl(routePaths.dashboard);
    }
    else if (!routesDict[locationHash]) {
        this.cleanup(); // Clean up resources before loading new content
        redirectUrl(routePaths.notFound);
    }
  }

  navigate(urlView, initFunc) {
    console.log("🚀 ~ Router ~ navigate ~ urlView:", urlView);
    this.cleanup(); // Clean up resources before loading new content
    fetch(urlView)
      .then((response) => {
        return response.text();
      })
      .then((html) => {
        this.routeElement.innerHTML = html;
        if (initFunc) {
          initFunc(); // Call the initialization function associated with the route
        }
      })
      .catch((error) => console.error("Error loading route:", error));
  }

  cleanup() {
    console.log("unmounting event listeners");
    // Cleanup any resources, event listeners, or detach event listeners here
    // For example, you might want to detach event listeners from the previous content

    // Remove all child elements inside the routeElement
    //   $(this.routeElement).empty();

    // Remove all event handlers attached to elements inside the routeElement
    $(this.routeElement).off();
  }
}

export class Routes {
  constructor(viewObj, isDefaultRoute, initFunc) {
    this.viewObj = viewObj;
    this.isDefaultRoute = isDefaultRoute;
    this.init = initFunc || null; // Set the initialization function for the route
  }

  isActiveRoute(hashPath) {
    console.log(hashPath);
    // let hashPathMatches = hashPath.startsWith(this.viewObj.path);
    let hashPathMatches = hashPath === this.viewObj.path;
    return hashPathMatches;
  }
}

// Add new route paths based on views here
const routePaths = {
  root: "/",
  index: "/app/",
  login: "/app/auth/#login",
  auth: "/app/auth/",
  register: "/app/auth/#register",
  dashboard: "/app/dashboard/",
  home: "/app/dashboard/#home",
  notFound: "/app/not-found.html",
};

const viewsUrls = {
  login: "/app/views/login.html",
  register: "/app/views/register.html",
  home: "/app/views/home.html",
};

// For Breadcrumbs
const breadCrumbsRouteNames = {
  "/app/dashboard/": "Dashboard",
  "/app/dashboard/#home": "Dashboard",
};

export {
  routePaths,
  viewsUrls,
  breadCrumbsRouteNames,
}
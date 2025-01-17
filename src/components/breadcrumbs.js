import $ from "jquery";
import { getCurrentRoute } from "@/libs/helper";
import { breadCrumbsRouteNames } from '@/config/routesDefinition';

// childRoutes = { hasActiveChild: false, routedId: null, routeName: "" }

const createBreadcrumbRoutes = ({ string, route, skipArray, routeConstructor }) => {
  // Normalize the input string and items
  const normalizedString = string.includes("#") || string.endsWith("/") ? string : string + "/";
  const normalizedRoute = route.includes("#") || route.endsWith("/") ? route : route + "/";
  const normalizedRouteConstructor =
    routeConstructor.includes("#") || routeConstructor.endsWith("/") ? routeConstructor : routeConstructor + "/";
  const normalizedSkipArray = skipArray.map((item) => {
    // Skip normalization if item includes a "#"
    if (item.includes("#")) {
      return item;
    } else {
      return item.endsWith("/") ? item : item + "/";
    }
  });

  let matchingRouteToString = normalizedString.endsWith(normalizedRoute) ? true : false;

  let html = ``;

  if (!normalizedSkipArray.includes(normalizedRoute)) {
    html = `
        <li data-route-url="${normalizedRouteConstructor}" class="breadcrumb-item ${matchingRouteToString ? `active` : ``}" ${matchingRouteToString ? `aria-current="page"` : ``}>
            ${matchingRouteToString ? `${breadCrumbsRouteNames[normalizedRouteConstructor]}` : ``}
            ${
              !matchingRouteToString
                ? `<a href="${normalizedRouteConstructor}">${breadCrumbsRouteNames[normalizedRouteConstructor]}</a>`
                : ``
            }
        </li>
        `;
  }

  return {
    html,
  };
};

export default function Breadcrumbs() {
  const currentRoute = getCurrentRoute();
  let routesArray = currentRoute
    .trim()
    .split("/")
    .filter((route) => route !== "")
    .map((route) => `/${route}`);

  let routeConstructor = "";
  let html = `
    <div class="container">
        <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                ${routesArray.reduce((htmlAcc, route) => {
                  routeConstructor += `${route}`;
                  let isCurrentRoute = createBreadcrumbRoutes({
                    string: currentRoute,
                    route: route,
                    skipArray: ["/app"],
                    routeConstructor: routeConstructor,
                  });
                  htmlAcc += isCurrentRoute.html;
                  return htmlAcc;
                }, "")}
            </ol>
        </nav>
    </div>
    `;

  return html;
}

// Use this function to update breadcrumbs for DOM container links (ajax-like)
export function updateBreadcrumbsWithChildContainerRoute({ $breadcrumbs, $childContainer, childRouteId, childRouteName }) {
  let $breadcrumbItemsLast = $($breadcrumbs).find(".breadcrumb").children(":last");
  if ($breadcrumbItemsLast.text() === childRouteId) {
    $breadcrumbItemsLast.remove();
  }

  let newBreadcrumbItem = `<li class="breadcrumb-item active">${childRouteName}</li>`;
  let prevBreadcrumbItemContent = (routeName, routeUrl) => `<a href="${routeUrl}">${routeName}</a>`;

  let $newActiveBreadcrumbItem = $($breadcrumbs).find(".breadcrumb").append(newBreadcrumbItem).children(":last");
//   history.pushState(null, null, `#${childRouteId}`);

  let $prevBreadcrumbItem = $newActiveBreadcrumbItem.prev(".breadcrumb-item");
  $prevBreadcrumbItem.html(
    prevBreadcrumbItemContent($prevBreadcrumbItem.text(), $prevBreadcrumbItem.data("route-url"))
  );
  $prevBreadcrumbItem.removeClass(".active");

  $(function () {
    $prevBreadcrumbItem.off("click").on("click", function(event) {
        event.preventDefault();
        $childContainer.empty();
        $childContainer.hide();
        $childContainer.siblings().show();

        let breadcrumbsHtml = Breadcrumbs();
        $breadcrumbs.html(breadcrumbsHtml);
    })
  });
}

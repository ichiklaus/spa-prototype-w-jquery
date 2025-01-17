
import $ from "jquery";
import { isAuthenticatedUser } from "@/libs/auth";

export default async function initHome(props) {
  props = await props;
  const isSignedIn = await isAuthenticatedUser();

  const $homeTemplate = $("#home-template");

  $homeTemplate.html(`
    <div>
      <p>We are in the home</p>
    </div>
    `);
}

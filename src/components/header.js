import $ from "jquery";
import { NavigationTopBar } from "@/components/navigation";

export default function Header(props) {
    const navigationHTML = NavigationTopBar({ isSignedIn: props.isSignedIn, username: props.username });
    let html = `
        <div>
            <div class="py-2 border-bottom d-lg-none">
                <div class="container-fluid container-lg d-flex flex-wrap justify-content-lg-center justify-content-end ">
                    <div class="text-end">
                    ${
                        props.isSignedIn
                        ? `<button type="button" class="logoutBtn btn btn-primary mb-2">Logout</button>
                            <p class="nav-item px-2 pt-1">Welcome, ${props.username}</p>`
                        : `<button type="button" class="loginBtn btn btn-light text-dark me-2">Login</button>
                            <button type="button" class="signupBtn btn btn-primary">Sign-up</button>`
                    }                  
                    </div>
                </div>
            </div>
            <div>${navigationHTML}</div>
        </div>
    `;

    $(function () {
        
    });

    return html;
}

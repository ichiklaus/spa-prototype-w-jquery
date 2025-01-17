import { routePaths } from "@/config/routesDefinition";
import "bootstrap";

function NavigationTopBar(props) {
    let html = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid container-lg">
            <a class="navbar-brand" href="${routePaths.home}">LOGO</a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse flex-md-grow-0" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item me-lg-4">
                        <a href="${routePaths.home}" class="nav-link text-secondary d-flex flex-lg-column column-gap-3">
                            <div class="bi d-flex d-lg-block mb-1 fs-3 text-center"><i class="fas fa-home"></i></div>
                            Home
                        </a>
                    </li>
                </ul>
            </div>            
            
            <ul class="nav d-none d-lg-flex ${props.username ? 'flex-row' : ''} align-items-center justify-content-center">
                ${
                    props.isSignedIn
                    ? `<li class="nav-item px-2">Welcome, ${props.username}</li>                    
                        <li class="nav-item px-2"><button type="button" class="logoutBtn btn btn-primary">Logout</button></li>`
                    : `<li class="nav-item me-2 px-2"><button type="button" class="loginBtn btn btn-outline-primary">Login</button></li>
                        <li class="nav-item px-2"><button type="button" class="signupBtn btn btn-primary">Sign up</button></li>`
                } 
            </ul>
        </div>
    </nav>
    `;

    // $(function () {
    //     $("#orders-dropdown").off("click").on("click", async function () {
    //         console.log("pub");
    //         $(this).next(".dropdown-menu").dropdown("toggle");
    //     });
    // });

    return html;
}

export {
    NavigationTopBar,
};
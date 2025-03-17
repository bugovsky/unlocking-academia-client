import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import App from "./App.tsx";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Request } from "./pages/Request";
import "./i18n";

const rootRoute = createRootRoute({});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$postId",
  component: PostDetail,
});

const requestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/request",
  component: Request,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  postDetailRoute,
  requestRoute,
  loginRoute,
  registerRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App router={router} />
  </React.StrictMode>
);
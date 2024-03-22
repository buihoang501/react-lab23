import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import Auth from "./pages/Auth";
import { action as authAction } from "./components/AuthForm";
import { tokenLoader } from "./utils/auth";
import Feed from "./pages/Feed";
import { action as logoutAction } from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  action as feedFormAction,
  loader as postsLoader,
} from "./components/FeedForm";

import PostDetail, {
  loader as postLoader,
  action as deletePost,
} from "./components/PostDetail";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <Root />,
    loader: tokenLoader,
    id: "root",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: (
          <ProtectedRoute>
            <Auth login />
          </ProtectedRoute>
        ),
        action: authAction,
      },

      {
        path: "signup",
        element: (
          <ProtectedRoute>
            <Auth />
          </ProtectedRoute>
        ),
        action: authAction,
      },
      {
        path: "logout",
        action: logoutAction,
      },
      {
        path: "feed",
        element: <Feed />,
        action: feedFormAction,
        loader: postsLoader,
      },
      {
        path: "feed/:feedId",
        element: <PostDetail />,
        loader: postLoader,
        action: deletePost,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;

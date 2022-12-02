import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import "./index.css";

// components
import Root, {
    loader as rootLoader,
    action as rootAction
} from './routes/root';
import ErrorPage from "./errorPage";
import Contact, {
    loader as contactLoader,
    action as contactAction
} from "./routes/contact";
import Edit, { action as editAction } from './routes/edit';
import { action as deleteAction } from "./routes/destroy";
import Index from "./routes";

// "root route"
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        // 渲染之前先执行 loader
        loader: rootLoader,
        action: rootAction,
        // 路由嵌套
        children: [{
            errorElement: <ErrorPage />,
            children: [{
                // 默认渲染到 <Outlet />
                index: true,
                element: <Index />
            }, {
                path: 'contacts/:contactId',
                element: <Contact />,
                loader: contactLoader,
                action: contactAction
            }, {
                path: 'contacts/:contactId/edit',
                element: <Edit />,
                loader: contactLoader,
                action: editAction
            }, {
                path: 'contacts/:contactId/destroy',
                action: deleteAction
            }]
        }]
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

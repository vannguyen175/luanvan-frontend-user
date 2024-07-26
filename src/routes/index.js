import Home from "~/pages/Home/Home";
import Products from "~/pages/Products/Products";
import DetailProduct from "~/pages/DetailProduct/DetailProduct";
import NotFoundPage from "~/pages/NotFoundPage/NotFoundPage";
import UserLayout from "~/layouts/userLayouts/userLayout";
import NoneFooterLayout from "../layouts/noneFooterLayout/noneFooterLayout";
import OrderProduct from "../pages/OrderProduct/OrderProduct";
import Cart from "../pages/Cart/Cart";

import { Fragment } from "react";
import Profile from "~/pages/Profile";
import Login from "~/pages/Login/Login"
import Register from "~/pages/Register/Register"
import PostingProduct from "../pages/PostingProduct/PostingProduct";
import ForSeller from "../pages/ForSeller";

export const routes = [
    {
        path: "/",
        page: Home,
        layout: UserLayout
    },
    {
        path: "/san-pham/:slug_category",
        page: Products,
        layout: UserLayout
    },
    {
        path: "/detail-product/:id",
        page: DetailProduct,
        layout: UserLayout
    },
    {
        path: "/dat-hang/:id",
        page: OrderProduct,
        layout: NoneFooterLayout
    },
    {
        path: "/gio-hang/:id",
        page: Cart,
        layout: UserLayout
    },
    {
        path: "/tai-khoan",
        page: Profile,
        layout: UserLayout
    },
    {
        path: "/nha-ban-hang",
        page: ForSeller,
        layout: UserLayout
    },
    {
        path: "/login",
        page: Login,
        layout: Fragment
    },
    {
        path: "/register",
        page: Register,
        layout: Fragment
    },
    {
        path: "/dang-tin",
        page: PostingProduct,
        layout: UserLayout
    },
    {
        path: "*",
        page: NotFoundPage,
        layout: Fragment
    },
];

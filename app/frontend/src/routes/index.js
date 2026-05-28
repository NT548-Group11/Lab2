
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/Home";
import Product from "../pages/Products";
import Login from "../pages/Login";
import LogOut from "../pages/LogOut";
import Register from "../pages/Register";
import Knowledge from "../pages/Knowledge";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/Blog/blogDetail";
import ExerciseDetail from '../pages/Knowledge/exerciseDetail';
import Carts from "../pages/Carts";
import User from "../pages/Users";
import DetailProduct from "../pages/DetailProduct";
import UserAddress from "../pages/Users/UserAddress";
import UserPassword from "../pages/Users/UserPassword";
import UserOrders from "../pages/Users/UserOrders";
import UserProfileInfo from "../pages/Users/UserProfileInfo";
import Contact from "../pages/Contact";
import About from "../pages/About";


import AdminLayout from "../layouts/LayoutDefault/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import UserManagement from "../pages/Admin/User";
import ProductManagement from "../pages/Admin/Product";
import OrderManagement from "../pages/Admin/Order";
import OrderDetail from "../pages/Admin/OrderDetail";
import AddNewProducts from "../pages/Admin/AddNewProducts";
// import ProductDetail from "../pages/Admin/ProductDetail";
import EditProduct from "../pages/Admin/ProductDetail";
import CategoryManagement from "../pages/Admin/Category";
import BlogManagement from "../pages/Admin/Blog";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            { path: "/", element: <Home /> },
            {path:"products", element: <Product />},
            {path:"products/:id", element:<DetailProduct />},
            {path:"login",element:<Login/>},
            {path:"logout",element:<LogOut/>},
            {path:"register",element:<Register/>},
            {path:"knowledge",element:<Knowledge/>},
            {path:"blog",element:<Blog/>},
            {path: "blog/:id", element: <BlogDetail />},
            {path: "contact", element: <Contact />},
            {path: "about", element: <About />},
            {path: "knowledge/:id", element: <ExerciseDetail /> },
            {path:"carts",element:<Carts/>},
            {path:"user",element:<User/>,
                children:[
                    {path:"profile",element:<UserProfileInfo/>},
                    {path:"address",element:<UserAddress/>},
                    {path:"password",element:<UserPassword/>},
                    {path:"orders",element:<UserOrders/>},
                ]
            },
            {path:"forgot",element:<ForgotPassword/>},
            {path:"reset-password/:token", element:<ResetPassword/>}
        ],
    },
    {
    path: "/admin",
    element: <LayoutDefault onlyHeader={true} />,
    children: [
        {
        element: <AdminLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "users", element: <UserManagement /> },
            { path: "products", element: <ProductManagement /> },
            { path: "products/add-product", element: <AddNewProducts /> },
            { path: "products/:id", element: <EditProduct/> },
            { path: "orders", element: <OrderManagement /> },
            { path: "orders/:id", element: <OrderDetail /> },
            { path: "blogs", element: <BlogManagement /> },
            { path: "categories", element: <CategoryManagement /> }
        ]
        }
    ]
    }
];
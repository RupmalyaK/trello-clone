import React from "react";

const Boards = React.lazy(() => import("../containers/Boards"));
const Signin = React.lazy(() => import("../containers/Signin"));
const Signup = React.lazy(() => import("../containers/Signup"));
const Board = React.lazy(() => import("../containers/Board"));


const routes = [
  {
    path: "/signup",
    exact: true,
    name: "Signup",
    component: Signup,
  },
  {
    path:"/signin",
    exact:true,
    name:"signin",
    component:Signin
  },
  {
    path:"/boards",
    exact:true,
    name:"Boards",
    component:Boards,
  },
  {
    path:"/:boardid/dashboard",
    exact:true,
    name:"Board",
    component:Board
  }
];

export default routes;

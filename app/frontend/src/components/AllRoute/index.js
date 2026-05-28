import React from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "../../routes";

function AllRoute() {
  // console.log("Routes configuration:", routes);
  const elements = useRoutes(routes);
  return <>{elements}</>;
}
export default AllRoute;

import React from "react";
import {createBrowserRouter} from "react-router-dom";
import Home from '@/view/Home';

export const ROUTER_CONFIG = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
  },
  // {
  //   path: '/CreateArticle',
  //   lazy: async ()=> ({
  //     Component: (await import("@/view/CreateArticle")).default
  //   })
  // }
])
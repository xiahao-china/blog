import React, { lazy, Suspense, useState } from "react";
import {RouterProvider} from "react-router-dom";
import {ROUTER_CONFIG} from "./router";
import styles from './App.less';
console.log(styles);
const router = ROUTER_CONFIG;

function App() {
  return (
    <div id='app' className={styles?.app}>
      11
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

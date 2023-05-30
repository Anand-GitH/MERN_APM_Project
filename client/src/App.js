import React from "react";
import Home from "./Home.js"
import Update from "./Update.js"
import Add from "./Add.js"
import Delete from "./Delete.js"
import {Route, Routes} from 'react-router-dom'

export default function App(){

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" Component={Home}/>
        <Route exact path="/update-user" Component={Update}/>
        <Route exact path="/add-user" Component={Add}/>
        <Route exact path="/delete-user" Component={Delete}/>
      </Routes>     
    </div>
  );
}

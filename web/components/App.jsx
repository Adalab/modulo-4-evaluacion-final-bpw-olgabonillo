import "../scss/App.scss";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import React from 'react'
import Landing from "./Landing";

function App() {
  return (
    <>
    <Header />
    <Landing />
    </>
  )
}

export default App
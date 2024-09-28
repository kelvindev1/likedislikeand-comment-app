import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Register from "./components/Register";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import AddPosts from "./components/AddPosts";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/add-post" element={<AddPosts />} />
      </Routes>
    </>
  );
}

export default App;

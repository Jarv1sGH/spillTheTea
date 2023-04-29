import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Components/Welcome/Welcome";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./Reducers/userReducers/userSlice";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    //Loads the currently logged-In user
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;

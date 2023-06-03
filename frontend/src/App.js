import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Components/Welcome/Welcome";
import { useEffect } from "react";
import Chats from "./Components/Chat/Chats";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./Reducers/userReducers/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.editProfile);
  useEffect(() => {
    //Loads the currently logged-In user
    dispatch(loadUser());
  }, [dispatch]);

  // to re render latest changes when user updates the profile
  useEffect(() => {
    if (message?.success === true) {
      dispatch(loadUser());
    }
    toast(message?.message);
  }, [message, dispatch]);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/chats" element={<Chats />} />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </>
  );
}

export default App;

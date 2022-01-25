import React, { useState } from "react";
import { CometChat } from "@cometchat-pro/chat";
import config from "../config";
// import {NotificationManager} from "react-notifications";
import "./App.css";
import { NotificationManager } from "react-notifications";
import Register from "./Register";
import Register_Logo from '../images/register.png'

const Login = (props) => {
  const [UID, setUID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    CometChat.login(UID, config.apiKey).then(
      (User) => {
        // window.alert('Login Successful');
        NotificationManager.success('Login Successfull');
        console.log("Login Successful:", { User });
        props.setUser(User);
      },
      (error) => {
        NotificationManager.error('Logging in Failed')
        console.log("Login failed with exception:", { error });
        setIsSubmitting(false);
      }
    );
  };
  const displayEvent = () =>{
    // do cument.getElementsByClassName('register').style.display = 'block';
  }

  return (
    <>
    <div className="row">
      <div className=" login-form mx-auto">
        <h3>Whatsapp Web</h3>
        <form className="" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder=""
              value={UID}
              onChange={(event) => setUID(event.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-dark btn-block"
              value={`${isSubmitting ? "Loading..." : "Login"}`}
              disabled={isSubmitting}
            />
          </div>
        </form>
        <p className="text_register">Don't have an Account? Register with Us.</p>
      </div>
    </div>
    <div className="register_icon">
      <div className="register_logo1">
        <img className="register_logo" onClick={displayEvent} src={Register_Logo} alt="" />
      </div>
    </div>
    <div className="register register_form" id="register_form">
      <Register/>
    </div>
    </>
  );
};

export default Login;

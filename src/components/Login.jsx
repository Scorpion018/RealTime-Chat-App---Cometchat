import React, { useState } from "react";
import { CometChat } from "@cometchat-pro/chat";
import config from "../config";
import "./App.css";

const Login = (props) => {
  const [UID, setUID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    CometChat.login(UID, config.apiKey).then(
      (User) => {
        console.log("Login Successful:", { User });
        props.setUser(User);
      },
      (error) => {
        console.log("Login failed with exception:", { error });
        setIsSubmitting(false);
      }
    );
  };

  return (
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
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { CometChat } from "@cometchat-pro/chat";
import './App.css';
import config from "../config";
import {NotificationManager} from "react-notifications";
const Register = (props) => {
    const [username, setUsername] = useState('')
    const [userId, setUserID] = useState('')
    // const [password, setPassword] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
        var UID = userId
            var name = username


            var user = new CometChat.User(UID);

            user.setName(name);
            user.setAvatar('https://i0.wp.com/i0.wp.com/novocom.top/image/Yy1zZVsZS5i5zbXVsZS5jb20=/z0/account/icon/v4_defpic.png')
            
            CometChat.createUser(user, config.apiKey).then(
                user => {
                    console.log("user created", user);

                    if (user.hasOwnProperty('errors')) {
                        alert(user.message)
                    } else {
                        NotificationManager.success('User Created Successfully');
                        NotificationManager.success('Login Now with User ID');
                        // alert('sucessfully created an account')
                    }
                }, error => {
                    console.log("error", error);
                }

            )
        

    }

    return (
        <div id="register_form" className="register_form">
            <h2 className="reg">Register</h2>
            <div className="form-group col-8">

                <form className="form_reg" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='User Name'
                        value={username}
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
                        name='username'

                    /><br />
                    <input
                        type="text"
                        placeholder='User Id'
                        value={userId}
                        className="form-control"
                        onChange={(e) => setUserID(e.target.value)}
                        name='userId'
                    /><br />
                    <input type='submit' className="btn btn-dark btn-block" value='Register' />
                </form>
            </div>
        </div>
    )
}
export default Register
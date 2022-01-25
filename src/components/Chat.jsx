import React, { useState, useEffect } from "react";
import "./Chat.css";
import { SiCircle, SiIconify } from "react-icons/si";
// import MDSpinner from 'react-md-spinner';
// import MdOutlineInsertEmoticon from 'react-icons/md';
import { NotificationManager } from "react-notifications";
import { TiTick } from "react-icons/ti";
import ClipLoader from "react-spinners/ClipLoader";
import { MdAttachFile } from "react-icons/md";
import {
  BsChatLeftTextFill,
  BsThreeDotsVertical,
  BsSearch,
} from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import profile from "../images/profile.png";
import { CometChat } from "@cometchat-pro/chat";

const msg_listener = "listener-key";
const listenerID = "listener-key2";

const limit = 30;
const Chat = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [Friend, setFriend] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatIsLoading, setChatIsLoading] = useState(false);
  const [friendisLoading, setFriendisLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [Group, setGroup] = useState(null);
  const [groupisLoading, setGroupisLoading] = useState(true);

  useEffect(() => {
    let usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();

    usersRequest.fetchNext().then(
      (userList) => {
        console.log("Fetched Users:", userList);
        setFriends(userList);
        setFriendisLoading(false);
      },
      (error) => {
        console.log("User list fetching failed with error:", error);
      }
    );

    let groupsRequest = new CometChat.GroupsRequestBuilder()
      .setLimit(limit)
      // .joinedOnly(true)
      .build();
    groupsRequest.fetchNext().then(
      (groupList) => {
        console.log("Groups list fetched successfully", groupList);
        setGroups(groupList);
        setGroupisLoading(false);
      },
      (error) => {
        console.log("Groups list fetching failed with error", error);
      }
    );

    return () => {
      CometChat.removeMessageListener(msg_listener);
      CometChat.logout();
    };
  }, []);

  useEffect(() => {
    if (Friend) {
      let messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(Friend)
        .setLimit(limit)
        .build();
      messagesRequest.fetchPrevious().then(
        (messages) => {
          setChat(messages);
          setChatIsLoading(false);
          scrollToBottom();
          console.log("Messages Fetched", messages);
        },
        (error) => {
          console.log("Message fetching failed with error:", error);
        }
      );

      CometChat.removeMessageListener(msg_listener);

      CometChat.addMessageListener(
        msg_listener,
        new CometChat.MessageListener({
          onTextMessageReceived: (message) => {
            NotificationManager.success(
              `New Message from ${message.sender.name}`
            );
            console.log("New Message ", { message });
            if (Friend === message.sender.uid) {
              setChat((prevState) => [...prevState, message]);
            }
          },
        })
      );
    }
  }, [Friend]);

  useEffect(() => {
    if (Group) {
      var messagesRequest = new CometChat.MessagesRequestBuilder()
        .setGUID(Group)
        .setLimit(limit)
        .build();

      messagesRequest.fetchPrevious().then(
        (messages) => {
          setChat(messages);
          setChatIsLoading(false);
          scrollToBottom();
          console.log("Messages Fetched:", messages);
        },
        (error) => {
          console.log("Message fetching failed with error:", error);
        }
      );

      CometChat.removeMessageListener(listenerID);

      CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
          onTextMessageReceived: (message) => {
            // NotificationManager.success(`New Message from ${message.sender.name}`);
            console.log("Incoming Message ", { message });
            if (Group === message.sender.uid) {
              setChat((prevState) => [...prevState, message]);
            }
          },
        })
      );
    }
  }, [Group]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let receiverType = CometChat.RECEIVER_TYPE.USER;

    let textMessage = new CometChat.TextMessage(Friend, message, receiverType);

    CometChat.sendMessage(textMessage).then(
      (message) => {
        console.log("Message sent successfully:", message);
        setChat([...chat, message]);
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
    setMessage("");
  };

  const grp_msg = (event) => {
    event.preventDefault();
    let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    // let receiverID = "supergroup";
    let textMessage = new CometChat.TextMessage(Group, message, receiverType);

    CometChat.sendMessage(textMessage).then(
      (message) => {
        console.log("Message sent successfully:", message);
        setChat([...chat, message]);
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
    setMessage("");
  };

  const logout = (e) => {
    CometChat.logout().then(
      () => {
        console.log("Please wait ... Logging out");
        if (window.confirm("Are you sure want to Logout ?")) {
          NotificationManager.success("Logout Successfull");
          window.location.reload(false);
          console.log("Logout completed successfully");
        } else {
          console.log("Logging Out Failed ");
        }
      },
      (error) => {
        console.log("Logout failed with exception:", { error });
      }
    );
  };

  const selectGroup = (guid) => {
    setGroup(guid);
    setChat([]);
    setChatIsLoading(true);
  };

  const selectFriend = (uid) => {
    setFriend(uid);
    setChat([]);
    setChatIsLoading(true);
  };

  const scrollToBottom = () => {
    let node = document.getElementById("MessageScreenEnded");
    node.scrollIntoView();
  };

  return (
    <div className="header">
      <div className="main_body">
        <div className="container-fluid body">
          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-8 h-400pr border rounded">
              <div className="row">
                <div
                  className="col-lg-4 col-xs-12 bg-light"
                  style={{ height: 910 }}
                >
                  <div className="row p-3">
                    <img src={user.avatar} alt="" className="main_header" />
                    <i className="user_name">{user.name}</i>
                    <i className="status_icon">
                      <SiCircle />
                    </i>{" "}
                    <br />
                    <i className="chat_icon">
                      <BsChatLeftTextFill />
                    </i>
                    <i onClick={logout} className="info_logo">
                      <BsThreeDotsVertical />
                      <span className="tooltiptext">Logout</span>
                    </i>
                    <div className="search_bar">
                      <i className="search_logo">
                        <BsSearch />
                      </i>
                      <input
                        className="search_in"
                        type="search"
                        placeholder="Search or start new chat"
                        name=""
                        id=""
                      />
                    </div>
                  </div>
                  <div
                    className="row bg-white border rounded"
                    style={{ height: "100%", overflow: "auto" }}
                  >
                    <GroupList
                      groups={groups}
                      groupisLoading={groupisLoading}
                      Group={Group}
                      selectGroup={selectGroup}
                    />
                    <FriendsNames
                      friends={friends}
                      friendisLoading={friendisLoading}
                      Friend={Friend}
                      selectFriend={selectFriend}
                    />
                  </div>
                </div>
                <div
                  className="col-lg-8 col-xs-12 bg-light"
                  style={{ height: 920 }}
                >
                  <div className="row p-3">
                    <div className="chat_header">
                      <img
                        src={profile}
                        alt="profile_pic"
                        className="chat_logo"
                      />
                      <i className="chat_search">
                        <BsSearch />
                      </i>
                      <i className="chat_dots">
                        <BsThreeDotsVertical />
                      </i>
                    </div>
                  </div>
                  <div
                    className="row screen_disp pt-5 bg-white"
                    style={{ height: 920, overflow: "auto" }}
                  >
                    <MessageScreen
                      chat={chat}
                      chatIsLoading={chatIsLoading}
                      user={user}
                    />
                  </div>
                  <div
                    className="row bg-light"
                    style={{ bottom: 0, width: "100%" }}
                  >
                    <form className="row m-0 p-0 w-100" onSubmit={handleSubmit}>
                      <div className="col-1 m-0 p-1">
                        <i className="smiley">
                          <i>
                            <SiIconify />
                          </i>
                        </i>
                      </div>
                      <div className="col-1 m-0 p-1">
                        <i className="file_attach">
                          <i>
                            <MdAttachFile />
                          </i>
                        </i>
                      </div>
                      <div className="col-9 m-0 p-1 msgs">
                        <input
                          id="text"
                          className="form-control type_msg"
                          type="text"
                          onChange={(event) => {
                            setMessage(event.target.value);
                          }}
                          value={message}
                          placeholder="Type a message....."
                        />
                      </div>
                      <div className="col-1 m-0 p-1">
                        <button className="mic">
                          <i></i>
                        </button>
                        <button onClick={grp_msg} className="mic">
                          <i>
                            <FaMicrophone />
                          </i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageScreen = (props) => {
  const { chat, chatIsLoading, user } = props;
  if (chatIsLoading) {
    return (
      <div className="col-xl-12 my-auto  text-center">
        <ClipLoader />
      </div>
    );
  } else {
    return (
      <div className="col-xl-12">
        {chat.map((chat) => (
          <div key={chat.id} className="message">
            <div
              className={`${
                chat.sender.uid === user.uid ? "receiver" : "sender"
              } p-3 m-1`}
            >
              {/* console.log(`${chat.receiver !== user.uid ? 'sender' : 'receiver'}`) */}
              {/* {console.log(`receiver ${chat.sender.uid}`)} */}
              {/* {console.log(`${user.uid}`)} */}
              <i className="sender_name"> {chat.sender.name} : </i>
              <i className="tick_mark">
                <TiTick />
              </i>
              <i className="chat_data">{chat.text}</i>
              {/* {new Date().toLocaleString()} */}
            </div>
          </div>
        ))}
        <div id="MessageScreenEnded" />
      </div>
    );
  }
};

const GroupList = (props) => {
  const { groups, groupisLoading, Group } = props;
  if (groupisLoading) {
    return (
      <div className="col my-auto text-center">
        <ClipLoader />
      </div>
    );
  } else {
    return (
      <div>
        <ul className="list-group list-group-flush">
          {groups.map((group) => (
            <li
              key={group.guid}
              className={`list-group-item ${group.uid === Group ? "" : ""}`}
              onClick={() => props.selectGroup(group.guid)}
            >
              <img src={group.icon} alt="" className="main_header" />
              {group.name}
            </li>
          ))}
          <hr className="horizontal_line" />
        </ul>
      </div>
    );
  }
};

const FriendsNames = (props) => {
  const { friends, friendisLoading, Friend } = props;
  if (friendisLoading) {
    return (
      <div className="col-xl-12 my-auto cliploader text-center">
        {/* <ClipLoader /> */}
      </div>
    );
  } else {
    return (
      <ul className="list-group friends_list list-group-flush">
        {friends.map((friend) => (
          <li
            key={friend.uid}
            className={`list-group-item ${friend.uid === Friend ? "" : ""}`}
            onClick={() => props.selectFriend(friend.uid)}
          >
            <img src={friend.avatar} alt="" className="main_header" />
            {friend.name}
            <i className="friend_status"> ({friend.status}) </i>
            {/* {console.log(`${friend.avatar === null ? 'abc' :'def '}`)} */}
            {/* {friend.avatar} */}
          </li>
        ))}
      </ul>
    );
  }
};

export default Chat;

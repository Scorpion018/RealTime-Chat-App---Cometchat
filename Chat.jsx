import React, { useState, useEffect } from 'react';
import './Chat.css';
import MDSpinner from 'react-md-spinner';
import { SiCircle } from 'react-icons/si';
import { BsChatLeftTextFill, BsThreeDotsVertical, BsSearch } from 'react-icons/bs'
import { FaMicrophone } from 'react-icons/fa'
import profile from '../images/profile.png'
import { CometChat } from '@cometchat-pro/chat';

const msg_listener = 'listener-key';
const listenerID = "listener-key2";

const limit = 30;
const Chat = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [Friend, setFriend] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatIsLoading, setChatIsLoading] = useState(false);
  const [friendisLoading, setFriendisLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [Group, setGroup] = useState(null);
  const [groupisLoading, setGroupisLoading] = useState(true);

  useEffect(() => {
    let usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();
    let groupsRequest = new CometChat.GroupsRequestBuilder()
      .setLimit(limit)
      // .joinedOnly(true)
      .build();
    groupsRequest.fetchNext().then(
      groupList => {
        console.log("Groups list fetched successfully", groupList);
        setGroups(groupList);
        setGroupisLoading(false);
      }, error => {
        console.log("Groups list fetching failed with error", error);
      });

    usersRequest.fetchNext().then(
      userList => {
        console.log('User list received:', userList);
        setFriends(userList);
        setFriendisLoading(false);
      },
      error => {
        console.log('User list fetching failed with error:', error);
      }
    );

    return () => {
      CometChat.removeMessageListener(msg_listener);
      CometChat.logout();
    };
  }, []);

  useEffect(() => {
    if (Friend) {
      var messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(Friend)
        .setLimit(limit)
        .build();

      messagesRequest.fetchPrevious().then(
        messages => {
          setChat(messages);
          setChatIsLoading(false);
          scrollToBottom();
          console.log("Message list fetched:", messages);
        }, error => {
          console.log("Message fetching failed with error:", error);
        }
      );

      CometChat.removeMessageListener(msg_listener);

      CometChat.addMessageListener(
        msg_listener,
        new CometChat.MessageListener({
          onTextMessageReceived: message => {
            console.log('Incoming Message ', { message });
            if (Friend === message.sender.uid) {
              setChat(prevState => [...prevState, message]);
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
        messages => {
          setChat(messages);
          setChatIsLoading(false);
          scrollToBottom();
          console.log("Message list fetched:", messages);
        }, error => {
          console.log("Message fetching failed with error:", error);
        }
      );

      CometChat.removeMessageListener(listenerID);

      CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
          onTextMessageReceived: message => {
            console.log('Incoming Message ', { message });
            if (Group === message.sender.uid) {
              setChat(prevState => [...prevState, message]);
            }
          },
        })
      );
    }
  }, [Group]);

  const handleSubmit = event => {
    event.preventDefault();
    let receiverType = CometChat.RECEIVER_TYPE.USER

    let textMessage = new CometChat.TextMessage(Friend, message, receiverType);


    CometChat.sendMessage(textMessage).then(
      message => {
        console.log('Message sent successfully:', message);
        setChat([...chat, message]);
      },
      error => {
        console.log('Message sending failed with error:', error);
      }
    );
    setMessage('');
  };


  const grp_msg = event => {
    event.preventDefault();
    let receiverType = CometChat.RECEIVER_TYPE.GROUP
    let receiverID = "supergroup"
    let textMessage = new CometChat.TextMessage(receiverID, message, receiverType);

    CometChat.sendMessage(textMessage).then(
      message => {
        console.log("Message sent successfully:", message);
        setChat([...chat , message])
      }, error => {
        console.log("Message sending failed with error:", error);
      }
    );
    setMessage('');
  }



  const selectGroup = guid => {
    setGroup(guid);
    setChat([]);
    setChatIsLoading(true);
  }

  const selectFriend = uid => {
    setFriend(uid);
    setChat([]);
    setChatIsLoading(true);
  };

  const scrollToBottom = () => {
    let node = document.getElementById('chatBoxEnded');
    node.scrollIntoView();
  };

  return (
    <div className="header">
      <div className='container-fluid body'>
        <div className='row'>
          <div className='col-md-2' />
          <div className='col-md-8 h-400pr border rounded'>
            <div className='row'>
              <div className='col-lg-4 col-xs-12 bg-light' style={{ height: 1020 }}>
                <div className='row p-3'>
                  <img src={profile} alt="profile_pic" className='main_header' />
                  <i className='status_icon'><SiCircle /></i> <br />
                  <i className='chat_icon'><BsChatLeftTextFill /></i>
                  <i className='info_logo'><BsThreeDotsVertical /></i>
                  <div className='search_bar'>
                    <i className='search_logo'><BsSearch /></i>
                    <input className='search_in' type="search" placeholder='Search or start new chat' name="" id="" />
                  </div>
                </div>
                <div
                  className='row h-75 bg-white border rounded'
                  style={{ height: '100%', overflow: 'auto' }}>
                  <GroupList
                    groups={groups}
                    groupisLoading={groupisLoading}
                    Group={Group}
                    selectGroup={selectGroup}
                  />
                  <FriendList
                    friends={friends}
                    friendisLoading={friendisLoading}
                    Friend={Friend}
                    selectFriend={selectFriend}
                  />

                </div>
              </div>
              <div className='col-lg-8 col-xs-12 bg-light' style={{ height: 1020 }}>
                <div className='row p-3'>
                  <div className='chat_header'>
                    <img src={profile} alt="profile_pic" className='chat_logo' />
                  </div>
                </div>
                <div
                  className='row pt-5 bg-white'
                  style={{ height: 930, overflow: 'auto' }}>
                  <ChatBox
                    chat={chat}
                    chatIsLoading={chatIsLoading}
                    user={user}
                  />

                </div>
                <div className='row bg-light' style={{ bottom: 0, borderRadius: '50px', width: '100%' }}>
                  <form className='row m-0 p-0 w-100' onSubmit={handleSubmit}>
                    <div className='col-11 m-0 p-1'>
                      <input
                        id='text'
                        className='mw-90 border rounded form-control type_msg'
                        type='text'
                        onChange={event => {
                          setMessage(event.target.value);
                        }}
                        value={message}
                        placeholder='Type a message.....'
                      />
                    </div>
                    <div className='col-1 m-0 p-1'>
                      <button className='mic'><i></i></button>
                      <button onClick={grp_msg} className='mic'><i><FaMicrophone /></i></button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatBox = props => {
  const { chat, chatIsLoading, user  } = props;
  if (chatIsLoading) {
    return (
      <div className='col-xl-12 my-auto text-center'>
        <MDSpinner size='72' />
      </div>
    );
  } else {
    return (
      <div className='col-xl-12'>
        {chat.map(chat => (
          <div key={chat.id} className='message'>
            <div className={`${chat.receiver.uid !== user.uid ? 'sender' : 'receiver'} p-3 m-1`}>
              {chat.text}
              {/* {new TimeRanges().toLocaleString() + ""} */}
            </div>
          </div>
        ))}
        <div id='chatBoxEnded' />
      </div>
    );
  }
};

const FriendList = props => {
  const { friends, friendisLoading, Friend } = props;
  if (friendisLoading) {
    return (
      <div className='col-xl-12 my-auto text-center'>
        <MDSpinner size='72' />
      </div>
    );
  } else {
    return (
      <ul className='list-group friends_list list-group-flush w-100'>
        {friends.map(friend => (
          <li
            key={friend.uid}
            className={`list-group-item ${friend.uid === Friend ? '' : ''
              }`}
            onClick={() => props.selectFriend(friend.uid)}>
            {friend.name}
          </li>
        ))}
      </ul>
    );
  }
};

const GroupList = props => {
  const { groups, groupisLoading, Group } = props;
  if (groupisLoading) {
    return (
      <div className='col my-auto text-center'>
      </div>
    );
  } else {
    return (
      <div>

        <ul className='list-group list-group-flush'>
          {groups.map(group => (
            <li
              key={group.guid}
              className={`list-group-item ${group.uid === Group ? '' : ''
                }`}
              onClick={() => props.selectGroup(group.guid)}>
              {group.name}
            </li>
          ))}
          <hr className='horizontal_line' />
        </ul>
      </div>
    );
  }
}
export default Chat;
import React from 'react';
import ReactDOM from 'react-dom';
import {CometChat} from '@cometchat-pro/chat';

import App from './components/App';
import config from './config';

// CometChat.init(config.appID);


let appSetting = new CometChat.AppSettingsBuilder()
                    .subscribePresenceForAllUsers()
                    .setRegion(config.region)   
                    .autoEstablishSocketConnection(true)
                    .build();
CometChat.init(config.appID, appSetting).then(
  () => {
    console.log("Initialization completed successfully");
  }, error => {
    console.log("Initialization failed with error:", error);
  }
);

ReactDOM.render(<App />, document.getElementById('root'));

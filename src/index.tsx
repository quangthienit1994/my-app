import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.scss';
import registerServiceWorker from './registerServiceWorker';
import MuiTheme from './MuiTheme';
import { Provider } from 'react-redux';
import Store from './Store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as firebase from 'firebase';
import App from './App';

const config = {
  apiKey: "AIzaSyCEdag1nRyRKXCifwK4arTehvY7SH9CDmI",
  authDomain: "angular-86347.firebaseapp.com",
  databaseURL: "https://angular-86347.firebaseio.com",
  projectId: "angular-86347",
  storageBucket: "angular-86347.appspot.com",
  messagingSenderId: "1034084933551"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });
(window as any).firebase = firebase;
(window as any).config = config;

ReactDOM.render(
  <Provider store={Store()}>
    <MuiTheme>
      <BrowserRouter>
        <Switch>
          <Route component={App} />
        </Switch>
      </BrowserRouter>
    </MuiTheme>
  </Provider>
  ,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();

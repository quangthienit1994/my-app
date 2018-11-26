import * as React from 'react';
import * as firebase from 'firebase/app';

import Admin from './pages/Admin';
import Notifications from './components/Notifications';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';

class App extends React.Component<any, any> {
  public state = {
    loading: false
  }
  public render() {
    if(this.state.loading){
      return <LinearProgress /> ;
    }
    return (
      <React.Fragment>
        <Notifications />
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </React.Fragment>
    );
  }
  public componentDidMount() {
    this.onUserSate();
  }
  public onUserSate() {
    this.setState({loading: true});
    firebase.auth().onAuthStateChanged((result: any) => {
      if (result && result.uid) {
        firebase.firestore().collection('users').doc(result.uid).onSnapshot((profile: any) => {
          if(profile.exists){
            this.props.dispatch({ type: "UPDATE_PROFILE", data: { ...profile.data(), uid: profile.id, ...result } });
          }
          setTimeout(() => {
            this.setState({loading: false});
          }, 200);
        });
      }else{
        this.setState({loading: false});
      }
    });
  }
}

export default connect(e => e)(App);

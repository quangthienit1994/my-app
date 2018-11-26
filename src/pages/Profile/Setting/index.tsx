import * as React from 'react';
import { connect } from 'react-redux';
import { IconButton, AppBar, Toolbar, Typography, List, ListItem, ListSubheader,  Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ListItemField from 'src/components/ListItemField';
import * as firebase from 'firebase/app';
import { Info } from '@material-ui/icons';
import Thumbnail from '../../../components/ChooseFileMedia';

class Component extends React.Component<any, any>{
    public state = {
        profile: this.props.PROFILE,
        loading: false
    };
    public handleChangeState = (key: string) => (e: React.ChangeEvent<any>) => {
        if (key === 'photoURL') {
            this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Chọn ảnh thành công' } });
            return this.setState({ profile: { ...this.state.profile, [key]: e } });
        }
        this.setState({ profile: { ...this.state.profile, [key]: e.target.value } });
    }
    public render() {
        const { photoURL } = this.props.PROFILE;
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={this.props.onClose} color="inherit" aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography className="ml-1 mr-1" color="inherit">CÀI ĐẶT</Typography>
                    </Toolbar>
                </AppBar>
                <div id="profile-content">
                    <List>
                        <ListItem>
                            <ListSubheader component="div"><Typography component="strong" className="d-flex align-items-center"><Info className="mr-2" /> THÔNG TIN TÀI KHOẢN</Typography></ListSubheader>
                        </ListItem>
                        <Divider component="li" />
                        <ListItemField hideTitle={true} fullSceen={true} avatar={photoURL} loading={this.state.loading} title="Ảnh đại diện" onSave={this.updateAccountState('photoURL')}>
                            <Thumbnail onChange={(this.handleChangeState('photoURL') as any)} />
                        </ListItemField>
                    </List>
                </div>
            </React.Fragment>
        );
    }

    public doUpdate = (key: string) => {
        const { uid } = this.props.PROFILE;
        if(this.state.profile[key]){
            firebase.firestore().collection('users').doc(uid).update({ [key]: this.state.profile[key] }).catch((error: Error) => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi cập nhật', content: error.toString() } });
            }).then(() => {
                this.setState({ loading: false });
            })
        }else{
            this.setState({ loading: false });
        }
    }

    protected updateAccountState = (key: string) => () => {
        this.setState({ loading: true });
        const user: any = firebase.auth().currentUser;
        switch (key) {
            case 'photoURL':
            case 'displayName':

                user.updateProfile({
                    [key]: this.state.profile[key]
                }).then(this.doUpdate(key)).catch((error: Error) => {
                    this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi cập nhật', content: error.toString() } });
                });

                break;
            case 'email':
                user.updateEmail(this.state.profile.email).then(this.doUpdate(key)).catch((error: Error) => {
                    this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi cập nhật', content: error.toString() } });
                });
                break;
            default:
                this.doUpdate(key);
                break;
        }

    }

}

export default connect(e => e)(Component);

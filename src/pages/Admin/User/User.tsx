import * as React from 'react';
import { SwipeableDrawer, List, IconButton, Tooltip, ListItem, ListItemIcon, ListItemText, Dialog } from '@material-ui/core';
import { Info, Delete } from '@material-ui/icons';
import Profile from './Profile';

interface IState {
    open: boolean;
    openProfile: boolean;
    [key: string]: any;
}

interface IProps {
    dataSource: any;
}

export default class UserTools extends React.Component<IProps, IState>{
    public state = {
        open: false,
        openProfile: false
    };

    public onClose = (key: string) => (e: any) => {
        this.setState({ [key]: !Boolean(this.state[key]) });
    }

    public render() {
        const { open } = this.state;
        return (
            <React.Fragment>
                <Tooltip key={1} title="Xem chi tiết">
                    <IconButton onClick={this.onClose('open')} className="text-light">
                        <Info />
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.openProfile}
                    fullScreen={true}
                    onClose={this.onClose('openProfile')}
                >
                    <Profile dataSource={this.props.dataSource} onClose={this.onClose('openProfile')} />
                </Dialog>
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={this.onClose('open')}
                    onOpen={this.onClose('open')}
                >
                    <List>
                        <ListItem button={true} component="div" onClick={this.onClose('openProfile')}>
                            <ListItemIcon><Info /></ListItemIcon>
                            <ListItemText>Xem chi tiết tài khoản</ListItemText>
                        </ListItem>
                        <ListItem button={true}>
                            <ListItemIcon><Delete /></ListItemIcon>
                            <ListItemText>Vui lòng đăng nhập vào hệ thống của firebase để xóa hoặc khóa tài khoản</ListItemText>
                        </ListItem>
                    </List>
                </SwipeableDrawer>
            </React.Fragment >
        );
    }
    public handleTrashAcount = () => {
        // const { dataSource: { uid } } = this.props;
        // firebase.
        // firebase.firestore().collection('users').doc(uid).delete().then(() => {

        // })
    }
    public handleDeleteAcount = () => {
        // const { dataSource: { uid } } = this.props;
        // firebase.auth().
        // firebase.firestore().collection('users').doc(uid).delete().then(() => {

        // })
    }
}

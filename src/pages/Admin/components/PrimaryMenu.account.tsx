import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Avatar, Menu, MenuItem, MenuList, ListItemText, ListItemIcon, Divider, Dialog, Typography } from '@material-ui/core';
import { AccountBox, Settings, Input } from '@material-ui/icons';
import Profile from 'src/pages/Profile/Profile';
import Setting from 'src/pages/Profile/Setting';
import * as firebase from 'firebase/app';

class AccountTools extends React.Component<any, any>{
    public state = {
        open: false,
        anchorEl: null,
        show: null
    }
    public render() {
        return (
            <div className="ml-auto position-relative">
                <Button onClick={this.handleMenuShow} className="d-flex align-items-center">
                    {this.props.PROFILE.photoURL ? <Avatar src={this.props.PROFILE.photoURL} /> : <AccountBox />}
                    <Typography className="ml-2 d-none-sm" style={{ textTransform: 'none' }}>{this.props.PROFILE.displayName || this.props.PROFILE.email}</Typography>
                </Button>
                <Menu anchorEl={this.state.anchorEl} open={this.state.open} onClose={this.handleMenuShow}>
                    <MenuList>
                        <MenuItem button={true} onClick={this.show('setting')}>
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText>Cài đặt</ListItemText>
                        </MenuItem>
                        <MenuItem button={true} onClick={this.show('profile')}>
                            <ListItemIcon><AccountBox /></ListItemIcon>
                            <ListItemText>Thông tin tài khoản</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem button={true} onClick={this.logout}>
                            <ListItemIcon><Input /></ListItemIcon>
                            <ListItemText>Đăng xuất</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Dialog fullScreen={true} open={this.state.show !== null} onClose={this.show(null)}>
                    {this.state.show === 'profile' && <Profile onClose={this.show(null)} />}
                    {this.state.show === 'setting' && <Setting onClose={this.show(null)} />}
                </Dialog>
            </div>
        );
    }

    public handleMenuShow = (e: any) => {
        this.setState({ open: !this.state.open, anchorEl: e.target });
    };

    public show = (show: any) => (e: any) => {
        this.setState({ show, open: null });
    }

    public logout = () => {
        (firebase.auth().currentUser as any).signOut();
    }

}

export default connect(e => e)(AccountTools);

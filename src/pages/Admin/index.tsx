import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import Libraries from './Libraries';
import User from './User';
import Post from './Post';
import Setting from './Setting';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, AppBar, Tooltip, IconButton, Toolbar, Button, Switch as SwitchCOM, withStyles, Typography } from '@material-ui/core';
import { Input, SettingsApplications, ColorLens } from '@material-ui/icons';
import Dashboard from './Dashboard';
import PrimaryMenuAccount from './components/PrimaryMenu.account';
import * as firebase from 'firebase/app';

class Admin extends React.Component<any, any>{
    public state = {
        open: false
    };

    public handleOpenSidebar = () => {
        this.setState({ open: !this.state.open });
    };

    public render() {
        const {PROFILE} = this.props;

        if( !(PROFILE.role === 'admin' || PROFILE.role === 'author' || PROFILE.role === 'editor') ){
            return <Typography>Bạn không có quyền truy cập đường dẫn này</Typography>;
        }

        return (
            <div id="admin-template">
                <AppBar position="static">
                    <Toolbar />
                </AppBar>
                <AppBar position="fixed" style={{ background: this.props.theme.palette.background.paper }} className="mb-2">
                    <Toolbar>
                        <Button color="default" onClick={this.handleOpenSidebar}><ColorLens /> Thanh công cụ </Button>
                        <PrimaryMenuAccount />
                        <Tooltip title={this.props.theme.palette.type !== 'light' ? "Giao diện sáng" : "Giao diện tối"} >
                            <SwitchCOM onClick={this.changeTheme} color="default" checked={this.props.theme.palette.type === 'light'} />
                        </Tooltip>
                        <Tooltip title="Đăng xuất">
                            <IconButton color="default">
                                <Input />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                <Drawer anchor="left" open={this.state.open} onClose={this.handleOpenSidebar}>
                    <List component="div">
                        <ListItem button={true}>
                            <ListItemText>
                                <Link className="d-block" style={{ color: 'unset', textDecoration: 'none' }} to="/admin/dashboard">Trang quản lý</Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem button={true}>
                            <ListItemText>
                                <Link className="d-block" style={{ color: 'unset', textDecoration: 'none' }} to="/admin/users">Người dùng</Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem button={true}>
                            <ListItemText>
                                <Link className="d-block" style={{ color: 'unset', textDecoration: 'none' }} to="/admin/posts">Bài viết</Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem button={true}>
                            <ListItemText>
                                <Link className="d-block" style={{ color: 'unset', textDecoration: 'none' }} to="/admin/libraries">Thư viện</Link>
                            </ListItemText>
                        </ListItem>

                        <Divider />
                        <ListItem button={true}>
                            <ListItemIcon>
                                <SettingsApplications />
                            </ListItemIcon>
                            <ListItemText>
                                <Link className="d-block" style={{ color: 'unset', textDecoration: 'none' }} to="/admin/settings">Dữ liệu</Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem button={true} onClick={this.logout}>
                            <ListItemIcon>
                                <Input />
                            </ListItemIcon>
                            <ListItemText>
                                Đăng xuất
                            </ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
                <div className="p-2">
                    <Switch>
                        <Route path="/admin/dashboard" component={Dashboard} />
                        <Route path="/admin/libraries" component={Libraries} />
                        <Route path="/admin/users" component={User} />
                        <Route path="/admin/posts" component={Post} />
                        <Route path="/admin/settings" component={Setting} />
                    </Switch>
                </div>
            </div>
        );
    }
    public changeTheme = () => {
        this.props.dispatch({ type: "UPDATE_THEME" });
    }
    public logout = () => {
        (firebase.auth().currentUser as any).signOut();
    }
}

export default withStyles({}, { withTheme: true })(connect(state => state)(Admin));
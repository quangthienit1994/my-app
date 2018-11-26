import * as React from 'react';
import { connect } from 'react-redux';
import { IconButton, AppBar, Toolbar, Typography, List, ListItem, ListSubheader, ListItemText, Divider, TextField, Select, MenuItem } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as moment from 'moment';
import ListItemField from 'src/components/ListItemField';
import * as firebase from 'firebase/app';
import { Settings, Info } from '@material-ui/icons';
import { roles } from '../Create';
import Thumbnail from '../../Libraries';

class Component extends React.Component<any, any>{
    public state = {
        profile: this.props.dataSource,
        loading: false
    };
    public handleChangeState = (key: string) => (e: React.ChangeEvent<any>) => {
        if(key === 'photoURL'){
            this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Chọn ảnh thành công' } });
            return this.setState({ profile: { ...this.state.profile, [key]: e } });
        }
        this.setState({ profile: { ...this.state.profile, [key]: e.target.value } });
    }
    public render() {
        const { email, displayName, phoneNumber, lastSignInTime, emailVerified, creationTime, role, photoURL } = this.state.profile;

        const Role = (roles.find((node: any) => node.value === role) as any);

        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={this.props.onClose} color="inherit" aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography className="ml-1 mr-1" color="inherit">THÔNG TIN TÀI KHOẢN</Typography>
                    </Toolbar>
                </AppBar>
                <div id="profile-content">
                    <List>
                        <ListItem>
                            <ListSubheader component="div"><Typography component="strong" className="d-flex align-items-center"><Info className="mr-2" /> THÔNG TIN TÀI KHOẢN</Typography></ListSubheader>
                        </ListItem>
                        <Divider component="li" />
                        <ListItemField hideTitle={true} fullSceen={true} avatar={photoURL} loading={this.state.loading} title="Ảnh đại diện" onSave={this.updateAccountState}>
                            <Thumbnail onChange={(this.handleChangeState('photoURL') as any)} />
                        </ListItemField>
                        <Divider component="li" />
                        <ListItemField loading={this.state.loading} title="Tên hiển thị" description={displayName} onSave={this.updateAccountState}>
                            <Typography>Tên hiển thị của tài khoản thay thế cho email và số điện thoại</Typography>
                            <TextField className="w-100" label="Tên hiển thị" onChange={this.handleChangeState('displayName')} />
                        </ListItemField>
                        <Divider component="li" />
                        <ListItem>
                            <ListSubheader component="div">Email</ListSubheader>
                            <ListItemText className="text-right">{email}</ListItemText>
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListSubheader component="div">Số điện thoại</ListSubheader>
                            <ListItemText className="text-right">{phoneNumber}</ListItemText>
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListSubheader component="div">Xác thực</ListSubheader>
                            <ListItemText className="text-right">{emailVerified ? 'Đã xác thực tài khoản' : 'Chưa xác thực tài khoản'}</ListItemText>
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListSubheader component="div">Phiên đăng nhập cuối</ListSubheader>
                            <ListItemText className="text-right">{moment(lastSignInTime).format('LLL')}</ListItemText>
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListSubheader component="div">Tài khoản được tạo vào lúc</ListSubheader>
                            <ListItemText className="text-right">{moment(creationTime).format('LLL')}</ListItemText>
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListSubheader component="div"><Typography component="strong" className="d-flex align-items-center"><Settings className="mr-2" /> BẢO MẬT</Typography></ListSubheader>
                        </ListItem>
                        <Divider component="li" />
                        <ListItemField loading={this.state.loading} title="Quyền truy cập" description={Role ? Role.name : 'user'} onSave={this.updateAccountState}>
                            <Typography>Tên hiển thị của tài khoản thay thế cho email và số điện thoại</Typography>
                            <Select disabled={!(this.props.PROFILE.role === 'admin' || this.props.PROFILE.role === 'author')} className="mt-2 w-100" value={role} onChange={this.handleChangeState('role')} >
                                {
                                    roles.map(({ value, name }) => {
                                        return <MenuItem value={value} key={value}>{name}</MenuItem>
                                    })
                                }
                            </Select>
                        </ListItemField>
                    </List>
                </div>
            </React.Fragment>
        );
    }
    protected updateAccountState = () => {
        const { uid } = this.state.profile;
        this.setState({ loading: true });
        
        firebase.firestore().collection('users').doc(uid).update(this.state.profile).catch((error: Error) => {
            this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi cập nhật', content: error.toString() } });
        }).then(() => {
            this.setState({ loading: false });
        })
    }
}

export default connect(e => e)(Component);

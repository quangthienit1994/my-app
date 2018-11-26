import * as React from 'react';
import { connect } from 'react-redux';
import { Paper, Button, TextField, Input, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, CircularProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as firebase from 'firebase/app';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const roles = [
    { value: 'author', name: 'Tác giả' },
    { value: 'admin', name: 'Quản trị viên' },
    { value: 'editor', name: 'Biên tập viên' },
    { value: 'user', name: 'Người dùng' }
];

class CreateUser extends React.Component<any, any>{
    public state = {
        showPwd: false,
        roles,
        user: {
            email: '',
            password: '',
            role: 'user',
            phone: ''
        },
        loading: false,
        expanded: -1
    };
    public expandedTab = (name: any) => (e: any) => {
        this.setState({ expanded: name });
    }
    public Password = () => {
        const { showPwd, user } = this.state;
        return (
            <FormControl className="mb-2 w-100">
                <InputLabel>Mật khẩu</InputLabel>
                <Input value={user.password} onChange={this.handleChangeCreateState('password')}
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    title="Mật khẩu"
                    endAdornment={
                        <InputAdornment position="start">
                            <IconButton onClick={this.handleShowPwd}>
                                {showPwd ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        );
    }
    public render() {
        const { user, loading, expanded } = this.state;
        return (
            <form action="#">

                <ExpansionPanel expanded={expanded === 1}>
                    <ExpansionPanelSummary onClick={this.expandedTab(expanded === 1 ? -1 : 1)} expandIcon={<ExpandMoreIcon />}>
                        <Typography className="mr-2">Email</Typography>
                        <Typography variant="caption">Tạo tài khoản với email và mật khẩu</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className="d-block clearfix w-100">
                            <TextField value={user.email} onChange={this.handleChangeCreateState('email')} id="email" name="email" className="mb-2 w-100" label="Email" type="email" />
                            <div className="d-block w-100" />
                            {this.Password()}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                {/* <ExpansionPanel expanded={expanded === 2}>
                    <ExpansionPanelSummary onClick={this.expandedTab(expanded === 2 ? -1 : 2)} expandIcon={<ExpandMoreIcon />}>
                        <Typography className="mr-2">Số điện thoại</Typography>
                        <Typography variant="caption">Tạo tài khoản với số điện thoại</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className="d-block clearfix w-100">
                            <TextField value={user.phone} onChange={this.handleChangeCreateState('phone')} id="phone" name="phone" className="mb-2 w-100" label="Số điện thoại" type="tel" />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel> */}

                <Paper className="p-2 mt-2">
                    <div className="d-block w-100 mb-2" />
                    <FormControl className="w-100">
                        <InputLabel>Quyền truy cập</InputLabel>
                        <Select className="w-100" value={user.role} onChange={this.handleChangeCreateState('role')}>
                            {
                                this.state.roles.map(({ name, value }: any) => {
                                    return <MenuItem key={value} value={value}>{name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <div className="d-block w-100" />
                    {
                        loading ? <CircularProgress className="mt-2" /> : <Button type="button" onClick={this.handleSubmit} disabled={loading} className="mt-2" variant="contained" color="primary">THÊM TÀI KHOẢN</Button>
                    }
                </Paper>
            </form >
        );
    }
    public handleChangeCreateState = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        this.setState({ user: { ...this.state.user, [key]: (e.target as any).value } });
    }

    public handleShowPwd = (e: any) => {
        this.setState({ showPwd: !this.state.showPwd });
    }

    public handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        const { user: { password, email, role }, expanded } = this.state;

        const complete = (result: any) => {
            const { displayName, emailVerified, isAnonymous, metadata: { creationTime, lastSignInTime }, phoneNumber, photoURL, uid } = result.user;
            const data = {
                email, emailVerified, isAnonymous, displayName, creationTime, lastSignInTime, phoneNumber, photoURL, role, status: 'open'
            };
            return firebase.firestore().collection('users').doc(uid).set(data).then(() => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Tạo tài khoản thành công' } });
            }).catch((error: Error) => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi khi thêm thông tin tài khoản', content: error.toString() } });
                return (firebase.auth().currentUser as any).delete();
            });
        };
        
        switch(expanded){
            case 1:
                firebase.auth().createUserWithEmailAndPassword(email, password).then(complete).catch((error: Error) => {
                    this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi khi thêm tài khoản', content: error.toString() } });
                }).then(() => {
                    this.setState({ loading: false });
                });
            break;
        }


    }
}

export default connect(e => e)(CreateUser);

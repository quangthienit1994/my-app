import * as React from 'react';
import { connect } from 'react-redux';
import { Input, FormControl, InputLabel, IconButton, InputAdornment, Button, AppBar, Toolbar, Typography, Grid, Paper, CircularProgress } from '@material-ui/core';
import { AccountBox, Visibility, VisibilityOff } from '@material-ui/icons';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';

class Login extends React.Component<any, any>{
    public state = {
        showPwd: false,
        email: '',
        password: '',
        loading: false
    };

    public render() {
        return (
            <Paper>
                <AppBar position="static" color="primary">
                    <Toolbar color="inherit">
                        <Typography color="inherit">ĐĂNG KÝ</Typography>
                        <Link to="/login" color="inherit" className="ml-auto">
                            <Button component="div" color="inherit">
                                <Typography color="inherit">ĐĂNG NHẬP</Typography>
                            </Button>
                        </Link>
                    </Toolbar>
                </AppBar>
                <div className="p-2">
                    <Grid container={true}>
                        <Grid item={true} xs={12} sm={6} className="d-flex">
                            <div className="d-flex w-100 height-100 align-items-center justify-content-center">
                                <div className="clearfix">
                                    <Typography component="p" variant="subtitle1">Chào mừng <strong>FIREBASE</strong></Typography>
                                    <Typography component="p" variant="caption">Ứng dụng giành cho website applications</Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <form action="/login" method="post" onSubmit={this.handleSubmit}>
                                <Grid container={true} className="mt-2 mb-2">
                                    <Grid item={true} xs={12} sm={6} className="mb-2">
                                        <FormControl className="w-100">
                                            <InputLabel>Email</InputLabel>
                                            <Input
                                                value={this.state.email}
                                                onChange={this.onChange('email')}
                                                type="email"
                                                required={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton disabled={true}>
                                                            <AccountBox />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                inputProps={{
                                                    required: true
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item={true} xs={12} sm={6} className="mb-2">
                                        <FormControl className="w-100">
                                            <InputLabel>Mật khẩu</InputLabel>
                                            <Input
                                                value={this.state.password}
                                                onChange={this.onChange('password')}
                                                type={this.state.showPwd ? "text" : "password"}
                                                required={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={this.handleShowPWD}>
                                                            {this.state.showPwd ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                inputProps={{
                                                    required: true,
                                                    min: 6,
                                                    max: 255
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        {
                                            this.state.loading ? <CircularProgress /> : <Button className="ml-auto" type="submit" variant="contained" color="primary">ĐĂNG KÝ</Button>
                                        }
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </div>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Link to="/"><Button component="div" color="inherit">ĐÓNG</Button></Link>
                    </Toolbar>
                </AppBar>
            </Paper>
        );
    }

    public handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.setState({ loading: true });
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((result: any) => {
            const { displayName, emailVerified, isAnonymous, metadata: { creationTime, lastSignInTime }, phoneNumber, photoURL, uid } = result.user;
            const data = {
                email: this.state.email, emailVerified, isAnonymous, displayName, creationTime, lastSignInTime, phoneNumber, photoURL, role: 'user', status: 'open'
            };
            return firebase.firestore().collection('users').doc(uid).set(data).then(() => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Đăng ký thành công' } });
            });
        }).catch((error: Error) => {
            this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Đăng ký thất bại', content: error.toString() } });
        }).then(() => {
            this.setState({ loading: false });
        });
    }

    public onChange = (key: string) => (e: React.ChangeEvent<any>) => {
        this.setState({ [key]: e.target.value });
    }

    public handleShowPWD = () => {
        this.setState({ showPwd: !this.state.showPwd });
    }
}

export default connect(e => e)(Login);
import * as React from 'react';
import { connect } from 'react-redux';
import { Input, FormControl, InputLabel, IconButton, InputAdornment, Button, AppBar, Toolbar, Typography, Grid, Paper, CircularProgress } from '@material-ui/core';
import { AccountBox } from '@material-ui/icons';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';

class Login extends React.Component<any, any>{
    public state = {
        showPwd: false,
        email: '',
        loading: false
    };

    public render() {
        return (
            <Paper>
                <AppBar position="static" color="primary">
                    <Toolbar color="inherit">
                        <Typography color="inherit">QUÊN MẬT KHẨU</Typography>
                        <Link to="/register" color="inherit" className="ml-auto">
                            <Button component="div" color="inherit">
                                <Typography color="inherit">ĐĂNG KÝ</Typography>
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
                                    <Grid item={true} xs={12} className="mb-2">
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
                                    <Grid item={true} xs={12}>
                                        {
                                            this.state.loading ? <CircularProgress /> : <Button className="ml-auto" type="submit" variant="contained" color="primary">ĐĂNG NHẬP</Button>
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
        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
            this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Gửi yêu cầu thành công, vui lòng email của bạn' } });
        }).catch((error: Error) => {
            this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Gửi yêu cầu thất bại', content: error.toString() } });
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
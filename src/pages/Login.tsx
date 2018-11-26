import * as React from 'react';
import { connect } from 'react-redux';
import { Slide } from '@material-ui/core';
import Login from './Action/Login/Login';
import { Button, AppBar, Toolbar, Typography, Grid, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';

class LoginScreen extends React.Component<any, any>{
    public render() {
        return (
            <div style={{ minHeight: '100vh' }} className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Slide direction="down" in={true}>
                    <div className="clearfix">
                        <AppBar position="static" color="primary">
                            <Toolbar color="inherit">
                                <Typography color="inherit">ĐĂNG NHẬP</Typography>
                                <Link to="/register" color="inherit" className="ml-auto">
                                    <Button component="div" color="inherit">
                                        <Typography color="inherit">ĐĂNG KÝ</Typography>
                                    </Button>
                                </Link>
                            </Toolbar>
                        </AppBar>
                        <Paper className="rounded-0 p-2">
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
                                    <Login />
                                    <Link to="/forgot-password">
                                        <Button>Quên mật khẩu ?</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Paper>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <Link to="/"><Button component="div" color="inherit">ĐÓNG</Button></Link>
                            </Toolbar>
                        </AppBar>
                    </div>
                </Slide>
            </div>
        );
    }
}

export default connect(e => e)(LoginScreen);
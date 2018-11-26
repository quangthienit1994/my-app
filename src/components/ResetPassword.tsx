import * as React from 'react';
import Login from 'src/pages/Action/Login/Login';
import { Input, FormControl, InputLabel, IconButton, InputAdornment, Button, Typography, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as firebase from 'firebase/app';

class ResetPassword extends React.Component {
    public state = {
        password: '',
        logged: false,
        showPwd: false,
        error: '',
        success: false,
        loading: false
    };

    public render() {
        const { logged } = this.state;
        return (
            <form action="#">
                {!logged ? <Login onLoginSuccess={this.authSuccess} /> : (
                    <div className="clearfix w-100">
                        <Typography color="error">{this.state.error}</Typography>
                        {this.state.success ? <Typography color="textPrimary">Đổi mật khẩu thành công</Typography> : (
                            <div className="clearfix w-100">
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
                                {
                                    this.state.loading ? <CircularProgress /> : <Button className="mt-2" onClick={this.resetPassword} variant="contained" color="primary">ĐỔI MẬT KHẨU</Button>
                                }
                            </div>
                        )}
                    </div>
                )}
            </form>
        );
    }
    public onChange = (key: string) => (e: React.ChangeEvent<any>) => {
        this.setState({ [key]: e.target.value });
    }

    public handleShowPWD = () => {
        this.setState({ showPwd: !this.state.showPwd });
    }

    protected authSuccess = (auth: any) => {
        this.setState({ logged: true });
    }

    protected resetPassword = () => {
        const { password } = this.state;
        this.setState({loading: true});
        (firebase.auth().currentUser as any).updatePassword(password).then(() => {
            this.setState({ success: true });
        }).catch((error: Error) => {
            this.setState({ error: error.toString() });
        }).then(() => {
            this.setState({loading: false});
        });
    }

}

export default ResetPassword;

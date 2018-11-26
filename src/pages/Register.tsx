import * as React from 'react';
import { connect } from 'react-redux';
import { Slide}  from '@material-ui/core';
import Register from './Action/Register';

class RegisterScreen extends React.Component <any,any>{
    public render() {
        return (
            <div style={{ minHeight: '100vh' }} className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Slide direction="down" in={true}>
                    <Register />
                </Slide>
            </div>
        );
    }
}

export default connect(e => e)(RegisterScreen);
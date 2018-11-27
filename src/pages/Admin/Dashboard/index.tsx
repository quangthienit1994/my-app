import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Divider } from '@material-ui/core';
import Posts from './components/Posts';
import Users from './components/Users';
import { DashboardOutlined } from '@material-ui/icons';

class Dashboard extends React.Component<any, any>{

    public state = {
        components: [Users, Posts]
    };

    public render() {
        return (
            <div className="libraries">
                <div className="p-2">
                    <Typography className="d-flex align-items-center" variant="subtitle1"><DashboardOutlined /> Trang quản lý ứng dụng &nbsp;<strong>FIREBASE</strong></Typography>
                    <Divider />
                </div>
                <Grid container={true}>
                    {
                        this.state.components.map((Comp: any, i: any) => <Comp key={i} />)
                    }
                </Grid>
            </div>
        );
    }
}

export default connect(e => e)(Dashboard);
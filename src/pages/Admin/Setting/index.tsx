import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Paper } from '@material-ui/core';
import Data from './Data';
import Security from './Security';
import { Security as SecurityIcon, Settings } from '@material-ui/icons';

class Setting extends React.Component {
    public state = {
        activeTab: 0
    };

    public handleUpdateState = (event: any, activeTab: any) => {
        this.setState({ activeTab, post: null });
    };
    public render() {
        return (
            <div id="page-settings">
                <Paper className="mb-1 rounded-0">
                    <Tabs
                        fullWidth={true}
                        scrollable={true}
                        value={this.state.activeTab}
                        onChange={this.handleUpdateState}
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        <Tab icon={<SecurityIcon />} component="div" label="TỔNG QUÁT" />
                        <Tab icon={<Settings />} component="div" label="THÊM DỮ LIỆU WEBSITE" />
                    </Tabs>
                </Paper>

                {this.state.activeTab === 0 && <Data />}
                {this.state.activeTab === 1 && <Security />}
            </div>
        );
    }
}

export default connect(e => e)(Setting);

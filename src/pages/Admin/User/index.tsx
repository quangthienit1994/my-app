import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Paper } from '@material-ui/core';
import { Group, GroupAdd } from '@material-ui/icons';
import Users from './Users';
import Create from './Create';

class Index extends React.Component <any,any>{
    public state = {
        activeTab: 0
    };

    public handleUpdateState = (event: any, activeTab: any) => {
        this.setState({ activeTab });
    }

    public render() {
        return (
            <div className="libraries">
                <Paper className="mb-1 rounded-0 d-inline-block w-100">
                    <Tabs
                        fullWidth={true}
                        scrollable={true}
                        value={this.state.activeTab}
                        onChange={this.handleUpdateState}
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        <Tab component="div" label="TẤT CẢ NGƯỜI DÙNG" icon={<Group />} />
                        <Tab component="div" label="THÊM TÀI KHOẢN" icon={<GroupAdd />} />
                    </Tabs>
                </Paper>
                { this.state.activeTab === 0 && <Users /> }
                { this.state.activeTab === 1 && <Create /> }
            </div>
        );
    }
}

export default connect(e => e)(Index);
import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Paper } from '@material-ui/core';
import { CloudUpload, Image, Build } from '@material-ui/icons';
import Upload from './Upload';
import All from './All';
import Edit from './Edit';

class Libraries extends React.Component<any, any>{
    public state = {
        activeTab: 0
    };

    public handleUpdateState = (event: any, activeTab: any) => {
        this.setState({ activeTab });
    }

    public render() {
        return (
            <div className="libraries">
                <Paper className="mb-1 rounded-0">
                    <Tabs
                        fullWidth={true}
                        scrollable={true}
                        value={this.state.activeTab}
                        onChange={this.handleUpdateState}
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        <Tab component="div" label="TẢI LÊN" icon={<CloudUpload />} />
                        <Tab component="div" label="THƯ VIỆN" icon={<Image />} />
                        <Tab component="div" label="CHỈNH SỬA" icon={<Build />} />
                    </Tabs>
                </Paper>

                <div className="p-1">
                    {this.state.activeTab === 0 && <Upload />}
                    {this.state.activeTab === 1 && <All onChange={this.props.onChange ? this.props.onChange : undefined} />}
                    {this.state.activeTab === 2 && <Edit />}
                </div>
            </div>
        );
    }
}

export default connect(e => e)(Libraries);

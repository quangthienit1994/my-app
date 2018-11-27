import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, AppBar } from '@material-ui/core';
import data from './data';
import Setting from '../Setting/class.setting';
import General from './General';

class Woocommerc extends React.Component {
    public state: any = {};
    constructor(props: any) {
        super(props);
        this.state = {
            settings: data.map((node) => new Setting(node.key, node, this.update)),
            activeTab: 0
        };
    }

    public update = () => {
        this.forceUpdate();
    }
    public handleUpdateState = (event: any, activeTab: any) => {
        this.setState({ activeTab, post: null });
    };

    public componentWillMount() {
        document.title = "Cài đặt cửa hàng";
    };
    public render() {
        return (
            <div id="woocommerc">
                <AppBar position="static" color="default" className="mb-1">
                    <Tabs
                        fullWidth={true}
                        scrollable={true}
                        value={this.state.activeTab}
                        onChange={this.handleUpdateState}
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        <Tab component="div" label="Chung" />
                        <Tab component="div" label="Sản phẩm" />
                        <Tab component="div" label="Thuế" />
                        <Tab component="div" label="Giao nhận" />
                        <Tab component="div" label="Thanh toán" />
                        <Tab component="div" label="Tài khoản" />
                        <Tab component="div" label="Email" />
                    </Tabs>
                </AppBar>

                {this.state.activeTab === 0 && <General settings={this.state.settings} />}
            </div>
        );
    }
}

export default connect(e => e)(Woocommerc);

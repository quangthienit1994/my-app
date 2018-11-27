import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Divider } from '@material-ui/core';
import { Assessment } from '@material-ui/icons';
import Product from './woocoomercs/Product';
import WareHouse from './woocoomercs/WareHouse';
import Shipping from './woocoomercs/Shipping';

class Woocoommerc extends React.Component<any, any> {
    public state = {
        activeTab: 'product'
    };

    public render() {
        return (
            <Grid container={true} className="mt-2">
                <Grid item={true} xs={12} sm={6} md={4} xl={3}>
                    <Paper className="rounded-0">
                        <List component="div">
                            <ListItem button={true} onClick={this.activeTab('product')}>
                                <ListItemIcon>
                                    <Assessment />
                                </ListItemIcon>
                                <ListItemText>Sản phẩm</ListItemText>
                            </ListItem>
                            <Divider />
                            <ListItem button={true} onClick={this.activeTab('warehouse')}>
                                <ListItemIcon>
                                    <Assessment />
                                </ListItemIcon>
                                <ListItemText>kho hàng</ListItemText>
                            </ListItem>
                            <Divider />
                            <ListItem button={true} onClick={this.activeTab('shipping')}>
                                <ListItemIcon>
                                    <Assessment />
                                </ListItemIcon>
                                <ListItemText>Giao và nhận</ListItemText>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
                <Grid item={true} xs={12} sm={6} md={8} xl={9} className="pl-sm-1">
                    {this.state.activeTab === 'product' && <Product {...this.props} />}
                    {this.state.activeTab === 'warehouse' && <WareHouse {...this.props} />}
                    {this.state.activeTab === 'shipping' && <Shipping {...this.props} />}
                </Grid>
            </Grid>
        );
    }

    protected activeTab = (activeTab: string) => () => {
        this.setState({ activeTab });
    }
}

export default connect(e => e)(Woocoommerc);

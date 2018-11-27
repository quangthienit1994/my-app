import * as React from 'react';
import { connect } from 'react-redux';
import { Paper, Checkbox, Typography, TextField, Grid, FormControlLabel, Divider } from '@material-ui/core';

class WareHouse extends React.PureComponent<any, any>{
    public render() {
        return (
            <Paper className="rounded-0 p-2">
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Mã sản phẩm</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <TextField className="w-100" onChange={this.props.onChange('product_code')} value={this.props.post.product_code} />
                    </Grid>
                </Grid>
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Quản lý kho hàng</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <FormControlLabel
                            label="Cho phép quản lý kho hàng theo mức độ sản phẩm"
                            control={<Checkbox checked={this.props.post.manage_warehouse} onChange={this.props.onChange('manage_warehouse')} />}
                        />
                    </Grid>
                </Grid>
                {
                    this.props.post.manage_warehouse && (
                        <Grid container={true} className="mb-2">
                            <Grid item={true} xs={12} sm={4}>
                                <Typography>Số lượng trong kho</Typography>
                            </Grid>
                            <Grid item={true} xs={12} sm={8}>
                                <TextField type="number" placeholder="15000000" className="w-100" onChange={this.props.onChange('number_of_product_in_warehouse')} value={this.props.post.number_of_product_in_warehouse} />
                            </Grid>
                        </Grid>
                    )
                }
                {
                    this.props.post.manage_warehouse && (
                        <Grid container={true} className="mb-2">
                            <Grid item={true} xs={12} sm={4}>
                                <Typography>Cho phép đặt hàng trước</Typography>
                            </Grid>
                            <Grid item={true} xs={12} sm={8}>
                                <FormControlLabel
                                    label="Sản phẩm được phép đặt hàng kể cả khi không còn hàng trong kho"
                                    control={<Checkbox checked={this.props.post.allows_pre_ordering} onChange={this.props.onChange('allows_pre_ordering')} />}
                                />
                            </Grid>
                        </Grid>
                    )
                }
                <Divider />
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Bán riêng</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <FormControlLabel
                            label="Kích hoạt tính năng này để chỉ cho phép một trong những mặt hàng này được mua trong một đơn đặt hàng."
                            control={<Checkbox checked={this.props.post.sold_individually} onChange={this.props.onChange('sold_individually')} />}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    public onChangeDate = (key: string) => (e: any) => {
        this.props.onChange(key)({ target: { value: new Date(e.target.value).getTime() } });
    }
}

export default connect(e => e)(WareHouse);

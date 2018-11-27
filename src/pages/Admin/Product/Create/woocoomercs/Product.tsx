import * as React from 'react';
import { connect } from 'react-redux';
import { Paper, Select, MenuItem, Typography, TextField, Button, Grid } from '@material-ui/core';
import * as moment from 'moment';

class Product extends React.PureComponent<any, any>{
    public state = {
        showCalendarSalesOff: false
    }
    public render() {
        return (
            <Paper className="rounded-0 p-2">

                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Loại sản phẩm</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <Select className="w-100" onChange={this.props.onChange('product_type')} value={this.props.post.product_type}>
                            <MenuItem disabled={true}>Chọn loại sản phẩm</MenuItem>
                            <MenuItem value="single">Sản phẩm đơn giản</MenuItem>
                            <MenuItem value="group">Sản phẩm gom nhóm</MenuItem>
                            <MenuItem value="link">Sản phẩm bên ngoài / liên kết</MenuItem>
                            <MenuItem value="child">Sản phẩm có biến thể</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                {
                    this.props.post.product_type === 'link' && (
                        <Grid container={true} className="mb-2">
                            <Grid item={true} xs={12} sm={4}>
                                <Typography>URL sản phẩm</Typography>
                            </Grid>
                            <Grid item={true} xs={12} sm={8}>
                                <TextField placeholder="https://..." className="w-100" onChange={this.props.onChange('product_link')} value={this.props.post.product_link} />
                            </Grid>
                        </Grid>
                    )
                }
                {
                    this.props.post.product_type === 'link' && (
                        <Grid container={true} className="mb-2">
                            <Grid item={true} xs={12} sm={4}>
                                <Typography>Nội dung nút bấm</Typography>
                            </Grid>
                            <Grid item={true} xs={12} sm={8}>
                                <TextField placeholder="Mua sản phẩm" className="w-100" onChange={this.props.onChange('product_link_title')} value={this.props.post.product_link_title} />
                            </Grid>
                        </Grid>
                    )
                }
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Giá bán thường (đ)</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <TextField placeholder="15000000" className="w-100" onChange={this.props.onChange('product_price')} value={this.props.post.product_price} />
                    </Grid>
                </Grid>
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Giá khuyến mãi (đ)</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <div className="d-flex w-100">
                            <TextField placeholder="15000000" className="w-100" onChange={this.props.onChange('product_price_sales')} value={this.props.post.product_price_sales} />
                            {!this.state.showCalendarSalesOff && <Button onClick={this.showCalendarSalesOff} size="small" style={{ textTransform: 'none' }}>Lên lịch</Button>}
                        </div>
                    </Grid>
                </Grid>
                {
                    this.state.showCalendarSalesOff && (
                        <Grid container={true} className="mb-2">
                            <Grid item={true} xs={12} sm={4}><Typography>Ngày giảm giá</Typography></Grid>
                            <Grid item={true} xs={12} sm={8} className="align-items-end">
                                <TextField type="datetime-local" label="Từ ngày" onChange={this.onChangeDate('product_sales_from')} value={moment(this.props.post.product_sales_from).utc().format().slice(0, 16)} />
                                <TextField type="datetime-local" label="Đến ngày" onChange={this.onChangeDate('product_sales_to')} value={moment(this.props.post.product_sales_to).utc().format().slice(0, 16)} />
                                <Button onClick={this.showCalendarSalesOff} size="small" style={{ textTransform: 'none' }}>Hủy</Button>
                            </Grid>
                        </Grid>
                    )
                }
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Trạng thái thuế ( % )</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <TextField type="number" className="w-100" onChange={this.props.onChange('product_tax')} value={this.props.post.product_tax} />
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    public showCalendarSalesOff = () => {
        this.setState({ showCalendarSalesOff: !this.state.showCalendarSalesOff });
    }

    public onChangeDate = (key: string) => (e: any) => {
        this.props.onChange(key)({ target: { value: new Date(e.target.value).getTime() } });
    }
}

export default connect(e => e)(Product);

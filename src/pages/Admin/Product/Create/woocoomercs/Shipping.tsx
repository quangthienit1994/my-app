import * as React from 'react';
import { connect } from 'react-redux';
import { Paper, Typography, TextField, Grid, FormControlLabel, Checkbox } from '@material-ui/core';

class Shipping extends React.PureComponent<any, any>{
    public state = {
        kind_of_shipings: [
            { name: 'Giao hàng miễn phí', value: 0 },
            { name: 'Giao hàng nhanh ( từ 1 đến 2 tuần )', value: 10000 },
            { name: 'Giao hàng siêu nhanh ( trong vòng 1 tuần )', value: 20000 },
            { name: 'Giao hàng vip ( trong vòng 3 ngày )', value: 500000 },
        ]
    };

    public render() {
        return (
            <Paper className="rounded-0 p-2">
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Trọng lượng ( kg )</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <TextField type="number" className="w-100" onChange={this.props.onChange('product_weight')} value={this.props.post.product_weight} />
                    </Grid>
                </Grid>
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Kích thước ( mm )</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        <div className="d-flex w-100">
                            <TextField type="number" label="Chiều dài" onChange={this.props.onChange('product_size_x')} value={this.props.post.product_size_x} />
                            <TextField type="number" label="Chiều rộng" onChange={this.props.onChange('product_size_y')} value={this.props.post.product_size_y} />
                            <TextField type="number" label="Chiều cao" onChange={this.props.onChange('product_size_z')} value={this.props.post.product_size_z} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container={true} className="mb-2">
                    <Grid item={true} xs={12} sm={4}>
                        <Typography>Loại hình giao hàng</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sm={8}>
                        {
                            this.state.kind_of_shipings.map(({ name, value }: any, i: number) => {
                                return (
                                    <FormControlLabel
                                        className="w-100"
                                        key={i}
                                        label={name}
                                        control={<Checkbox checked={this.props.post.kind_of_shipings && this.props.post.kind_of_shipings.find((node: any) => node.value === value)} onChange={this.onChange({ name, value })} />}
                                    />
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    public onChange = (key: any) => (e: any) => {
        let { kind_of_shipings } = this.props.post;
        if (!kind_of_shipings) {
            kind_of_shipings = [];
        }
        if (e.target.checked) {
            kind_of_shipings.push(key);
        } else {
            kind_of_shipings = kind_of_shipings.filter(({ value }: any) => value !== key.value);
        }
        this.props.onChange('kind_of_shipings')({ target: { value: kind_of_shipings } });
    }
}

export default connect(e => e)(Shipping);

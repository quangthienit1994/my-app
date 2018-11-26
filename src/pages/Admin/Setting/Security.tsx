import * as React from 'react';
import { connect } from 'react-redux';
import { TextField, Paper, withStyles, Select, MenuItem, FormControl, InputLabel, Button, IconButton, FormControlLabel, Checkbox, Typography, CircularProgress } from '@material-ui/core';
import * as firebase from 'firebase/app';
import Delete from '@material-ui/icons/Delete';

class Index extends React.Component<any, any>{
    public state = {
        settings: [],
        option: {
            label: '',
            key: '',
            type: 'public',
            value: '',
            group: 'public',
            required: false,
            fieldType: 'text'
        },
        source: [],
        loading: false
    }
    public render() {
        return (
            <div className="libraries">
                <Paper className="mt-2 p-2">
                    <form action="#" onSubmit={this.handleClick}>
                        <div className="clearfix w-100">
                            <TextField required={true} value={this.state.option.label} onChange={this.onChange('label')} className="mb-2 w-100" label="Tên dữ liệu" />
                            <TextField required={true} value={this.state.option.key} onChange={this.onChange('key')} className="mb-2 w-100" label="ID" placeholder="ID này là độc nhất" />
                            <TextField value={this.state.option.group} onChange={this.onChange('group')} className="mb-2 w-100" label="Nhóm dữ liệu" />
                            <Typography variant="caption">Dùng để đánh dấu nơi dữ liệu sẽ được tải</Typography>
                            <TextField required={true} value={this.state.option.value} onChange={this.onChange('value')} className="mb-2 w-100" label="Giá trị mặc định" />
                            <FormControl className="mb-2 w-100">
                                <InputLabel>Loại dữ liệu*</InputLabel>
                                <Select required={true} className="w-100" value={this.state.option.fieldType} onChange={this.onChange('fieldType')}>
                                    <MenuItem value="text">Chuỗi</MenuItem>
                                    <MenuItem value="number">Số</MenuItem>
                                    <MenuItem value="time">Giờ giấc 20:40:21</MenuItem>
                                    <MenuItem value="date">Ngày Tháng 12/32/2019</MenuItem>
                                    <MenuItem value="datetime-local">Thời gian 12/32/2019 20:40:21</MenuItem>
                                    <MenuItem value="password">Mật khẩu</MenuItem>
                                    <MenuItem value="file">File</MenuItem>
                                    <MenuItem value="image">Hình ảnh</MenuItem>
                                    <MenuItem value="radio">Radio</MenuItem>
                                    <MenuItem value="checkbox">Checkbox</MenuItem>
                                    <MenuItem value="select">Lựa chọn</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                label="Trường bắt buộc?"
                                control={<Checkbox checked={this.state.option.required} onChange={this.onChange('required')} />}
                            />
                            {
                                this.getDataSource()
                            }
                        </div>
                        <div className="clearfix w-100 mb-2">
                            <Typography>Chú ý*:</Typography>
                            <Typography>- Bạn không thể chỉnh sửa hay xóa sau khi nhấn nút lưu</Typography>
                        </div>
                        {
                            this.state.loading ? <CircularProgress /> : <Button variant="contained" color="primary" type="submit">LƯU</Button>
                        }
                    </form>
                </Paper>
            </div>
        );
    }

    public getDataSource() {
        switch (this.state.option.fieldType) {
            case 'radio':
            case 'checkbox':
            case 'select':
                return (
                    <div id="add-datasource" className="mt-2 mb-2">
                        <table>
                            <tbody>
                                {
                                    this.state.source.map(({ name, value }: any, i) => {
                                        return (
                                            <tr key={i}>
                                                <td><TextField label="Tên dữ liệu" value={name} onChange={this.handleChangeSource('name', i)} /></td>
                                                <td><TextField label="Giá trị" value={value} onChange={this.handleChangeSource('key', i)} /></td>
                                                <td>
                                                    <IconButton onClick={this.handleDeleteSource(i)}>
                                                        <Delete />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        <Button color="default" variant="contained" className="mt-2" onClick={this.addDataSource}>Thêm dữ liệu</Button>
                    </div>
                );
            default:
                return null;
        }
    }

    public addDataSource = () => {
        const { source }: any = this.state;
        source.push({ key: '', value: '' });
        this.setState({ source });
    }

    public handleDeleteSource = (i: number) => (e: any) => {
        const { source }: any = this.state;
        this.setState({ source: source.filter((n: any, j: number) => j !== i) });
    }

    public handleChangeSource = (key: string, i: number) => (e: any) => {
        const { source }: any = this.state;
        source[i][key] = e.target.value;
        this.setState({ source });
    }

    public handleClick = (e: React.FormEvent) => {
        e.preventDefault();
        this.setState({ loading: true });
        firebase.firestore().collection('settings').where('key', '==', this.state.option.key).get().then(result => {
            if (result.docs.length) {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'ID đã tồn tại, vui lòng chọn ID khác' } });
                return this.setState({ loading: false });
            }
            firebase.firestore().collection('settings').add({ ...this.state.option, source: this.state.source })
            return this.setState({ loading: false });
        });
    }

    public onChange = (key: string) => (e: any) => {
        if (key === 'required') {
            this.setState({ option: { ...this.state.option, [key]: e.target.checked } });
        } else {
            this.setState({ option: { ...this.state.option, [key]: e.target.value } });
        }
    }
}

export default withStyles({}, { withTheme: true })(connect(e => e)(Index));
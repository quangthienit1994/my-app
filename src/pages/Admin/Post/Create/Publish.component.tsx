import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, ExpansionPanelActions, Button, Input, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete, PublicOutlined, CalendarToday } from '@material-ui/icons';
import * as moment from 'moment';

class PublishCom extends React.Component<any, any>{


    public render() {
        const { date, status, uid } = this.props.post;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Đăng bài viết</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="w-100 d-block">
                        <FormControl className="w-100 mb-2">
                            <InputLabel>Ngày đăng bài viết</InputLabel>
                            <Input
                                type="datetime-local"
                                value={moment(date).utc().format().slice(0, 16)}
                                onChange={this.handleChangeDate}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CalendarToday />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl className="w-100">
                            <InputLabel>Trạng thái bài viết</InputLabel>
                            <Select className="w-100" value={status} onChange={this.props.onChange('status')}>
                                <MenuItem value="publish">Công khai</MenuItem>
                                <MenuItem value="trash">Lưu nháp</MenuItem>
                                <MenuItem value="pending">Xét duyệt</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    <div className="d-flex justify-content-between w-100">
                        <Button disabled={status === 'trash'} onClick={this.handleTrash} variant="contained" color="default"><Delete /> Lưu nháp</Button>
                        <Button disabled={this.props.loading} onClick={this.props.onSubmit} variant="contained" color="primary"><PublicOutlined /> {uid ? 'Cập nhật bài viết' : 'Đăng bài viết'}</Button>
                    </div>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
    public handleTrash =  (e: React.ChangeEvent<any>) => {
        this.props.onChange('status')({ ...e, target: { ...e.target, value: 'trash' } });
    };

    public handleChangeDate = (e: React.ChangeEvent<any>) => {
        const date = new Date(e.target.value);
        this.props.onChange('date')({ ...e, target: { ...e.target, value: date } });
    };

}

export default connect(e => e)(PublishCom);
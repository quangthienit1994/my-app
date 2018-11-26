import * as React from 'react';
import { connect } from 'react-redux';
import { IconButton, ListItem, ListSubheader, ListItemText, ListItemIcon, DialogTitle, Dialog, DialogContent, DialogActions, Divider, Button, CircularProgress, ListItemAvatar, Avatar } from '@material-ui/core';

import { KeyboardArrowRight, Close } from '@material-ui/icons';

interface IProps {
    title: string;
    description?: string;
    dialogTitle?: string;
    onSave?: any;
    avatar?: string;
    loading?: boolean;
    actions?: React.ReactElement<any>;
    fullSceen?: boolean;
    hideTitle?: boolean;
    component?: any;
    disabledSubmitBtn?: boolean;
    [key: string]: any;
}

class Component extends React.Component<IProps, any>{
    public static defaultProps = {
        fullSceen: false
    };

    public state = {
        open: false
    };
    public render() {
        const { title, description, dialogTitle, actions, loading, avatar, hideTitle, component } = this.props;
        return (
            <React.Fragment>
                <ListItem component={component}>
                    {avatar && <ListItemAvatar><Avatar src={avatar} /></ListItemAvatar>}
                    <ListSubheader component="div">{title}</ListSubheader>
                    <ListItemText className="text-right">{description}</ListItemText>
                    <ListItemIcon><IconButton onClick={this.handleOpen}><KeyboardArrowRight /></IconButton></ListItemIcon>
                </ListItem>
                <Dialog fullScreen={this.props.fullSceen} open={this.state.open} onClose={this.handleOpen}>
                    {
                        !hideTitle && (
                            <DialogTitle>
                        <div className="d-flex align-items-center">
                            <span>{dialogTitle || title}</span>
                            {this.props.fullSceen && <IconButton className="ml-auto" onClick={this.handleOpen}><Close /></IconButton>}
                        </div>
                    </DialogTitle>
                        )
                    }
                    <Divider />
                    <DialogContent className={hideTitle ? "p-0" : "mt-2"}>
                        {this.props.children}
                    </DialogContent>
                    <DialogActions>
                        {actions}
                        <Button className="ml-auto mr-1"  variant="contained" color="default" onClick={this.handleOpen}>Đóng</Button>
                        {loading ? <CircularProgress /> : this.props.onSave && <Button disabled={this.props.disabledSubmitBtn} onClick={this.props.onSave} variant="contained" color="primary">Lưu lại</Button>}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
    public handleOpen = () => {
        this.setState({ open: !this.state.open });
    }
}

export default connect(e => e)(Component);

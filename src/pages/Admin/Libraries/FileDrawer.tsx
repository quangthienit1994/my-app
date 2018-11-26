import * as React from 'react';
import { SwipeableDrawer, List, IconButton, Tooltip, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Info, TrackChanges } from '@material-ui/icons';
import DeleteMedia from './Delete';
import ViewInfo from './ViewInfo';

interface IState {
    open: boolean;
}

interface IProps {
    dataSource: any;
    onChange: (e: any) => any;
}

export class FileDrawer extends React.Component<IProps, IState>{
    public state = {
        open: false
    };

    public onClose = (e: any) => {
        this.setState({ open: !this.state.open });
    }

    public render() {
        const { open } = this.state;
        return (
            <React.Fragment>
                <Tooltip key={1} title="Xem chi tiết">
                    <IconButton onClick={this.onClose} className="text-light">
                        <Info />
                    </IconButton>
                </Tooltip>
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={this.onClose}
                    onOpen={this.onClose}
                >
                    <List>
                        <DeleteMedia dataSource={this.props.dataSource} />
                        <ViewInfo dataSource={this.props.dataSource} />
                        {
                            this.props.onChange && <ListItem button={true} onClick={this.onChange}>
                                <ListItemIcon><TrackChanges /></ListItemIcon>
                                <ListItemText>Chọn hình ảnh</ListItemText>
                            </ListItem>
                        }
                    </List>
                </SwipeableDrawer>
            </React.Fragment>
        );
    }
    protected onChange = () => {
        this.props.onChange(this.props.dataSource.photoURL);
    };
}

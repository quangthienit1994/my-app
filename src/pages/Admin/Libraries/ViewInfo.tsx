import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button, TableRow, TableCell, Table, TableBody, Paper, Grid, withStyles } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import * as firebase from 'firebase/app';

interface IProps {
    dataSource: any;
    theme: any;
}

interface IState {
    data: any;
    open: boolean;
    loading: boolean;
}

export default withStyles({}, { withTheme: true })(
    class ViewInfo extends React.Component<IProps, IState> {
        public state = {
            data: null,
            loading: false,
            open: false
        };

        public render() {
            const { fileName, photoURL } = this.props.dataSource;
            const els = [];
            const { data }: any = this.state;
            if (this.state.data) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        els.push(<TableRow key={key}><TableCell>{key}</TableCell><TableCell>{data[key]}</TableCell></TableRow>);
                    }
                }
            }

            return (
                <React.Fragment>
                    <ListItem onClick={this.handleViewInfo} button={true}>
                        <ListItemIcon><Info /></ListItemIcon>
                        <ListItemText>Xem chi tiết</ListItemText>
                    </ListItem>
                    <Dialog fullScreen={true} open={Boolean(this.state.open)}>
                        <DialogTitle>{fileName}</DialogTitle>
                        <DialogContent style={{ backgroundColor: this.props.theme.palette.background.default }} className="pt-2">
                            <Grid container={true}>
                                <Grid item={true} xs={12} sm={6} className="d-flex justify-content-center align-content-center">
                                    <div className="clearfix">
                                        <img className="img-fluid" src={photoURL} alt={fileName} />
                                    </div>
                                </Grid>
                                <Grid item={true} xs={12} sm={6} className="pl-sm-2">
                                    <Paper className="table-responsive">
                                        <Table>
                                            <TableBody>{els}</TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={this.handleCloseViewInfo}>Đóng</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        public handleCloseViewInfo = (e: any) => {
            this.setState({ open: false });
        }

        public handleViewInfo = (e: React.MouseEvent<HTMLElement>) => {
            this.setState({ loading: true });
            const { photoURL } = this.props.dataSource;
            if (this.state.data) {
                this.setState({ open: true });
            } else {
                firebase.storage().refFromURL(photoURL).getMetadata().then(data => {
                    this.setState({ loading: false, data, open: true });
                }).catch((error: Error) => {
                    this.setState({ loading: false });
                });
            }
        }
    }
)

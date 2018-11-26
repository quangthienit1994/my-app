import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, CircularProgress } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as firebase from 'firebase/app';
import { connect } from 'react-redux';
interface IState {
    confirm: boolean;
    deleting: boolean;
}

 class DeleteMedia extends React.Component<any, IState>{
    public state = {
        confirm: false,
        deleting: false
    };

    public render() {
        const { confirm } = this.state;
        return (
            <React.Fragment>
                <ListItem onClick={this.handleCloseDialog} button={true}>
                    <ListItemIcon><Delete /></ListItemIcon>
                    <ListItemText>Xóa file</ListItemText>
                </ListItem>
                <Dialog
                    fullScreen={false}
                    open={confirm}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Bạn có chắc không ?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            File này sẽ bị xóa và không thể hoàn tác, bạn có chắc sẽ xóa file này hay không ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {
                            !this.state.deleting && <Button onClick={this.handleCloseDialog} color="primary" autoFocus={true} size="small">
                                Không đồng ý
                        </Button>
                        }
                        <Button onClick={this.handleDeleteFile} color="primary" size="small">
                            {this.state.deleting ? <CircularProgress /> : "Đồng ý"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
    public handleCloseDialog = (e: any) => {
        this.setState({ confirm: !this.state.confirm });
    }
    public handleDeleteFile = (e: React.MouseEvent<HTMLElement>) => {
        this.setState({ deleting: true });
        const { photoURL, uid } = this.props.dataSource;
        firebase.storage().refFromURL(photoURL).delete().then(() => {
            return firebase.firestore().collection('libraries').doc(uid).delete();
        }).catch((error: Error) => {
            this.setState({ deleting: false });
            return firebase.firestore().collection('libraries').doc(uid).delete();
        });
    }
}

export default connect(e => e)(DeleteMedia);
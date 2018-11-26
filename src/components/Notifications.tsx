import * as React from 'react';
import { connect } from 'react-redux';
import { Snackbar, Typography } from '@material-ui/core';

class Notifications extends React.Component<any, any>{
    public render() {
        const { NOTIFICATIONS } = this.props;
        return NOTIFICATIONS.map(({ title, content, actions, uid }: any, i: number) => {
            return (
                <Snackbar
                    key={i}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={true}
                    autoHideDuration={6000}
                    onClose={this.handleClose(uid)}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={
                        <React.Fragment>
                            {title && <Typography color="inherit">{title}</Typography>}
                            {content && <Typography color="inherit">{content}</Typography>}
                        </React.Fragment>
                    }
                    action={actions ? actions : null}
                />
            );
        })
    }
    public handleClose = (uid: string) => (e: any) => {
        this.props.dispatch({ type: "REMOVE_NOTIFICATION", uid });
    }
}

export default connect(e => e)(Notifications);

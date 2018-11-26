import * as React from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, AppBar, Toolbar, DialogContent, Typography, DialogActions } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import Libraries from '../pages/Admin/Libraries';

class ChooseFileMedia extends React.Component<any, any>{
  public state = {
    open: false,
  };

  public render() {
    return (
      <React.Fragment>
        <Dialog fullScreen={true} open={this.state.open}>
          <DialogContent className="p-0">
            <Libraries onChange={this.onChange} />
          </DialogContent>
          <DialogActions className="p-0">
            <AppBar position="static">
              <Toolbar>
                <Typography color="inherit">THƯ VIỆN</Typography>
                <Button className="ml-auto" onClick={this.openDialog} color="inherit">ĐÓNG</Button>
              </Toolbar>
            </AppBar>
          </DialogActions>
        </Dialog>
        <Button size="small" onClick={this.openDialog} variant="contained" color="primary"><CloudUpload /> &nbsp;Chọn ảnh</Button>
      </React.Fragment>
    );
  }
  public openDialog = () => {
    this.setState({ open: !this.state.open });
  };
  public onChange = (data: any) => {
    this.setState({ open: false });
    this.props.onChange(data);
  }
}

export default connect(e => e)(ChooseFileMedia);
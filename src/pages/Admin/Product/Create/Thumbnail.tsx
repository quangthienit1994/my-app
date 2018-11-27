import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Button } from '@material-ui/core';
import { ExpandMore, DeleteForever } from '@material-ui/icons';
import ChooseFileMedia from 'src/components/ChooseFileMedia';

class PublishCom extends React.Component<any, any>{
  public state = {
    open: false,
  };

  public render() {
    const { photoURL } = this.props.post;
    return (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography>Ảnh đại diện</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className="clearfix">
              {photoURL && <img src={photoURL} alt="ảnh đại diện" className="img-fluid" />}
              <div className="d-flex align-items-center mt-2 justify-content-center">
                {photoURL && <Button size="small" className="mr-1" onClick={this.removePhotoURL} variant="contained" color="default"><DeleteForever /> Xóa ảnh này</Button>}
                <ChooseFileMedia onChange={this.handleChange}  />
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
    );
  }
  public openDialog = () => {
    this.setState({ open: true });
  };

  public removePhotoURL = () => {
    this.props.onChange('photoURL')({ target: { value: '' } });
  };

  public handleChange = (thumbnail: any) => {
    this.setState({ open: false });
    this.props.onChange('photoURL')({ target: { value: thumbnail } });
  }
}

export default connect(e => e)(PublishCom);
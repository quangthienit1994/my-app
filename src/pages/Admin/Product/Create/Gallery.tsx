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
        let { galleries } = this.props.post;
        if (!galleries) {
            galleries = [];
        }
        return (
            <ExpansionPanel className="mt-2">
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography>Thư viện hình ảnh</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="clearfix">
                        <div className="w-100 mb-2 clearfix">
                            {
                                galleries.map((image: string, i: number) => {
                                    return (
                                        <div key={i} style={{ width: 300 }} className="m-1 d-inline-block pull-left">
                                            {image && <img src={image} alt="ảnh đại diện" className="img-fluid" />}
                                            <div className="d-flex align-items-center mt-2 justify-content-center">
                                                {image && <Button size="small" className="mr-1" onClick={this.removePhotoURL(image)} variant="contained" color="default"><DeleteForever /> Xóa ảnh này</Button>}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <ChooseFileMedia onChange={this.handleChange} />
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
    public openDialog = () => {
        this.setState({ open: true });
    };

    public removePhotoURL = (thumbnail: string) => () => {
        let { galleries } = this.props.post;
        if (!galleries) {
            galleries = [];
        }
        galleries = galleries.filter((n: string) => thumbnail !== n);
        this.props.onChange('galleries')({ target: { value: galleries } });
    };

    public handleChange = (thumbnail: any) => {
        this.setState({ open: false });
        let { galleries } = this.props.post;
        if (!galleries) {
            galleries = [];
        }
        galleries.push(thumbnail);
        this.props.onChange('galleries')({ target: { value: galleries } });
    }
}

export default connect(e => e)(PublishCom);
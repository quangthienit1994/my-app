import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Excerpt extends React.Component <any,any>{
    public render() {
        return (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Mô tả ngắn</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                    <TextField placeholder="Nhập mô tả ngắn ở đây" className="w-100" rows={5} multiline={true} value={this.props.post.excerpt} onChange={this.props.onChange('excerpt')} /> 
              </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default connect(e => e)(Excerpt);
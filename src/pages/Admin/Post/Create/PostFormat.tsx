import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import {ExpandMore, Chat, Audiotrack, Link, Image, Assignment, FormatQuote, VideoCall, Comment } from '@material-ui/icons';

class PublishCom extends React.Component<any, any>{


  public render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>Định dạng</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="d-bloc w-100">
            <RadioGroup name="format" onChange={this.props.onChange('format')} value={this.props.post.format}>
              <FormControlLabel className="mb-0" value="aside" label={<div className="d-flex align-items-center"><Assignment /> Đứng riêng</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="video" label={<div className="d-flex align-items-center"><VideoCall /> Video</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="status" label={<div className="d-flex align-items-center"><Comment /> Trạng thái</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="chat" label={<div className="d-flex align-items-center"><Chat /> Chat</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="quote" label={<div className="d-flex align-items-center"><FormatQuote /> Trích dẫn</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="audio" label={<div className="d-flex align-items-center"><Audiotrack /> Audio</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="link" label={<div className="d-flex align-items-center"><Link /> Đường dẫn</div>} control={<Radio />} />
              <FormControlLabel className="mb-0" value="image" label={<div className="d-flex align-items-center"><Image /> Hình ảnh</div>} control={<Radio />} />
            </RadioGroup>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default connect(e => e)(PublishCom);
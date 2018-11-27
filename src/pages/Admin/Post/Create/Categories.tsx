import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, FormControlLabel, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as firebase from 'firebase/app';

class PublishCom extends React.Component<any, any>{
  public state = {
    terms: []
  };
  public componentDidMount() {
    this.getTerms();
  };

  public render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Danh mục</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography component="div" className="d-block pl-3 w-100" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {this.getDataSource(this.state.terms, null, 0)}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
  public getDataSource(source: any[], childOf: any, index: number) {
    return source.map((node) => {
      if (node.parent === childOf || node.parent && node.parent.id === childOf) {
        return (
          <React.Fragment key={node.uid}>
            {this.getDoom(node, index)}
            {this.getDataSource(source, node.uid, index + 1)}
          </React.Fragment>
        );
      } else {
        return null;
      }
    })
  }
  public getDoom = (node: any, index: number) => {
    const { categories } = this.props.post;
    const { name, uid } = node;
    let i = 0;
    for (let j = 0; j < index; j++) {
      i += 30;
    }
    return (
      <div className="d-bloc w-100">
        <FormControlLabel
          className="mb-0 text-truncate"
          style={{ paddingLeft: i }}
          label={name}
          control={<Checkbox className="p-1" onClick={this.handleChangeTerm(node)} checked={Boolean(categories.find((n: any) => n.uid === uid || n.id === uid))} />}
        />
      </div>
    );
  }
  public handleChangeTerm = (term: any) => (e: any) => {
    let { categories } = this.props.post;
    if (e.target.checked) {
      categories.push(term);
    } else {
      categories = categories.filter((n: any) => n.uid !== term.uid);
    }
    this.props.onChange('categories')({ ...e, target: { ...e.target, value: categories } });
  }
  public getTerms() {
    firebase.firestore()
      .collection('terms')
      .where('type', '==', this.props.type)
      .where('term', '==', this.props.term)
      .onSnapshot(snapshot => {
        const terms: any[] = [];
        const { categories } = this.props.post;
        snapshot.docs.map(doc => {
          const index = categories.findIndex(({ uid }: any) => doc.id);
          const d = { ...doc.data(), uid: doc.id };
          if (index !== -1) {
            categories[index] = d;
            this.props.onChange('categories')({ target: { value: categories } });
          }
          terms.push(d);
        });
        this.setState({ terms });
      })
  };
}

export default connect(e => e)(PublishCom);
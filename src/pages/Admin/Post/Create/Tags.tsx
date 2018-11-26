import * as React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField, Chip, Button, Badge } from '@material-ui/core';
import { ExpandMore, Search, Done } from '@material-ui/icons';
import * as firebase from 'firebase/app';
import string_to_slug from '../../../../helper/string_to_slug';

class Tags extends React.Component<any, any>{
  public state = {
    tags: [],
    search: '',
    loading: false,
    tagsMostUsed: []
  };

  public componentDidMount(){
    this.getMostTags();
  }

  public render() {
    const { tags } = this.props.post;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>Thẻ mây</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="d-block">
            <div className="tags mb-3">
              {
                tags.map((tag: any) => {
                  return (
                    <Chip
                      className="mr-1 mb-1"
                      key={tag.uid}
                      label={tag.name}
                      onDelete={this.handleDelete(tag)}
                      color="primary"
                    />
                  )
                })
              }
            </div>
            <div className="form d-flex align-items-end">
              <TextField
                id="outlined-name"
                className="m-0 mr-1"
                label="Tên thẻ mây"
                value={this.state.search}
                onChange={this.handleSearch}
                margin="normal"
                variant="outlined"
              />
              <Button className="text-truncate" onClick={this.searchTag} disabled={this.state.loading} variant="contained" size="small" color="default"><Search /> Tìm kiếm</Button>
            </div>
            <div className="tags mt-2">
              {
                this.state.tags.map((tag: any) => {
                  if (tags.find(({ uid }: any) => uid === tag.uid)) {
                    return null;
                  }
                  return (
                    <Chip
                      className="mr-1 mb-1"
                      key={tag.uid}
                      label={tag.name}
                      deleteIcon={<Done />}
                      onDelete={this.handleChange(tag)}
                      color="primary"
                    />
                  )
                })
              }
              {
                this.state.tagsMostUsed.map((tag: any) => {
                  if (tags.find(({ uid }: any) => uid === tag.uid)) {
                    return null;
                  }
                  return (
                    <Chip
                      className="mr-1 mb-1"
                      key={tag.uid}
                      label={<Badge color="secondary" badgeContent={tag.count}>{tag.name}</Badge>}
                      deleteIcon={<Done />}
                      onDelete={this.handleChange(tag)}
                      color="primary"
                    />
                  )
                })
              }
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  public getMostTags(){
    this.setState({ loading: true });
    const { type, term } = this.props;
    firebase.firestore().collection('terms')
    .where('type', '==', type)
    .where('term', '==', term)
    .orderBy('count', 'desc')
    .get().then((result: any) => {
      this.setState({ tagsMostUsed: result.docs.map((doc: any) => ({ ...doc.data(), uid: doc.id })) });
    }).catch((error: Error) => {
      this.props.dispatch({ type: 'ADD_NOTIFICATION', data: { title: error.toString() } });
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  public handleSearch = (e: any) => {
    this.setState({ search: e.target.value });
  }
  public handleChange = (tag: any) => (e: any) => {
    const { tags } = this.props.post;
    const { type, term } = this.props;
    if (!tag.slug) {
      const data = {
        type, term, name: tag.name, slug: string_to_slug(tag.name) + `-${new Date().getTime()}`, description: '', editing: false,
        createdAt: new Date().getTime()
      };
      firebase.firestore().collection('terms').add(data).then((result:any) => {
        firebase.firestore().collection('terms').doc(result.id).get().then((termResult: any) => {
          this.props.onChange('tags')({ target: { value: [...tags, {...termResult.data(), uid: termResult.id}] } });
        })
      }).catch((error: Error) => {
        this.props.dispatch({ type: 'ADD_NOTIFICATION', data: { title: error.toString() } });
      });
    } else {
      if (!tags.find(({ uid }: any) => uid === tag.uid)) {
        this.props.onChange('tags')({ target: { value: [...tags, tag] } });
      }
    }
    this.setState({ tags: this.state.tags.filter(({ uid }: any) => uid !== tag.uid) });
  }
  public handleDelete = (tag: any) => (e: any) => {
    const { tags } = this.props.post;
    this.props.onChange('tags')({ ...e, target: { ...e.target, value: tags.filter(({ uid }: any) => uid !== tag.uid) } });
  }
  public searchTag = () => {
    this.setState({ loading: true });
    const { type, term } = this.props;
    firebase.firestore().collection('terms')
    .where('name', '==', this.state.search)
    .where('type', '==', type)
    .where('term', '==', term)
    .get().then((result: any) => {
      if (result.docs.length === 0) {
        this.setState({ search: '', tags: [{ name: this.state.search, uid: new Date().getTime() }] });
      } else {
        this.setState({ search: '', tags: result.docs.map((doc: any) => ({ ...doc.data(), uid: doc.id })) });
      }
    }).catch((error: Error) => {
      this.props.dispatch({ type: 'ADD_NOTIFICATION', data: { title: error.toString() } });
    }).then(() => {
      this.setState({ loading: false });
    });
  }
}

export default connect(e => e)(Tags);
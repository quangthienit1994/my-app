import * as React from 'react';
import { connect } from 'react-redux';
import { TextField, Grid, Typography, LinearProgress } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PublishComponent from './Publish.component';
import PostFormat from './PostFormat';
import Categories from './Categories';
import Tags from './Tags';
import Thumbnail from './Thumbnail';
import Metas from './Metas';
import Excerpt from './Excerpt';
import Editor from 'src/components/Editor/index';
import ChooseFileMedia from 'src/components/ChooseFileMedia';
import string_to_slug from 'src/helper/string_to_slug';
import * as firebase from 'firebase/app';

interface IProps {
    type: string; // loại bài viết
    name: string; // tên của loại bài viết
    [key: string]: any;
}

class Index extends React.Component<IProps, any>{
    public defaultPost = {
        uid: '',
        title: '', // tên bài viết
        slug: '', // đường dẫn bài viết
        uri: '', // đường dẫn URL bài viết
        categories: [], // danh mục { uid, name }
        tags: [], // thẻ mây
        photoURL: '',
        content: '',
        excerpt: '',
        metas: [],
        format: 'aside',
        updatedAt: new Date().getTime(),
        createdAt: new Date().getTime(),
        date: new Date().getTime(),
        status: 'publish', // trang thái bài viết
        type: this.props.type, // loại bài viết
        name: this.props.name, // tên loại bài viết
        editing: true,
        author: null
    }
    public state = {
        post: this.props.post || this.defaultPost,
        loading: false
    }

    public componentWillMount() {
        document.title = "Tạo bài viết";
    };


    public render() {
        const { title, slug } = this.state.post;
        const { name } = this.props;
        // window.console.log(this.state.post);
        return (
            <div className="post-create">
                {this.state.loading && <LinearProgress />}
                <Grid container={true}>
                    <Grid item={true} xs={12} sm={8} md={9} xl={10} className="pr-sm-1 mb-2">
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Tiêu đề bài viết</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <TextField className="w-100" value={title} onChange={this.handleChangeStatePost('title')} />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Đường dẫn URL</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div className="clearfix w-100">
                                    <div className="d-flex align-items-end">
                                        <div className="text-nowrap" style={{ marginBottom: 6 }}><Typography>{window.location.origin}/{name}/</Typography></div>
                                        <TextField className="w-100" value={slug} onChange={this.handleChangeStatePost('slug')} />
                                    </div>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <div className="mt-2 mb-2">
                            <div className="mb-2">
                                <ChooseFileMedia onChange={this.appendMediaToContent} />
                            </div>

                            <Editor value={this.state.post.content} onChange={this.handleChangeStatePost('content')} />
                        </div>
                        <Excerpt onChange={this.handleChangeStatePost} post={this.state.post} />
                        <Metas onChange={this.handleChangeStatePost} post={this.state.post} />
                    </Grid>
                    <Grid item={true} xs={12} sm={4} md={3} xl={2}>
                        <PublishComponent loading={this.state.loading} onSubmit={this.handleSubmit} onChange={this.handleChangeStatePost} post={this.state.post} />
                        <PostFormat onChange={this.handleChangeStatePost} post={this.state.post} />
                        <Categories onChange={this.handleChangeStatePost} post={this.state.post} type="category" term="category" />
                        <Tags onChange={this.handleChangeStatePost} post={this.state.post} type="tag" term="tag" />
                        <Thumbnail onChange={this.handleChangeStatePost} post={this.state.post} />
                    </Grid>
                </Grid>
            </div>
        );
    }
    public appendMediaToContent = (url: string) => {
        let { content } = this.state.post;
        content += `<img src="${url}" />`;
        this.setState({ post: { ...this.state.post, content } });
    }

    public handleChangeStatePost = (key: string) => (e: any) => {
        switch (key) {
            case 'title':
                const slug = string_to_slug(e.target.value) + "-" + this.state.post.date;
                this.setState({
                    post: {
                        ...this.state.post,
                        [key]: e.target.value,
                        slug,
                        uri: this.state.post.name + "/" + slug,
                    }
                });
                break;
            default:
                this.setState({ post: { ...this.state.post, [key]: e.target.value } });
                break;
        }
    }

    public handleSubmit = () => {
        this.setState({ loading: true });

        // tăng count của term 
        const updateCount = (term: any, bool = false) => {
            const uid = term.uid || term.id;
            // window.console.log(uid);
            if (typeof uid === 'string') {
                return firebase.firestore().runTransaction(transaction => {
                    const doc = firebase.firestore().collection('terms').doc(uid)
                    return transaction.get(doc).then((t: any) => {
                        if (!t.exists) {
                            return transaction.delete(doc);
                        }
                        if (!bool) {
                            const count = t.data().count ? t.data().count + 1 : 1;
                            return transaction.update(doc, { count });
                        } else {
                            const count = t.data().count ? t.data().count - 1 : 0;
                            return transaction.update(doc, { count });
                        }
                    });
                })
            }
            return null;
        }
        const postData: any = { ...this.state.post };
        postData.categories = postData.categories.filter(({uid}: any) => typeof uid === 'string').map(({ uid }: any) => firebase.firestore().doc(`/terms/${uid}`));
        postData.tags = postData.tags.filter(({uid}: any) => typeof uid === 'string').map(({ uid }: any) => firebase.firestore().doc(`/terms/${uid}`));

        if(!postData.title){
            return this.props.dispatch({type: "ADD_NOTIFICATION", data: {title: "Tiêu đề không được để trống"}});
        }
        if(!postData.slug){
            return this.props.dispatch({type: "ADD_NOTIFICATION", data: {title: "Đường dẫn không được để trống"}});
        }

        if (this.state.post.uid) {
            const post = firebase.firestore().collection('posts').doc(this.state.post.uid);
            firebase.firestore().runTransaction(transition => {
                return transition.get(post).then( postResult => {
                    if (postResult.exists) {

                        // GIẢM COUNT TERM
                        const { categories, tags }: any = postResult.data();
                        for (const term of categories) {
                             updateCount(term, true);
                        }
                        for (const term of tags) {
                             updateCount(term, true);
                        }

                        for (const term of this.state.post.categories) {
                             updateCount(term);
                        }
                        for (const term of this.state.post.tags) {
                             updateCount(term);
                        }

                        transition.update(post, postData);
                    }
                })
            })
            .then(this.submitSuccess).catch(this.submitError);
        } else {
            firebase.firestore().collection('posts').add(postData).then( result => {
                const { categories, tags } = this.state.post;
                for (const term of categories) {
                     updateCount(term);
                }
                for (const term of tags) {
                     updateCount(term);
                }
                this.setState({ post: { ...this.state.post, uid: result.id } });
            })
                .then(this.submitSuccess).catch(this.submitError);
        }
    }

    public submitSuccess = () => {
        this.setState({ loading: false });
        this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: this.state.post.uid ? 'Cập nhật bài viết thành công' : 'Sửa bài viết thành công' } });
    }
    public submitError = (error: Error) => {
        this.setState({ loading: false });
        this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi', content: error.toString() } });
    }
}

export default connect(e => e)(Index);
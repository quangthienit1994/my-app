import * as React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import { Table, TableBody, TableCell, Chip, TableRow, TableHead, TableSortLabel, Paper, Button, Avatar, Typography, IconButton, Tooltip, LinearProgress, TextField, GridList, GridListTile, GridListTileBar, Grid } from '@material-ui/core';
import * as moment from 'moment';
import { Delete, Search } from '@material-ui/icons';
import * as _ from 'lodash';

interface IRow {
    id: string;
    numeric: boolean,
    disablePadding: boolean;
    label: string;
    disabled?: boolean;
}
const defaultPhotoURL = 'https://www.w3schools.com/w3images/avatar2.png';

const rows: IRow[] = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Tiêu đề' },
    { id: 'calories', numeric: true, disablePadding: false, label: 'Danh mục', disabled: true },
    { id: 'tags', numeric: true, disablePadding: false, label: 'Thẻ mây', disabled: true },
    { id: 'author', numeric: true, disablePadding: false, label: 'Tác giả' },
    { id: 'date', numeric: true, disablePadding: false, label: 'Ngày đăng bài' },
];
class Posts extends React.Component<any, any>{
    public defaultLimit = 10;
    public state = {
        posts: [],
        orderBy: 'createdAt',
        order: 'desc',
        where: null,
        status: 'publish',
        loading: false,
        search: '',
        limit: 10,
        lastSnapshot: null
    };
    public listen: any = () => { /* */ };

    public componentDidMount() {
        this.getPosts(this.state);
    }

    public render() {
        const { orderBy, order, loading } = this.state;
        return (
            <div className="libraries">
                {loading && <LinearProgress />}

                <Grid className="d-flex mt-2 mb-2 align-items-end" container={true}>
                    <Grid item={true} xs={12} sm={6}>
                        <Button size="small" disabled={this.state.status === 'publish'} className="mr-1" onClick={this.updateStatus('publish')} variant="contained" color="primary">Tất cả</Button>
                        <Button size="small" disabled={this.state.status === 'trash'} className="mr-1" onClick={this.updateStatus('trash')} variant="contained" color="default">Thùng rác</Button>
                        <Button size="small" disabled={this.state.status === 'pending'} onClick={this.updateStatus('pending')} variant="contained" color="default">Chờ xét duyệt</Button>
                    </Grid>
                    <Grid item={true} xs={12} sm={6} className="d-flex align-items-end justify-content-end pl-2 pr-2">
                        <TextField className="text-truncate" label="Nhập nội dung tìm kiếm" value={this.state.search} onChange={this.updateState("search")} />
                        <Button variant="contained" color="primary" disabled={Boolean(this.state.search === '')} onClick={this.queryWhere('name', this.state.search)}>
                            <Tooltip title="nhấn để tìm kiếm">
                                <Search />
                            </Tooltip>
                        </Button>
                    </Grid>
                </Grid>

                {
                    rows.length === 0 && <Typography color="error">Không có dữ liệu</Typography>
                }
                {
                    window.innerWidth <= 768 ? (
                        <GridList>
                            {
                                this.state.posts.map((post: any) => {
                                    return (
                                        <GridListTile key={post.uid}>
                                            <img src={post.photoURL || defaultPhotoURL} alt={post.title} />
                                            <GridListTileBar
                                                title={
                                                    post.deleting ? <LinearProgress /> : <Button className="p-0" color="inherit" style={{ textTransform: 'none' }} onClick={this.props.onChange(post)}>
                                                        {post.title}
                                                    </Button>
                                                }
                                                subtitle={<Typography color="inherit">{moment(post.date).format('LLL')}</Typography>}
                                                actionIcon={
                                                    <Tooltip title="Xóa bài viết">
                                                        <IconButton color="secondary" onClick={this.handleDeletePost(post)}><Delete /></IconButton>
                                                    </Tooltip>
                                                }
                                            />
                                        </GridListTile>
                                    );
                                })
                            }
                        </GridList>
                    ) : (
                            <Paper className="rounded-0">
                                <div className="table-responsive">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    rows.map((row: IRow) => {
                                                        return (
                                                            <TableCell key={row.id}>
                                                                <TableSortLabel
                                                                    disabled={row.disabled}
                                                                    active={orderBy === row.id}
                                                                    direction={(order as any)}
                                                                    onClick={this.createSortHandler(row.id)} >
                                                                    {row.label}
                                                                </TableSortLabel>
                                                            </TableCell>
                                                        );
                                                    })
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.state.posts.map((post: any) => {
                                                    return (
                                                        <TableRow key={post.uid}>
                                                            <TableCell>
                                                                <div className="d-flex">
                                                                    <Avatar src={post.photoURL || defaultPhotoURL} alt={post.title} />
                                                                    <div className="w-100 ml-1">
                                                                        {
                                                                            post.deleting ? <LinearProgress /> :
                                                                                <Button className="pl-0" style={{ textTransform: 'none' }} onClick={this.props.onChange(post)}>
                                                                                    <Typography className="ml-2">{post.title}</Typography>
                                                                                </Button>
                                                                        }
                                                                        <Typography className="pl-2" variant="caption">{post.excerpt}</Typography>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="d-none-sm">
                                                                {
                                                                    _.isArray(post.categories) && (
                                                                        post.categories.map((cat: any) => {
                                                                            return (
                                                                                <Chip
                                                                                    className="mr-1 mb-1"
                                                                                    key={cat.uid}
                                                                                    label={cat.name}
                                                                                    color="default"
                                                                                />
                                                                            );
                                                                        })
                                                                    )
                                                                }
                                                            </TableCell>
                                                            <TableCell className="d-none-sm">
                                                                {
                                                                    _.isArray(post.tags) && (
                                                                        post.tags.map((cat: any) => {
                                                                            return (
                                                                                <Chip
                                                                                    className="mr-1 mb-1"
                                                                                    key={cat.uid}
                                                                                    label={cat.name}
                                                                                    color="default"
                                                                                />
                                                                            );
                                                                        })
                                                                    )
                                                                }
                                                            </TableCell>
                                                            <TableCell className="d-none-sm">
                                                                {post.author && <Button onClick={this.queryWhere('author', post.author.uid)}>{post.author.displayName || post.author.email}</Button>}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="d-flex align-items-center">
                                                                    <Typography className="mr-2 w-100">{moment(post.date).format('LLL')}</Typography>
                                                                    <Tooltip title="Xóa bài viết">
                                                                        <IconButton color="secondary" onClick={this.handleDeletePost(post)}><Delete /></IconButton>
                                                                    </Tooltip>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </Paper>
                        )
                }
                <Button disabled={(this.state.limit > this.state.posts.length) || loading} className="mt-2 ml-auto mr-auto" onClick={this.loadMore} variant="contained" color="primary">Tải thêm</Button>
            </div>
        );
    }
    public loadMore = () => {
        this.listen();
        const state = { ...this.state, limit: this.state.limit + 10 };
        this.setState(state);
        this.getPosts(state);
    }
    public updateState = (key: string) => (e: React.ChangeEvent<any>) => {
        this.setState({ [key]: e.target.value });
    }

    public updateStatus = (val: string) => (e: any) => {
        const state = { ...this.state, status: val, limit: this.defaultLimit };
        this.setState(state);
        this.getPosts(state, true);
    }

    public handleDeletePost = (post: any) => (e: any) => {

        const updateCount = async (term: any, bool = false) => {
            if (_.isString(term.uid)) {
                return firebase.firestore().runTransaction(transaction => {
                    const doc = firebase.firestore().collection('terms').doc(term.uid)
                    return transaction.get(doc).then((t: any) => {
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
            return Promise.resolve();
        }

        const postRef = firebase.firestore().collection('posts').doc(post.uid);

        this.setState({
            posts: this.state.posts.map((k: any) => {
                if (k.uid === post.uid) {
                    k.deleting = true;
                }
                return k;
            })
        });

        firebase.firestore().runTransaction(async transaction => {
            return transaction.get(postRef).then(async result => {
                if (!result.exists) {
                    return this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Bài viết đã bị xóa hoặc không tồn tại' } });
                }

                const { categories, tags } = post;
                for (const iterator of categories) {
                     updateCount(iterator, true);
                }
                for (const iterator of tags) {
                     updateCount(iterator, true);
                }
                transaction.delete(postRef);
            });
        }).catch((error: Error) => {
            return this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi khi xóa bài viết', content: error.toString() } });
        });

    }
    public componentWillunmount() {
        this.listen();
    }
    public handleEditPost = (post: any) => (e: any) => {
        if (this.props.onChange) {
            this.props.onChange(post);
        }
    }
    public queryWhere = (key: string, value: string, equal = '==') => (e: any) => {
        const state = { ...this.state, where: { key, value, equal } };
        this.setState(state);
        this.getPosts(state);
    }

    public createSortHandler = (property: string) => (e: any) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        const state = { ...this.state, order, orderBy };
        this.setState(state);
        this.getPosts(state);
    }

    public componentWillUnmount() {
        this.listen();
    }

    public getPosts(query: any, byStatus = false) {
        const { order, orderBy, status, limit } = query;

        this.listen();
        this.setState({ loading: true });

        const ref: any = firebase.firestore().collection('posts')
            .where('status', '==', status)
            .orderBy(orderBy, order);

        this.listen = ref
            .limit(limit)
            .onSnapshot((snapshot: any) => {
                const posts: any[] = [];

                snapshot.docs.find((doc: any): any => {
                    const { categories, tags } = doc.data();

                    if (categories && categories.length) {
                        categories.map((cat: any, i: number) => {
                            cat.get().then((child: any) => {
                                const postss: any = this.state.posts;
                                const index = postss.findIndex(({ uid }: any) => {
                                    return uid === doc.id;
                                });
                                if (index !== -1) {
                                    if (postss[index].categories.loading) {
                                        postss[index].categories = [];
                                    }
                                    if (child.exists) {
                                        postss[index].categories.push({ ...child.data(), uid: cat.id });
                                    } else {
                                        postss[index].categories = postss[index].categories.filter(({ uid }: any) => uid !== cat.id);
                                    }
                                    this.setState({ posts: postss });
                                }
                            });
                            return { uid: cat.id, loading: true };
                        });
                    }
                    if (tags && tags.length) {
                        tags.map((cat: any, i: number) => {
                            cat.get().then((child: any) => {
                                const postss: any = this.state.posts;
                                const index = postss.findIndex(({ uid }: any) => {
                                    return uid === doc.id;
                                });
                                if (index !== -1) {
                                    if (postss[index].tags.loading) {
                                        postss[index].tags = [];
                                    }
                                    if (child.exists) {
                                        postss[index].tags.push({ ...child.data(), uid: cat.id });
                                    } else {
                                        postss[index].tags = postss[index].tags.filter(({ uid }: any) => uid !== cat.id);
                                    }
                                    this.setState({ posts: postss });
                                }
                            });
                        });
                    }

                    posts.push({
                        ...doc.data(),
                        categories: [],
                        tags: [],
                        uid: doc.id
                    });
                });
                this.setState({ posts, loading: false, lastSnapshot: snapshot.docs[snapshot.docs.length - 1] });
            })
    }
}

export default connect(e => e)(Posts);
import * as React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import { Paper, Typography, TableRow, TableCell, Table, TableBody, TableHead, LinearProgress, TableFooter, Avatar, Grid } from '@material-ui/core';
import * as moment from 'moment';

class Index extends React.Component<any, any>{
    public state = {
        posts: [],
        loading: false
    };

    public componentDidMount() {
        this.getPosts();
    }

    public render() {
        return (
            <Grid item={true} xs={12} sm={6}>
                <div className="table-responsive">
                    <Paper className="p-2 m-2 rounded-0">
                        <Typography variant="subheading">DANH SÁCH BÀI VIẾT MỚI NHẤT</Typography>
                        {this.state.loading && <LinearProgress />}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-truncate">Tiêu đề</TableCell>
                                    <TableCell className="text-truncate">Ngày đăng</TableCell>
                                    <TableCell className="text-truncate">Lượt xem</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.posts.map((post: any) => {
                                        return (
                                            <TableRow key={post.uid}>
                                                <TableCell>
                                                    <div className="d-flex align-items-center">
                                                        <Avatar src={post.photoURL} />
                                                        <Typography className="ml-2">{post.title}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{moment(post.date).format('LLL')}</TableCell>
                                                <TableCell>{post.count ? post.count : 0}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="text-truncate">Tiêu đề</TableCell>
                                    <TableCell className="text-truncate">Ngày đăng</TableCell>
                                    <TableCell className="text-truncate">Lượt xem</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Paper>
                </div>
            </Grid>
        );
    }

    protected getPosts() {
        this.setState({ loading: true });
        firebase.firestore().collection('posts').where('status', '==', 'publish').orderBy("date", 'desc').limit(10).onSnapshot(snapshot => {
            const posts: any[] = [];
            snapshot.docs.map((doc: any) => {
                posts.push({ ...doc.data(), uid: doc.id });
            });
            this.setState({ posts, loading: false });
        });
    }
}

export default connect(e => e)(Index);
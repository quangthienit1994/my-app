import * as React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import { Paper, Typography, TableRow, TableCell, Table, TableBody, TableHead, LinearProgress, TableFooter, Avatar, Grid } from '@material-ui/core';
import * as moment from 'moment';

class Index extends React.Component<any, any>{
    public state = {
        users: [],
        loading: false
    };

    public componentDidMount() {
        this.getUsers();
    }

    public render() {
        return (
            <Grid item={true} xs={12} sm={6}>
                <div className="table-responsive">
                    <Paper className="p-2 m-2 rounded-0">
                        <Typography variant="subheading">DANH SÁCH TÀI KHOẢN MỚI NHẤT</Typography>
                        {this.state.loading && <LinearProgress />}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-truncate">Email</TableCell>
                                    <TableCell className="text-truncate">Tên hiển thị</TableCell>
                                    <TableCell className="text-truncate">Ngày tham gia</TableCell>
                                    <TableCell className="text-truncate">Đăng nhập cuối</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.users.map((user: any) => {
                                        return (
                                            <TableRow key={user.uid}>
                                                <TableCell>
                                                    <div className="d-flex align-items-center">
                                                        <Avatar src={user.photoURL} />
                                                        <Typography className="ml-2">{user.email}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.displayName}</TableCell>
                                                <TableCell>{moment(user.creationTime).format('LLL')}</TableCell>
                                                <TableCell>{moment(user.lastSignInTime).format('LLL')}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="text-truncate">Email</TableCell>
                                    <TableCell className="text-truncate">Tên hiển thị</TableCell>
                                    <TableCell className="text-truncate">Ngày tham gia</TableCell>
                                    <TableCell className="text-truncate">Đăng nhập cuối</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Paper>
                </div>
            </Grid>
        );
    }

    protected getUsers() {
        this.setState({ loading: true });
        firebase.firestore().collection('users').orderBy("creationTime", 'desc').limit(10).onSnapshot(snapshot => {
            const users: any[] = [];
            snapshot.docs.map((doc: any) => {
                users.push({ ...doc.data(), uid: doc.id });
            });
            this.setState({ users, loading: false });
        });
    }
}

export default connect(e => e)(Index);
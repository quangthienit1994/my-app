import * as React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { Grid, GridListTile, GridListTileBar, Typography, LinearProgress, Button, TextField } from '@material-ui/core';
import * as moment from 'moment';
import User from './User';
import { Search } from '@material-ui/icons';

class Component extends React.Component {
    public state = {
        lastSnapshot: null,
        users: [],
        cols: 0.25,
        loading: false,
        overData: false,
        search: ''
    };
    public listen: any = null;
    public handleChangeState = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [key]: e.target.value });
    }
    public render() {
        const { users, loading, overData } = this.state;
        return (
            <div id="users">
                {loading && <LinearProgress />}
                <div className="mb-2 mt-2 d-flex justify-content-start align-items-end w-100">
                    <TextField className="w-100" label="Tìm kiếm" value={this.state.search} onChange={this.handleChangeState('search')} />
                    <Button variant="contained" disabled={this.state.search === ''} size="small" color="primary" onClick={this.handleSearch}><Search /></Button>
                </div>
                <Grid container={true}>
                    {
                        users.map((user: any) => {
                            return (
                                <Grid item={true} xs={6} sm={4} md={3} xl={2} key={user.uid}>
                                    <GridListTile component='div' style={{ height: 200 }}>
                                        <img src={user.photoURL || (window as any)._INIT_DATA_.define.photoURL} alt={user.displayName} />
                                        <GridListTileBar
                                            title={user.email}
                                            subtitle={
                                                <div>
                                                    <Typography color="inherit">{user.phoneNumber}</Typography>
                                                    <Typography color="inherit">{moment(user.lastSignInTime).fromNow()}</Typography>
                                                </div>
                                            }
                                            actionIcon={
                                                <User dataSource={user} />
                                            }
                                        />
                                    </GridListTile>
                                </Grid>
                            );
                        })
                    }
                </Grid>
                <Button className="mt-2 ml-auto mr-auto" disabled={loading || overData} onClick={this.loadMore} variant="contained" color="primary">Tải thêm</Button>
            </div>
        );
    }
    public componentWillUnmount() {
        this.removeListener();
    }
    public componentDidMount() {
        this.getUsers();
    }
    public loadMore = () => {
        this.removeListener();
        this.getUsers();
    }
    public removeListener() {
        if (this.listen) {
            this.listen();
        }
    }
    protected getUsers() {
        this.setState({ loading: true });
        if (this.state.lastSnapshot) {
            this.listen = firebase.firestore().collection('users').limit(20).startAfter(this.state.lastSnapshot).onSnapshot((snapshot: any) => {
                const { users }: any = this.state;
                if (snapshot.docs && snapshot.docs.length) {
                    snapshot.docs.map((doc: any) => users.push({ ...doc.data(), uid: doc.id }));
                } else {
                    return this.setState({ overData: true, loading: false });
                }
                this.setState({ users, loading: false, lastSnapshot: snapshot.docs[snapshot.docs.length - 1] });
            });
        } else {
            this.listen = firebase.firestore().collection('users').limit(20).onSnapshot((snapshot: any) => {
                const users: any = [];
                if (snapshot.docs && snapshot.docs.length) {
                    snapshot.docs.map((doc: any) => users.push({ ...doc.data(), uid: doc.id }));
                } else {
                    return this.setState({ overData: true, loading: false });
                }
                this.setState({ users, loading: false, lastSnapshot: snapshot.docs[snapshot.docs.length - 1] });
            });
        }
    }
    protected handleSearch = () => {
        this.setState({ loading: true });
        firebase.firestore().collection('users').where('email', '==', this.state.search).limit(20).get().then((snapshot: any) => {
            const users: any = [];
            if (snapshot.docs && snapshot.docs.length) {
                snapshot.docs.map((doc: any) => users.push({ ...doc.data(), uid: doc.id }));
            }
            this.setState({ users, loading: false });
        });
    }
}

export default connect(e => e)(Component);

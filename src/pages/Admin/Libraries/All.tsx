import * as React from 'react';
import { Grid, GridListTile, GridListTileBar, Typography, IconButton, LinearProgress, TextField, Button, Paper } from '@material-ui/core';
import * as firebase from 'firebase';
import { FileDrawer } from './FileDrawer';
import Search from '@material-ui/icons/Search';

export default class All extends React.Component<any, any> {
    public state = {
        files: [],
        showDialog: false,
        limit: 10,
        lastFile: null,
        loading: false,
        overData: false,
        cols: 0.25,
        search: ''
    };
    public listen: any = null;

    public render() {
        const { files, loading, overData } = this.state;
        return (
            <div className="clearfix w-100">
                {loading && <LinearProgress />}
                <Paper className="rounded-0 mb-2 p-1">
                    <form action="#" onSubmit={this.handleSearch} className="d-flex w-100">
                        <TextField className="w-100" value={this.state.search} onChange={this.onChange('search')} label="Tìm kiếm" />
                        <IconButton type="submit" color="primary"><Search /></IconButton>
                    </form>
                </Paper>
                <Grid container={true}>
                    {files.map((file: any) => (
                        <Grid item={true} key={file.photoURL} xs={6} sm={4} md={3} xl={2}>
                            <GridListTile component='div' cols={this.state.cols} className="pointer" style={{ height: 200 }}>
                                <img src={file.photoURL} alt={file.fileName} />
                                <GridListTileBar
                                    title={file.fileName}
                                    subtitle={
                                        <React.Fragment>
                                            <Typography color="inherit" variant="caption">Size: {file.size}kb</Typography>
                                            {file.author && <Typography color="inherit" variant="caption">by: {file.author && 'chưa cập nhật'}</Typography>}
                                        </React.Fragment>
                                    }
                                    actionIcon={
                                        <FileDrawer dataSource={file} onChange={this.props.onChange} />
                                    }
                                />
                            </GridListTile>
                        </Grid>
                    ))}
                </Grid>
                {/* <Button color="primary" onClick={this.loadPrev} variant="contained" disabled={!lastFile || loading} className="mt-2 ml-2 mr-2">{'Quay lại'}</Button> */}
                <Button color="primary" variant="contained" disabled={loading || overData} className="mt-2 ml-auto mr-auto" onClick={this.loadMore}>{overData ? 'Hết dữ liệu' : 'Tải thêm'}</Button>

            </div>
        );
    }
    public onChange = (key: string) => (e: any) => {
        this.setState({ [key]: e.target.value });
        if (key === 'search' && !e.target.value) {
            this.loadCols(this.state.limit);
        }
    }
    public loadPrev = () => {
        this.loadCols(this.state.limit, 'prev');
    }
    public loadMore = () => {
        this.loadCols(this.state.limit, 'next');
    }

    public componentWillUnmount() {
        this.listen();
    }

    public componentDidMount() {
        this.loadCols(this.state.limit);
    }
    protected loadCols(limit: number, nextOrPrev = '') {
        this.setState({ loading: true });

        const complete = (result: any) => {
            const files: any = nextOrPrev ? this.state.files : [];
            if (result.docs.length === 0 || result.docs.length < limit) {
                this.setState({ overData: true, loading: false });
            } else {
                result.docs.map((doc: any) => {
                    files.push(({ ...doc.data(), uid: doc.id }));
                });
                const lastFile = result.docs[result.docs.length - 1];
                this.setState({ files, lastFile, loading: false, overData: false });
            }
        };

        if (nextOrPrev !== '') {
            this.listen = firebase.firestore().collection('libraries').limit(limit).orderBy('createdAt', 'desc').startAfter(this.state.lastFile).onSnapshot(complete);
        } else {
            this.listen = firebase.firestore().collection('libraries').limit(limit).orderBy('createdAt', 'desc').onSnapshot(complete);
        }
    }

    protected handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        this.listen();
        const { search } = this.state;
        this.setState({ loading: true });
        firebase.firestore().collection('libraries')
            .where('fileName', '==', search)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get().then(result => {
                const files: any[] = [];
                result.docs.map((doc: any) => {
                    files.push(({ ...doc.data(), uid: doc.id }));
                });
                this.setState({ files, loading: false, overData: false });
            }).catch((error: Error) => {
                this.setState({ loading: false });
                this.props.dispatch({ type: 'ADD_NOTIFICATION', data: { title: error.toString() } });
            });
    }
}

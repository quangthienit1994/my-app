import * as React from 'react';
import { Grid, GridListTile, GridListTileBar, Typography, Button, LinearProgress } from '@material-ui/core';
import * as firebase from 'firebase';
import { FileDrawer } from './FileDrawer';

export default class All extends React.Component<any, any> {
    public state = {
        files: [],
        showDialog: false,
        limit: 10,
        lastFile: null,
        loading: false,
        overData: false,
        cols: 0.25
    };
    public listen: any = null;

    public render() {
        const { files, loading, overData } = this.state;
        return (
            <div className="clearfix w-100">
                {loading && <LinearProgress />}
                <Grid container={true}>
                    {files.map((file: any) => (
                        <Grid item={true} key={file.photoURL} xs={6} sm={4} md={3} xl={2}>
                            <GridListTile component='div' cols={this.state.cols} className="pointer" style={{height: 200}}>
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
            this.listen = firebase.firestore().collection('libraries').limit(limit).startAfter(this.state.lastFile).onSnapshot(complete);
        } else {
            this.listen = firebase.firestore().collection('libraries').limit(limit).onSnapshot(complete);
        }
    }
}

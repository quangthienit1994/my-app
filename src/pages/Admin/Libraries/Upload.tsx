import * as React from 'react';
import { connect } from 'react-redux';
import { Paper, Typography, IconButton, Avatar, Button } from '@material-ui/core';
import { DeleteForever, CloudUpload, CloudDone } from '@material-ui/icons';
import Storage from 'src/helper/Storage';
class Upload extends React.Component<any, any> {
    public state = {
        files: [],
        uploading: false
    };

    public render() {
        const { files } = this.state;
        return (
            <div>
                <Paper className="mb-2 p-2">
                    <form action="#" className="form-inline">
                        <Button disabled={!files.length || this.state.uploading} onClick={this.handleSubmit} size="small" variant="contained" className="text-truncate mr-2" color="primary"><CloudUpload /> Tải lên</Button>
                        <input onChange={this.handleChange} type="file" multiple={true} className="form-control form-control-sm" />
                    </form>
                </Paper>
                {
                    files.map((node: any, i: number) => {
                        return (
                            <Paper key={i} className="mb-1 p-2">
                                <div className="d-flex align-items-center">
                                    <IconButton onClick={this.handleRemove(i)}>{!node.complete ? <DeleteForever color="error" /> : <CloudDone color="primary" />}</IconButton>
                                    <Avatar src={node.photoURL} />
                                    <div className="d-inline-block pl-2">
                                        <Typography>{node.file.name} ({(node.file.size / 1024).toFixed(2)} kb)</Typography>
                                        <Typography variant="caption">{node.photoURL}</Typography>
                                    </div>
                                    {node.progress && <Typography variant="subtitle1" className="pl-2 pr-2">{node.progress}%</Typography>}
                                </div>
                            </Paper>
                        );
                    })
                }
            </div>
        );
    }
    public handleRemove = (i: number) => (e: any) => {
        this.setState({ files: this.state.files.filter((n, j: number) => j !== i) });
    }
    public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = e.target.files;
        this.setState({ files: [].slice.call(files).map((file: File) => ({ photoURL: URL.createObjectURL(file), file })) })
    }
    public handleSubmit = (e: any) => {
        this.setState({ uploading: true });
        const upload = (node: any, i: number) => {
            const storage = new Storage();
            const { files }: any = this.state;
            storage.upload({
                onComplete: () => {
                    files[i].complete = true;
                    files[i].progress = null;
                    let uploading = true;
                    for (const file of files) {
                        if (file.complete === false) {
                            uploading = false;
                        }
                    }
                    this.setState({ files, uploading });
                },
                onUpdate: (snapshot: any) => {
                    files[i].progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                    this.setState({ files });
                },
                onError: (error: any) => {
                    this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: error.message_ } });
                },
                url: new Date().getTime() + '-' + node.file.name,
                file: node.file,
                options: {
                    type: 'public',
                    fileName: node.file.name
                }
            });
        };

        this.state.files.map(upload);
    }
}

export default connect(e => e)(Upload);

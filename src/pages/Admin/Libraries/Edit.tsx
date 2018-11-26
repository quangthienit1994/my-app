import * as React from 'react';
import { Paper, Button, Grid, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop/dist/ReactCrop.js';
import { Delete, CloudUpload } from '@material-ui/icons';
import Storage from 'src/helper/Storage';
import { connect } from 'react-redux';

class Edit extends React.Component {
    public state = {
        fileName: null,
        src: '',
        crop: {
            x: 0,
            y: 0,
            width: 50,
            height: 50
        },
        aspectX: 2,
        aspectY: 3,
        croppedImageUrl: '',
        complete: false,
        progress: 0
    };
    public imageRef = '';
    public fileUrl = '';
    public canvasFile = '';

    public render() {
        const { crop: { x, y, width, height }, src, aspectX, aspectY } = this.state;

        const file = new Blob([this.fileUrl]);

        return (
            <div id="libraries-edit">
                <Paper className="p-2">
                    <Grid container={true}>
                        <Grid item={true} xs={12} sm={6}>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <ReactCrop
                                    className="w-100 text-center m-auto"
                                    src={this.state.src}
                                    crop={this.state.crop}
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                />
                                <input type="hidden" className="d-none" id="file" />
                            </div>
                            {
                                !this.state.src ? <input className="form-control form-control-sm" type="file" accept="image/**" onChange={this.onSelectFile} /> : <Button variant="contained" color="secondary" className="mt-2 ml-auto mr-auto" onClick={this.deleteSrc}><Delete /> Xóa ảnh này</Button>
                            }
                        </Grid>
                        {
                            src && (
                                <Grid item={true} xs={12} sm={6} className="p-2">
                                    <Paper>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Chiều rộng</TableCell>
                                                    <TableCell><input style={{ width: 50 }} type="number" value={width.toFixed(2)} step="0.01" onChange={this.handleChangeState("width")} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Chiều dài</TableCell>
                                                    <TableCell><input style={{ width: 50 }} type="number" value={height.toFixed(2)} step="0.01" onChange={this.handleChangeState("width")} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>X/Y</TableCell>
                                                    <TableCell>
                                                        <input style={{ width: 50 }} type="number" value={x.toFixed(2)} step="0.01" onChange={this.handleChangeState("x")} />
                                                        &nbsp;/&nbsp;
                                                        <input style={{ width: 50 }} type="number" value={y.toFixed(2)} step="0.01" onChange={this.handleChangeState("y")} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Tỷ lệ</TableCell>
                                                    <TableCell>
                                                        <input style={{ width: 50 }} type="number" value={aspectX.toFixed(2)} step="0.01" onChange={this.handleChangeState("aspectX")} />
                                                        &nbsp;/&nbsp;
                                                        <input style={{ width: 50 }} type="number" value={aspectY.toFixed(2)} step="0.01" onChange={this.handleChangeState("aspectY")} />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Kích thước</TableCell>
                                                    <TableCell>{file.size} Kb</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2}>
                                                        {this.state.complete ? 'Tải lên hoàn tất' :
                                                            <Button variant="contained" color="primary" disabled={this.state.progress !== 0} onClick={this.handleUpload} >
                                                                {this.state.progress === 0 ? <React.Fragment><CloudUpload /> Tải lên</React.Fragment> : `Đang tải lên ${this.state.progress}%`}
                                                            </Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                            )
                        }
                    </Grid>
                </Paper>
            </div>
        );
    }

    public handleChangeState = (key: string) => (e: any) => {

        if (key === 'aspectX') {
            return this.setState({ crop: { ...this.state.crop, aspect: e.target.value / this.state.aspectY, [key]: e.target.value } })
        }
        if (key === 'aspectY') {
            return this.setState({ crop: { ...this.state.crop, aspect: this.state.aspectX / e.target.value, [key]: e.target.value } })
        }
        this.setState({ crop: { ...this.state.crop, [key]: e.target.value } });
    }
    public handleUpload = () => {
        const storage = new Storage();
        const fileName = new Date().getTime() + '.jpeg';
        storage.upload({
            onComplete: () => {
                const complete = true;
                const progress = 0;
                this.setState({ complete, progress });
            },
            onUpdate: (snapshot: any) => {
                const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                this.setState({ progress });
            },
            url: fileName,
            file: this.canvasFile,
            options: {
                type: 'public',
                fileName
            }
        });
    }
    public deleteSrc = () => {
        this.setState({ src: '' });
    }
    public componentDidCatch() {
        window.console.log('error');
    }
    public onCropChange = (crop: any) => {
        this.setState({ crop });
    };

    public onSelectFile = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {

            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            const fileName = e.target.files[0].name;
            reader.addEventListener('load', () => {
                this.setState({ src: reader.result, fileName });
            });

        }
    };
    public onImageLoaded = (image: any) => {
        this.imageRef = image;
    };
    public onCropComplete = async (crop: any, pixelCrop: any) => {
        if (crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                pixelCrop,
                new Date().getTime() + '.jpeg',
            );
            this.setState({ croppedImageUrl });
        }
    };
    public getCroppedImg(image: any, pixelCrop: any, fileName: any) {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx: any = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob: any) => {
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
                this.canvasFile = blob;
            }, 'image/jpeg');

        });
    }
}

export default connect(e => e)(Edit)

import * as React from 'react';
import { connect } from 'react-redux';
import { TextField, FormControl, FormHelperText, Button, InputLabel, Select, MenuItem, CircularProgress, DialogContent, Dialog, DialogActions } from '@material-ui/core';
import * as firebase from 'firebase';
import string_to_slug from '../../../../helper/string_to_slug';
import Libraries from '../../Libraries';
import { CloudUpload } from '@material-ui/icons';

class CreateTerm extends React.Component<any, any>{
    public defaultTerm: any = {
        uid: null,
        name: '',
        slug: '',
        description: '',
        parent: null,
        photoURL: null,
        childs: [],
        status: 'publish'
    };

    public state = {
        term: { ...this.defaultTerm },
        loading: false,
        openLibs: false
    };

    public componentWillUpdate(nextProps: any) {
        this.getTermToEdit(nextProps);
    }

    public componentDidMount() {
        this.getTermToEdit(this.props);
    }

    public componentWillUnmount() {
        this.deleteTermToEdit(this.state.term.uid);
    }
    public render() {
        const { type } = this.props;
        return (
            <div id="create-term">
                <form action="#">
                    <FormControl className="mb-2 w-100">
                        <TextField label="Tên" value={this.state.term.name} onChange={this.handleChangeTerm('name')} />
                        <FormHelperText>Tên sẽ được hiển thị của danh mục hoặc thẻ mây này</FormHelperText>
                    </FormControl>
                    <FormControl className="mb-2 w-100">
                        <TextField label="Đường dẫn" value={this.state.term.slug} onChange={this.handleChangeTerm('slug')} />
                        <FormHelperText>Đường dẫn sẽ được hiển thị của danh mục hoặc thẻ mây này trên thanh URL</FormHelperText>
                    </FormControl>
                    <FormControl className="mb-2 w-100">
                        <TextField multiline={true} label="Mô tả" value={this.state.term.description} onChange={this.handleChangeTerm('description')} />
                        <FormHelperText>Mô tả của danh mục hoặc thẻ mây</FormHelperText>
                    </FormControl>
                    {
                        type === 'category' && (
                            <React.Fragment>
                                <FormControl className="mb-2 w-100">
                                    <InputLabel>Cha</InputLabel>
                                    <Select value={this.state.term.parent ? this.state.term.parent.id ? this.state.term.parent.id : this.state.term.parent : ''} onChange={this.handleChangeTerm('parent')}>
                                        <MenuItem value="">Không có danh mục</MenuItem>
                                        {
                                            this.props.dataSource.map((term: any) => {
                                                if (this.state.term.uid && this.state.term.uid === term.uid) {
                                                    return null;
                                                }
                                                return <MenuItem key={term.uid} value={term.uid}>{term.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                    <FormHelperText>Mô tả của danh mục hoặc thẻ mây</FormHelperText>
                                </FormControl>
                                <div className="w-100">
                                    {this.state.term.photoURL && <img src={this.state.term.photoURL} className="img-fluid w-100 mb-2" alt="photo URL" />}
                                    <div className="d-flex">
                                        {this.state.term.photoURL && <Button onClick={this.removeThumbnail} variant="contained" color="default" className="mr-1">Xóa ảnh này</Button>}
                                        <Button variant="contained" color="default" onClick={this.showLibs}><CloudUpload className="mr-2" /> Chọn ảnh đại diện</Button>
                                    </div>
                                </div>
                                <Dialog fullScreen={true} open={this.state.openLibs}>
                                    <DialogContent>
                                        <Libraries onChange={this.handleChangeTerm('photoURL')} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button variant="contained" color="default" onClick={this.showLibs}>Đóng</Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                        )
                    }
                    <div className="d-flex align-items-center mt-2">
                        {this.state.loading ? <CircularProgress /> : <Button className="mr-1" onClick={this.handleSubmit} variant="contained" color="primary">LƯU</Button>}
                        {this.state.term.uid && <Button onClick={this.handleCancel} variant="contained" color="primary">HỦY BỎ</Button>}
                    </div>
                </form>
            </div>
        );
    }

    public getTermToEdit(props: any) {
        if (props.edit) {
            if (props.edit.uid !== this.state.term.uid) {
                this.setState({ term: props.edit });
                if (this.state.term.uid) {
                    this.eventUnloadTabBrowser(this.state.term.uid)();
                }
                window.addEventListener("beforeunload", this.eventUnloadTabBrowser(props.edit.uid));
            }
        }
    }

    public deleteTermToEdit(uid: string) {
        if (uid) {
            firebase.firestore().collection('terms').doc(uid).update({ editing: false });
            window.removeEventListener("beforeunload", this.eventUnloadTabBrowser(uid));
        }
    }

    public eventUnloadTabBrowser = (uid: string) => () => {
        return firebase.firestore().collection('terms').doc(uid).update({ editing: false });
    }

    public showLibs = () => {
        this.setState({ openLibs: !this.state.openLibs });
    }

    public handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        this.eventUnloadTabBrowser(this.state.term.uid)().then(() => {
            this.setState({ term: this.defaultTerm });
        });
    }
    public removeThumbnail = () => {
        this.setState({ term: { ...this.state.term, photoURL: null } });
    }

    public handleChangeTerm = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let value: any = event.target.value;
        const { term } = this.state;
        switch (key) {
            case 'name':
                term.slug = string_to_slug(value);
                break;
            case 'parent':
                if (value === '') {
                    value = null;
                }
                break;
            case 'photoURL':
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Đã chọn ảnh đại diện' } });
                value = event;
                break;
            default:
                value = event.target.value;
                break;
        }
        this.setState({ term: { ...term, [key]: value } });
    }

    public handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { name, slug, description, photoURL, uid, createdAt } = this.state.term;
        let { parent } = this.state.term;
        const { type, term } = this.props;

        if (typeof parent === 'string') {
            parent = firebase.firestore().collection('terms').doc(parent);
        }

        const data = { name, slug, parent, description, photoURL, type, term, createdAt: createdAt ? createdAt : new Date().getTime() };

        if (!data.name) {
            return this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: "Tiêu đề không được để trống" } });
        }
        if (!data.slug) {
            return this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: "Đường dẫn không được để trống" } });
        }

        this.setState({ loading: true });
        if (uid) {
            firebase.firestore().collection('terms').doc(uid).update(data).then(() => {
                this.setState({ term: this.defaultTerm });
            }).catch((error: Error) => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi', content: error } });
            }).then(() => {
                this.setState({ loading: false });
                this.deleteTermToEdit(uid);
            });
        } else {
            firebase.firestore().collection('terms').add(data).then(() => {
                this.setState({ term: this.defaultTerm });
            }).catch((error: Error) => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi', content: error } });
            }).then(() => {
                this.setState({ loading: false });
                this.deleteTermToEdit(uid);
            });
        }

    }

}

export default connect(state => state)(CreateTerm);
import * as React from 'react';
import { connect } from 'react-redux';
import { TextField, Table, Button, TableHead, TableRow, TableCell, TableBody, Paper, Avatar, IconButton, Badge } from '@material-ui/core';
import * as firebase from 'firebase/app';
import DeleteIcon from '@material-ui/icons/DeleteForever';

class Index extends React.Component<any, any>{
    public state = {
        search: ''
    };

    public render() {
        const { dataSource, type } = this.props;
        return (
            <div className="terms">
                <div className="d-flex justify-content-start align-items-end w-100">
                    <TextField className="w-100" label="Tìm kiếm" value={this.state.search} onChange={this.handleChangeState('search')} />
                </div>
                <Paper className="rounded-0">
                    <div className="table-responsive">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-truncate">Tên</TableCell>
                                    <TableCell className="text-truncate">Đường dẫn</TableCell>
                                    <TableCell className="text-truncate">Mô tả</TableCell>
                                    <TableCell className="text-truncate">Xóa</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.search !== '' ? dataSource.map((node: any) => {
                                        if (new RegExp(node.name).test(node.name)) {
                                            return this.getDoom(node, 0);
                                        }
                                        return null;
                                    }) : type === 'tag' ? dataSource.map((doc: any) => this.getDoom(doc, 0)) : this.getDataSource(dataSource, null, 0)
                                }
                            </TableBody>
                        </Table>
                    </div>
                </Paper>
            </div>
        );
    };
    public onChange = (node: any) => (e: any) => {
        firebase.firestore().collection('terms').doc(node.uid).update({ editing: true }).then(() => {
            if (this.props.onChange) {
                this.props.onChange(node);
            }
        });
    }
    public deleteTerm = (node: any) => () => {
        if (node.type === 'category' && !window.confirm('Bạn có chắc không ?')) {
            return;
        }
        const { type } = this.props;

        firebase.firestore().collection('terms').doc(node.uid).delete().then(() => {
            firebase.firestore().collection('posts').where(type, 'array-contains', node.uid).get().then((result) => {
                if (result.docs.length) {
                    result.docs.map((doc) => {
                        const postRef = firebase.firestore().collection('posts').doc(doc.id);
                        firebase.firestore().runTransaction(transaction => {
                            return transaction.get(postRef).then(postResult => {
                                if (postResult.exists) {
                                    const data: any = postResult.data();
                                    transaction.update(postRef, { [type]: data[type].filter((id: string) => id !== node.uid) });
                                }
                            })
                        })
                    })
                }
            });
        }).then(() => {
        
            // delete uid parent
            if(type === 'category'){
                firebase.firestore().collection('terms').where('parent', '==', node.uid).get().then((result) => {
                    if (result.docs.length) {
                        result.docs.map((doc) => {
                            const termRef = firebase.firestore().collection('terms').doc(doc.id);
                            firebase.firestore().runTransaction(transaction => {
                                return transaction.get(termRef).then(postResult => {
                                    if (postResult.exists) {
                                        transaction.update(termRef, { parent: null });
                                    }
                                })
                            })
                        })
                    }
                });
            }
        }).catch((error: Error) => {
            window.console.log(error);
            this.props.dispatch({type: "ADD_NOTIFICATION", data: {title: error.toString()}});
        })

    }
    public getDataSource(source: any[], childOf: any, index: number) {
        return source.map((node) => {
            if (node.parent === childOf || node.parent && node.parent.id === childOf) {
                return (
                    <React.Fragment key={node.uid}>
                        {this.getDoom(node, index)}
                        {this.getDataSource(source, node.uid, index + 1)}
                    </React.Fragment>
                );
            } else {
                return null;
            }
        })
    }
    public getDoom = (node: any, index: number) => {
        const { name, uid, slug, description, count } = node;
        let i = '';
        for (let j = 0; j < index; j++) {
            i += '-';
        }
        return (
            <TableRow key={uid}>
                <TableCell>
                    <div className="d-flex">
                        {
                            node.type === 'category' && node.photoURL && (
                                <div style={{ width: 40 }}>
                                    <Avatar src={node.photoURL} />
                                </div>
                            )
                        }
                        <div className="clearfix">
                            <Button className="text-truncate" style={{ textTransform: 'none' }} onClick={this.onChange(node)} >{i} {name}</Button>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-truncate">{slug}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell><Badge color="primary" badgeContent={count || 0}><IconButton onClick={this.deleteTerm(node)}><DeleteIcon /></IconButton></Badge></TableCell>
            </TableRow>
        );
    }

    public handleChangeState = (key: string) => (e: any) => {
        this.setState({ [key]: e.target.value });
    };
}

export default connect(e => e)(Index);
import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Paper, LinearProgress, Button } from '@material-ui/core';
import Create from './Create';
import All from './All';
import * as firebase from 'firebase/app';

class Index extends React.Component<any, any>{
    public state = {
        terms: [],
        loading: false,
        term: null,
        lastSnapshot: null,
        updated: false
    };
    public listen: any = () => {/** */ };

    public componentWillMount() {
        document.title = "Danh mục";
    };


    public render() {
        const { terms, loading } = this.state;
        const { type, term } = this.props;
        window.console.log(terms.length);
        return (
            <div className="libraries">
                <Grid container={true}>
                    <Grid item={true} xs={12} sm={5} md={4} xl={3} className="mb-2">
                        <Paper className="p-2 rounded-0">
                            <Create {...this.props} dataSource={terms} edit={this.state.term} />
                        </Paper>
                    </Grid>
                    <Grid item={true} xs={12} sm={7} md={8} xl={9} className="pl-sm-1">
                        {loading && <LinearProgress />}
                        <All dataSource={terms} updated={this.state.updated} onChange={this.handleChangeTerm} type={type} term={term} />
                        {type === 'tag' && <Button disabled={loading} className="mt-2 ml-auto mr-auto" onClick={this.loadMore} variant="contained" color="primary">Tải thêm</Button>}
                    </Grid>
                </Grid>
            </div>
        );
    }

    /**
     * Nhận Term để chỉnh sửa
     */
    public handleChangeTerm = (term: any) => {
        this.setState({ term });
    };

    public componentDidMount() {
        this.getTerms();
    }
    public loadMore = () => {
        this.listen();
        this.getTerms();
    }
    public componentWillUnmount(){
        this.listen();
    }
    public getTerms() {
        const { type, term } = this.props;
        this.setState({ loading: true });

        let ref = firebase.firestore()
            .collection('terms')
            .where('type', '==', type)
            .where('term', '==', term)
            .orderBy('createdAt', 'desc');

        if (type === 'tag') {
            ref = ref.limit(20);
        }
        if (this.state.lastSnapshot) {
            ref = ref.startAfter(this.state.lastSnapshot);
        }

        this.listen = ref
            .onSnapshot((snapshot) => { 
                const terms: any[] = snapshot.docs.map((doc: any) => {
                    return { ...doc.data(), uid: doc.id };
                });
                this.setState({ terms, loading: false, lastSnapshot: snapshot.docs[snapshot.docs.length - 1], updated: !this.state.updated });
            });
    }
}

export default connect(e => e)(Index);
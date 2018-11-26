import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Paper } from '@material-ui/core';
import { Bookmark, Create as CreateIcon, Cloud, Label } from '@material-ui/icons';
import Category from './Term';
import Create from './Create';
import Posts from './Posts';

class Index extends React.Component<any, any>{
    public state = {
        activeTab: 0,
        post: null
    };

    public handleUpdateState = (event: any, activeTab: any) => {
        this.setState({ activeTab, post: null });
    };

    public componentWillMount() {
        document.title = "Bài viết";
    };


    public render() {
        return (
            <div className="libraries">
                <Paper className="mb-1 rounded-0">
                    <Tabs
                        fullWidth={true}
                        scrollable={true}
                        value={this.state.activeTab}
                        onChange={this.handleUpdateState}
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        <Tab component="div" label="TẤT CẢ BÀI VIẾT" icon={<Bookmark />} />
                        <Tab component="div" label="THÊM BÀI VIẾT" icon={<CreateIcon />} />
                        <Tab component="div" label="DANH MỤC" icon={<Label />} />
                        <Tab component="div" label="THẺ MÂY" icon={<Cloud />} />
                    </Tabs>
                </Paper>

                {this.state.activeTab === 0 && <Posts onChange={this.handleChangePost} type="post" name="bai-viet" />}
                {this.state.activeTab === 1 && <Create post={this.state.post} type="post" name="bai-viet" />}
                {this.state.activeTab === 2 && <Category type="category" term="category" />}
                {this.state.activeTab === 3 && <Category type="tag" term="tag" />}
            </div>
        );
    }

    public handleChangePost = (post: any) => (e: any) => {
        this.setState({ post, activeTab: 1 });
    }
}

export default connect(e => e)(Index);
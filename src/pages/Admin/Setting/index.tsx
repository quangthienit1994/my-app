import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, TextField, Paper, List } from '@material-ui/core';
import Setting from './class.setting';
import ListItemField from 'src/components/ListItemField';
import ChooseFileMedia from 'src/components/ChooseFileMedia';

/**
 * Lấy setting và lưu setting, quản lý setting
 * 
 * @author: Quang Nguyen
 */
export class SettingCore extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            settings: [
                new Setting('siteTitle', { value: '', type: 'public', group: 'setting' }, this.update),
                new Setting('siteDescription', { value: '', type: 'public', group: 'setting' }, this.update),
                new Setting('siteEmail', { value: '', type: 'public', group: 'setting' }, this.update),
                new Setting('siteLogo', { value: '', type: 'public', group: 'setting' }, this.update),
            ],
            loading: null
        };
    }
    public update = () => {
        this.forceUpdate();
    }

    public render() {

        const siteTitle: Setting = this.getSetting('siteTitle');
        const siteDescription: Setting = this.getSetting('siteDescription');
        const siteEmail: Setting = this.getSetting('siteEmail');
        const siteLogo: Setting = this.getSetting('siteLogo');

        return (
            <Paper className="rounded-0">
                <List>
                    <ListItemField loading={this.state.loading === 'siteTitle'} title="Tiêu đề ứng dụng" description={siteTitle.value} onSave={this.handleSubmit('siteTitle')}>
                        <TextField onChange={this.onChange('siteTitle')} value={siteTitle.value} />
                    </ListItemField>
                    <ListItemField loading={this.state.loading === 'siteDescription'} title="Mô tả của ứng dụng" description={siteDescription.value} onSave={this.handleSubmit('siteDescription')}>
                        <TextField onChange={this.onChange('siteDescription')} value={siteDescription.value} />
                    </ListItemField>
                    <ListItemField loading={this.state.loading === 'siteEmail'} title="Email của ứng dụng" description={siteEmail.value} onSave={this.handleSubmit('siteEmail')}>
                        <TextField type="email" onChange={this.onChange('siteEmail')} value={siteEmail.value} />
                    </ListItemField>
                    <ListItemField loading={this.state.loading === 'siteLogo'} title="Logo của ứng dụng" avatar={siteLogo.value} onSave={this.handleSubmit('siteLogo')}>
                        <img className="img-fluid mb-2" src={(siteLogo.value as string)} alt="Logo của ứng dụng" />
                        <ChooseFileMedia onChange={this.onChange('siteLogo')} />
                    </ListItemField>
                </List>
            </Paper>
        );
    }
    protected getSetting(key: string): Setting {
        return (this.state.settings.find((node: Setting) => node.key === key) as Setting);
    }

    /**
     * Cập nhập value của setting theo key
     */
    protected onChange = (key: string) => (e: any ) => {

        const setting: Setting = this.getSetting(key);
        let value;

        if (e.target) {
            switch (e.target.type) {
                case 'checkbox':
                case 'radio':
                    value = e.target.checked;
                    break;
                default:
                    value = e.target.value;
                    break;
            }
        } else {
            value = e;
        }

        setting.value = value;

        this.forceUpdate();
    }
    protected handleSubmit = (key: string) => () => {
        const setting: Setting = this.getSetting(key);

        this.setState({ loading: key });
        if (setting) {
            setting.save().catch((error: Error) => {
                this.props.dispatch({ type: "UPDATE_NOTIFICATION", data: { title: error.toString() } });
            }).then(() => {
                this.setState({ loading: null });
            });
        }
    }
}

export default withStyles({}, { withTheme: true })(connect(e => e)(SettingCore));
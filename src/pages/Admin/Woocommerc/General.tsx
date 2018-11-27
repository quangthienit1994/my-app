import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, TextField, Paper, List, Divider } from '@material-ui/core';
import ListItemField from 'src/components/ListItemField';
import Setting from '../Setting/class.setting';

/**
 * Lấy setting và lưu setting, quản lý setting
 * 
 * @author: Quang Nguyen
 */
export class SettingCore extends React.Component<any, any>{
    public state = {
        loading: ''
    };

    public render() {

        const address1: Setting = this.getSetting('address1');
        const address2: Setting = this.getSetting('address2');
        const city: Setting = this.getSetting('city');
        const nation: Setting = this.getSetting('nation');

        return (
            <Paper className="rounded-0">
                <List>
                    <ListItemField loading={this.state.loading === 'address1'} title="Địa chỉ 1" description={address1.value} onSave={this.handleSubmit('address1')}>
                        <TextField onChange={this.onChange('address1')} value={address1.value} />
                    </ListItemField>
                    <Divider />
                    <ListItemField loading={this.state.loading === 'address2'} title="Địa chỉ 2" description={address2.value} onSave={this.handleSubmit('address2')}>
                        <TextField onChange={this.onChange('address2')} value={address2.value} />
                    </ListItemField>
                    <Divider />
                    <ListItemField loading={this.state.loading === 'city'} title="Thành phố / Tỉnh" description={city.value} onSave={this.handleSubmit('city')}>
                        <TextField type="email" onChange={this.onChange('city')} value={city.value} />
                    </ListItemField>
                    <Divider />
                    <ListItemField loading={this.state.loading === 'nation'} title="Quốc gia" description={nation.value} onSave={this.handleSubmit('nation')}>
                        <TextField onChange={this.onChange('nation')} value={nation.value} />
                    </ListItemField>
                </List>
            </Paper>
        );
    }
    protected getSetting(key: string): Setting {
        return (this.props.settings.find((node: Setting) => node.key === key) as Setting);
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
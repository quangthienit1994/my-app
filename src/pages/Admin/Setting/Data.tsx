import * as React from 'react';
import { connect } from 'react-redux';
import { List, TextField, Divider, Paper, Button, Typography, withStyles, FormControlLabel, Radio, RadioGroup, ListItem, ListItemText } from '@material-ui/core';
import ListItemField from 'src/components/ListItemField';
import ChooseFileMedia from 'src/components/ChooseFileMedia';
import * as firebase from 'firebase/app';
import Settings from '@material-ui/icons/Settings';

export class SettingCore extends React.Component<any, any>{
    public state = {
        settings: [
            {
                key: 'site_title',
                label: 'Tiêu đề ứng dụng',
                value: '',
                group: 'data',
                type: 'public',
                fieldType: 'text',
                loading: false,
                required: true
            },
            {
                key: 'site_description',
                label: 'Mô tả của ứng dụng',
                value: '',
                group: 'data',
                type: 'public',
                fieldType: 'text',
                loading: false,
                required: true
            },
            {
                key: 'site_logo',
                label: 'Logo ứng dụng',
                value: '',
                group: 'data',
                type: 'public',
                fieldType: 'image',
                loading: false,
                required: false
            },
            {
                key: 'site_email',
                label: 'Email ứng dụng',
                value: '',
                group: 'data',
                type: 'public',
                fieldType: 'email',
                loading: false,
                required: false
            },
            {
                key: 'time_type',
                label: 'Cách hiển thị thời gian',
                value: 'LLL',
                group: 'data',
                type: 'public',
                source: [
                    { value: 'LT', name: '2:32 PM' },
                    { value: 'LTS', name: '2:32:23 PM' },
                    { value: 'L', name: '11/22/2018' },
                    { value: 'l', name: '11/22/2018' },
                    { value: 'LL', name: 'November 22, 2018' },
                    { value: 'll', name: 'Nov 22, 2018' },
                    { value: 'LLL', name: 'November 22, 2018 2:31 PM' },
                    { value: 'lll', name: 'Nov 22, 2018 2:31 PM' },
                    { value: 'LLLL', name: 'Thursday, November 22, 2018 2:31 PM' },
                    { value: 'llll', name: 'Thu, Nov 22, 2018 2:31 PM' },
                ],
                fieldType: 'radio',
                loading: false,
                required: true
            },
        ]
    };

    public componentDidMount() {
        this.getSettings();
    }

    public render() {
        return (
            <div className="libraries">
                <Paper className="rounded-0">
                    <List>
                        <ListItem>
                            <ListItemText>
                                <div className="d-flex align-items-center">
                                    <Settings /> TẤT CẢ DỮ LIỆU
                                </div>
                            </ListItemText>
                        </ListItem>
                        {this.getSettingsDOOM()}
                    </List>
                </Paper>
            </div>
        );
    }

    public getSettingsDOOM() {
        return this.state.settings.map((node: any, i) => {
            const { key, label, value, type, fieldType, required, loading, source } = node;
            let file;
            const options: any = { loading };
            switch (fieldType) {
                case 'radio':
                    options.description = source.find((s: any) => s.value === value).name;
                    file = (
                        <div className="d-block">
                            <RadioGroup
                                onChange={this.handleChange(i)}
                                value={value}
                            >
                                {
                                    source.map((s: any) => {
                                        return (
                                            <FormControlLabel
                                                key={s.value}
                                                label={s.name}
                                                value={s.value}
                                                control={<Radio />}
                                            />
                                        );
                                    })
                                }
                            </RadioGroup>
                        </div>
                    )
                    break;
                case 'file':
                    options.fullSceen = true;
                    file = (
                        <div className="d-block">
                            {value && <Typography>{value}</Typography>}
                            <div className="d-flex w-100 mt-2">
                                {value && <Button className="mr-1" onClick={this.handleChangeValue(i)} variant="contained" color="default">Xóa file</Button>}
                                <ChooseFileMedia onChange={this.handleChange(i)} />
                            </div>
                        </div>
                    )
                    break;
                case 'image':
                    options.fullSceen = true;
                    options.avatar = value;
                    file = (
                        <div className="d-block">
                            {value && <img src={value} alt={label} className="img-fluid" />}
                            <div className="d-flex w-100 mt-2">
                                {value && <Button className="mr-1" onClick={this.handleChangeValue(i)} variant="contained" color="default">Xóa file</Button>}
                                <ChooseFileMedia onChange={this.handleChange(i)} />
                            </div>
                        </div>
                    )
                    break;
                default:
                    options.description = value;
                    file = <TextField className="w-100" type={type} label={label} value={value} onChange={this.handleChange(i)} />
                    break;
            }
            return (
                <React.Fragment key={key}>
                    <Divider />
                    <ListItemField
                        onSave={this.handleSaveSetting(node, i)}
                        disabledSubmitBtn={required ? value === '' : false}
                        title={label}
                        {...options}
                    >
                        <div className="text-center m-ato d-flex jusity-content-center">
                            {file}
                        </div>
                    </ListItemField>
                </React.Fragment>
            )
        })
    }

    public getSettings = () => {
        firebase.firestore().collection('settings').onSnapshot(snapshot => {
            const { settings } = this.state;
            snapshot.docs.map((setting: any) => {
                const find = settings.findIndex(({ key }: any) => key === setting.data().key);
                if (find === -1) {
                    settings.push({ ...setting.data(), uid: setting.id, loading: false });
                } else {
                    settings[find] = { ...settings[find], ...setting.data(), uid: setting.id, loading: false }
                }
            });
            this.setState({ settings });
        });
    }

    public handleChangeValue = (i: number) => (e: any) => {
        this.handleChange(i)('');
    };

    public handleChange = (i: number) => (e: any) => {
        const { settings } = this.state;
        switch (typeof e) {
            case 'string':
                settings[i].value = e;
                break;
            default:
                settings[i].value = e.target.value;
        }

        this.setState({ settings });
    };

    public handleSaveSetting = (setting: any, index: number) => (e: any) => {
        const ref = firebase.firestore().collection('settings');

        const { settings }: any = this.state;
        settings[index].loading = true;
        this.setState({ settings });

        const complete = (result: any) => {
            if (!settings[index].uid) {
                settings[index].uid = result.id;
            }
            settings[index].loading = false;
            this.setState({ settings });
        };

        const data = {
            label: setting.label,
            group: setting.group,
            key: setting.key,
            type: setting.type,
            value: setting.value
        };

        if (setting.uid) {
            ref.doc(setting.uid).update(data).catch((error: Error) => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi', content: error.toString() } });
            }).then(complete);
        } else {
            ref.add(data).catch((error: Error) => {
                this.props.dispatch({ type: "ADD_NOTIFICATION", data: { title: 'Lỗi', content: error.toString() } });
            }).then(complete);
        }
    }
}

export default withStyles({}, { withTheme: true })(connect(e => e)(SettingCore));
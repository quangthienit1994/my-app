import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';

class MuiTheme extends React.Component<any, any>{
    public render() {
        const theme = createMuiTheme((this.props.THEME as any));

        return (
            <MuiThemeProvider theme={theme}>
                <div style={{background: theme.palette.background.default, width: '100%', minHeight: '100vh'}}>
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default connect(e => e)(MuiTheme);

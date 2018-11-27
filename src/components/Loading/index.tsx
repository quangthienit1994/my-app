import * as React from 'react';
import "./style.scss";

class Loading extends React.PureComponent<React.HTMLAttributes<any>, any>{
    public render() {
        return (
            <div className={`loading-line ${this.props.className}`} {...this.props} />
        );
    }
}

export default Loading;

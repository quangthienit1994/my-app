import * as React from 'react';
import CKEditor from "react-ckeditor-component";

export default class Editor extends React.Component<any, any>{
    public handleEditorChange = (evt: any): void => {
        if (this.props.onChange) {
            this.props.onChange({ target: { value: evt.editor.getData() } });
        }
    }
    public shouldComponentUpdate(nextProps: any) {
        return nextProps.value !== this.props.value;
    }
    public render(): React.ReactNode {
        return (
            <CKEditor
                content={this.props.value}
                activeClass="p10" 
                events={{
                "change": this.handleEditorChange
                }} />
        );
    }
}
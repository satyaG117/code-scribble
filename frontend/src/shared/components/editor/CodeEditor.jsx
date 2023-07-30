import Editor from '@monaco-editor/react';

export default function CodeEditor(props) {
    return (
        <Editor
            height="100%"
            defaultLanguage={props.language}
            value={props.value}
            onChange={props.onChange}
            theme={props.theme}
        />

    )
}
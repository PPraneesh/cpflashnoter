/* eslint-disable react/prop-types */
import Editor from '@monaco-editor/react';

export default function Code(props) {
    
    return (<>
        <Editor
            height="90vh"
            defaultLanguage="C++"
            defaultValue={props.code}
            onChange={(value) =>{ console.log(value)
                props.setCode(value)}}
        />
    </>)
    }

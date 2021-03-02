import * as React from 'react';
import { Editor, EditorTools } from '@progress/kendo-react-editor';

const { Bold, Italic, Underline,
    AlignLeft, AlignRight, AlignCenter,
    Indent, Outdent,
    OrderedList, UnorderedList,
    Undo, Redo, Link, Unlink } = EditorTools;

const KendoRichEditor = (props) => {
  return (
    <Editor
        tools={[
            [ Bold, Italic, Underline ],
            [ Undo, Redo ],
            [ Link, Unlink ],
            [ AlignLeft, AlignCenter, AlignRight ],
            [ OrderedList, UnorderedList, Indent, Outdent ]
        ]}
        contentStyle={{ height: 320 }}
        defaultContent={`<p>The KendoReact Editor allows your users to edit HTML in a familiar, user-friendly way.<br />The Editor provides the core HTML editing engine, which includes text formatting, hyperlinks, and lists. The component <strong>outputs identical HTML</strong> across all major browsers, follows accessibility standards, and provides API for content manipulation.</p>
        <p>Features include:</p>
        <ul>
            <li>Text formatting</li>
            <li>Bulleted and numbered lists</li>
            <li>Hyperlinks</li>
            <li>Cross-browser support</li>
            <li>Identical HTML output across browsers</li>
        </ul>`}
    />
  );
}

export default KendoRichEditor;

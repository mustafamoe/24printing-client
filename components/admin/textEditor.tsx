import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

interface ITextEditor {
    name: string;
    styles?: object;
    direction?: "rtl" | "ltr";
    id: string;
    value: string;
    onChange: any;
}

const TextEditor = ({
    name,
    styles,
    direction,
    id,
    value,
    onChange,
}: ITextEditor) => {
    const [editorIsInitialized, setEditorIsInitialized] = useState(false);

    return (
        <div style={{ ...styles }}>
            <Editor
                value={editorIsInitialized ? value : " "}
                id={id}
                onInit={() => {
                    if (!editorIsInitialized) {
                        setEditorIsInitialized(true);
                    }
                }}
                apiKey="p2f3wrzpsomvt0lvr2uphccyzhlnxzopddrmptrb4addcxon"
                init={{
                    height: 200,
                    min_height: 200,
                    branding: false,
                    menubar: true,
                    plugins:
                        "fullscreen link media preview print charmap emoticons",
                    directionality: direction || "ltr",
                    toolbar:
                        "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor casechange formatpainter removeformat | pagebreak | charmap emoticons | fullscreen preview save print | media pageembed template link anchor codesample | a11ycheck ltr rtl",
                }}
                onEditorChange={(e) => onChange(e, name)}
            />
        </div>
    );
};

export default TextEditor;

import { baseUrl } from "@/lib/gen/base-url";
import Checklist from "@editorjs/checklist";
import EditorJS, {
  type EditorConfig,
  type OutputData,
} from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import React, { useEffect, useRef } from "react";
// import Image from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";

interface EditorComponentProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const EDITOR_JS_TOOLS = {
  checklist: {
    class: Checklist,
    inlineToolbar: true,
    config: {
      placeholder: "Masukkan item checklist",
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Masukkan judul",
      levels: [1, 2, 3, 4],
      defaultLevel: 1,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      placeholder: "Masukkan item daftar",
    },
  },
  paragraph: Paragraph,
  quote: Quote,
  // image: {
  //   class: Image,
  //   inlineToolbar: true,
  //   config: {
  //     endpoints: {
  //       byFile: `${baseUrl.auth_esensi}/_file/upload`, // Your backend file uploader endpoint
  //       byUrl: `${baseUrl.auth_esensi}/_file/upload`, // Your endpoint that provides uploading by Url
  //     },
  //     field: "file", // The name of the file field in your backend
  //     additionalRequestData: {
  //       // You can add additional data to be sent with the file upload request
  //       // For example, you can send the book ID or any other relevant data
  //       bookId: "your-book-id", // Replace with actual book ID or other data
  //     },
  //   },
  // },
  image: {
    class: SimpleImage,
    inlineToolbar: true,
    config: {
      endpoints: {
        byFile: `${baseUrl.auth_esensi}/_file/upload`, // Your backend file uploader endpoint
        byUrl: `${baseUrl.auth_esensi}/_file/upload`, // Your endpoint that provides uploading by Url
      },
    },
  },
  embed: Embed,
};

const MyEditorJS: React.FC<EditorComponentProps> = ({
  data,
  onChange,
  readOnly = false,
  placeholder = "Start writing something...",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) return;
    if (!holderRef.current) return;

    const editorConfig: EditorConfig = {
      holder: holderRef.current,
      tools: EDITOR_JS_TOOLS,
      data: data || { blocks: [] },
      readOnly,
      placeholder,
      onChange: async () => {
        if (onChange) {
          const outputData = await editorRef.current?.save();
          if (outputData) {
            onChange(outputData);
          }
        }
      },
      onReady: () => {},
      autofocus: !readOnly,
    };

    const editor = new EditorJS(editorConfig);
    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [readOnly, placeholder, data, onChange]);

  return (
    <div className="editor-container">
      <div ref={holderRef} className="editor-js" />
    </div>
  );
};

export default MyEditorJS;

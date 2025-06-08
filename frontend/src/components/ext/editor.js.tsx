import { baseUrl } from "@/lib/gen/base-url";
import { cn } from "@/lib/utils";
import Checklist from "@editorjs/checklist";
import EditorJS, {
  type EditorConfig,
  type OutputData,
} from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
// import Image from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef } from "react";

interface EditorComponentProps {
  label?: string;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
  placeholder?: string;
  optional?: boolean;
}

// class SimpleImage {
//   static get toolbox() {
//     return {
//       title: "Image",
//       icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
//     };
//   }

//   render() {
//     return document.createElement("input");
//   }

//   save(blockContent) {
//     return {
//       url: blockContent.value,
//     };
//   }
// }

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
  list: List,
  paragraph: Paragraph,
  quote: Quote,
  // list: {
  //   class: List,
  //   inlineToolbar: true,
  //   config: {
  //     placeholder: "Masukkan item daftar",
  //   },
  // },
  // image: {
  //   class: Image,
  //   inlineToolbar: true,
  //   config: {
  //     endpoints: {
  //       byFile: `${baseUrl.auth_esensi}/api/upload`, // Your backend file uploader endpoint
  //       byUrl: `${baseUrl.auth_esensi}/api/upload`, // Your endpoint that provides uploading by Url
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
        byFile: `${baseUrl.auth_esensi}/api/upload`, // Your backend file uploader endpoint
        byUrl: `${baseUrl.auth_esensi}/api/upload`, // Your endpoint that provides uploading by Url
      },
    },
  },
  embed: Embed,
};

const MyEditorJS: React.FC<EditorComponentProps> = ({
  label,
  data,
  onChange,
  readOnly = false,
  placeholder = "Start writing something...",
  optional = false,
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
    <>
      <label className="text-sm font-medium" onClick={() => {}}>
        {label}
        {optional && (
          <span className="text-gray-500 lowercase"> (opsional)</span>
        )}
      </label>
      <div className="editor-container">
        <div ref={holderRef} className="editor-js" />
      </div>
    </>
  );
};

export default MyEditorJS;

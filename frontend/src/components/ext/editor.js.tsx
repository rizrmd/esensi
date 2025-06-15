import { baseUrl } from "@/lib/gen/base-url";
import Checklist from "@editorjs/checklist";
import EditorJS, {
  type EditorConfig,
  type OutputData,
} from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import React, { useEffect, useRef } from "react";

interface EditorComponentProps {
  label?: string;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
  placeholder?: string;
  optional?: boolean;
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
      defaultStyle: "unordered",
    },
    shortcut: "CMD+SHIFT+L",
  },
  paragraph: Paragraph,
  quote: Quote,
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

// Data transformation utility to ensure List block compatibility
const transformEditorData = (data: OutputData): OutputData => {
  if (!data || !data.blocks) return data;

  const transformedBlocks = data.blocks.map((block) => {
    if (block.type === "list") {
      // Ensure list data has correct format
      const listData = block.data;

      // Handle different possible formats
      if (listData && typeof listData === "object") {
        // Ensure items is always an array
        if (!Array.isArray(listData.items)) listData.items = [];

        // Ensure each item is a string (not an object)
        listData.items = listData.items.map((item, itemIndex) => {
          if (typeof item === "string") return item;
          else if (item && typeof item === "object") {
            // Handle case where item is {content: "text", items: []} (nested lists)
            if (item.content) return item.content;
            // Handle case where item is {text: "text"}
            else if (item.text) return item.text;
            // Handle case where item might have other properties
            else if (item.value) return item.value;
            // Fallback to JSON stringify for complex objects
            else return JSON.stringify(item);
          } else return String(item);
        });

        // Ensure style is properly set
        if (
          !listData.style ||
          (listData.style !== "ordered" && listData.style !== "unordered")
        )
          listData.style = "unordered";
      }
    }
    return block;
  });

  return {
    ...data,
    blocks: transformedBlocks,
  };
};

// Test function to validate list data format
const validateListData = (data: any): boolean => {
  if (!data || typeof data !== "object") return false;
  if (!data.style || (data.style !== "ordered" && data.style !== "unordered"))
    return false;
  if (!Array.isArray(data.items)) return false;

  // Ensure all items are strings
  return data.items.every((item: any) => typeof item === "string");
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
  const isUpdatingFromEditor = useRef(false);

  // Effect to handle data updates from external sources only
  useEffect(() => {
    if (editorRef.current && data && !isUpdatingFromEditor.current) {
      // Transform data to ensure compatibility
      const transformedData = transformEditorData(data);
      editorRef.current
        .render(transformedData)
        .catch((error) =>
          console.error("Error rendering editor:", error, "on data:", data)
        );
    }
  }, [data]);

  useEffect(() => {
    if (editorRef.current) return;
    if (!holderRef.current) return;

    const testData = {
      time: Date.now(),
      blocks: [
        {
          id: "test-paragraph",
          type: "paragraph",
          data: {
            text: "This is a test paragraph.",
          },
        },
        {
          id: "test-list",
          type: "list",
          data: {
            style: "unordered",
            items: ["First list item", "Second list item", "Third list item"],
          },
        },
      ],
      version: "2.28.2",
    };

    const editorConfig: EditorConfig = {
      holder: holderRef.current,
      tools: EDITOR_JS_TOOLS,
      data: data ? transformEditorData(data) : testData,
      readOnly,
      placeholder,
      onReady: () => {},
      onChange: async (api, event) => {
        if (onChange) {
          try {
            isUpdatingFromEditor.current = true;
            const outputData = await editorRef.current?.save();
            if (outputData) {
              // Apply transformation to saved data as well to ensure consistency
              const transformedOutputData = transformEditorData(outputData);
              onChange(transformedOutputData);
            }
          } catch (error) {
            console.error("Stack:", (error as Error).stack);
          } finally {
            // Reset the flag after a short delay to allow parent component to update
            setTimeout(() => {
              isUpdatingFromEditor.current = false;
            }, 100);
          }
        }
      },
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

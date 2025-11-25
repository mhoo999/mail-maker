"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
  editable = true,
  className = "",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className}`,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const currentHTML = editor.getHTML();
      // 빈 HTML을 정규화 (빈 에디터는 <p></p>로 표시됨)
      const normalizedCurrent = currentHTML.replace(/<p><\/p>/g, '').trim();
      const normalizedContent = content?.replace(/<p><\/p>/g, '').trim() || '';
      
      // 내용이 실제로 다를 때만 업데이트
      if (normalizedCurrent !== normalizedContent) {
        editor.commands.setContent(content || '<p></p>', false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-toss-gray-300 rounded-lg ${!editable ? "bg-toss-gray-50" : ""}`}>
      {editable && (
        <div className="flex items-center gap-1 p-2 border-b border-toss-gray-200 bg-toss-gray-50 rounded-t-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-toss-gray-200 transition-colors ${
              editor.isActive("bold") ? "bg-toss-blue-light text-toss-blue" : "text-toss-gray-700"
            }`}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-toss-gray-200 transition-colors ${
              editor.isActive("italic") ? "bg-toss-blue-light text-toss-blue" : "text-toss-gray-700"
            }`}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="19" y1="4" x2="10" y2="4" />
              <line x1="14" y1="20" x2="5" y2="20" />
              <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-toss-gray-200 transition-colors ${
              editor.isActive("bulletList") ? "bg-toss-blue-light text-toss-blue" : "text-toss-gray-700"
            }`}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-toss-gray-200 transition-colors ${
              editor.isActive("orderedList") ? "bg-toss-blue-light text-toss-blue" : "text-toss-gray-700"
            }`}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <line x1="4" y1="6" x2="4.01" y2="6" />
              <line x1="4" y1="12" x2="4.01" y2="12" />
              <line x1="4" y1="18" x2="4.01" y2="18" />
            </svg>
          </button>
        </div>
      )}
      <div className={editable ? "p-3 min-h-[100px] max-h-[300px] overflow-y-auto" : "p-3"}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


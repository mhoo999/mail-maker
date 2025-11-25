"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "./extensions/FontSize";
import { useEffect, useState } from "react";

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      FontSize,
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
        editor.commands.setContent(content || '<p></p>', { emitUpdate: false });
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
        <div className="p-2 border-b border-toss-gray-200 bg-toss-gray-50 rounded-t-lg">
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-toss-gray-200 transition-colors ${
                editor.isActive("bold") ? "bg-toss-blue-light text-toss-blue" : "text-toss-gray-700"
              }`}
              type="button"
              title="굵게"
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
              title="기울임"
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
            
            {/* 폰트 크기 선택 */}
            <div className="relative">
              <button
                onClick={() => setShowFontSizePicker(!showFontSizePicker)}
                className="p-1.5 rounded hover:bg-toss-gray-200 transition-colors text-toss-gray-700 text-sm font-medium min-w-[60px]"
                type="button"
                title="글자 크기"
              >
                크기
              </button>
              {showFontSizePicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFontSizePicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white border border-toss-gray-300 rounded-lg shadow-lg z-20 p-1 min-w-[100px]">
                    {[10, 12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          editor.chain().focus().setFontSize(`${size}`).run();
                          setShowFontSizePicker(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-toss-gray-100 rounded text-sm"
                        type="button"
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 색상 선택 */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-toss-gray-200 transition-colors text-toss-gray-700 relative"
                type="button"
                title="글자 색상"
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
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                {editor.getAttributes("textStyle").color && (
                  <span
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: editor.getAttributes("textStyle").color }}
                  />
                )}
              </button>
              {showColorPicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white border border-toss-gray-300 rounded-lg shadow-lg z-20 p-2">
                    <div className="grid grid-cols-6 gap-1 mb-2">
                      {[
                        "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
                        "#FF0000", "#FF6600", "#FFCC00", "#66FF00", "#00CCFF", "#0066FF",
                        "#6600FF", "#FF00FF", "#FF0066", "#FF3366", "#FF6699", "#FF99CC",
                        "#3182f6", "#4caf50", "#ff9800", "#f44336", "#9c27b0", "#00bcd4",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border border-toss-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          type="button"
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      onChange={(e) => {
                        editor.chain().focus().setColor(e.target.value).run();
                        setShowColorPicker(false);
                      }}
                      className="mb-2 w-full h-8 rounded border border-toss-gray-300 cursor-pointer"
                    />
                    <button
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorPicker(false);
                      }}
                      className="w-full px-3 py-1.5 text-sm text-toss-gray-700 hover:bg-toss-gray-100 rounded"
                      type="button"
                    >
                      색상 제거
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-toss-gray-300 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-toss-gray-200 transition-colors ${
                editor.isActive("bulletList") ? "bg-toss-blue-light text-toss-blue" : "text-toss-gray-700"
              }`}
              type="button"
              title="불릿 리스트"
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
              title="번호 리스트"
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
        </div>
      )}
      <div className={editable ? "p-3 min-h-[100px] max-h-[300px] overflow-y-auto" : "p-3"}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


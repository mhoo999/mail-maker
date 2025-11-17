"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Block, BlockType } from "@/types/block";
import { generateId } from "@/lib/utils";
import { SortableBlock } from "./SortableBlock";
import { EmailPreview } from "./EmailPreview";
import { Plus, Eye, Code, Copy, Check, FileText } from "lucide-react";
import { generateEmailHTML } from "@/lib/html-generator";
import { TEMPLATES, createBlocksFromTemplate } from "@/lib/templates";

const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: "header", label: "헤더" },
  { type: "title", label: "제목" },
  { type: "text", label: "본문" },
  { type: "button", label: "버튼" },
  { type: "image", label: "이미지" },
  { type: "highlight", label: "강조 박스" },
  { type: "divider", label: "구분선" },
  { type: "footer", label: "푸터" },
];

export function MailBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const createBlock = (type: BlockType): Block => {
    const baseBlock = { id: generateId(), type };

    switch (type) {
      case "header":
        return { ...baseBlock, type: "header", logoUrl: "", badgeText: "" };
      case "title":
        return { ...baseBlock, type: "title", text: "", level: "h1" };
      case "text":
        return { ...baseBlock, type: "text", content: "" };
      case "button":
        return { ...baseBlock, type: "button", text: "", url: "" };
      case "image":
        return { ...baseBlock, type: "image", url: "", alt: "" };
      case "highlight":
        return { ...baseBlock, type: "highlight", variant: "info", content: "" };
      case "divider":
        return { ...baseBlock, type: "divider" };
      case "footer":
        return { ...baseBlock, type: "footer", companyName: "", copyright: "" };
      case "stats":
        return { ...baseBlock, type: "stats", stats: [] };
      default:
        return baseBlock as Block;
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock = createBlock(type);
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updatedBlock: Block) => {
    setBlocks(blocks.map((block) => (block.id === id ? updatedBlock : block)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const copyHtmlToClipboard = async () => {
    const html = generateEmailHTML(blocks);
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setBlocks(createBlocksFromTemplate(template));
      setShowTemplates(false);
    }
  };

  const startFromScratch = () => {
    setBlocks([]);
    setShowTemplates(false);
  };

  if (showTemplates && blocks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-toss-gray-100 p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-toss-gray-900 mb-4">Mail Maker</h1>
            <p className="text-lg text-toss-gray-600">HTML 이메일을 쉽게 만들어보세요</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => loadTemplate(template.id)}
                className="bg-white p-6 rounded-xl border-2 border-toss-gray-200 hover:border-toss-blue hover:shadow-lg transition-all text-left"
              >
                <FileText className="w-8 h-8 text-toss-blue mb-3" />
                <h3 className="text-lg font-bold text-toss-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-toss-gray-600">{template.description}</p>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={startFromScratch}
              className="px-6 py-3 text-toss-gray-700 hover:text-toss-blue font-medium transition-colors"
            >
              빈 페이지에서 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-toss-gray-100">
      {/* 왼쪽 패널: 블록 추가 및 편집 */}
      <div className="w-96 bg-white border-r border-toss-gray-300 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-toss-gray-900 mb-4">블록 추가</h2>
          <div className="grid grid-cols-2 gap-2 mb-8">
            {BLOCK_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-toss-gray-100 hover:bg-toss-blue-light hover:text-toss-blue text-toss-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-toss-gray-900 mb-4">블록 편집</h2>
          {blocks.length === 0 ? (
            <div className="text-center py-12 text-toss-gray-500 text-sm">
              왼쪽 버튼을 클릭하여 블록을 추가하세요
            </div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* 오른쪽 패널: 미리보기 */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-toss-gray-300 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-toss-gray-900">미리보기</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-toss-gray-100 hover:bg-toss-gray-200 text-toss-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              {showPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "HTML 보기" : "미리보기"}
            </button>
            <button
              onClick={copyHtmlToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-toss-blue hover:bg-toss-blue-dark text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              disabled={blocks.length === 0}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "복사됨!" : "HTML 복사"}
            </button>
          </div>
        </div>

        <div className="p-6">
          {showPreview ? (
            <EmailPreview blocks={blocks} />
          ) : (
            <div className="bg-toss-gray-900 text-toss-gray-100 p-6 rounded-lg font-mono text-sm overflow-auto max-h-[calc(100vh-120px)]">
              <pre className="whitespace-pre-wrap break-words">
                {blocks.length > 0 ? generateEmailHTML(blocks) : "블록을 추가하면 HTML 코드가 표시됩니다"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

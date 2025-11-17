"use client";

import { Block } from "@/types/block";
import { Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function BlockEditor({ block, onUpdate, onDelete, isDragging }: BlockEditorProps) {
  const renderEditor = () => {
    switch (block.type) {
      case "header":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="로고 URL"
              value={block.logoUrl || ""}
              onChange={(e) => onUpdate({ ...block, logoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <input
              type="text"
              placeholder="배지 텍스트"
              value={block.badgeText || ""}
              onChange={(e) => onUpdate({ ...block, badgeText: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "title":
        return (
          <div className="space-y-3">
            <select
              value={block.level}
              onChange={(e) => onUpdate({ ...block, level: e.target.value as "h1" | "h2" })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            >
              <option value="h1">제목 (큰)</option>
              <option value="h2">제목 (작은)</option>
            </select>
            <input
              type="text"
              placeholder="제목 텍스트"
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "text":
        return (
          <div className="space-y-3">
            <textarea
              placeholder="본문 내용"
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "button":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="버튼 텍스트"
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <input
              type="text"
              placeholder="링크 URL"
              value={block.url}
              onChange={(e) => onUpdate({ ...block, url: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="이미지 URL"
              value={block.url}
              onChange={(e) => onUpdate({ ...block, url: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <input
              type="text"
              placeholder="이미지 설명 (alt)"
              value={block.alt}
              onChange={(e) => onUpdate({ ...block, alt: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "highlight":
        return (
          <div className="space-y-3">
            <select
              value={block.variant}
              onChange={(e) => onUpdate({ ...block, variant: e.target.value as any })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            >
              <option value="info">정보</option>
              <option value="warning">경고</option>
              <option value="success">성공</option>
              <option value="error">에러</option>
            </select>
            <input
              type="text"
              placeholder="제목 (선택사항)"
              value={block.title || ""}
              onChange={(e) => onUpdate({ ...block, title: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <textarea
              placeholder="내용"
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "divider":
        return (
          <div className="text-center text-toss-gray-500 text-sm py-4">
            구분선
          </div>
        );

      case "footer":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="회사명"
              value={block.companyName || ""}
              onChange={(e) => onUpdate({ ...block, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <textarea
              placeholder="주소 및 연락처"
              value={block.address || ""}
              onChange={(e) => onUpdate({ ...block, address: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <input
              type="text"
              placeholder="저작권"
              value={block.copyright || ""}
              onChange={(e) => onUpdate({ ...block, copyright: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-toss-gray-300 p-4 mb-3 transition-shadow",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-toss-gray-400 cursor-grab" />
          <span className="text-sm font-medium text-toss-gray-700">
            {getBlockLabel(block.type)}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="text-toss-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {renderEditor()}
    </div>
  );
}

function getBlockLabel(type: Block["type"]): string {
  const labels: Record<Block["type"], string> = {
    header: "헤더",
    title: "제목",
    text: "본문",
    button: "버튼",
    image: "이미지",
    highlight: "강조 박스",
    stats: "통계 카드",
    divider: "구분선",
    footer: "푸터",
  };
  return labels[type];
}

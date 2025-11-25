"use client";

import { Block } from "@/types/block";
import { Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

interface BlockEditorProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function BlockEditor({ block, onUpdate, onDelete, isDragging, dragHandleProps }: BlockEditorProps) {
  const renderEditor = () => {
    switch (block.type) {
      case "header":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-toss-gray-700 mb-2">
                로고 URL
              </label>
              <input
                type="text"
                placeholder="로고 URL"
                value={block.logoUrl || ""}
                onChange={(e) => onUpdate({ ...block, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-toss-gray-700 mb-2">
                배지 텍스트
              </label>
              <TiptapEditor
                content={block.badgeText || ""}
                onChange={(content) => onUpdate({ ...block, badgeText: content })}
                placeholder="배지 텍스트를 입력하세요..."
              />
            </div>
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
            <TiptapEditor
              content={block.content || ""}
              onChange={(content) => onUpdate({ ...block, content })}
              placeholder="본문 내용을 입력하세요..."
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
            <TiptapEditor
              content={block.content || ""}
              onChange={(content) => onUpdate({ ...block, content })}
              placeholder="강조 박스 내용을 입력하세요..."
            />
          </div>
        );

      case "divider":
        return (
          <div className="text-center text-toss-gray-500 text-sm py-4">
            구분선
          </div>
        );

      case "spacer":
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-toss-gray-700">
              간격 높이 (px)
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={block.height}
              onChange={(e) => onUpdate({ ...block, height: parseInt(e.target.value) || 20 })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            <select
              value={block.listType}
              onChange={(e) => onUpdate({ ...block, listType: e.target.value as "bullet" | "number" })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            >
              <option value="bullet">불릿 (•)</option>
              <option value="number">숫자 (1,2,3)</option>
            </select>
            {block.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[index] = e.target.value;
                    onUpdate({ ...block, items: newItems });
                  }}
                  className="flex-1 px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                />
                <button
                  onClick={() => {
                    const newItems = block.items.filter((_, i) => i !== index);
                    onUpdate({ ...block, items: newItems });
                  }}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              onClick={() => onUpdate({ ...block, items: [...block.items, "새 항목"] })}
              className="w-full px-3 py-2 border-2 border-dashed border-toss-gray-300 hover:border-toss-blue hover:text-toss-blue rounded-lg transition-colors text-sm"
            >
              + 항목 추가
            </button>
          </div>
        );

      case "badge":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="배지 텍스트"
              value={block.text}
              onChange={(e) => onUpdate({ ...block, text: e.target.value })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            />
            <select
              value={block.variant}
              onChange={(e) => onUpdate({ ...block, variant: e.target.value as any })}
              className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
            >
              <option value="red">빨강 (긴급)</option>
              <option value="orange">주황 (경고)</option>
              <option value="blue">파랑 (정보)</option>
              <option value="green">초록 (완료)</option>
            </select>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-3">
            {block.stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="라벨"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...block.stats];
                    newStats[index] = { ...stat, label: e.target.value };
                    onUpdate({ ...block, stats: newStats });
                  }}
                  className="px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                />
                <input
                  type="text"
                  placeholder="값"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...block.stats];
                    newStats[index] = { ...stat, value: e.target.value };
                    onUpdate({ ...block, stats: newStats });
                  }}
                  className="px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                />
              </div>
            ))}
          </div>
        );

      case "infoTable":
        return (
          <div className="space-y-3">
            {block.rows.map((row, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="항목명"
                      value={row.label}
                      onChange={(e) => {
                        const newRows = [...block.rows];
                        newRows[index] = { ...row, label: e.target.value };
                        onUpdate({ ...block, rows: newRows });
                      }}
                      className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                    />
                    <TiptapEditor
                      content={row.value || ""}
                      onChange={(content) => {
                        const newRows = [...block.rows];
                        newRows[index] = { ...row, value: content };
                        onUpdate({ ...block, rows: newRows });
                      }}
                      placeholder="항목 내용을 입력하세요..."
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newRows = block.rows.filter((_, i) => i !== index);
                      onUpdate({ ...block, rows: newRows });
                    }}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => onUpdate({ ...block, rows: [...block.rows, { label: "항목", value: "내용" }] })}
              className="w-full px-3 py-2 border-2 border-dashed border-toss-gray-300 hover:border-toss-blue hover:text-toss-blue rounded-lg transition-colors text-sm"
            >
              + 행 추가
            </button>
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
            <TiptapEditor
              content={block.address || ""}
              onChange={(content) => onUpdate({ ...block, address: content })}
              placeholder="주소 및 연락처를 입력하세요..."
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
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-toss-gray-400" />
          </div>
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
    badge: "배지",
    title: "제목",
    text: "본문",
    list: "리스트",
    button: "버튼",
    image: "이미지",
    highlight: "강조 박스",
    infoTable: "정보 테이블",
    stats: "통계 카드",
    divider: "구분선",
    spacer: "간격",
    footer: "푸터",
  };
  return labels[type];
}

"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Block, BlockType } from "@/types/block";
import { generateId } from "@/lib/utils";
import { SortableBlock } from "./SortableBlock";
import { EmailPreview } from "./EmailPreview";
import { Plus, Eye, Code, Copy, Check, FileText, Save, Trash, Home, Upload } from "lucide-react";
import { generateEmailHTML } from "@/lib/html-generator";
import { parseEmailHTML, isMailMakerHTML } from "@/lib/html-parser";
import { TEMPLATES, createBlocksFromTemplate } from "@/lib/templates";
import { getSavedTemplates, saveTemplate, deleteTemplate as deleteStoredTemplate, SavedTemplate } from "@/lib/storage";

const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: "header", label: "헤더" },
  { type: "badge", label: "배지" },
  { type: "title", label: "제목" },
  { type: "text", label: "본문" },
  { type: "list", label: "리스트" },
  { type: "highlight", label: "강조 박스" },
  { type: "infoTable", label: "정보 테이블" },
  { type: "stats", label: "통계 카드" },
  { type: "button", label: "버튼" },
  { type: "image", label: "이미지" },
  { type: "divider", label: "구분선" },
  { type: "spacer", label: "간격" },
  { type: "footer", label: "푸터" },
];

export function MailBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importHTML, setImportHTML] = useState("");

  useEffect(() => {
    setSavedTemplates(getSavedTemplates());
  }, []);

  const createBlock = (type: BlockType): Block => {
    const baseBlock = { id: generateId(), type };

    switch (type) {
      case "header":
        return { ...baseBlock, type: "header", logoUrl: "", badgeText: "" };
      case "title":
        return { ...baseBlock, type: "title", text: "", level: "h1" };
      case "text":
        return { ...baseBlock, type: "text", content: "" };
      case "list":
        return { ...baseBlock, type: "list", items: ["항목 1", "항목 2"], listType: "bullet" };
      case "badge":
        return { ...baseBlock, type: "badge", text: "배지", variant: "blue" };
      case "button":
        return { ...baseBlock, type: "button", text: "", url: "" };
      case "image":
        return { ...baseBlock, type: "image", url: "", alt: "" };
      case "highlight":
        return { ...baseBlock, type: "highlight", variant: "info", content: "" };
      case "infoTable":
        return { ...baseBlock, type: "infoTable", rows: [{ label: "항목", value: "내용" }] };
      case "stats":
        return { ...baseBlock, type: "stats", stats: [{ label: "전체", value: "0" }, { label: "완료", value: "0" }, { label: "남음", value: "0" }] };
      case "divider":
        return { ...baseBlock, type: "divider" };
      case "spacer":
        return { ...baseBlock, type: "spacer", height: 20 };
      case "footer":
        return { ...baseBlock, type: "footer", companyName: "", copyright: "" };
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

  const loadSavedTemplate = (template: SavedTemplate) => {
    setBlocks(template.blocks);
    setShowTemplates(false);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert("템플릿 이름을 입력해주세요.");
      return;
    }

    try {
      saveTemplate(templateName, templateDescription, blocks);
      setSavedTemplates(getSavedTemplates());
      setShowSaveDialog(false);
      setTemplateName("");
      setTemplateDescription("");
      alert("템플릿이 저장되었습니다!");
    } catch (error) {
      alert("템플릿 저장에 실패했습니다.");
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("이 템플릿을 삭제하시겠습니까?")) {
      try {
        deleteStoredTemplate(id);
        setSavedTemplates(getSavedTemplates());
      } catch (error) {
        alert("템플릿 삭제에 실패했습니다.");
      }
    }
  };

  const startFromScratch = () => {
    setBlocks([]);
    setShowTemplates(false);
  };

  const handleImportHTML = () => {
    if (!importHTML.trim()) {
      alert("HTML 코드를 입력해주세요.");
      return;
    }

    if (!isMailMakerHTML(importHTML)) {
      alert("Mail Maker가 생성한 HTML이 아닙니다.\nMAIL_MAKER_BLOCK 메타데이터가 포함된 HTML만 가져올 수 있습니다.");
      return;
    }

    try {
      const importedBlocks = parseEmailHTML(importHTML);
      setBlocks(importedBlocks);
      setShowImportDialog(false);
      setImportHTML("");
      setShowTemplates(false);
      alert(`${importedBlocks.length}개의 블록을 성공적으로 가져왔습니다!`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "HTML 가져오기에 실패했습니다.");
    }
  };

  if (showTemplates && blocks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-toss-gray-100 p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-toss-gray-900 mb-4">Mail Maker</h1>
            <p className="text-lg text-toss-gray-600">HTML 이메일을 쉽게 만들어보세요</p>
            <a
              href="https://need-coffee.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
            >
              개발자 커피 한잔 사주기
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-toss-gray-900 mb-4">기본 템플릿</h2>
            <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          {savedTemplates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-toss-gray-900 mb-4">저장된 템플릿</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {savedTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white p-6 rounded-xl border-2 border-toss-gray-200 hover:border-toss-blue hover:shadow-lg transition-all relative group"
                  >
                    <button
                      onClick={() => loadSavedTemplate(template)}
                      className="w-full text-left"
                    >
                      <FileText className="w-8 h-8 text-toss-blue mb-3" />
                      <h3 className="text-lg font-bold text-toss-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-toss-gray-600">{template.description || "사용자 정의 템플릿"}</p>
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="absolute top-4 right-4 p-2 text-toss-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={startFromScratch}
                className="px-6 py-3 text-toss-gray-700 hover:text-toss-blue font-medium transition-colors"
              >
                빈 페이지에서 시작하기
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className="flex items-center gap-2 px-6 py-3 text-toss-gray-700 hover:text-toss-blue font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                HTML 가져오기
              </button>
            </div>
          </div>
        </div>

        {/* HTML 가져오기 다이얼로그 */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <h3 className="text-xl font-bold text-toss-gray-900 mb-4">HTML 가져오기</h3>
              <div className="mb-4">
                <div className="bg-toss-blue-light border border-toss-blue rounded-lg p-3 mb-4">
                  <p className="text-sm text-toss-gray-700">
                    💡 <strong>Mail Maker</strong>가 생성한 HTML만 가져올 수 있습니다.
                    <br />
                    HTML 주석에 포함된 블록 메타데이터를 사용하여 정확하게 복원합니다.
                  </p>
                </div>
                <label className="block text-sm font-medium text-toss-gray-700 mb-2">
                  HTML 코드 붙여넣기
                </label>
                <textarea
                  value={importHTML}
                  onChange={(e) => setImportHTML(e.target.value)}
                  placeholder="Mail Maker가 생성한 HTML 코드를 여기에 붙여넣으세요..."
                  rows={12}
                  className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue font-mono text-sm"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportHTML("");
                  }}
                  className="px-4 py-2 text-toss-gray-700 hover:bg-toss-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleImportHTML}
                  className="px-4 py-2 bg-toss-blue hover:bg-toss-blue-dark text-white rounded-lg transition-colors"
                >
                  가져오기
                </button>
              </div>
            </div>
          </div>
        )}
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBlocks([]);
                setShowTemplates(true);
              }}
              className="p-2 text-toss-gray-600 hover:text-toss-blue hover:bg-toss-gray-100 rounded-lg transition-colors"
              title="처음으로"
            >
              <Home className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-toss-gray-900">미리보기</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-toss-gray-100 hover:bg-toss-gray-200 text-toss-gray-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              disabled={blocks.length === 0}
            >
              <Save className="w-4 h-4" />
              템플릿 저장
            </button>
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

      {/* 템플릿 저장 다이얼로그 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-toss-gray-900 mb-4">템플릿 저장</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-toss-gray-700 mb-2">
                  템플릿 이름 *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="예: 메가존 교육사업부"
                  className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-toss-gray-700 mb-2">
                  설명 (선택)
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="템플릿에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setTemplateName("");
                  setTemplateDescription("");
                }}
                className="px-4 py-2 text-toss-gray-700 hover:bg-toss-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-toss-blue hover:bg-toss-blue-dark text-white rounded-lg transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML 가져오기 다이얼로그 */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-toss-gray-900 mb-4">HTML 가져오기</h3>
            <div className="mb-4">
              <div className="bg-toss-blue-light border border-toss-blue rounded-lg p-3 mb-4">
                <p className="text-sm text-toss-gray-700">
                  💡 <strong>Mail Maker</strong>가 생성한 HTML만 가져올 수 있습니다.
                  <br />
                  HTML 주석에 포함된 블록 메타데이터를 사용하여 정확하게 복원합니다.
                </p>
              </div>
              <label className="block text-sm font-medium text-toss-gray-700 mb-2">
                HTML 코드 붙여넣기
              </label>
              <textarea
                value={importHTML}
                onChange={(e) => setImportHTML(e.target.value)}
                placeholder="Mail Maker가 생성한 HTML 코드를 여기에 붙여넣으세요..."
                rows={12}
                className="w-full px-3 py-2 border border-toss-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue font-mono text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportHTML("");
                }}
                className="px-4 py-2 text-toss-gray-700 hover:bg-toss-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleImportHTML}
                className="px-4 py-2 bg-toss-blue hover:bg-toss-blue-dark text-white rounded-lg transition-colors"
              >
                가져오기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

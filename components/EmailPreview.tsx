"use client";

import { Block } from "@/types/block";
import { EmailBlock } from "./email-preview/EmailBlock";
import { EmailLayoutSettings, DEFAULT_LAYOUT_SETTINGS } from "@/types/layout";

interface EmailPreviewProps {
  blocks: Block[];
  layoutSettings?: EmailLayoutSettings;
}

export function EmailPreview({ blocks, layoutSettings = DEFAULT_LAYOUT_SETTINGS }: EmailPreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-12 text-center text-toss-gray-500">
        블록을 추가하면 미리보기가 표시됩니다
      </div>
    );
  }

  // 정렬 방식에 따른 margin 스타일 계산
  let marginStyle: React.CSSProperties = {};
  if (layoutSettings.alignment === "center") {
    marginStyle = { margin: "0 auto" };
  } else if (layoutSettings.alignment === "left") {
    marginStyle = { margin: "0" };
  } else if (layoutSettings.alignment === "right") {
    marginStyle = { marginLeft: "auto", marginRight: "0" };
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div
        style={{
          padding: `${layoutSettings.padding}px`,
          maxWidth: `${layoutSettings.maxWidth}px`,
          ...marginStyle,
        }}
      >
        {blocks.map((block) => (
          <EmailBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}

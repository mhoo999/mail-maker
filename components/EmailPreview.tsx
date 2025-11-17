"use client";

import { Block } from "@/types/block";
import { EmailBlock } from "./email-preview/EmailBlock";

interface EmailPreviewProps {
  blocks: Block[];
}

export function EmailPreview({ blocks }: EmailPreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-12 text-center text-toss-gray-500">
        블록을 추가하면 미리보기가 표시됩니다
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
        {blocks.map((block) => (
          <EmailBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}

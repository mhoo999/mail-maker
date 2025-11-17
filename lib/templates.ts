import { Block } from "@/types/block";
import { generateId } from "./utils";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  type: "notice" | "promotion" | "newsletter" | "custom";
  blocks: Omit<Block, "id">[];
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "notice",
    name: "공지 메일",
    description: "중요한 공지사항을 전달하는 템플릿",
    type: "notice",
    blocks: [
      {
        type: "header",
        logoUrl: "",
        badgeText: "공지",
      },
      {
        type: "title",
        text: "중요 공지사항",
        level: "h1",
      },
      {
        type: "text",
        content: "안녕하세요. 중요한 공지사항을 전달드립니다.",
      },
      {
        type: "highlight",
        variant: "info",
        title: "알림",
        content: "중요한 내용을 여기에 작성하세요.",
      },
      {
        type: "divider",
      },
      {
        type: "footer",
        companyName: "회사명",
        copyright: "© 2025 All rights reserved",
      },
    ],
  },
  {
    id: "promotion",
    name: "프로모션 메일",
    description: "이벤트나 프로모션을 홍보하는 템플릿",
    type: "promotion",
    blocks: [
      {
        type: "header",
        logoUrl: "",
        badgeText: "특별 혜택",
      },
      {
        type: "title",
        text: "특별한 혜택을 놓치지 마세요!",
        level: "h1",
      },
      {
        type: "text",
        content: "지금 바로 확인하고 특별한 혜택을 받아보세요.",
      },
      {
        type: "image",
        url: "https://via.placeholder.com/600x300",
        alt: "프로모션 이미지",
      },
      {
        type: "button",
        text: "자세히 보기",
        url: "https://example.com",
      },
      {
        type: "divider",
      },
      {
        type: "footer",
        companyName: "회사명",
        copyright: "© 2025 All rights reserved",
      },
    ],
  },
  {
    id: "newsletter",
    name: "뉴스레터",
    description: "정기적인 소식을 전달하는 템플릿",
    type: "newsletter",
    blocks: [
      {
        type: "header",
        logoUrl: "",
        badgeText: "Newsletter",
      },
      {
        type: "title",
        text: "이번 주의 소식",
        level: "h1",
      },
      {
        type: "text",
        content: "안녕하세요! 이번 주에도 유익한 소식을 전해드립니다.",
      },
      {
        type: "title",
        text: "주요 소식 1",
        level: "h2",
      },
      {
        type: "text",
        content: "첫 번째 소식 내용입니다.",
      },
      {
        type: "title",
        text: "주요 소식 2",
        level: "h2",
      },
      {
        type: "text",
        content: "두 번째 소식 내용입니다.",
      },
      {
        type: "button",
        text: "더 알아보기",
        url: "https://example.com",
      },
      {
        type: "divider",
      },
      {
        type: "footer",
        companyName: "회사명",
        copyright: "© 2025 All rights reserved",
      },
    ],
  },
];

export function createBlocksFromTemplate(template: TemplateDefinition): Block[] {
  return template.blocks.map((block) => ({
    ...block,
    id: generateId(),
  })) as Block[];
}

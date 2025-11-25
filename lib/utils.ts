import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * TipTap HTML을 이메일 호환 HTML로 변환
 * 이메일 클라이언트에서 안전하게 렌더링되도록 인라인 스타일을 적용
 */
export function convertTipTapToEmailHTML(html: string): string {
  if (!html || html.trim() === "") {
    return "";
  }

  // 태그별 스타일 매핑
  const tagStyles: Record<string, string> = {
    p: 'style="margin: 0.5em 0; font-size: 16px; color: #4e5968; line-height: 1.6;"',
    h1: 'style="margin: 1em 0 0.5em 0; font-size: 1.5em; font-weight: 600; color: #191f28;"',
    h2: 'style="margin: 1em 0 0.5em 0; font-size: 1.25em; font-weight: 600; color: #191f28;"',
    h3: 'style="margin: 1em 0 0.5em 0; font-size: 1.1em; font-weight: 600; color: #191f28;"',
    strong: 'style="font-weight: 600;"',
    b: 'style="font-weight: 600;"',
    em: 'style="font-style: italic;"',
    i: 'style="font-style: italic;"',
    ul: 'style="margin: 0.5em 0; padding-left: 1.5em;"',
    ol: 'style="margin: 0.5em 0; padding-left: 1.5em;"',
    li: 'style="margin: 0.25em 0;"',
  };

  let result = html;

  // 각 태그에 스타일 추가 (기존 스타일이 있으면 유지)
  Object.keys(tagStyles).forEach((tag) => {
    const style = tagStyles[tag];
    
    // 열린 태그에 스타일 추가 (정규식으로 처리)
    const openTagRegex = new RegExp(`<${tag}(?![^>]*style=)([^>]*)>`, "gi");
    result = result.replace(openTagRegex, (match, attrs) => {
      // style 속성이 없는 경우에만 추가
      if (!match.includes("style=")) {
        return `<${tag}${attrs.trim() ? attrs.trim() + " " : ""}${style}>`;
      }
      return match;
    });
    
    // style이 있지만 비어있는 경우
    const emptyStyleRegex = new RegExp(`<${tag}([^>]*)style=""([^>]*)>`, "gi");
    result = result.replace(emptyStyleRegex, `<${tag}$1${style}$2>`);
  });

  return result;
}

/**
 * TipTap HTML에서 텍스트만 추출 (미리보기용)
 */
export function getTextFromTipTapHTML(html: string): string {
  if (!html || html.trim() === "") {
    return "";
  }

  if (typeof window === "undefined") {
    // 서버 사이드에서는 간단한 정규식으로 태그 제거
    return html.replace(/<[^>]*>/g, "").trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

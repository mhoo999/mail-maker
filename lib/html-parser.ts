import { Block } from "@/types/block";

/**
 * Mail Maker가 생성한 HTML을 파싱하여 블록 배열로 변환합니다.
 * HTML 주석에 포함된 MAIL_MAKER_BLOCK 메타데이터를 사용하여 정확하게 역변환합니다.
 *
 * @param html - 파싱할 HTML 문자열
 * @returns 복원된 블록 배열
 * @throws {Error} Mail Maker가 생성한 HTML이 아닌 경우
 */
export function parseEmailHTML(html: string): Block[] {
  const blocks: Block[] = [];

  // MAIL_MAKER_BLOCK 주석 패턴 매칭
  const blockPattern = /<!--\s*MAIL_MAKER_BLOCK\s+(.+?)\s*-->/g;

  let match;
  let foundBlocks = false;

  while ((match = blockPattern.exec(html)) !== null) {
    foundBlocks = true;
    try {
      const blockData = JSON.parse(match[1]);
      blocks.push(blockData as Block);
    } catch (error) {
      console.error("블록 메타데이터 파싱 실패:", match[1], error);
      throw new Error("잘못된 블록 메타데이터 형식입니다.");
    }
  }

  if (!foundBlocks) {
    throw new Error(
      "Mail Maker가 생성한 HTML이 아닙니다. MAIL_MAKER_BLOCK 메타데이터를 찾을 수 없습니다."
    );
  }

  return blocks;
}

/**
 * HTML이 Mail Maker가 생성한 것인지 확인합니다.
 *
 * @param html - 검사할 HTML 문자열
 * @returns Mail Maker HTML 여부
 */
export function isMailMakerHTML(html: string): boolean {
  return /<!--\s*MAIL_MAKER_BLOCK\s+/.test(html);
}

/**
 * HTML에서 블록 개수를 확인합니다.
 *
 * @param html - 검사할 HTML 문자열
 * @returns 발견된 블록 개수
 */
export function countBlocks(html: string): number {
  const matches = html.match(/<!--\s*MAIL_MAKER_BLOCK\s+/g);
  return matches ? matches.length : 0;
}

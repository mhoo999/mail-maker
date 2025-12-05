import { Block } from "@/types/block";

/**
 * Mail Maker가 생성한 HTML을 파싱하여 블록 배열로 변환합니다.
 * data-mail-maker-block 속성의 메타데이터를 사용하여 정확하게 역변환합니다.
 *
 * @param html - 파싱할 HTML 문자열
 * @returns 복원된 블록 배열
 * @throws {Error} Mail Maker가 생성한 HTML이 아닌 경우
 */
export function parseEmailHTML(html: string): Block[] {
  const blocks: Block[] = [];

  // data-mail-maker-block 속성 패턴 매칭 (이메일 클라이언트 호환)
  const blockPattern = /data-mail-maker-block="([^"]+)"/g;

  let match;
  let foundBlocks = false;

  while ((match = blockPattern.exec(html)) !== null) {
    foundBlocks = true;
    try {
      // HTML 엔티티 디코딩
      const decodedData = match[1].replace(/&quot;/g, '"');
      const blockData = JSON.parse(decodedData);
      blocks.push(blockData as Block);
    } catch (error) {
      console.error("블록 메타데이터 파싱 실패:", match[1], error);
      throw new Error("잘못된 블록 메타데이터 형식입니다.");
    }
  }

  if (!foundBlocks) {
    throw new Error(
      "Mail Maker가 생성한 HTML이 아닙니다. data-mail-maker-block 메타데이터를 찾을 수 없습니다."
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
  return /data-mail-maker-block="/.test(html);
}

/**
 * HTML에서 블록 개수를 확인합니다.
 *
 * @param html - 검사할 HTML 문자열
 * @returns 발견된 블록 개수
 */
export function countBlocks(html: string): number {
  const matches = html.match(/data-mail-maker-block="/g);
  return matches ? matches.length : 0;
}

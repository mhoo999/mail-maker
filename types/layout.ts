export interface EmailLayoutSettings {
  maxWidth: number; // 이메일 컨테이너 최대 너비 (px)
  alignment: "left" | "center" | "right"; // 정렬 방식
  padding: number; // 내부 패딩 (px)
}

export const DEFAULT_LAYOUT_SETTINGS: EmailLayoutSettings = {
  maxWidth: 600,
  alignment: "center",
  padding: 32,
};

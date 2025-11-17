export type BlockType =
  | "header"
  | "title"
  | "text"
  | "list"
  | "highlight"
  | "stats"
  | "infoTable"
  | "badge"
  | "button"
  | "image"
  | "divider"
  | "spacer"
  | "footer";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeaderBlock extends BaseBlock {
  type: "header";
  logoUrl?: string;
  logoAlt?: string;
  badgeText?: string;
}

export interface TitleBlock extends BaseBlock {
  type: "title";
  text: string;
  level: "h1" | "h2";
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

export interface ListBlock extends BaseBlock {
  type: "list";
  items: string[];
  listType: "bullet" | "number";
}

export interface HighlightBlock extends BaseBlock {
  type: "highlight";
  variant: "info" | "warning" | "success" | "error";
  title?: string;
  content: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface StatsBlock extends BaseBlock {
  type: "stats";
  stats: StatItem[];
}

export interface InfoTableRow {
  label: string;
  value: string;
}

export interface InfoTableBlock extends BaseBlock {
  type: "infoTable";
  rows: InfoTableRow[];
}

export interface BadgeBlock extends BaseBlock {
  type: "badge";
  text: string;
  variant: "red" | "orange" | "blue" | "green";
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  text: string;
  url: string;
  variant?: "primary" | "secondary";
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt: string;
  width?: number;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer";
  height: number; // in pixels
}

export interface FooterBlock extends BaseBlock {
  type: "footer";
  companyName?: string;
  address?: string;
  copyright?: string;
  links?: { text: string; url: string }[];
}

export type Block =
  | HeaderBlock
  | TitleBlock
  | TextBlock
  | ListBlock
  | HighlightBlock
  | StatsBlock
  | InfoTableBlock
  | BadgeBlock
  | ButtonBlock
  | ImageBlock
  | DividerBlock
  | SpacerBlock
  | FooterBlock;

export interface Template {
  id: string;
  name: string;
  type: "notice" | "promotion" | "newsletter" | "custom";
  blocks: Block[];
}

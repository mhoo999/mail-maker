export type BlockType =
  | "header"
  | "title"
  | "text"
  | "highlight"
  | "stats"
  | "button"
  | "image"
  | "divider"
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
  isList?: boolean;
  listItems?: string[];
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
  | HighlightBlock
  | StatsBlock
  | ButtonBlock
  | ImageBlock
  | DividerBlock
  | FooterBlock;

export interface Template {
  id: string;
  name: string;
  type: "notice" | "promotion" | "newsletter" | "custom";
  blocks: Block[];
}

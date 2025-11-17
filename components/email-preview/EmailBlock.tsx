"use client";

import { Block } from "@/types/block";
import { cn } from "@/lib/utils";

interface EmailBlockProps {
  block: Block;
}

export function EmailBlock({ block }: EmailBlockProps) {
  switch (block.type) {
    case "header":
      return (
        <div style={{ padding: "24px", textAlign: "center", backgroundColor: "#ffffff" }}>
          {block.logoUrl && (
            <img
              src={block.logoUrl}
              alt={block.logoAlt || "Logo"}
              style={{ maxWidth: "120px", margin: "0 auto" }}
            />
          )}
          {block.badgeText && (
            <div
              style={{
                display: "inline-block",
                marginTop: "12px",
                padding: "4px 12px",
                backgroundColor: "#e8f3ff",
                color: "#3182f6",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "12px",
              }}
            >
              {block.badgeText}
            </div>
          )}
        </div>
      );

    case "title":
      const TitleTag = block.level;
      const fontSize = block.level === "h1" ? "28px" : "20px";
      return (
        <TitleTag
          style={{
            margin: "24px 0 16px 0",
            fontSize,
            fontWeight: "700",
            color: "#191f28",
            lineHeight: "1.4",
          }}
        >
          {block.text || "제목을 입력하세요"}
        </TitleTag>
      );

    case "text":
      return (
        <p
          style={{
            margin: "16px 0",
            fontSize: "16px",
            color: "#4e5968",
            lineHeight: "1.6",
            whiteSpace: "pre-line",
          }}
        >
          {block.content || "본문을 입력하세요"}
        </p>
      );

    case "button":
      return (
        <div style={{ margin: "24px 0", textAlign: "center" }}>
          <a
            href={block.url || "#"}
            style={{
              display: "inline-block",
              padding: "14px 28px",
              backgroundColor: "#3182f6",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              textDecoration: "none",
              borderRadius: "8px",
            }}
          >
            {block.text || "버튼 텍스트"}
          </a>
        </div>
      );

    case "image":
      return (
        <div style={{ margin: "24px 0", textAlign: "center" }}>
          <img
            src={block.url || "https://via.placeholder.com/600x300"}
            alt={block.alt || "Image"}
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      );

    case "highlight":
      const variantColors = {
        info: { bg: "#e8f3ff", border: "#3182f6", text: "#191f28" },
        warning: { bg: "#fff3e0", border: "#ff9800", text: "#191f28" },
        success: { bg: "#e8f5e9", border: "#4caf50", text: "#191f28" },
        error: { bg: "#ffebee", border: "#f44336", text: "#191f28" },
      };
      const colors = variantColors[block.variant];

      return (
        <div
          style={{
            margin: "24px 0",
            padding: "16px",
            backgroundColor: colors.bg,
            borderLeft: `4px solid ${colors.border}`,
            borderRadius: "4px",
          }}
        >
          {block.title && (
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: colors.text,
                marginBottom: "8px",
              }}
            >
              {block.title}
            </div>
          )}
          <div
            style={{
              fontSize: "14px",
              color: colors.text,
              lineHeight: "1.5",
            }}
          >
            {block.content}
          </div>
        </div>
      );

    case "divider":
      return (
        <hr
          style={{
            margin: "32px 0",
            border: "none",
            borderTop: "1px solid #e5e8eb",
          }}
        />
      );

    case "footer":
      return (
        <div
          style={{
            marginTop: "48px",
            padding: "24px",
            backgroundColor: "#f9fafb",
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7684",
            lineHeight: "1.6",
          }}
        >
          {block.companyName && (
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              {block.companyName}
            </div>
          )}
          {block.address && (
            <div style={{ marginBottom: "8px", whiteSpace: "pre-line" }}>
              {block.address}
            </div>
          )}
          {block.copyright && <div>{block.copyright}</div>}
        </div>
      );

    default:
      return null;
  }
}

import { Block } from "@/types/block";

export function generateEmailHTML(blocks: Block[]): string {
  const blocksHTML = blocks.map(blockToHTML).join("\n");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 32px;">
${blocksHTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function blockToHTML(block: Block): string {
  switch (block.type) {
    case "header":
      let headerHTML = "";
      if (block.logoUrl) {
        headerHTML += `              <div style="text-align: center; margin-bottom: 24px;">
                <img src="${block.logoUrl}" alt="${block.logoAlt || "Logo"}" style="max-width: 120px; height: auto;">
              </div>\n`;
      }
      if (block.badgeText) {
        headerHTML += `              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; padding: 4px 12px; background-color: #e8f3ff; color: #3182f6; font-size: 12px; font-weight: 600; border-radius: 12px;">
                  ${block.badgeText}
                </span>
              </div>\n`;
      }
      return headerHTML;

    case "title":
      const fontSize = block.level === "h1" ? "28px" : "20px";
      return `              <${block.level} style="margin: 24px 0 16px 0; font-size: ${fontSize}; font-weight: 700; color: #191f28; line-height: 1.4;">
                ${escapeHtml(block.text || "제목")}
              </${block.level}>\n`;

    case "text":
      const textContent = escapeHtml(block.content || "본문").replace(/\n/g, '<br>');
      return `              <p style="margin: 16px 0; font-size: 16px; color: #4e5968; line-height: 1.6; white-space: pre-line;">
                ${textContent}
              </p>\n`;

    case "button":
      return `              <div style="margin: 24px 0; text-align: center;">
                <a href="${block.url || "#"}" style="display: inline-block; padding: 14px 28px; background-color: #3182f6; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                  ${escapeHtml(block.text || "버튼")}
                </a>
              </div>\n`;

    case "image":
      return `              <div style="margin: 24px 0; text-align: center;">
                <img src="${block.url || "https://via.placeholder.com/600x300"}" alt="${escapeHtml(block.alt || "이미지")}" style="max-width: 100%; height: auto; border-radius: 8px;">
              </div>\n`;

    case "highlight":
      const variantColors = {
        info: { bg: "#e8f3ff", border: "#3182f6" },
        warning: { bg: "#fff3e0", border: "#ff9800" },
        success: { bg: "#e8f5e9", border: "#4caf50" },
        error: { bg: "#ffebee", border: "#f44336" },
      };
      const colors = variantColors[block.variant];

      let highlightHTML = `              <div style="margin: 24px 0; padding: 16px; background-color: ${colors.bg}; border-left: 4px solid ${colors.border}; border-radius: 4px;">\n`;
      if (block.title) {
        highlightHTML += `                <div style="font-size: 16px; font-weight: 600; color: #191f28; margin-bottom: 8px;">
                  ${escapeHtml(block.title)}
                </div>\n`;
      }
      highlightHTML += `                <div style="font-size: 14px; color: #191f28; line-height: 1.5;">
                  ${escapeHtml(block.content)}
                </div>
              </div>\n`;
      return highlightHTML;

    case "divider":
      return `              <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e8eb;">\n`;

    case "footer":
      let footerHTML = `              <div style="margin-top: 48px; padding: 24px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7684; line-height: 1.6; border-radius: 4px;">\n`;
      if (block.companyName) {
        footerHTML += `                <div style="font-weight: 600; margin-bottom: 8px;">
                  ${escapeHtml(block.companyName)}
                </div>\n`;
      }
      if (block.address) {
        const addressHtml = escapeHtml(block.address).replace(/\n/g, '<br>');
        footerHTML += `                <div style="margin-bottom: 8px;">
                  ${addressHtml}
                </div>\n`;
      }
      if (block.copyright) {
        footerHTML += `                <div>
                  ${escapeHtml(block.copyright)}
                </div>\n`;
      }
      footerHTML += `              </div>\n`;
      return footerHTML;

    default:
      return "";
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

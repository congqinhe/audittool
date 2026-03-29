import { toSvg } from 'html-to-image';

/**
 * 将指定 DOM 节点导出为 SVG 文件并下载到本地
 * @param element - 要导出的 DOM 元素（如 ref.current）
 * @param filename - 保存的文件名（不含扩展名会自动加 .svg）
 */
export async function exportElementToSvg(
  element: HTMLElement | null,
  filename: string = 'design-export'
): Promise<void> {
  if (!element) {
    console.warn('exportSvg: 未找到要导出的元素');
    return;
  }

  const name = filename.endsWith('.svg') ? filename : `${filename}.svg`;

  try {
    const dataUrl = await toSvg(element, {
      quality: 1,
      pixelRatio: 2,
      skipFonts: false,
    });

    const link = document.createElement('a');
    link.download = name;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('导出 SVG 失败:', err);
    throw err;
  }
}

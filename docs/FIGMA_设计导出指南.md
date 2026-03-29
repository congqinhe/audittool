# 将前端界面导入 Figma 继续设计

本指南说明如何将智能审核系统的前端界面导入 Figma，以便在 Figma 中继续迭代设计。

---

## 推荐方式：html.to.design 插件

**[html.to.design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design)** 可将网页转换为 Figma 中的可编辑 Frame / 组件，适合在 Figma 中继续调整布局、颜色、文字等。

---

## 操作步骤

### 1. 启动本地开发服务器

在项目根目录执行：

```bash
cd ai-contract-reviewer
npm install   # 如未安装依赖
npm start
```

浏览器会自动打开 `http://localhost:3000`。

### 2. 安装 Figma 插件

1. 打开 Figma（[figma.com](https://figma.com)）
2. 进入任意文件，点击左侧 **Resources** 或菜单 **Plugins → Find more plugins**
3. 搜索 **「html to design」** 或 **「html.to.design」**
4. 点击 **Install** 安装插件

### 3. 导入页面到 Figma

1. 在 Figma 中运行插件：**Plugins → html to design**（或在 Resources 中搜索并运行）
2. 在插件输入框中填入要导入的页面 URL：

| 页面       | URL                                    |
|------------|----------------------------------------|
| 管理端首页 | `http://localhost:3000/admin`         |
| 规则管理   | `http://localhost:3000/admin/rules`    |
| 审核复核页 | `http://localhost:3000/reviewer`      |

3. 点击 **Import**，插件会抓取页面并生成 Figma Frame
4. 导入完成后，可在 Figma 中直接编辑文字、颜色、间距等

### 4. 获取最佳导入效果的建议

- **视口尺寸**：将浏览器窗口设为 1280×800 或 1440×900，避免过小或过宽
- **滚动内容**：若页面很长，可先滚动到需要导出的区域，再运行插件（部分版本支持选择区域）
- **登录/权限**：当前为本地静态原型，无登录限制，可直接访问
- **多页面**：管理端、审核页需分别用不同 URL 导入，每次导入一个页面即可

---

## 可导入的页面清单

| 路由               | 说明                     |
|--------------------|--------------------------|
| `/admin`           | 管理端控制台首页（Dashboard） |
| `/admin/rules`     | 规则管理列表页           |
| `/reviewer`        | 审核结果复核页（左右分栏）   |

---

## 方式二：页面内「导出 SVG」按钮（已内置）

各页面顶部已提供 **「导出 SVG」** 按钮，点击后会直接将当前页面导出为 `.svg` 文件并下载到本地。

- **管理端**：在顶部导航栏右侧，点击「导出 SVG」
- **审核复核页**：在顶部右侧「财务部视图」旁，点击「导出 SVG」

导出的文件名示例：
- `admin-dashboard.svg`（管理端首页）
- `admin-rules.svg`（规则管理页）
- `reviewer-page.svg`（审核复核页）

得到 `.svg` 文件后，在 Figma 中通过 **File → Place image** 或拖拽导入即可。

---

## 备选方式

若 html.to.design 无法满足需求，可考虑：

- **截图**：截取页面后粘贴进 Figma，作为参考图（位图，不可编辑）

---

## 常见问题

**Q：插件提示无法访问 localhost？**  
A：确认 `npm start` 已启动且浏览器能正常访问对应 URL。部分插件版本要求页面在本地同一机器上可访问。

**Q：导入后样式有偏差？**  
A：部分 Tailwind 或复杂 CSS 可能无法完全还原，可在 Figma 中手动微调颜色、间距。

**Q：想导入整页滚动内容？**  
A：可先滚动到目标区域再导入，或分多段导入后拼接到一起。

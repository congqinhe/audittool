import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, FileText, AlertTriangle, CheckCircle2, Info, ArrowUpRight, Search, LayoutTemplate, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { exportElementToSvg } from '../utils/exportSvg';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RiskCategory = 'trigger' | 'missing' | 'low';

interface StructuredField {
  id: string;
  label: string;
  value: string;
  sourceText?: string;
  locationId?: string;
  confirmed?: boolean;
}

interface RiskItem {
  id: string;
  title: string;
  summary: string;
  details: string;
  conclusion: string;
  reason: string;
  reasonLocationId?: string;
  category: RiskCategory;
  quote?: string;
  locationId?: string;
  isAccepted?: boolean;
  structuredFields: StructuredField[];
}

function ReviewerPage() {
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  const [riskItems, setRiskItems] = useState<RiskItem[]>([
    {
      id: 'risk-1',
      title: '交货方式要求',
      summary: '命中风险审核规则',
      details: '合同约定交货方式为卖方负责交付并承担卸货费用，与规则要求“车板交货/主变基础交货”不一致。',
      conclusion: '合同交货方式与风险规则不匹配，判定触发风险。',
      reason: '根据第3条第3.1款“卖方负责将设备交付至指定地点，并承担卸货费用”，与“车板交货/主变基础交货”要求冲突，存在风险。',
      reasonLocationId: 'risk-1',
      category: 'trigger',
      quote: '第3条 交货方式与地点 3.1 交货方式：卖方负责将设备交付至指定地点，并承担卸货费用。',
      locationId: 'risk-1',
      structuredFields: [
        {
          id: 'f-1-1',
          label: '交货方式',
          value: '卖方负责交付并承担卸货费用',
          sourceText: '3.1 交货方式：卖方负责将设备交付至指定地点，并承担卸货费用。',
          locationId: 'risk-1',
          confirmed: false,
        },
        {
          id: 'f-1-2',
          label: '交货地点',
          value: '买方XX变电站项目现场',
          sourceText: '3.2 交货地点：买方XX变电站项目现场。',
          locationId: 'risk-1',
          confirmed: false,
        },
      ],
      isAccepted: false,
    },
    {
      id: 'risk-2',
      title: '质保期要求',
      summary: '没有支持判断的原文依据',
      details: '合同中未明确约定质保期条款，无法判断是否满足规则中的12个月要求。',
      conclusion: '合同中缺少质保期信息，判定信息缺失。',
      reason: '合同全文未找到质保期条款（如第5条/第6条），无法用原文确认是否符合12个月要求。',
      category: 'missing',
      structuredFields: [
        {
          id: 'f-2-1',
          label: '质保期',
          value: '未约定',
          confirmed: false,
        },
      ],
      isAccepted: false,
    },
    {
      id: 'risk-3',
      title: '付款方式要求',
      summary: '在规则要求内',
      details: '合同约定支付为电汇或6个月内银行承兑汇票，符合规则要求。',
      conclusion: '付款方式符合规则要求，判定低风险。',
      reason: '根据第4条第4.3款“应通过电汇或6个月内到期的银行承兑汇票支付货款”，在规则范围内。',
      reasonLocationId: 'risk-3',
      category: 'low',
      quote: '4.3 到货款：设备到达现场并验收合格后，应通过电汇或6个月内到期的银行承兑汇票支付货款。',
      locationId: 'risk-3',
      structuredFields: [
        {
          id: 'f-3-1',
          label: '付款方式',
          value: '电汇/6个月承兑汇票',
          sourceText: '应通过电汇或6个月内到期的银行承兑汇票支付货款。',
          locationId: 'risk-3',
          confirmed: false,
        },
      ],
      isAccepted: false,
    },
    {
      id: 'risk-4',
      title: '违约金比例',
      summary: '存在潜在违约金额问题',
      details: '违约金设定为逾期金额千分之五，需与合规规则比对上限。',
      conclusion: '违约金比例可能超过规则上限，判定触发风险。',
      reason: '根据第5条第5.1款“每逾期一日应支付逾期交货部分货款的千分之五”，需与最高30％上限对比判断。',
      reasonLocationId: 'risk-4',
      category: 'trigger',
      quote: '5.1 卖方未能按期交货，每逾期一日应支付逾期交货部分货款的千分之五。',
      locationId: 'risk-4',
      isAccepted: false,
      structuredFields: [
        {
          id: 'f-4-1',
          label: '违约金比例',
          value: '千分之五',
          sourceText: '每逾期一日，应支付逾期交货部分货款的千分之五。',
          locationId: 'risk-4',
          confirmed: false,
        },
      ],
    },
  ]);

  // 审核意见相关状态
  const [opinionText, setOpinionText] = useState('');
  const [isOpinionExpanded, setIsOpinionExpanded] = useState(true);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleAcceptRisk = (item: RiskItem) => {
    setRiskItems((prev) =>
      prev.map((risk) =>
        risk.id === item.id
          ? {
              ...risk,
              isAccepted: true,
              structuredFields: risk.structuredFields.map((field) => ({ ...field, confirmed: true })),
            }
          : risk
      )
    );
    setOpinionText((prev) => {
      const addition = `${item.conclusion} ${item.reason}`;
      if (!prev.trim()) {
        return addition;
      }
      return `${prev.trim()}\n${addition}`;
    });
  };

  const handleIgnoreRisk = (riskId: string) => {
    setRiskItems((prev) =>
      prev.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              isAccepted: false,
              structuredFields: risk.structuredFields.map((field) => ({ ...field, confirmed: false })),
            }
          : risk
      )
    );
  };

  const handleSubmit = () => {
    const accepted = riskItems.filter((risk) => risk.isAccepted);
    const confirmedFields = riskItems.flatMap((risk) =>
      risk.structuredFields
        .filter((field) => field.confirmed)
        .map((field) => ({ ...field, riskId: risk.id }))
    );

    const payload = {
      opinion: opinionText,
      acceptedRisks: accepted,
      confirmedFields,
    };

    console.log('提交至BPM payload:', payload);
    // TODO: 替换为真正的提交流程（例如调用 POST /bpm/review）

    // 模拟提交成功后可清理状态逻辑
    // setOpinionText('');
  };

  // 拖动侧边栏状态
  const [rightPanelWidth, setRightPanelWidth] = useState(480);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = document.body.clientWidth - e.clientX;
      // 设置最小和最大宽度限制
      if (newWidth > 320 && newWidth < 800) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // 监听右侧滚动，仅在向下滑动时自动收缩意见框，上滑不自动展开
  useEffect(() => {
    const handleScroll = () => {
      if (rightScrollRef.current) {
        const scrollTop = rightScrollRef.current.scrollTop;
        
        // 判断是否是向下滚动
        const isScrollingDown = scrollTop > lastScrollTop.current;
        
        if (isScrollingDown && scrollTop > 50 && isOpinionExpanded) {
          setIsOpinionExpanded(false);
        }
        
        lastScrollTop.current = scrollTop;
      }
    };

    const scrollContainer = rightScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isOpinionExpanded]);

  // 定位到对应的风险原文
  const scrollToRisk = (riskId: string) => {
    setActiveRiskId(riskId);
    
    // 给一点小延迟，等待高亮样式渲染完成后再滚动
    setTimeout(() => {
      const element = document.getElementById(riskId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // 将高亮内容居中显示
        });
        
        // 可选：添加一个短暂的闪烁效果增强引导
        element.classList.add('ring-4', 'ring-primary-500/30');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-primary-500/30');
        }, 1500);
      }
    }, 50);
  };
  
  return (
    <div ref={pageRef} className="flex flex-col h-screen bg-surface-50 overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-surface-200 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-surface-500 hover:text-surface-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">返回BPM任务</span>
          </button>
          <div className="h-4 w-[1px] bg-surface-300"></div>
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary-50 text-primary-600 rounded-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-surface-900 leading-tight">设备采购合同_XX变电站项目.pdf</h1>
              <div className="flex items-center gap-2 text-xs text-surface-500 mt-0.5">
                <span>任务ID: CON-20250321-001</span>
                <span>•</span>
                <span>项目: XX变电站项目</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => exportElementToSvg(pageRef.current, 'reviewer-page')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="导出当前页面为 SVG"
          >
            <Download className="w-4 h-4" /> 导出 SVG
          </button>
          <div className="px-3 py-1.5 bg-surface-100 rounded-full flex items-center gap-2 border border-surface-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            <span className="text-sm font-medium text-surface-700">财务部视图</span>
          </div>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧区域：合同原文预览区 */}
        <section className="flex-1 bg-surface-200 relative p-4 flex flex-col">
          {/* 模拟PDF工具栏 */}
          <div className="h-12 bg-white rounded-t-lg shadow-sm flex items-center justify-between px-4 z-10">
            <div className="flex items-center gap-3 text-surface-600">
              <span className="text-sm font-medium">1 / 12 页</span>
              <div className="h-4 w-[1px] bg-surface-300"></div>
              <span className="text-sm">100%</span>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-surface-100 rounded text-surface-600"><Search className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-surface-100 rounded text-surface-600"><LayoutTemplate className="w-4 h-4" /></button>
            </div>
          </div>
          
          {/* 模拟PDF页面 */}
          <div className="flex-1 bg-surface-100 overflow-y-auto overflow-x-hidden flex justify-center pb-8 rounded-b-lg">
            <div className="w-full max-w-[800px] mt-4 space-y-6">
              
              {/* 第一页 */}
              <div className="bg-white min-h-[1000px] shadow-sm p-12 relative font-serif text-justify text-surface-800 leading-relaxed text-sm">
                <h2 className="text-2xl font-bold text-center mb-8">设备采购合同</h2>
                
                <p className="mb-4">甲方（买方）：XX变电站项目部</p>
                <p className="mb-8">乙方（卖方）：XXX电气设备有限公司</p>
                
                <p className="mb-4 indent-8">甲乙双方经友好协商，就买方向卖方采购设备事宜，达成如下协议，以资共同遵守。</p>
                
                <h3 className="font-bold mb-2 mt-6">第一条 合同标的</h3>
                <p className="mb-4 indent-8">1.1 卖方向买方提供变压器、断路器等设备，具体型号、规格、数量、单价详见附件一《采购清单》。</p>
                
                <h3 className="font-bold mb-2 mt-6">第二条 合同金额</h3>
                <p className="mb-4 indent-8">2.1 本合同总金额为人民币（大写）伍佰万元整（¥5,000,000.00）。该价格包含设备款、包装费、运输费、保险费、安装指导费等全部费用。</p>

                <h3 className="font-bold mb-2 mt-6">第三条 交货方式与地点</h3>
                <div 
                  id="risk-1"
                  className={cn(
                  "p-2 rounded-md transition-all duration-300 border-2",
                  activeRiskId === 'risk-1' ? "bg-risk-high/10 border-risk-high shadow-[0_0_0_4px_rgba(239,68,68,0.2)]" : "border-transparent"
                )}>
                  <p className="indent-8">3.1 <span className={cn("font-medium", activeRiskId === 'risk-1' && "bg-risk-high/20")}>交货方式：卖方负责将设备交付至指定地点，并承担卸货费用。</span></p>
                  <p className="indent-8">3.2 交货地点：买方XX变电站项目现场。</p>
                </div>
                
                <h3 className="font-bold mb-2 mt-6">第四条 付款方式</h3>
                <div 
                  id="risk-3"
                  className={cn(
                  "p-2 rounded-md transition-all duration-300 border-2 mt-2",
                  activeRiskId === 'risk-3' ? "bg-risk-low/10 border-risk-low shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" : "border-transparent"
                )}>
                  <p className="indent-8">4.1 预付款：合同签订后10个工作日内，买方支付合同总价的30%作为预付款。</p>
                  <p className="indent-8">4.2 发货款：设备生产完毕发货前，买方支付合同总价的30%。</p>
                  <p className="indent-8">4.3 到货款：设备到达现场并验收合格后，买方<span className={cn("font-medium", activeRiskId === 'risk-3' && "bg-risk-low/20")}>应通过电汇或6个月内到期的银行承兑汇票支付货款</span>（合同总价的30%）。</p>
                </div>

                {/* 因为展示滚动效果，增加一些占位的长文本让页面可滚动 */}
                <h3 className="font-bold mb-2 mt-6">第五条 违约责任</h3>
                <div className="p-2 border-2 border-transparent">
                  <p className="indent-8 mb-2">5.1 卖方未能按期交货的，每逾期一日，应向买方支付逾期交货部分货款的千分之五作为违约金。</p>
                  <p className="indent-8 mb-2">5.2 买方未能按期付款的，每逾期一日，应向卖方支付逾期付款金额的千分之五作为违约金。</p>
                  <p className="indent-8">5.3 任何一方违反本合同其他约定的，应赔偿因此给守约方造成的全部损失。</p>
                </div>
                
                <h3 className="font-bold mb-2 mt-6">第六条 争议解决</h3>
                <div className="p-2 border-2 border-transparent">
                  <p className="indent-8 mb-2">6.1 凡因执行本合同所发生的或与本合同有关的一切争议，双方应首先通过友好协商解决。</p>
                  <p className="indent-8">6.2 协商不成的，任何一方均有权向买方所在地有管辖权的人民法院提起诉讼。</p>
                </div>

                <h3 className="font-bold mb-2 mt-6">第七条 其他约定</h3>
                <div className="p-2 border-2 border-transparent">
                  <p className="indent-8 mb-2">7.1 本合同自双方签字盖章之日起生效。</p>
                  <p className="indent-8 mb-2">7.2 本合同一式肆份，双方各执贰份，具有同等法律效力。</p>
                  <p className="indent-8">7.3 本合同未尽事宜，双方可签订补充协议，补充协议与本合同具有同等法律效力。</p>
                </div>

                {/* 模拟缺物质保期 - 删除左侧占位锚点 */}
              </div>
            </div>
          </div>
        </section>

        {/* 拖动调节宽度的手柄 */}
        <div 
          className="w-1 bg-surface-200 hover:bg-primary-400 cursor-col-resize z-30 transition-colors shrink-0 flex items-center justify-center group"
          onMouseDown={(e) => {
            e.preventDefault();
            isResizing.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        >
          {/* 手柄上的小圆点指示器 */}
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 rounded-full bg-surface-400"></div>
            <div className="w-1 h-1 rounded-full bg-surface-400"></div>
            <div className="w-1 h-1 rounded-full bg-surface-400"></div>
          </div>
        </div>

        {/* 右侧区域：智能审核辅助与操作区 */}
        <section 
          className="bg-white flex flex-col shrink-0 shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.05)] z-20 relative"
          style={{ width: rightPanelWidth }}
        >
          
          {/* Header */}
          <div className="p-5 border-b border-surface-100 shrink-0">
            <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600">智能审核辅助</span>
              <span className="text-xs font-normal px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full border border-primary-100">AI V1.3</span>
            </h2>
            <p className="text-sm text-surface-500 mt-1">已自动过滤与【财务部】相关的评审规则</p>
          </div>

          <div className="flex-1 overflow-y-auto relative" ref={rightScrollRef}>
            {/* 风险点列表 */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" />
                  规则评审结果
                </h3>
                
                {/* 风险概览 Pill */}
                <div className="flex items-center gap-1.5 text-xs font-medium bg-surface-100 p-1 rounded-full border border-surface-200">
                  <span className="px-2 py-0.5 bg-white text-risk-high rounded-full shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-risk-high"></span> {riskItems.filter((item) => item.category === 'trigger').length}
                  </span>
                  <span className="px-2 py-0.5 text-risk-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-risk-medium"></span> {riskItems.filter((item) => item.category === 'missing').length}
                  </span>
                  <span className="px-2 py-0.5 text-risk-low flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-risk-low"></span> {riskItems.filter((item) => item.category === 'low').length}
                  </span>
                </div>
              </div>

              {/* 风险卡片列表 */}
              <div className="space-y-4">
                {riskItems
                  .slice()
                  .sort((a, b) => {
                    const order: RiskCategory[] = ['trigger', 'missing', 'low'];
                    return order.indexOf(a.category) - order.indexOf(b.category);
                  })
                  .map((item) => {
                    const isActive = activeRiskId === item.id;
                    const categoryMeta = {
                      trigger: { bg: 'bg-risk-high/5', border: 'border-risk-high', text: 'text-risk-high', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                      missing: { bg: 'bg-risk-medium/5', border: 'border-risk-medium', text: 'text-risk-medium', icon: <Info className="w-3.5 h-3.5" /> },
                      low: { bg: 'bg-risk-low/5', border: 'border-risk-low', text: 'text-risk-low', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                    }[item.category];

                    const categoryLabel = item.category === 'trigger' ? '触发风险' : item.category === 'missing' ? '信息缺失' : '低风险';
                    const hoverBorderClass = item.category === 'trigger' ? 'hover:border-risk-high/50' : item.category === 'missing' ? 'hover:border-risk-medium/50' : 'hover:border-risk-low/50';
                    const ringClass = item.category === 'trigger' ? 'ring-risk-high/20' : item.category === 'missing' ? 'ring-risk-medium/20' : 'ring-risk-low/20';

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'border rounded-lg overflow-hidden transition-all duration-200',
                          isActive
                            ? `${categoryMeta.border} shadow-md ring-1 ${ringClass}`
                            : `border-surface-200 ${hoverBorderClass}`
                        )}
                      >
                        <div className={cn(categoryMeta.bg, 'p-3 border-b border-surface-100 flex items-start justify-between')}>
                          <div className="flex items-start gap-2">
                            <div className={cn('mt-0.5 p-1 rounded-full', categoryMeta.bg, categoryMeta.text)}>{categoryMeta.icon}</div>
                            <div>
                              <h4 className="text-sm font-semibold text-surface-900">{item.title}</h4>
                              <p className={cn('text-xs font-medium mt-0.5', categoryMeta.text)}>
                                {categoryLabel}：{item.summary}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => handleAcceptRisk(item)}
                              className={cn(
                                'px-2 py-1 text-xs font-medium rounded-md border',
                                item.isAccepted
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                              )}
                            >
                              采纳
                            </button>
                            <button
                              onClick={() => handleIgnoreRisk(item.id)}
                              className="px-2 py-1 text-xs font-medium rounded-md border bg-white text-surface-600 border-surface-300 hover:bg-surface-100"
                            >
                              忽略
                            </button>
                            {item.isAccepted && (
                              <span className="text-xs text-green-600 font-medium">已采纳</span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-white space-y-4 border border-surface-200 rounded-lg shadow-sm">
                          <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider">审核结论</div>
                          <div className="rounded-lg bg-surface-50 px-3 py-2 text-sm text-surface-900 leading-relaxed">
                            {item.conclusion} {item.details}
                          </div>

                          <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider">结论原因</div>
                          <div className="rounded-lg bg-surface-50 px-3 py-2 text-sm text-surface-500">
                            {(() => {
                              const reasonMatch = item.reason.match(/第\d+条第\d+\.\d+款/);
                              if (!reasonMatch) {
                                return <span>{item.reason}</span>;
                              }
                              const [before, after] = item.reason.split(reasonMatch[0]);
                              return (
                                <span>
                                  {before}
                                  <button
                                    onClick={() => scrollToRisk(item.reasonLocationId || item.id)}
                                    className="text-primary-600 hover:text-primary-700 underline"
                                  >
                                    {reasonMatch[0]}
                                  </button>
                                  {after}
                                </span>
                              );
                            })()}
                          </div>

                          {/* 结构化字段 */}
                          <div className="bg-surface-50 p-3 rounded-md border border-surface-200">
                            <h5 className="text-xs font-semibold text-surface-600 mb-2">评审要点提取</h5>
                            <div className="space-y-2">
                              {item.structuredFields.map((field) => (
                                <div key={field.id} className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-surface-500">{field.label}</span>
                                      {field.confirmed && (
                                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                                          已确认
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => field.locationId ? scrollToRisk(field.locationId) : undefined}
                                      className="text-xs text-primary-600 hover:text-primary-700"
                                    >
                                      定位原文
                                    </button>
                                  </div>
                                  <input
                                    value={field.value}
                                    onChange={(e) => {
                                      setRiskItems((prev) =>
                                        prev.map((prevItem) =>
                                          prevItem.id === item.id
                                            ? {
                                                ...prevItem,
                                                structuredFields: prevItem.structuredFields.map((p) =>
                                                  p.id === field.id ? { ...p, value: e.target.value } : p
                                                ),
                                              }
                                            : prevItem
                                        )
                                      );
                                    }}
                                    className="w-full px-2 py-1 border border-surface-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* 留出底部空间给固定的审核操作区 */}
            <div className={cn("transition-all duration-300", isOpinionExpanded ? "h-64" : "h-20")}></div>
          </div>

          {/* 底部固定区：审核意见填写与提交 */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 border-t transition-all duration-300 z-30 flex flex-col",
            isOpinionExpanded 
              ? "bg-white border-surface-200 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]" 
              : opinionText.trim().length === 0
                ? "bg-orange-50 border-orange-200 shadow-[0_-8px_30px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20" // 未填写时强调改为橙色系
                : "bg-surface-800 border-surface-700 shadow-[0_-8px_30px_rgba(0,0,0,0.2)]" // 已填写时变为深色突出状态
          )}>
            {/* 意见区头部/收起状态 */}
            <div 
              className={cn(
                "px-5 py-3.5 flex items-center justify-between cursor-pointer select-none transition-colors",
                isOpinionExpanded ? "hover:bg-surface-50" : (opinionText.trim().length === 0 ? "hover:bg-orange-100" : "hover:bg-surface-700"),
                !isOpinionExpanded && "border-b-0"
              )}
              onClick={() => setIsOpinionExpanded(!isOpinionExpanded)}
            >
              <div className="flex items-center gap-3">
                <label className={cn(
                  "text-sm font-semibold cursor-pointer flex items-center",
                  isOpinionExpanded ? "text-surface-900" : (opinionText.trim().length === 0 ? "text-orange-800" : "text-white")
                )}>
                  审核意见<span className={cn("ml-1", isOpinionExpanded || opinionText.trim().length === 0 ? "text-risk-high" : "text-risk-high/80")}>*</span>
                </label>
                
                {!isOpinionExpanded && (
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors shadow-sm",
                    opinionText.trim().length > 0 
                      ? "bg-risk-low/20 text-risk-low border border-risk-low/20" 
                      : "bg-white text-orange-600 border border-orange-200"
                  )}>
                    {opinionText.trim().length === 0 && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                    )}
                    <span>{opinionText.trim().length > 0 ? "已填写，点击展开并提交" : "待填写意见"}</span>
                  </div>
                )}
              </div>
              <div className={cn(
                "flex items-center gap-2 text-xs font-medium",
                isOpinionExpanded ? "text-surface-400" : (opinionText.trim().length === 0 ? "text-orange-600" : "text-surface-300")
              )}>
                {!isOpinionExpanded && <span>点击展开</span>}
                <button className={cn(
                  "p-1 rounded-md transition-colors",
                  isOpinionExpanded 
                    ? "hover:text-surface-700 hover:bg-surface-100" 
                    : (opinionText.trim().length === 0 ? "bg-white/50 hover:bg-white" : "hover:bg-surface-600 text-white")
                )}>
                  {isOpinionExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 展开的意见输入与提交区 */}
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out bg-white",
                isOpinionExpanded ? "max-h-[300px] opacity-100 px-5 pb-5" : "max-h-0 opacity-0 px-5 pb-0"
              )}
            >
              <textarea 
                className="w-full h-24 p-3 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all"
                placeholder="请基于AI辅助信息，填写您的最终审核意见。此意见将提交至BPM系统..."
                value={opinionText}
                onChange={(e) => setOpinionText(e.target.value)}
              ></textarea>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-surface-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 结构化字段将同步提交
                </span>
                <button 
                  onClick={handleSubmit}
                  className={cn(
                    "px-6 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition-colors active:scale-95 flex items-center gap-2",
                    opinionText.trim().length > 0 
                      ? "bg-surface-900 hover:bg-surface-800 shadow-surface-900/20" 
                      : "bg-surface-300 cursor-not-allowed shadow-none"
                  )}
                  disabled={opinionText.trim().length === 0}
                >
                  提交结论并返回 BPM
                </button>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default ReviewerPage;

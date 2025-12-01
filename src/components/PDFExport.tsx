'use client';

import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

export default function PDFExport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          /* 隐藏页面背景和其他装饰 */
          body {
            background: white !important;
          }

          /* 隐藏非打印元素 */
          .no-print,
          header,
          footer,
          nav,
          .ant-float-btn {
            display: none !important;
          }

          /* 页面设置 */
          @page {
            size: A4;
            margin: 15mm;
          }

          /* 确保颜色正确显示 */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 避免内容被截断 */
          .ant-card,
          .ant-timeline-item {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <Button
        type="primary"
        icon={<PrinterOutlined />}
        onClick={handlePrint}
      >
        打印/导出PDF
      </Button>
    </>
  );
}

'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button, Modal, Spin, App } from 'antd';
import { FilePdfOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { ProfileData } from '@/types/profile';
import ProfileDisplay from './ProfileDisplay';

interface PDFExportProps {
  profile: ProfileData;
}

export default function PDFExport({ profile }: PDFExportProps) {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);
  const { message } = App.useApp();

  const generatePDF = async (preview: boolean = false) => {
    setLoading(true);
    try {
      if (!printRef.current) {
        throw new Error('打印内容未找到');
      }

      // 使用html2canvas将内容转换为canvas
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: false,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
      });

      // 计算PDF页面尺寸
      const imgWidth = 210; // A4宽度(mm)
      const pageHeight = 297; // A4高度(mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // 添加第一页
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // 如果内容超过一页，添加更多页
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      if (preview) {
        // 预览模式
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPreviewUrl(url);
        setPreviewOpen(true);
      } else {
        // 下载模式
        pdf.save(`${profile.name}_简历.pdf`);
        message.success('PDF已下载');
      }
    } catch (error) {
      console.error('生成PDF失败:', error);
      message.error('生成PDF失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={() => generatePDF(false)}
          loading={loading}
        >
          导出PDF
        </Button>
        <Button
          icon={<EyeOutlined />}
          onClick={() => generatePDF(true)}
          loading={loading}
        >
          预览PDF
        </Button>
      </div>

      {/* 隐藏的打印内容 */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={printRef} style={{ width: '210mm', background: 'white', padding: '20mm' }}>
          <ProfileDisplay profile={profile} />
        </div>
      </div>

      {/* PDF预览模态框 */}
      <Modal
        title="PDF预览"
        open={previewOpen}
        onCancel={() => {
          setPreviewOpen(false);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
          }
        }}
        width="90%"
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<FilePdfOutlined />}
            onClick={() => {
              setPreviewOpen(false);
              generatePDF(false);
            }}
          >
            下载PDF
          </Button>,
        ]}
        styles={{ body: { height: '80vh' } }}
      >
        {previewUrl && (
          <iframe
            src={previewUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="PDF预览"
          />
        )}
      </Modal>
    </>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, Check, Copy, ExternalLink, QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColorClass: string;
  targetType: 'parent' | 'student' | 'all';
  schoolName: string;
  hostName: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  url,
  title,
  subtitle,
  badgeText,
  badgeColorClass,
  targetType,
  schoolName,
  hostName
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: targetType === 'parent' ? '#047857' : targetType === 'student' ? '#4338ca' : '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [url, targetType]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${schoolName}_인성설문_${targetType === 'parent' ? '학부모용' : targetType === 'student' ? '학생용' : '통합'}_QR코드.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${schoolName} 인성설문 QR 안내장 - ${title}</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", dotum, sans-serif; color: #1e293b; text-align: center; padding: 30px; }
            .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; background: #f1f5f9; color: #334155; margin-bottom: 15px; }
            .header { margin-bottom: 25px; border-bottom: 2px solid #0f172a; padding-bottom: 15px; }
            h1 { font-size: 24px; margin: 0 0 10px 0; color: #0f172a; }
            .sub { font-size: 14px; color: #475569; margin: 0; }
            .qr-box { margin: 30px auto; padding: 20px; width: 280px; height: 280px; border: 2px dashed #94a3b8; border-radius: 16px; background: #fff; }
            .qr-box img { width: 100%; height: 100%; object-fit: contain; }
            .instructions { font-size: 14px; color: #334155; line-height: 1.6; margin-top: 25px; background: #f8fafc; padding: 15px; border-radius: 10px; text-align: left; }
            .url-text { font-family: monospace; font-size: 11px; word-break: break-all; color: #64748b; margin-top: 15px; }
            .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">${badgeText}</span>
            <h1>${schoolName} 인성 프로그램 만족도 조사 안내</h1>
            <p class="sub">${title} (${subtitle})</p>
          </div>

          <div class="qr-box">
            <img src="${dataUrl}" alt="QR Code" />
          </div>

          <div class="instructions">
            <strong>■ 참여 방법</strong><br>
            1. 스마트폰 기본 카메라 앱을 켭니다.<br>
            2. 화면에 위 QR코드를 비추면 상단에 나타나는 알림 링크를 터치합니다.<br>
            3. 학년 선택 후 총 5개 문항에 솔직하게 응답해 주세요. (약 1분 소요)
          </div>

          <div class="url-text">직접 접속 주소: ${url}</div>

          <div class="footer">
            ${schoolName}
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-center gap-6">
      {/* QR Image Box */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-48 h-48 bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 flex items-center justify-center shadow-xs relative group">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`${title} QR Code`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <QrCode size={36} className="animate-pulse" />
              <span className="text-xs">QR 생성 중...</span>
            </div>
          )}
        </div>
        <span className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-mono">
          <span>스마트폰 카메라로 스캔</span>
        </span>
      </div>

      {/* Info & Action Controls */}
      <div className="flex-1 w-full space-y-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColorClass}`}>
              {badgeText}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* URL Box with Copy */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 block">
            접속 주소(URL):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? '복사됨' : '복사'}</span>
            </button>
          </div>
        </div>

        {/* Download & Print Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Download size={13} />
            <span>QR 이미지(PNG) 저장</span>
          </button>
          <button
            onClick={handlePrintSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>인쇄용 안내장 출력</span>
          </button>
        </div>
      </div>
    </div>
  );
};

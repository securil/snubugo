import React, { useState } from 'react';
import { generatePdfThumbnail, extractPdfInfo } from '../utils/pdfUtils';

const PdfTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testPdf = async () => {
    setLoading(true);
    setResult('테스트 시작...\n');
    
    const pdfPath = '/pdfs/test-131.pdf';
    
    try {
      // 1. 파일 접근 테스트
      setResult(prev => prev + '1. 파일 접근 테스트...\n');
      const response = await fetch(pdfPath, { method: 'HEAD' });
      setResult(prev => prev + `   - 상태 코드: ${response.status}\n`);
      
      if (response.ok) {
        setResult(prev => prev + '   - ✅ 파일 접근 성공\n');
        
        // 2. PDF 정보 추출 테스트
        setResult(prev => prev + '2. PDF 정보 추출 테스트...\n');
        const info = await extractPdfInfo(pdfPath);
        setResult(prev => prev + `   - 페이지 수: ${info?.numPages || '알 수 없음'}\n`);
        setResult(prev => prev + `   - 제목: ${info?.title || '알 수 없음'}\n`);
        
        // 3. 썸네일 생성 테스트
        setResult(prev => prev + '3. 썸네일 생성 테스트...\n');
        const thumbnail = await generatePdfThumbnail(pdfPath);
        
        if (thumbnail) {
          setResult(prev => prev + '   - ✅ 썸네일 생성 성공\n');
          setResult(prev => prev + `   - 썸네일 크기: ${thumbnail.length} 문자\n`);
        } else {
          setResult(prev => prev + '   - ❌ 썸네일 생성 실패\n');
        }
        
      } else {
        setResult(prev => prev + '   - ❌ 파일 접근 실패\n');
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ 오류 발생: ${error}\n`);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">PDF 테스트</h3>
      
      <button 
        onClick={testPdf}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '테스트 중...' : 'PDF 테스트 실행'}
      </button>
      
      {result && (
        <pre className="mt-4 p-4 bg-white rounded border text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
};

export default PdfTest;
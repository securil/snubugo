import { useState, useEffect, useCallback } from 'react';
import { extractPdfInfo, getPdfFileSize } from '../utils/pdfUtils';
import { Book } from '../types';

interface PdfThumbnailState {
  thumbnail: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * PDF 썸네일 훅 - 자동 생성 기능 비활성화됨
 * 미리 준비된 썸네일을 사용하므로 이 훅은 더 이상 사용되지 않음
 * @deprecated 미리 준비된 썸네일 사용으로 인해 비활성화됨
 */
export const usePdfThumbnail = (_pdfPath: string) => {
  const [state] = useState<PdfThumbnailState>({
    thumbnail: null,
    isLoading: false,
    error: 'PDF 썸네일 자동 생성이 비활성화되었습니다. 미리 준비된 썸네일을 사용합니다.',
  });

  console.warn('usePdfThumbnail 훅이 호출되었지만 자동 생성 기능이 비활성화되어 있습니다.');

  return {
    ...state,
    regenerate: () => Promise.resolve(),
  };
};

export const usePdfInfo = (pdfPath: string) => {
  const [pdfInfo, setPdfInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfPath) return;

    const loadPdfInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const testUrl = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
        const info = await extractPdfInfo(testUrl);
        setPdfInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
        setPdfInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfInfo();
  }, [pdfPath]);

  return { pdfInfo, isLoading, error };
};

/**
 * PDF 파일들을 스캔하여 자동으로 Book 객체들을 생성하는 훅
 * 썸네일 자동 생성 부분만 제거됨
 */
export const usePdfScanner = (pdfPaths: string[]) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const scanPdfs = useCallback(async () => {
    if (pdfPaths.length === 0) return;

    setIsScanning(true);
    setProgress(0);

    const scannedBooks: Book[] = [];

    for (let i = 0; i < pdfPaths.length; i++) {
      const pdfPath = pdfPaths[i];
      
      try {
        const testUrl = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
        
        // PDF 정보 추출 (썸네일 생성 제외)
        const pdfInfo = await extractPdfInfo(testUrl);
        const fileSize = await getPdfFileSize(testUrl);

        // 파일명에서 ID 및 제목 추출
        const fileName = pdfPath.split('/').pop()?.replace('.pdf', '') || `pdf-${i}`;
        const bookId = fileName.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();

        const book: Book = {
          id: bookId,
          title: pdfInfo?.title || fileName,
          author: pdfInfo?.author || '작가 미상',
          description: pdfInfo?.subject || `${fileName}에 대한 PDF 문서입니다.`,
          coverImage: 'auto-generated', // 썸네일은 AutoThumbnail 컴포넌트에서 처리
          pdfPath: testUrl,
          pageCount: pdfInfo?.numPages || 0,
          category: '문서',
          publishDate: pdfInfo?.creationDate 
            ? new Date(pdfInfo.creationDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          tags: [
            pdfInfo?.creator && pdfInfo.creator !== 'Unknown' ? pdfInfo.creator : null,
            pdfInfo?.producer && pdfInfo.producer !== 'Unknown' ? pdfInfo.producer : null,
          ].filter(Boolean) as string[],
          fileSize: fileSize,
        };

        scannedBooks.push(book);
        
      } catch (error) {
        console.error(`PDF 스캔 실패 (${pdfPath}):`, error);
        
        // 실패해도 기본 정보로 책 객체 생성
        const fileName = pdfPath.split('/').pop()?.replace('.pdf', '') || `pdf-${i}`;
        const bookId = fileName.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();
        
        scannedBooks.push({
          id: bookId,
          title: fileName,
          author: '작가 미상',
          description: '정보를 가져올 수 없는 PDF 문서입니다.',
          coverImage: 'auto-generated', // 썸네일은 AutoThumbnail 컴포넌트에서 처리
          pdfPath: pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`,
          pageCount: 0,
          category: '문서',
          publishDate: new Date().toISOString().split('T')[0],
          tags: [],
          fileSize: '알 수 없음',
        });
      }

      setProgress(Math.round(((i + 1) / pdfPaths.length) * 100));
    }

    setBooks(scannedBooks);
    setIsScanning(false);
  }, [pdfPaths]);

  useEffect(() => {
    scanPdfs();
  }, [scanPdfs]);

  return {
    books,
    isScanning,
    progress,
    rescan: scanPdfs,
  };
};
import { useState, useEffect, useCallback } from 'react';
import { generatePdfThumbnail, extractPdfInfo, getPdfFileSize } from '../utils/pdfUtils';
import { Book } from '../types';

interface PdfThumbnailState {
  thumbnail: string | null;
  isLoading: boolean;
  error: string | null;
}

export const usePdfThumbnail = (pdfPath: string) => {
  const [state, setState] = useState<PdfThumbnailState>({
    thumbnail: null,
    isLoading: false,
    error: null,
  });

  const generateThumbnail = useCallback(async () => {
    if (!pdfPath) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const thumbnail = await generatePdfThumbnail(pdfPath);
      setState({
        thumbnail,
        isLoading: false,
        error: thumbnail ? null : 'PDF 썸네일 생성에 실패했습니다.',
      });
    } catch (error) {
      setState({
        thumbnail: null,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      });
    }
  }, [pdfPath]);

  useEffect(() => {
    generateThumbnail();
  }, [generateThumbnail]);

  return {
    ...state,
    regenerate: generateThumbnail,
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
        const info = await extractPdfInfo(pdfPath);
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
        // PDF 정보 추출
        const pdfInfo = await extractPdfInfo(pdfPath);
        const fileSize = await getPdfFileSize(pdfPath);
        const thumbnail = await generatePdfThumbnail(pdfPath);

        // 파일명에서 ID 및 제목 추출
        const fileName = pdfPath.split('/').pop()?.replace('.pdf', '') || `pdf-${i}`;
        const bookId = fileName.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();

        const book: Book = {
          id: bookId,
          title: pdfInfo?.title || fileName,
          author: pdfInfo?.author || '작가 미상',
          description: pdfInfo?.subject || `${fileName}에 대한 PDF 문서입니다.`,
          coverImage: thumbnail || '/covers/default-cover.svg',
          pdfPath: pdfPath,
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
          coverImage: '/covers/default-cover.svg',
          pdfPath: pdfPath,
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

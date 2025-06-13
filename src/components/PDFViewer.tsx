import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useBookStore } from '../store/bookStore';
import ViewerControls from './ViewerControls';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { 
    books, 
    currentBook, 
    viewerState, 
    setCurrentBook, 
    updateViewerState 
  } = useBookStore();

  const [containerWidth, setContainerWidth] = useState<number>(800);

  // 책 찾기 및 설정
  useEffect(() => {
    if (bookId) {
      const book = books.find(b => b.id === bookId);
      if (book) {
        setCurrentBook(book);
      } else {
        navigate('/');
      }
    }
  }, [bookId, books, setCurrentBook, navigate]);

  // 컨테이너 크기 감지
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const updateWidth = () => {
        setContainerWidth(node.offsetWidth - 40); // 패딩 고려
      };
      
      updateWidth();
      
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(node);
      
      return () => resizeObserver.disconnect();
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    updateViewerState({ 
      totalPages: numPages, 
      isLoading: false,
      currentPage: 1
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF 로드 에러:', error);
    updateViewerState({ isLoading: false });
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          useBookStore.getState().prevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          useBookStore.getState().nextPage();
          break;
        case 'Home':
          event.preventDefault();
          useBookStore.getState().goToPage(1);
          break;
        case 'End':
          event.preventDefault();
          useBookStore.getState().goToPage(viewerState.totalPages);
          break;
        case 'Escape':
          navigate('/');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, viewerState.totalPages]);

  if (!currentBook) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">책을 로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <ViewerControls />
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-800 p-4"
      >
        <div className="flex justify-center">
          <Document
            file={currentBook.pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white">PDF 로딩중...</p>
              </div>
            }
            error={
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">PDF를 로드할 수 없습니다.</p>
                <p className="text-gray-400 text-sm">
                  파일 경로: {currentBook.pdfPath}
                </p>
              </div>
            }
          >
            <Page
              pageNumber={viewerState.currentPage}
              scale={viewerState.scale}
              width={containerWidth}
              loading={
                <div className="bg-gray-200 animate-pulse" 
                     style={{ width: containerWidth, height: containerWidth * 1.4 }} />
              }
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;

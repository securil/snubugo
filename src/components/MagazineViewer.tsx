import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useBookStore } from '../store/bookStore';
import ViewerControls from './ViewerControls';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const MagazineViewer: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { 
    books, 
    magazines,
    currentBook, 
    currentMagazine,
    viewerState, 
    setCurrentBook,
    setCurrentMagazine,
    updateViewerState 
  } = useBookStore();

  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [, setContainerHeight] = useState<number>(600);

  // 현재 아이템 (책 또는 매거진)
  const currentItem = currentMagazine || currentBook;

  // 아이템 찾기 및 설정
  useEffect(() => {
    if (bookId) {
      // 먼저 매거진에서 찾기
      const magazine = magazines.find(m => m.id === bookId);
      if (magazine) {
        setCurrentMagazine(magazine);
        return;
      }
      
      // 매거진에서 찾지 못하면 책에서 찾기
      const book = books.find(b => b.id === bookId);
      if (book) {
        setCurrentBook(book);
        return;
      }
      
      // 둘 다 없으면 홈으로
      navigate('/');
    }
  }, [bookId, books, magazines, setCurrentBook, setCurrentMagazine, navigate]);

  // 컨테이너 크기 감지
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const updateSize = () => {
        const rect = node.getBoundingClientRect();
        setContainerWidth(rect.width - 40); // 패딩 고려
        setContainerHeight(rect.height - 40);
      };
      
      updateSize();
      
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(node);
      
      return () => resizeObserver.disconnect();
    }
  }, []);

  // 반응형 뷰 모드 자동 설정
  useEffect(() => {
    const updateViewMode = () => {
      const width = window.innerWidth;
      if (width >= 1920) {
        // 1920px 이상에서는 기본적으로 2페이지 모드
        if (viewerState.viewMode === 'single') {
          updateViewerState({ viewMode: 'double' });
        }
      } else if (width < 1024) {
        // 1024px 미만에서는 단일 페이지 모드
        if (viewerState.viewMode === 'double') {
          updateViewerState({ viewMode: 'single' });
        }
      }
    };

    updateViewMode();
    window.addEventListener('resize', updateViewMode);
    return () => window.removeEventListener('resize', updateViewMode);
  }, [viewerState.viewMode, updateViewerState]);

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
        case '1':
          if (event.ctrlKey) {
            event.preventDefault();
            useBookStore.getState().setViewMode('single');
          }
          break;
        case '2':
          if (event.ctrlKey) {
            event.preventDefault();
            useBookStore.getState().setViewMode('double');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, viewerState.totalPages]);

  // 페이지 스케일 계산
  const getPageScale = () => {
    const baseScale = viewerState.scale;
    if (viewerState.viewMode === 'double') {
      // 2페이지 모드에서는 각 페이지가 화면의 절반 크기
      return baseScale * 0.8;
    }
    return baseScale;
  };

  // 페이지 너비 계산
  const getPageWidth = () => {
    if (viewerState.viewMode === 'double') {
      return Math.min(containerWidth / 2 - 20, 600); // 2페이지 모드
    }
    return Math.min(containerWidth, 800); // 단일 페이지 모드
  };

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">문서를 로딩중...</p>
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
        <div className="flex justify-center min-h-full">
          <Document
            file={currentItem.pdfPath}
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
                  파일 경로: {currentItem.pdfPath}
                </p>
              </div>
            }
          >
            {viewerState.viewMode === 'single' ? (
              // 단일 페이지 모드
              <div className="flex flex-col items-center space-y-4">
                <Page
                  pageNumber={viewerState.currentPage}
                  scale={getPageScale()}
                  width={getPageWidth()}
                  loading={
                    <div className="bg-gray-200 animate-pulse rounded-lg" 
                         style={{ width: getPageWidth(), height: getPageWidth() * 1.4 }} />
                  }
                  className="shadow-2xl rounded-lg overflow-hidden"
                />
              </div>
            ) : (
              // 2페이지 모드
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4 justify-center">
                  {/* 왼쪽 페이지 */}
                  {viewerState.currentPage <= viewerState.totalPages && (
                    <Page
                      pageNumber={viewerState.currentPage}
                      scale={getPageScale()}
                      width={getPageWidth()}
                      loading={
                        <div className="bg-gray-200 animate-pulse rounded-lg" 
                             style={{ width: getPageWidth(), height: getPageWidth() * 1.4 }} />
                      }
                      className="shadow-2xl rounded-lg overflow-hidden"
                    />
                  )}
                  
                  {/* 오른쪽 페이지 */}
                  {viewerState.currentPage + 1 <= viewerState.totalPages && (
                    <Page
                      pageNumber={viewerState.currentPage + 1}
                      scale={getPageScale()}
                      width={getPageWidth()}
                      loading={
                        <div className="bg-gray-200 animate-pulse rounded-lg" 
                             style={{ width: getPageWidth(), height: getPageWidth() * 1.4 }} />
                      }
                      className="shadow-2xl rounded-lg overflow-hidden"
                    />
                  )}
                </div>
                
                {/* 2페이지 모드 정보 */}
                <div className="text-center text-gray-400 text-sm">
                  {viewerState.currentPage + 1 <= viewerState.totalPages ? (
                    `${viewerState.currentPage} - ${viewerState.currentPage + 1} / ${viewerState.totalPages}`
                  ) : (
                    `${viewerState.currentPage} / ${viewerState.totalPages}`
                  )}
                </div>
              </div>
            )}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default MagazineViewer;

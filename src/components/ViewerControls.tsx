import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Home,
  BookOpen,
  Columns,
  FileText
} from 'lucide-react';

const ViewerControls: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBook, 
    currentMagazine,
    viewerState, 
    nextPage, 
    prevPage, 
    goToPage,
    zoomIn, 
    zoomOut, 
    resetZoom,
    updateViewerState 
  } = useBookStore();

  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');

  const currentItem = currentMagazine || currentBook;

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInputValue);
    if (pageNum && pageNum >= 1 && pageNum <= viewerState.totalPages) {
      goToPage(pageNum);
    }
    setShowPageInput(false);
    setPageInputValue('');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      updateViewerState({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      updateViewerState({ isFullscreen: false });
    }
  };

  if (!currentItem) return null;

  return (
    <div className="bg-gray-800 text-white p-4 border-b border-gray-700">
      {/* 상단 정보 바 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Home size={20} />
            <span>홈으로</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <BookOpen size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">{currentItem.title}</h2>
            <span className="text-gray-400">
              {currentMagazine ? 
                `${currentMagazine.year}년 ${currentMagazine.season}호` : 
                `by ${(currentItem as any).author || '작가 미상'}`
              }
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {Math.round(viewerState.scale * 100)}%
          </span>
          
          {/* 뷰 모드 전환 버튼 */}
          <div className="flex rounded-lg overflow-hidden border border-gray-600">
            <button
              onClick={() => useBookStore.getState().setViewMode('single')}
              className={`p-2 transition-colors ${
                viewerState.viewMode === 'single' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="단일 페이지 보기"
            >
              <FileText size={20} />
            </button>
            <button
              onClick={() => useBookStore.getState().setViewMode('double')}
              className={`p-2 transition-colors ${
                viewerState.viewMode === 'double' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="2페이지 보기"
            >
              <Columns size={20} />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title={viewerState.isFullscreen ? "전체화면 끄기" : "전체화면"}
          >
            {viewerState.isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between">
        {/* 페이지 네비게이션 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={viewerState.currentPage <= 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="이전 페이지 (←)"
          >
            <ChevronLeft size={20} />
          </button>

          {showPageInput ? (
            <form onSubmit={handlePageInputSubmit} className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={viewerState.totalPages}
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-white"
                placeholder={viewerState.currentPage.toString()}
                autoFocus
                onBlur={() => setShowPageInput(false)}
              />
              <span className="text-gray-400">/ {viewerState.totalPages}</span>
            </form>
          ) : (
            <button
              onClick={() => {
                setShowPageInput(true);
                setPageInputValue(viewerState.currentPage.toString());
              }}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="페이지로 이동"
            >
              <span className="font-mono">
                {viewerState.viewMode === 'double' && viewerState.currentPage + 1 <= viewerState.totalPages ? (
                  `${viewerState.currentPage}-${viewerState.currentPage + 1} / ${viewerState.totalPages}`
                ) : (
                  `${viewerState.currentPage} / ${viewerState.totalPages}`
                )}
              </span>
            </button>
          )}

          <button
            onClick={nextPage}
            disabled={viewerState.currentPage >= viewerState.totalPages}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="다음 페이지 (→)"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 확대/축소 컨트롤 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            disabled={viewerState.scale <= 0.5}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="축소"
          >
            <ZoomOut size={20} />
          </button>

          <button
            onClick={resetZoom}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
            title="원본 크기"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={zoomIn}
            disabled={viewerState.scale >= 3.0}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="확대"
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* 키보드 단축키 힌트 */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        키보드: ←→ 페이지 이동, Space 다음 페이지, Esc 홈으로, Home/End 처음/끝 페이지, Ctrl+1/2 보기모드 전환
      </div>
    </div>
  );
};

export default ViewerControls;

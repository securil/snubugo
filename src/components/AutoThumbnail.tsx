import { useState } from 'react';
import { Book } from '../types';
import { usePdfThumbnail } from '../hooks/usePdfThumbnail';

interface AutoThumbnailProps {
  book: Book;
  onThumbnailGenerated?: (bookId: string, thumbnail: string) => void;
}

const AutoThumbnail: React.FC<AutoThumbnailProps> = ({ book, onThumbnailGenerated }) => {
  const [shouldGenerate, setShouldGenerate] = useState(
    book.coverImage === 'auto-generated' || book.coverImage.includes('default-cover')
  );
  
  const { thumbnail, isLoading, error } = usePdfThumbnail(
    shouldGenerate ? book.pdfPath : ''
  );

  // 썸네일이 생성되면 부모 컴포넌트에 알림
  if (thumbnail && onThumbnailGenerated) {
    onThumbnailGenerated(book.id, thumbnail);
  }

  // 기존 표지 이미지가 있으면 그것을 사용
  if (!shouldGenerate && book.coverImage !== 'auto-generated') {
    return (
      <img 
        src={book.coverImage} 
        alt={book.title}
        className="w-full h-full object-cover"
        onError={() => setShouldGenerate(true)}
      />
    );
  }

  // 썸네일 로딩 중
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-xs text-gray-500">표지 생성 중...</span>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600">
        <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-xs text-center px-2">표지 생성 실패</span>
      </div>
    );
  }

  // 생성된 썸네일 표시
  if (thumbnail) {
    return (
      <img 
        src={thumbnail} 
        alt={book.title}
        className="w-full h-full object-cover"
      />
    );
  }

  // 기본 아이콘
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
      <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
      </svg>
      <span className="text-xs">표지 없음</span>
    </div>
  );
};

export default AutoThumbnail;

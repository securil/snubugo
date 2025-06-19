import { useState } from 'react';
import { Book, Magazine } from '../types';

interface StaticThumbnailProps {
  item: Book | Magazine;
  onError?: () => void;
}

const StaticThumbnail: React.FC<StaticThumbnailProps> = ({ item, onError }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 썸네일 경로 결정
  const getThumbnailPath = () => {
    // coverImage가 이미 설정되어 있으면 그것을 사용
    if (item.coverImage && 
        item.coverImage !== 'auto-generated' && 
        !item.coverImage.includes('default-cover')) {
      return item.coverImage;
    }

    // Magazine 타입인 경우 썸네일 폴더에서 ID로 찾기
    if ('season' in item && 'issue' in item) {
      return `/thumbnails/${item.id}.jpg`;
    }

    // Book 타입인 경우 기존 로직 유지
    return item.coverImage || '/covers/default-cover.svg';
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
    if (onError) {
      onError();
    }
  };

  const thumbnailPath = getThumbnailPath();

  // 이미지 로딩 중
  if (isLoading && !imageError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-xs text-gray-500">로딩 중...</span>
      </div>
    );
  }

  // 이미지 로드 에러 시
  if (imageError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
        </svg>
        <span className="text-xs text-center px-2">표지 없음</span>
      </div>
    );
  }

  // 정상적인 썸네일 표시
  return (
    <>
      <img 
        src={thumbnailPath} 
        alt={item.title}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1"></div>
          <span className="text-xs text-gray-500">로딩 중...</span>
        </div>
      )}
    </>
  );
};

export default StaticThumbnail;
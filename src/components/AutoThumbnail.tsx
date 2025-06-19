import { useState, useEffect } from 'react';
import { Book } from '../types';

interface AutoThumbnailProps {
  book: Book;
  onThumbnailGenerated?: (bookId: string, thumbnail: string) => void;
}

/**
 * PDF 파일명에서 가능한 썸네일 경로들을 우선순위별로 생성
 */
const generateThumbnailPaths = (pdfPath: string): string[] => {
  const fileName = pdfPath.split('/').pop()?.replace('.pdf', '') || '';
  
  // 파일명 정규화 (특수 문자 및 공백 처리)
  const normalizedName = fileName.trim();
  
  console.log(`🔍 [${normalizedName}] PDF 파일명에서 썸네일 경로 생성 중...`);
  console.log(`📄 원본 PDF 경로: ${pdfPath}`);
  console.log(`📝 추출된 파일명: "${normalizedName}"`);
  
  const extensions = ['png', 'jpg', 'jpeg', 'webp'];
  const suffixes = ['_1', '', '_thumb', '_thumbnail'];
  
  const paths: string[] = [];
  
  // 우선순위: _1 > 기본 > _thumb > _thumbnail
  for (const suffix of suffixes) {
    for (const ext of extensions) {
      const path = `/thumbnails/${normalizedName}${suffix}.${ext}`;
      paths.push(path);
    }
  }
  
  console.log(`🎯 [${normalizedName}] 생성된 썸네일 경로 목록 (${paths.length}개):`);
  paths.forEach((path, index) => {
    console.log(`   ${index + 1}. ${path}`);
  });
  
  return paths;
};

/**
 * 이미지 URL이 실제로 존재하는지 확인하는 함수
 */
const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    console.log(`🔗 이미지 존재 확인 중: ${url}`);
    
    // fetch 대신 Image 객체로 테스트
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✅ ${url} - 이미지 로드 성공`);
        resolve(true);
      };
      img.onerror = () => {
        console.log(`❌ ${url} - 이미지 로드 실패`);
        resolve(false);
      };
      img.src = url;
    });
  } catch (error) {
    console.log(`❌ ${url} - 네트워크 오류:`, error);
    return false;
  }
};

const AutoThumbnail: React.FC<AutoThumbnailProps> = ({ book, onThumbnailGenerated }) => {
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const findThumbnail = async () => {
      const bookName = book.title || book.id;
      console.log(`\n🚀 [${bookName}] 썸네일 검색 시작`);
      console.log(`📚 Book ID: ${book.id}`);
      console.log(`📖 Book Title: ${book.title}`);
      console.log(`📁 PDF Path: ${book.pdfPath}`);
      console.log(`🖼️ Cover Image: ${book.coverImage}`);
      
      setIsSearching(true);
      setImageError(false);
      setDebugInfo('썸네일 검색 중...');

      // 1. 기존 표지 이미지가 명시적으로 설정된 경우
      if (book.coverImage && 
          book.coverImage !== 'auto-generated' && 
          !book.coverImage.includes('default-cover')) {
        
        console.log(`📋 [${bookName}] 기존 표지 이미지 확인: ${book.coverImage}`);
        const exists = await checkImageExists(book.coverImage);
        if (exists) {
          console.log(`✅ [${bookName}] 기존 표지 이미지 사용: ${book.coverImage}`);
          setThumbnailPath(book.coverImage);
          setIsSearching(false);
          setDebugInfo(`기존 표지 사용: ${book.coverImage.split('/').pop()}`);
          if (onThumbnailGenerated) {
            onThumbnailGenerated(book.id, book.coverImage);
          }
          return;
        } else {
          console.log(`⚠️ [${bookName}] 기존 표지 이미지 없음, 자동 검색으로 전환`);
        }
      }

      // 2. 가능한 썸네일 경로들 순차 확인
      console.log(`🔍 [${bookName}] 자동 썸네일 검색 시작`);
      const possiblePaths = generateThumbnailPaths(book.pdfPath);
      
      for (let i = 0; i < possiblePaths.length; i++) {
        const path = possiblePaths[i];
        console.log(`🎯 [${bookName}] ${i + 1}/${possiblePaths.length} 검사 중: ${path}`);
        setDebugInfo(`검사 중 (${i + 1}/${possiblePaths.length}): ${path.split('/').pop()}`);
        
        const exists = await checkImageExists(path);
        if (exists) {
          console.log(`🎉 [${bookName}] 썸네일 발견! ${path}`);
          setThumbnailPath(path);
          setIsSearching(false);
          setDebugInfo(`썸네일 발견: ${path.split('/').pop()}`);
          if (onThumbnailGenerated) {
            onThumbnailGenerated(book.id, path);
          }
          return;
        }
        
        // 0.1초 대기 (너무 빠른 요청 방지)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 3. 모든 경로에서 실패
      console.log(`😞 [${bookName}] 썸네일을 찾을 수 없습니다.`);
      console.log(`📂 확인된 경로: ${possiblePaths.length}개`);
      console.log(`📋 실제 썸네일 폴더 내용을 확인해주세요: /public/thumbnails/`);
      console.log(`🔗 직접 테스트: http://localhost:5173/pdf-ebook-viewer/thumbnails/${book.pdfPath.split('/').pop()?.replace('.pdf', '')}_1.png`);
      
      setThumbnailPath(null);
      setIsSearching(false);
      setDebugInfo('썸네일 없음 - 콘솔 확인');
    };

    findThumbnail();
  }, [book.pdfPath, book.coverImage, book.id, onThumbnailGenerated]);

  // 썸네일 검색 중
  if (isSearching) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 border border-blue-200">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-xs text-blue-600 text-center px-2">썸네일 검색 중...</span>
        <span className="text-xs text-blue-400 mt-1 text-center px-2">{debugInfo}</span>
      </div>
    );
  }

  // 썸네일이 있는 경우
  if (thumbnailPath && !imageError) {
    return (
      <div className="w-full h-full relative">
        <img 
          src={thumbnailPath} 
          alt={book.title}
          className="w-full h-full object-cover"
          onError={() => {
            console.log(`❌ 이미지 로드 실패: ${thumbnailPath}`);
            setImageError(true);
            setDebugInfo('이미지 로드 실패');
          }}
          onLoad={() => {
            console.log(`✅ 이미지 로드 성공: ${thumbnailPath}`);
            // 로드 성공시 다시 한번 부모에게 알림 (중복 방지를 위해 확인)
            if (onThumbnailGenerated && thumbnailPath) {
              onThumbnailGenerated(book.id, thumbnailPath);
            }
          }}
        />
        {/* 개발 모드에서 디버그 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-75 text-white text-xs p-1">
            ✅ {thumbnailPath.split('/').pop()}
          </div>
        )}
      </div>
    );
  }

  // 썸네일 없음 또는 로드 실패
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100 text-red-400 border border-red-200">
      <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
      </svg>
      <span className="text-xs text-center px-2 font-medium">표지 없음</span>
      <span className="text-xs text-red-300 mt-1 text-center px-2 break-all">
        {debugInfo}
      </span>
      {process.env.NODE_ENV === 'development' && (
        <>
          <span className="text-xs text-red-300 mt-1 text-center px-2 break-all">
            파일: {book.pdfPath.split('/').pop()?.replace('.pdf', '')}
          </span>
          <button 
            className="text-xs text-red-500 mt-1 underline"
            onClick={() => {
              const testUrl = `http://localhost:5173/pdf-ebook-viewer/thumbnails/${book.pdfPath.split('/').pop()?.replace('.pdf', '')}_1.png`;
              window.open(testUrl, '_blank');
            }}
          >
            직접 테스트
          </button>
        </>
      )}
    </div>
  );
};

export default AutoThumbnail;
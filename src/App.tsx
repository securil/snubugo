import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBookStore } from './store/bookStore';
import BookList from './components/BookList';
import MagazineList from './components/MagazineList';
import MagazineViewer from './components/MagazineViewer';
import PdfTest from './components/PdfTest';
import Header from './components/Header';
import { Book, Magazine, MagazineData } from './types';

function App() {
  const { setBooks, setMagazines, setSettings } = useBookStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 정적 데이터만 로드 (PDF 분석 제거)
    const loadStaticData = async () => {
      try {
        // 동창회보 데이터 로드
        const magazineResponse = await fetch('/pdf-ebook-viewer/magazines.json');
        const magazineData: MagazineData = await magazineResponse.json();
        
        setSettings(magazineData.settings);
        setMagazines(magazineData.magazines); // 정적 데이터 그대로 사용

        // 기존 책 데이터도 로드 (하위 호환성을 위해)
        try {
          const bookResponse = await fetch('/pdf-ebook-viewer/metadata.json');
          const bookData = await bookResponse.json();
          
          if (bookData.books) {
            setBooks(bookData.books); // 정적 데이터 그대로 사용
          }
        } catch (bookError) {
          console.log('metadata.json 파일이 없습니다 (동창회보만 사용)');
          setBooks([]); // 빈 배열로 설정
        }

      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaticData();
  }, [setBooks, setMagazines, setSettings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">동창회보 로딩 중...</h2>
          <p className="text-gray-500">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<MagazineList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/test" element={<PdfTest />} />
          <Route path="/viewer/:bookId" element={<MagazineViewer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
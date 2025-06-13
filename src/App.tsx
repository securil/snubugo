import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBookStore } from './store/bookStore';
import BookList from './components/BookList';
import MagazineList from './components/MagazineList';
import MagazineViewer from './components/MagazineViewer';
import Header from './components/Header';
import { extractPdfInfo, getPdfFileSize } from './utils/pdfUtils';
import { Book, Magazine, MagazineData } from './types';

function App() {
  const { setBooks, setMagazines, setSettings } = useBookStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 동창회보 데이터와 기존 책 데이터를 모두 로드
    const loadAllData = async () => {
      try {
        // 동창회보 데이터 로드
        const magazineResponse = await fetch('/pdf-ebook-viewer/magazines.json');
        const magazineData: MagazineData = await magazineResponse.json();
        
        setSettings(magazineData.settings);
        
        // 각 매거진의 PDF 정보를 실제로 추출하여 업데이트
        const updatedMagazines: Magazine[] = [];
        
        for (const magazine of magazineData.magazines) {
          try {
            // PDF 정보 추출
            const pdfInfo = await extractPdfInfo(magazine.pdfPath);
            const fileSize = await getPdfFileSize(magazine.pdfPath);
            
            // 추출된 정보로 매거진 데이터 업데이트
            const updatedMagazine: Magazine = {
              ...magazine,
              title: pdfInfo?.title || magazine.title,
              pageCount: pdfInfo?.numPages || magazine.pageCount,
              fileSize: fileSize,
              publishDate: pdfInfo?.creationDate 
                ? new Date(pdfInfo.creationDate).toISOString().split('T')[0]
                : magazine.publishDate,
            };
            
            updatedMagazines.push(updatedMagazine);
            
          } catch (pdfError) {
            console.error(`매거진 PDF 정보 추출 실패 (${magazine.title}):`, pdfError);
            // PDF 정보 추출에 실패해도 기본 정보는 유지
            updatedMagazines.push(magazine);
          }
        }
        
        setMagazines(updatedMagazines);

        // 기존 책 데이터도 로드 (하위 호환성을 위해)
        try {
          const bookResponse = await fetch('/pdf-ebook-viewer/metadata.json');
          const bookData = await bookResponse.json();
          
          if (bookData.books) {
            const updatedBooks: Book[] = [];
            
            for (const book of bookData.books) {
              try {
                const pdfInfo = await extractPdfInfo(book.pdfPath);
                const fileSize = await getPdfFileSize(book.pdfPath);
                
                const updatedBook: Book = {
                  ...book,
                  title: pdfInfo?.title || book.title,
                  author: pdfInfo?.author || book.author,
                  description: pdfInfo?.subject || book.description,
                  pageCount: pdfInfo?.numPages || book.pageCount,
                  fileSize: fileSize,
                  publishDate: pdfInfo?.creationDate 
                    ? new Date(pdfInfo.creationDate).toISOString().split('T')[0]
                    : book.publishDate,
                  tags: [
                    ...book.tags,
                    ...(pdfInfo?.creator && pdfInfo.creator !== 'Unknown' ? [pdfInfo.creator] : []),
                    ...(pdfInfo?.producer && pdfInfo.producer !== 'Unknown' ? [pdfInfo.producer] : []),
                  ].filter((tag, index, array) => array.indexOf(tag) === index),
                };
                
                updatedBooks.push(updatedBook);
                
              } catch (pdfError) {
                console.error(`책 PDF 정보 추출 실패 (${book.title}):`, pdfError);
                updatedBooks.push(book);
              }
            }
            
            setBooks(updatedBooks);
          }
        } catch (bookError) {
          console.log('기존 책 데이터 로드 실패 (정상적인 상황일 수 있음):', bookError);
          setBooks([]);
        }
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        
        // 오류 시 기본 샘플 데이터 사용
        const sampleMagazines: Magazine[] = [
          {
            id: 'sample-magazine',
            year: 2025,
            season: '여름',
            issue: 131,
            month: 6,
            title: '2025년 여름호 동창회보',
            description: '서울사대부고 동창회 소식지입니다.',
            coverImage: 'auto-generated',
            pdfPath: '/pdf-ebook-viewer/pdfs/sample.pdf',
            pageCount: 0,
            publishDate: '2025-06-01',
            fileSize: '알 수 없음',
            isLatest: true,
            featured: true,
            tags: ['동창회보', '2025', '여름호'],
            category: '동창회보'
          }
        ];
        setMagazines(sampleMagazines);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [setBooks, setMagazines, setSettings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">PDF 정보를 분석중입니다...</h2>
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
          <Route path="/viewer/:bookId" element={<MagazineViewer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBookStore } from './store/bookStore';
import BookList from './components/BookList';
import PDFViewer from './components/PDFViewer';
import Header from './components/Header';
import { extractPdfInfo, getPdfFileSize } from './utils/pdfUtils';
import { Book } from './types';

function App() {
  const { setBooks } = useBookStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // metadata.json에서 책 정보 로드 및 PDF 정보 자동 추출
    const loadBooks = async () => {
      try {
        const response = await fetch('/pdf-ebook-viewer/metadata.json');
        const data = await response.json();
        
        // 각 책의 PDF 정보를 실제로 추출하여 업데이트
        const updatedBooks: Book[] = [];
        
        for (const book of data.books) {
          try {
            // PDF 정보 추출
            const pdfInfo = await extractPdfInfo(book.pdfPath);
            const fileSize = await getPdfFileSize(book.pdfPath);
            
            // 추출된 정보로 책 데이터 업데이트
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
              ].filter((tag, index, array) => array.indexOf(tag) === index), // 중복 제거
            };
            
            updatedBooks.push(updatedBook);
            
          } catch (pdfError) {
            console.error(`PDF 정보 추출 실패 (${book.title}):`, pdfError);
            // PDF 정보 추출에 실패해도 기본 정보는 유지
            updatedBooks.push(book);
          }
        }
        
        setBooks(updatedBooks);
        
      } catch (error) {
        console.error('책 정보를 로드하는데 실패했습니다:', error);
        // 오류 시 기본 샘플 데이터 사용
        const sampleBooks = [
          {
            id: 'sample-1',
            title: 'React 개발 가이드',
            author: '김개발',
            description: 'React를 이용한 모던 웹 개발에 대한 종합 가이드입니다.',
            coverImage: '/pdf-ebook-viewer/covers/react-guide.svg',
            pdfPath: '/pdf-ebook-viewer/pdfs/react-guide.pdf',
            pageCount: 3,
            category: '기술',
            publishDate: '2024-01-01',
            tags: ['React', 'TypeScript'],
            fileSize: '2.5MB'
          }
        ];
        setBooks(sampleBooks);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [setBooks]);

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
          <Route path="/" element={<BookList />} />
          <Route path="/viewer/:bookId" element={<PDFViewer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

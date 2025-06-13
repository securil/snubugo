import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBookStore } from './store/bookStore';
import BookList from './components/BookList';
import PDFViewer from './components/PDFViewer';
import Header from './components/Header';

function App() {
  const { setBooks } = useBookStore();

  useEffect(() => {
    // metadata.json에서 책 정보 로드
    const loadBooks = async () => {
      try {
        const response = await fetch('/pdf-ebook-viewer/metadata.json');
        const data = await response.json();
        setBooks(data.books);
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
      }
    };

    loadBooks();
  }, [setBooks]);

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

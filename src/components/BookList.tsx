import React from 'react';
import { Link } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { BookOpen, Calendar, Tag, FileText } from 'lucide-react';

const BookList: React.FC = () => {
  const { books } = useBookStore();

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">책이 없습니다</h2>
        <p className="text-gray-500">PDF 파일을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">나의 도서관</h1>
        <p className="text-gray-600">{books.length}권의 책이 있습니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="flex flex-col items-center text-gray-400">
                <BookOpen size={48} />
                <span className="text-sm mt-2">표지 없음</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500 line-clamp-2">{book.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <FileText size={14} />
                  <span>{book.pageCount}페이지</span>
                </div>
                {book.fileSize && (
                  <div className="flex items-center space-x-1">
                    <span>{book.fileSize}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar size={14} />
                <span>{book.publishDate}</span>
              </div>

              {book.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {book.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to={`/viewer/${book.id}`}
                className="btn-primary w-full text-center block"
              >
                읽기 시작
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;

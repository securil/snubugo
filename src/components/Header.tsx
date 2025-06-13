import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';
import { useBookStore } from '../store/bookStore';

const Header: React.FC = () => {
  const { currentBook } = useBookStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <BookOpen size={24} />
            <h1 className="text-xl font-bold">PDF 이북 뷰어</h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {currentBook && (
              <span className="text-sm text-gray-600">
                현재 읽는 책: <span className="font-medium">{currentBook.title}</span>
              </span>
            )}
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home size={20} />
              <span>홈</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

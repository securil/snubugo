import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, Library } from 'lucide-react';
import { useBookStore } from '../store/bookStore';

const Header: React.FC = () => {
  const { currentBook, currentMagazine, settings } = useBookStore();
  
  const currentItem = currentMagazine || currentBook;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700">
            <BookOpen size={28} />
            <div>
              <h1 className="text-xl font-bold">
                {settings?.title || '서울사대부고 동창회보'}
              </h1>
              <p className="text-xs text-gray-500">
                {settings?.subtitle || 'Alumni Magazine'}
              </p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            {currentItem && (
              <div className="hidden md:block text-sm text-gray-600">
                <span className="text-gray-500">현재 읽는 중:</span>
                <span className="font-medium ml-2">
                  {currentMagazine ? 
                    `${currentMagazine.year}년 ${currentMagazine.season}호` : 
                    currentItem.title
                  }
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home size={20} />
                <span className="hidden sm:inline">동창회보</span>
              </Link>
              
              <Link 
                to="/books" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Library size={20} />
                <span className="hidden sm:inline">기타 도서</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

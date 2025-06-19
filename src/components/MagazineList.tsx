import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { Calendar, FileText, Download, Star, Clock } from 'lucide-react';
import AutoThumbnail from './AutoThumbnail';
import { Magazine } from '../types';

const MagazineList: React.FC = () => {
  const { magazines, settings } = useBookStore();
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedSeason, setSelectedSeason] = useState<string | 'all'>('all');

  // 연도별, 계절별 필터링
  const filteredMagazines = magazines.filter(magazine => {
    const yearMatch = selectedYear === 'all' || magazine.year === selectedYear;
    const seasonMatch = selectedSeason === 'all' || magazine.season === selectedSeason;
    return yearMatch && seasonMatch;
  });

  // 연도 목록 생성 (최신년도부터)
  const availableYears = [...new Set(magazines.map(m => m.year))].sort((a, b) => b - a);
  const availableSeasons = settings?.seasons ? Object.values(settings.seasons) : [];

  // 최신호와 추천호 분리
  const latestMagazine = filteredMagazines.find(m => m.isLatest);
  const featuredMagazines = filteredMagazines.filter(m => m.featured && !m.isLatest);
  const regularMagazines = filteredMagazines.filter(m => !m.isLatest && !m.featured);

  const getSeasonColor = (season: string) => {
    const colors = {
      '봄': 'bg-green-100 text-green-800 border-green-200',
      '여름': 'bg-orange-100 text-orange-800 border-orange-200', 
      '가을': 'bg-amber-100 text-amber-800 border-amber-200',
      '겨울': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[season as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const MagazineCard: React.FC<{ magazine: Magazine; isLatest?: boolean; isFeatured?: boolean }> = ({ 
    magazine, 
    isLatest = false, 
    isFeatured = false 
  }) => (
    <div className={`card hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
      isLatest ? 'ring-2 ring-blue-500 shadow-lg' : isFeatured ? 'ring-1 ring-orange-400' : ''
    }`}>
      {/* 상태 배지 */}
      {isLatest && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <Star size={14} className="mr-1" />
            최신호
          </span>
        </div>
      )}
      {isFeatured && !isLatest && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            추천
          </span>
        </div>
      )}

      {/* 표지 이미지 */}
      <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
        <AutoThumbnail 
          book={{
            id: magazine.id,
            title: magazine.title,
            author: '서울사대부고 동창회',
            description: magazine.description,
            coverImage: magazine.coverImage,
            pdfPath: magazine.pdfPath,
            pageCount: magazine.pageCount,
            category: magazine.category,
            publishDate: magazine.publishDate,
            tags: magazine.tags,
            fileSize: magazine.fileSize
          }}
        />
        
        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/viewer/${magazine.id}`}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              📖 읽기
            </Link>
          </div>
        </div>
      </div>

      {/* 내용 정보 */}
      <div className="space-y-3">
        {/* 제목과 호수 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeasonColor(magazine.season)}`}>
              {magazine.year}년 {magazine.season}호
            </span>
            <span className="text-sm font-mono text-gray-500">#{magazine.issue}</span>
          </div>
          <h3 className="font-bold text-lg text-gray-800 leading-tight">
            {magazine.year}년 {magazine.season}호
          </h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{magazine.description}</p>

        {/* 메타 정보 */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{new Date(magazine.publishDate).toLocaleDateString('ko-KR')}</span>
            </div>
            {magazine.pageCount > 0 && (
              <div className="flex items-center space-x-1">
                <FileText size={14} />
                <span>{magazine.pageCount}페이지</span>
              </div>
            )}
          </div>
          
          {magazine.fileSize && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Download size={14} />
                <span>{magazine.fileSize}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Clock size={12} />
                <span>약 {Math.max(1, Math.ceil((magazine.pageCount || 0) / 5))}분 소요</span>
              </div>
            </div>
          )}
        </div>

        {/* 태그 */}
        {magazine.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {magazine.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="pt-3 border-t border-gray-200">
          <Link
            to={`/viewer/${magazine.id}`}
            className="btn-primary w-full text-center block"
          >
            {isLatest ? '최신호 읽기' : '읽기 시작'}
          </Link>
        </div>
      </div>
    </div>
  );

  if (magazines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">동창회보가 준비 중입니다</h2>
        <p className="text-gray-500">곧 동창회 소식지를 만나보실 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* 헤더 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {settings?.title || '서울사대부고 동창회보'}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {settings?.subtitle || 'Seoul National University High School Alumni Magazine'}
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {settings?.description || '서울대학교 사범대학 부설고등학교 동창회에서 발행하는 공식 소식지입니다.'}
        </p>
      </div>

      {/* 필터 */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">연도:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">전체</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">계절:</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">전체</option>
              {availableSeasons.map(season => (
                <option key={season} value={season}>{season}호</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            총 {filteredMagazines.length}권의 동창회보
          </div>
        </div>
      </div>

      {/* 최신호 섹션 */}
      {latestMagazine && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Star className="mr-2 text-blue-500" />
            최신호
          </h2>
          <div className="max-w-md mx-auto">
            <MagazineCard magazine={latestMagazine} isLatest />
          </div>
        </div>
      )}

      {/* 추천호 섹션 */}
      {featuredMagazines.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">추천 동창회보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMagazines.map((magazine) => (
              <MagazineCard key={magazine.id} magazine={magazine} isFeatured />
            ))}
          </div>
        </div>
      )}

      {/* 전체 동창회보 섹션 */}
      {regularMagazines.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">전체 동창회보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularMagazines.map((magazine) => (
              <MagazineCard key={magazine.id} magazine={magazine} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazineList;

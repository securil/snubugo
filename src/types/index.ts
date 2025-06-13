export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pdfPath: string;
  pageCount: number;
  category: string;
  publishDate: string;
  tags: string[];
  fileSize?: string;
}

export interface Magazine {
  id: string;
  year: number;
  season: string;
  issue: number;
  month: number;
  title: string;
  description: string;
  coverImage: string;
  pdfPath: string;
  pageCount: number;
  publishDate: string;
  fileSize: string;
  isLatest: boolean;
  featured: boolean;
  tags: string[];
  category: string;
}

export interface MagazineSettings {
  title: string;
  subtitle: string;
  description: string;
  startYear: number;
  publishMonths: number[];
  seasons: Record<string, string>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
}

export interface MagazineData {
  magazines: Magazine[];
  settings: MagazineSettings;
}

export interface ViewerState {
  currentPage: number;
  totalPages: number;
  scale: number;
  isFullscreen: boolean;
  isLoading: boolean;
  viewMode: 'single' | 'double'; // 단일 페이지 또는 2페이지 보기
  spreadMode: boolean; // 스프레드 모드 (2페이지를 하나의 큰 이미지로)
}

export interface BookStore {
  books: Book[];
  magazines: Magazine[];
  settings: MagazineSettings | null;
  currentBook: Book | null;
  currentMagazine: Magazine | null;
  viewerState: ViewerState;
  setBooks: (books: Book[]) => void;
  setMagazines: (magazines: Magazine[]) => void;
  setSettings: (settings: MagazineSettings) => void;
  setCurrentBook: (book: Book | null) => void;
  setCurrentMagazine: (magazine: Magazine | null) => void;
  updateViewerState: (state: Partial<ViewerState>) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleViewMode: () => void;
  setViewMode: (mode: 'single' | 'double') => void;
}

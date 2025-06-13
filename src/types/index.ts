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

export interface ViewerState {
  currentPage: number;
  totalPages: number;
  scale: number;
  isFullscreen: boolean;
  isLoading: boolean;
}

export interface BookStore {
  books: Book[];
  currentBook: Book | null;
  viewerState: ViewerState;
  setBooks: (books: Book[]) => void;
  setCurrentBook: (book: Book | null) => void;
  updateViewerState: (state: Partial<ViewerState>) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

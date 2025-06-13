import { create } from 'zustand';
import { BookStore, Book, Magazine, MagazineSettings, ViewerState } from '../types';

const initialViewerState: ViewerState = {
  currentPage: 1,
  totalPages: 0,
  scale: 1.0,
  isFullscreen: false,
  isLoading: false,
  viewMode: 'single',
  spreadMode: false,
};

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  magazines: [],
  settings: null,
  currentBook: null,
  currentMagazine: null,
  viewerState: initialViewerState,

  setBooks: (books: Book[]) => set({ books }),
  
  setMagazines: (magazines: Magazine[]) => set({ magazines }),
  
  setSettings: (settings: MagazineSettings) => set({ settings }),
  
  setCurrentBook: (book: Book | null) => 
    set({ 
      currentBook: book,
      currentMagazine: null,
      viewerState: { ...initialViewerState }
    }),

  setCurrentMagazine: (magazine: Magazine | null) => 
    set({ 
      currentMagazine: magazine,
      currentBook: null,
      viewerState: { ...initialViewerState }
    }),

  updateViewerState: (state: Partial<ViewerState>) =>
    set((prev) => ({
      viewerState: { ...prev.viewerState, ...state }
    })),

  nextPage: () => {
    const { viewerState } = get();
    const increment = viewerState.viewMode === 'double' ? 2 : 1;
    if (viewerState.currentPage + increment <= viewerState.totalPages) {
      set((prev) => ({
        viewerState: {
          ...prev.viewerState,
          currentPage: prev.viewerState.currentPage + increment
        }
      }));
    }
  },

  prevPage: () => {
    const { viewerState } = get();
    const decrement = viewerState.viewMode === 'double' ? 2 : 1;
    if (viewerState.currentPage - decrement >= 1) {
      set((prev) => ({
        viewerState: {
          ...prev.viewerState,
          currentPage: Math.max(1, prev.viewerState.currentPage - decrement)
        }
      }));
    }
  },

  goToPage: (page: number) => {
    const { viewerState } = get();
    if (page >= 1 && page <= viewerState.totalPages) {
      set((prev) => ({
        viewerState: {
          ...prev.viewerState,
          currentPage: page
        }
      }));
    }
  },

  zoomIn: () => {
    const { viewerState } = get();
    const newScale = Math.min(viewerState.scale + 0.25, 3.0);
    set((prev) => ({
      viewerState: {
        ...prev.viewerState,
        scale: newScale
      }
    }));
  },

  zoomOut: () => {
    const { viewerState } = get();
    const newScale = Math.max(viewerState.scale - 0.25, 0.5);
    set((prev) => ({
      viewerState: {
        ...prev.viewerState,
        scale: newScale
      }
    }));
  },

  resetZoom: () => {
    set((prev) => ({
      viewerState: {
        ...prev.viewerState,
        scale: 1.0
      }
    }));
  },

  toggleViewMode: () => {
    set((prev) => ({
      viewerState: {
        ...prev.viewerState,
        viewMode: prev.viewerState.viewMode === 'single' ? 'double' : 'single',
        currentPage: prev.viewerState.viewMode === 'single' 
          ? Math.max(1, prev.viewerState.currentPage - 1) // double에서 single로 갈 때
          : prev.viewerState.currentPage % 2 === 0 ? prev.viewerState.currentPage - 1 : prev.viewerState.currentPage // single에서 double로 갈 때 홀수 페이지로
      }
    }));
  },

  setViewMode: (mode: 'single' | 'double') => {
    set((prev) => ({
      viewerState: {
        ...prev.viewerState,
        viewMode: mode,
        currentPage: mode === 'double' && prev.viewerState.currentPage % 2 === 0 
          ? Math.max(1, prev.viewerState.currentPage - 1)
          : prev.viewerState.currentPage
      }
    }));
  },
}));

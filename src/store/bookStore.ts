import { create } from 'zustand';
import { BookStore, Book, ViewerState } from '../types';

const initialViewerState: ViewerState = {
  currentPage: 1,
  totalPages: 0,
  scale: 1.0,
  isFullscreen: false,
  isLoading: false,
};

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  currentBook: null,
  viewerState: initialViewerState,

  setBooks: (books: Book[]) => set({ books }),
  
  setCurrentBook: (book: Book | null) => 
    set({ 
      currentBook: book,
      viewerState: { ...initialViewerState }
    }),

  updateViewerState: (state: Partial<ViewerState>) =>
    set((prev) => ({
      viewerState: { ...prev.viewerState, ...state }
    })),

  nextPage: () => {
    const { viewerState } = get();
    if (viewerState.currentPage < viewerState.totalPages) {
      set((prev) => ({
        viewerState: {
          ...prev.viewerState,
          currentPage: prev.viewerState.currentPage + 1
        }
      }));
    }
  },

  prevPage: () => {
    const { viewerState } = get();
    if (viewerState.currentPage > 1) {
      set((prev) => ({
        viewerState: {
          ...prev.viewerState,
          currentPage: prev.viewerState.currentPage - 1
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
}));

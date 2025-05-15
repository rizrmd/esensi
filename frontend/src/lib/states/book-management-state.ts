import { proxy } from "valtio";

export interface BookState {
  // List view
  books: any[];
  loading: boolean;
  error: string | null;
  success: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  searchQuery: string;
  statusFilter: string;
  
  // Book detail
  currentBook: any;
  
  // Form submission
  submitting: boolean;
}

export const bookWrite = proxy<BookState>({
  books: [],
  loading: true,
  error: null,
  success: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  searchQuery: "",
  statusFilter: "all",
  currentBook: null,
  submitting: false,
});

export const bookRead = bookWrite;

export const bookState = {
  reset() {
    bookWrite.books = [];
    bookWrite.loading = true;
    bookWrite.error = null;
    bookWrite.success = null;
    bookWrite.page = 1;
    bookWrite.limit = 10;
    bookWrite.total = 0;
    bookWrite.totalPages = 0;
    bookWrite.searchQuery = "";
    bookWrite.statusFilter = "all";
    bookWrite.currentBook = null;
    bookWrite.submitting = false;
  },
  
  setError(error: string) {
    bookWrite.error = error;
    bookWrite.success = null;
  },
  
  setSuccess(message: string) {
    bookWrite.success = message;
    bookWrite.error = null;
  },
  
  clearMessages() {
    bookWrite.success = null;
    bookWrite.error = null;
  }
};

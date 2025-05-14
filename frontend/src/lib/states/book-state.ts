import { proxy } from "valtio";

interface BookProcessState {
  // Book data fields
  title: string;
  description: string;
  categories: { label: string; value: string }[];
  coverImage: File | null;
  coverImagePreview: string;
  price: string;
  contentFile: File | null;
  contentFileName: string;
  isUsingAI: boolean;

  // Form-specific error (e.g., validation error in BookForm or BookContent)
  formError: string;

  // Page lifecycle fields for create-book.tsx
  activeTab: string;
  pageLoading: boolean;
  pageSaving: boolean;
  pageError: string; // Errors related to publishing process, session errors etc.
  pageSuccessMessage: string;
}

const initialBookProcessState: BookProcessState = {
  title: "",
  description: "",
  categories: [],
  coverImage: null,
  coverImagePreview: "",
  price: "",
  contentFile: null,
  contentFileName: "",
  isUsingAI: false,
  formError: "",
  activeTab: "info", // Default active tab
  pageLoading: true, // Initial loading state
  pageSaving: false,
  pageError: "",
  pageSuccessMessage: "",
};

export const bookProcessWrite = proxy<BookProcessState>({ ...initialBookProcessState });

export const bookProcessState = {
  write: bookProcessWrite,
  reset(data?: Partial<BookProcessState>) {
    const currentPageLoading = bookProcessWrite.pageLoading;
    const currentActiveTab = bookProcessWrite.activeTab;

    Object.assign(bookProcessWrite, initialBookProcessState);

    if (data) {
      Object.assign(bookProcessWrite, data);
    } else {
      // If no data is provided for reset, ensure pageLoading and activeTab are truly reset to initial
      bookProcessWrite.pageLoading = initialBookProcessState.pageLoading;
      bookProcessWrite.activeTab = initialBookProcessState.activeTab;
    }

    // Special handling if data is provided but these specific fields are not
    if (data && typeof data.pageLoading === 'undefined') {
        bookProcessWrite.pageLoading = currentPageLoading;
    }
    if (data && typeof data.activeTab === 'undefined') {
        bookProcessWrite.activeTab = currentActiveTab;
    }
  },
  setFormError(message: string) {
    bookProcessWrite.formError = message;
  },
  clearFormError() {
    bookProcessWrite.formError = "";
  },
  setPageError(message: string) {
    bookProcessWrite.pageError = message;
    bookProcessWrite.pageSuccessMessage = ""; // Clear success if error occurs
  },
  clearPageError() {
    bookProcessWrite.pageError = "";
  },
  setPageSuccessMessage(message: string) {
    bookProcessWrite.pageSuccessMessage = message;
    bookProcessWrite.pageError = ""; // Clear error if success occurs
  },
  clearPageSuccessMessage() {
    bookProcessWrite.pageSuccessMessage = "";
  }
};

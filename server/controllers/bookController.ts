import { Request, Response } from 'express';
import Book from '../models/Book';
import Borrow from '../models/Borrow';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Librarian
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;
    
    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      return sendResponse(res, 400, false, 'Book with this ISBN already exists');
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity,
      availableQuantity: quantity,
    });

    sendResponse(res, 201, true, 'Book created successfully', book);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Private (Member & Librarian)
export const getBooks = async (req: Request, res: Response) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const books = await Book.find(query).skip(skip).limit(limitNumber);
    const total = await Book.countDocuments(query);

    sendResponse(res, 200, true, 'Books retrieved successfully', {
      books,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private (Member & Librarian)
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }
    sendResponse(res, 200, true, 'Book retrieved successfully', book);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Librarian
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    const { quantity } = req.body;
    
    // Adjust availableQuantity if total quantity changes
    let newAvailableQuantity = book.availableQuantity;
    if (quantity !== undefined && quantity !== book.quantity) {
      const diff = quantity - book.quantity;
      newAvailableQuantity = book.availableQuantity + diff;
      
      if (newAvailableQuantity < 0) {
        return sendResponse(res, 400, false, 'Cannot reduce quantity below currently borrowed amount');
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, availableQuantity: newAvailableQuantity },
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, true, 'Book updated successfully', updatedBook);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Librarian
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    // Check if book is currently borrowed
    if (book.quantity !== book.availableQuantity) {
      return sendResponse(res, 400, false, 'Cannot delete book as there are active borrowings');
    }

    await book.deleteOne();
    sendResponse(res, 200, true, 'Book deleted successfully');
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Private/Member
export const borrowBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }
    
    if (book.availableQuantity <= 0) {
      return sendResponse(res, 400, false, 'Book is currently unavailable');
    }

    // Check if user already borrowed this book and hasn't returned it
    const activeBorrow = await Borrow.findOne({
      memberId: req.user._id,
      bookId: book._id,
      status: 'borrowed'
    });

    if (activeBorrow) {
      return sendResponse(res, 400, false, 'You have already borrowed this book');
    }

    // Create borrow record
    const borrow = await Borrow.create({
      memberId: req.user._id,
      bookId: book._id,
    });

    // Decrease available quantity
    book.availableQuantity -= 1;
    await book.save();

    sendResponse(res, 200, true, 'Book borrowed successfully', borrow);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Private/Member
export const returnBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    // Find active borrow record
    const activeBorrow = await Borrow.findOne({
      memberId: req.user._id,
      bookId: book._id,
      status: 'borrowed'
    });

    if (!activeBorrow) {
      return sendResponse(res, 400, false, 'You have not borrowed this book or already returned it');
    }

    // Update borrow record
    activeBorrow.status = 'returned';
    activeBorrow.returnDate = new Date();
    await activeBorrow.save();

    // Increase available quantity
    book.availableQuantity += 1;
    await book.save();

    sendResponse(res, 200, true, 'Book returned successfully', activeBorrow);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

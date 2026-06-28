import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
} from '../controllers/bookController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/role';
import { validateBook, validateBookUpdate } from '../validators/bookValidator';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('member', 'librarian'), getBooks)
  .post(protect, authorize('librarian'), validateBook, createBook);

router
  .route('/:id')
  .get(protect, authorize('member', 'librarian'), getBookById)
  .put(protect, authorize('librarian'), validateBookUpdate, updateBook)
  .delete(protect, authorize('librarian'), deleteBook);

router.post('/:id/borrow', protect, authorize('member'), borrowBook);
router.post('/:id/return', protect, authorize('member'), returnBook);

export default router;

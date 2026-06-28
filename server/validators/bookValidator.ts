import { check } from 'express-validator';
import { validate } from './authValidator';

export const validateBook = [
  check('title', 'Title is required').not().isEmpty(),
  check('author', 'Author is required').not().isEmpty(),
  check('isbn', 'ISBN is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('quantity', 'Quantity must be a positive number').isInt({ min: 0 }),
  validate,
];

export const validateBookUpdate = [
  check('title', 'Title must not be empty').optional().not().isEmpty(),
  check('author', 'Author must not be empty').optional().not().isEmpty(),
  check('isbn', 'ISBN must not be empty').optional().not().isEmpty(),
  check('category', 'Category must not be empty').optional().not().isEmpty(),
  check('quantity', 'Quantity must be a positive number').optional().isInt({ min: 0 }),
  validate,
];

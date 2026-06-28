import { Request, Response } from 'express';
import User from '../models/User';
import Borrow from '../models/Borrow';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Librarian
export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password');
    sendResponse(res, 200, true, 'Members retrieved successfully', members);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private/Librarian
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const member = await User.findOne({ _id: req.params.id, role: 'member' });
    
    if (!member) {
      return sendResponse(res, 404, false, 'Member not found');
    }

    // Check if member has active borrowings
    const activeBorrowings = await Borrow.findOne({
      memberId: member._id,
      status: 'borrowed'
    });

    if (activeBorrowings) {
      return sendResponse(res, 400, false, 'Cannot delete member with active borrowed books');
    }

    await member.deleteOne();
    sendResponse(res, 200, true, 'Member deleted successfully');
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Get my borrowed books
// @route   GET /api/members/me/books
// @access  Private/Member
export const getMyBooks = async (req: AuthRequest, res: Response) => {
  try {
    const borrowings = await Borrow.find({ memberId: req.user._id })
      .populate('bookId', 'title author isbn category')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'Borrowed books retrieved successfully', borrowings);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

import express from 'express';
import { getMembers, deleteMember, getMyBooks } from '../controllers/memberController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/role';

const router = express.Router();

router.get('/', protect, authorize('librarian'), getMembers);
router.delete('/:id', protect, authorize('librarian'), deleteMember);
router.get('/me/books', protect, authorize('member'), getMyBooks);

export default router;

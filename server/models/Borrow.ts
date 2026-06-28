import mongoose, { Document, Schema } from 'mongoose';

export interface IBorrow extends Document {
  memberId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  borrowDate: Date;
  returnDate: Date | null;
  status: 'borrowed' | 'returned';
}

const borrowSchema: Schema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' },
  },
  { timestamps: true }
);

export default mongoose.model<IBorrow>('Borrow', borrowSchema);

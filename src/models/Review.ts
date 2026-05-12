import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, default: '', maxlength: 5000 },
  },
  { timestamps: true },
);

reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });
reviewSchema.index({ bookId: 1, createdAt: -1 });

export type ReviewDoc = InferSchemaType<typeof reviewSchema> & { _id: Schema.Types.ObjectId };

export const Review: Model<ReviewDoc> =
  (models.Review as Model<ReviewDoc>) || model<ReviewDoc>('Review', reviewSchema);

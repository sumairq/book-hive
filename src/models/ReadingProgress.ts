import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

export const READING_STATUSES = [
  'want_to_read',
  'currently_reading',
  'completed',
  'dropped',
] as const;
export type ReadingStatus = (typeof READING_STATUSES)[number];

const readingProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    status: { type: String, enum: READING_STATUSES, required: true, index: true },
    currentPage: { type: Number, default: 0, min: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });
readingProgressSchema.index({ userId: 1, status: 1 });

export type ReadingProgressDoc = InferSchemaType<typeof readingProgressSchema> & {
  _id: Schema.Types.ObjectId;
};

export const ReadingProgress: Model<ReadingProgressDoc> =
  (models.ReadingProgress as Model<ReadingProgressDoc>) ||
  model<ReadingProgressDoc>('ReadingProgress', readingProgressSchema);

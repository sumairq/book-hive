import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

export const ACTIVITY_TYPES = [
  'started_reading',
  'completed_book',
  'posted_note',
  'rated_book',
  'streak_milestone',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', default: null },
    noteId: { type: Schema.Types.ObjectId, ref: 'Note', default: null },
    reviewId: { type: Schema.Types.ObjectId, ref: 'Review', default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

export type ActivityDoc = InferSchemaType<typeof activitySchema> & {
  _id: Schema.Types.ObjectId;
};

export const Activity: Model<ActivityDoc> =
  (models.Activity as Model<ActivityDoc>) || model<ActivityDoc>('Activity', activitySchema);

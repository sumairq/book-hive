import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const readingGoalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    year: { type: Number, required: true, min: 1900, max: 9999 },
    targetBooks: { type: Number, required: true, min: 1 },
    targetPages: { type: Number, default: null, min: 1 },
  },
  { timestamps: true },
);

readingGoalSchema.index({ userId: 1, year: 1 }, { unique: true });

export type ReadingGoalDoc = InferSchemaType<typeof readingGoalSchema> & {
  _id: Schema.Types.ObjectId;
};

export const ReadingGoal: Model<ReadingGoalDoc> =
  (models.ReadingGoal as Model<ReadingGoalDoc>) ||
  model<ReadingGoalDoc>('ReadingGoal', readingGoalSchema);

import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const followSchema = new Schema(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true },
);

followSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

followSchema.pre('validate', function (next) {
  if (this.followerId?.equals(this.followeeId)) {
    return next(new Error('Cannot follow yourself'));
  }
  next();
});

export type FollowDoc = InferSchemaType<typeof followSchema> & { _id: Schema.Types.ObjectId };

export const Follow: Model<FollowDoc> =
  (models.Follow as Model<FollowDoc>) || model<FollowDoc>('Follow', followSchema);

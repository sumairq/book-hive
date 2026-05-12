import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

export const NOTE_VISIBILITIES = ['public', 'private'] as const;
export type NoteVisibility = (typeof NOTE_VISIBILITIES)[number];

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    content: { type: String, required: true, maxlength: 10_000 },
    visibility: { type: String, enum: NOTE_VISIBILITIES, default: 'private', index: true },
    removedByAdmin: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ bookId: 1, visibility: 1 });
noteSchema.index({ visibility: 1, createdAt: -1 });

export type NoteDoc = InferSchemaType<typeof noteSchema> & { _id: Schema.Types.ObjectId };

export const Note: Model<NoteDoc> =
  (models.Note as Model<NoteDoc>) || model<NoteDoc>('Note', noteSchema);

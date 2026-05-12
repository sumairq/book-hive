import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const bookSchema = new Schema(
  {
    openLibraryId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    authors: { type: [String], default: [] },
    coverUrl: { type: String, default: null },
    publishYear: { type: Number, default: null },
    pageCount: { type: Number, default: null, min: 0 },
    description: { type: String, default: null },
    subjects: { type: [String], default: [], index: true },
    isbn: { type: [String], default: [] },
    cachedAt: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true },
);

bookSchema.index(
  { title: 'text', authors: 'text', subjects: 'text' },
  { weights: { title: 10, authors: 5, subjects: 1 }, name: 'BookTextIndex' },
);

export type BookDoc = InferSchemaType<typeof bookSchema> & { _id: Schema.Types.ObjectId };

export const Book: Model<BookDoc> =
  (models.Book as Model<BookDoc>) || model<BookDoc>('Book', bookSchema);

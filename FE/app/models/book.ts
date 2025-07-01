import mongoose, { Schema, Document } from 'mongoose';

enum CoverType {
  Soft = 'soft',
  Hard = 'hard',
}

interface IRating extends Document {
  authorId: mongoose.Types.ObjectId;
  content: string;
  starRating: number;
}
const RatingSchema = new Schema<IRating>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
    },
    starRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

export interface IBook {
  productId: string;
  name: string;
  author: string;
  price: number;
  discount: number;
  description: string;
  provider: string;
  publisher: string;
  publishYear: number;
  language: string;
  weight: number;
  dimensionsX: number;
  dimensionsY: number;
  dimensionsZ: number;
  pageCount: number;
  coverType: CoverType;
  coverImage: string;
  images: string[];
  // genres: string[];
  category: string;
  ratings: [IRating];
  stock: number;
  imageUrl: string;
  seller: {
    userId: string;
    fullname?: string;
  }
}

const BookSchema = new Schema<IBook>(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      required: false,
    },
    publisher: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    dimensionsX: {
      type: Number,
      required: true,
    },
    dimensionsY: {
      type: Number,
      required: true,
    },
    dimensionsZ: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    coverType: {
      type: String,
      required: true,
      enum: ['soft', 'hard'],
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
      // ref: 'Genre',
    },
    ratings: {
      type: [RatingSchema],
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const BookModel =
  (mongoose.models.Book as mongoose.Model<IBook>) ||
  mongoose.model<IBook>('Book', BookSchema);

export default BookModel;

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: mongoose.Types.ObjectId;
  fullname: string;
  username: string;
  email: string;
  password: string;
  address: string;
  imageUrl: string;
  country: string;
  city: string;
  specificLocal: string;
  phoneNumber: string;
  ownedBooks: string[]; // bookId
  cart: [
    {
      bookId: mongoose.Types.ObjectId; // bookId
      quantity: number;
    },
  ];
  isAdmin: boolean;
  name: string;
  resetToken?: string;
  resetTokenExpiration?: Date | number; // Allow both Date and number (timestamp)
}

const UserSchema = new Schema<IUser>(
  {
    imageUrl:{
      type: String,
      required: false,
    },
    country:{
      type: String,
      required: false,
    },
    city:{
      type: String,
      required: false,
    },
    specificLocal:{
      type: String,
      required: false,
    },
    fullname: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    ownedBooks: [
      {
        type: String,
        ref: 'Book',
      },
    ],
    cart: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Schema.Types.Mixed, // Allow both Date and number (timestamp)
      get: (timestamp: number) => new Date(timestamp), // Custom getter for conversion
    },
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);

export default UserModel;

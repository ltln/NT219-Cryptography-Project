import mongoose, { Schema, Document } from "mongoose";

interface IGenre extends Document {
  genreId: string;
  name: string;
  description: string;
}

const GenreSchema = new Schema<IGenre>({
  genreId: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const GenreModel = mongoose.models.Genre as mongoose.Model<IGenre> || mongoose.model<IGenre>("Genre", GenreSchema);

export default GenreModel;
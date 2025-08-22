import mongoose, { Document, Model } from "mongoose";

export type mainCategoryDocument = Document & {
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  metaData?: {
    seoTitle?: string;
    seoDescription?: string;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type mainCategoryModel = Model<mainCategoryDocument> & {};

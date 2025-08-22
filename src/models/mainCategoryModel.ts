import { Schema, model } from "mongoose";
import { mainCategoryDocument, mainCategoryModel } from "../types/mainCategoryTypes";

const mainCategorySchema = new Schema<mainCategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Main category name is required"],
      unique: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metaData: {
      seoTitle: String,
      seoDescription: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // populate it in res
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// run when cod created
mainCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  next();
});

// handle update qeury
mainCategorySchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  // get updated doc
  const doc = this.getUpdate() as any;

  // { $set: { name: "New Name" } }
  if (doc.name || doc.$set?.name) {
    const newName = doc.name || doc.$set?.name;
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (doc.$set) {
      doc.$set.slug = newSlug;
    } else {
      doc.slug = newSlug;
    }
  }

  next();
});

const MainCategory = model<mainCategoryDocument, mainCategoryModel>(
  "MainCategory",
  mainCategorySchema
);

export default MainCategory;

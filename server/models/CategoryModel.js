import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9\s-]+$/.test(v);
            },
            message: 'Category name can only contain letters, numbers, spaces, and hyphens'
        }
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot be more than 200 characters'],
        trim: true
    },
    image: {
        type: String,
        default: 'default-category.jpg',
    },
    isActive: {
        type: Boolean,
        default: true
    },
    meta: {
        postCount: {
            type: Number,
            default: 0
        },
        viewCount: {
            type: Number,
            default: 0
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { 
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Update slug if name is modified
categorySchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = slugify(update.name, { lower: true, strict: true });
    }
    next();
});

// Virtual for category URL
categorySchema.virtual('url').get(function() {
    return `/categories/${this.slug}`;
});

// Virtual for posts in this category
// categorySchema.virtual('posts', {
//     ref: 'Post',
//     localField: '_id',
//     foreignField: 'categories',
//     justOne: false
// });

// Update post count when posts are added/removed from this category
// categorySchema.statics.updatePostCount = async function(categoryId) {
//     const postCount = await mongoose.model('Post').countDocuments({ categories: categoryId });
//     return this.findByIdAndUpdate(categoryId, { 'meta.postCount': postCount });
// };

const Category = mongoose.model('Category', categorySchema);
export default Category;
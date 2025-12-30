import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
    title: string;
    content: any; // Using 'any' for flexibility with Delta/JSON from editors like Tiptap/Quill
    owner: mongoose.Types.ObjectId;
    collaborators: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
    {
        title: { type: String, required: true, default: 'Untitled Document' },
        content: { type: Schema.Types.Mixed, default: '' }, // Store JSON or HTML
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const Doc = mongoose.model<IDocument>('Document', DocumentSchema);
export default Doc;

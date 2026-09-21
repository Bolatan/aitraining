import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  isAuthorized: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isAuthorized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export interface IAuthToken extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  isUsed: boolean;
  usedBy?: mongoose.Types.ObjectId;
  usedAt?: Date;
}

const AuthTokenSchema = new Schema<IAuthToken>({
  code: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  usedAt: { type: Date },
});

export const AuthToken: Model<IAuthToken> =
  mongoose.models.AuthToken || mongoose.model<IAuthToken>('AuthToken', AuthTokenSchema);

export interface ILesson {
  tag: string;
  heading: string;
  body: string;
}

export interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IModule extends Document {
  _id: mongoose.Types.ObjectId;
  order: number;
  slug: string;
  title: string;
  accentColor: string;
  estMinutes: number;
  objectives: string[];
  lessons: ILesson[];
  exercise: string;
  tip: string;
  quiz: IQuizQuestion[];
  isCapstone?: boolean;
  isToolkit?: boolean;
}

const ModuleSchema = new Schema<IModule>({
  order: { type: Number, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  accentColor: { type: String, required: true },
  estMinutes: { type: Number, required: true },
  objectives: [{ type: String }],
  lessons: [
    {
      tag: { type: String, required: true },
      heading: { type: String, required: true },
      body: { type: String, required: true },
    },
  ],
  exercise: { type: String, required: true },
  tip: { type: String, required: true },
  quiz: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswerIndex: { type: Number, required: true },
    },
  ],
  isCapstone: { type: Boolean, default: false },
  isToolkit: { type: Boolean, default: false },
});

export const ModuleModel: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

export interface IProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  quizPassed: boolean;
  quizScore?: number;
  adminApproved: boolean;
  completed: boolean;
  completedAt?: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  quizPassed: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },
  adminApproved: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

ProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export const Progress: Model<IProgress> =
  mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

export interface ICapstoneSubmission extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  proposalUrl: string;
  deckUrl: string;
  infographicUrl: string;
  appUrl: string;
  submittedAt: Date;
}

const CapstoneSubmissionSchema = new Schema<ICapstoneSubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  proposalUrl: { type: String, required: true },
  deckUrl: { type: String, required: true },
  infographicUrl: { type: String, required: true },
  appUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export const CapstoneSubmission: Model<ICapstoneSubmission> =
  mongoose.models.CapstoneSubmission ||
  mongoose.model<ICapstoneSubmission>('CapstoneSubmission', CapstoneSubmissionSchema);

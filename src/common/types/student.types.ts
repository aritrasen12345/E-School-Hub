import { HydratedDocument } from 'mongoose';
import { Student } from '../schemas';

export type StudentDocument = HydratedDocument<Student>;

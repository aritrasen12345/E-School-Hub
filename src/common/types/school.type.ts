import { HydratedDocument } from 'mongoose';
import { School } from '../schemas';

export type SchoolDocument = HydratedDocument<School>;

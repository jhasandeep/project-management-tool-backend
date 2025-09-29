import { Document, Types } from 'mongoose';
export type ProjectDocument = Project & Document;
export declare enum ProjectStatus {
    ACTIVE = "active",
    COMPLETED = "completed"
}
export declare class Project {
    _id: Types.ObjectId;
    title: string;
    description: string;
    status: ProjectStatus;
    owner: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any, {}> & Project & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Project> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;

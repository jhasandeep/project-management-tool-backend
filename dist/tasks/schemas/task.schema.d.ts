import { Document, Types } from 'mongoose';
export type TaskDocument = Task & Document;
export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in-progress",
    DONE = "done"
}
export declare class Task {
    _id: Types.ObjectId;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: Date;
    project: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task, any, {}> & Task & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Task> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;

import { ObjectId } from "mongodb";

export type MemoData = {
  _id?: string;
  text: string;
  tagMemos: {
    _id: string;
    text: string;
  }[];
  taggedMemos: {
    _id: string;
    text: string;
  }[];
  creator: string;
};

export type MemoDataSchema = {
  _id?: ObjectId;
  text: string;
  tagMemos: ObjectId[];
  creator: string;
};
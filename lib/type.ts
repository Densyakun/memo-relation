import { ObjectId } from "mongodb";

export type MemoData = {
  _id?: ObjectId;
  text: string;
};
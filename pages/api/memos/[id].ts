import type { NextApiRequest, NextApiResponse } from "next";
import { MemoData } from "@/lib/type";
import { clientPromise, DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemoData>,
) {
  const { query, method } = req;
  const id = query.id as string;

  switch (method) {
    case "GET":
      const myDB = (await clientPromise).db(DB_NAME);
      const myColl = myDB.collection<MemoData>("memos");

      const value = await myColl.findOne({ _id: new ObjectId(id) });

      res.status(200).json(value as MemoData || {});

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
import type { NextApiRequest, NextApiResponse } from "next";
import { MemoData, MemoDataSchema } from "@/lib/type";
import { clientPromise, DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { query, method } = req;
    const id = query.id as string;
    const text = query.text as string;
    const tagMemos = query["tagMemos[]"] as string | string[];

    switch (method) {
      case "GET": {
        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection<MemoDataSchema>("memos");

        const value = await myColl.findOne({ _id: new ObjectId(id) });

        if (!value) {
          res.status(404).end();
          break;
        }

        let tagMemos: MemoDataSchema[] = [];

        if (value.tagMemos)
          tagMemos = await myColl.find({
            _id: { $in: value.tagMemos },
          }).toArray();

        res.status(200).json({
          _id: value._id.toString(),
          text: value.text,
          tagMemos: tagMemos.map(memo => ({
            _id: memo._id?.toString(),
            text: memo.text,
          })) || [],
        } as MemoData);

        break;
      }
      case "PUT": {
        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection<MemoDataSchema>("memos");

        const set: any = {};
        if (text !== undefined)
          set['text'] = text;
        if (tagMemos !== undefined)
          set['tagMemos'] = Array.isArray(tagMemos) ? tagMemos.map(id => new ObjectId(id)) : [new ObjectId(tagMemos)];

        await myColl.updateOne(
          { _id: new ObjectId(id) },
          { $set: set });

        res.status(201).end();

        break;
      }
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ statusCode: 500, message: err.message });
    } else {
      res.status(500).json({ statusCode: 500 });
    }
  }
}
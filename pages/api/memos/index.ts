import { clientPromise, DB_NAME } from "@/lib/mongodb";
import { MemoData } from "@/lib/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { method } = req;
    switch (method) {
      case "GET": {
        const skip = Math.max(0, parseInt(String(req.query.skip) || "") || 0);
        const take = parseInt(String(req.query.take) || "") || 10;

        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection<MemoData>("memos");

        const cursor = myColl.find({}, {
          sort: { "_id": 1 },
          skip,
          limit: take,
        });
        const allValues = await cursor.toArray();

        res.status(200).json(allValues);

        break;
      }
      case "POST": {
        const json = JSON.parse(req.body);

        if (typeof json.text !== "string" || !(json.text as string).length) {
          res.status(400).end();
          break;
        }

        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection<MemoData>("memos");

        const doc: MemoData = {
          _id: undefined!,
          text: json.text,
        };
        const result = await myColl.insertOne(doc);

        doc._id = result.insertedId;
        res.status(201).json(doc);

        break;
      }
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ statusCode: 500, message: err.message });
    } else {
      res.status(500).json({ statusCode: 500 });
    }
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { MemoData, MemoDataSchema } from "@/lib/type";
import { clientPromise, DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

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

        if (!(!value.creator || value.creator === session?.user?.email)) {
          res.status(403).end();
          break;
        }

        let tagMemos: {
          _id: string;
          text: string;
        }[] = [];

        if (value.tagMemos)
          tagMemos = await myColl.find({
            _id: { $in: value.tagMemos },
            $or: [
              {
                creator: { $exists: false },
              },
              {
                creator: "",
              },
              {
                creator: session?.user?.email || "",
              },
            ],
          }).map(memo => ({
            _id: memo._id?.toString(),
            text: memo.text,
          })).toArray();

        let taggedMemos = await myColl.find({
          tagMemos: { $all: [value._id] },
          $or: [
            {
              creator: { $exists: false },
            },
            {
              creator: "",
            },
            {
              creator: session?.user?.email || "",
            },
          ],
        }).map(memo => ({
          _id: memo._id?.toString(),
          text: memo.text,
        })).toArray();

        res.status(200).json({
          _id: value._id.toString(),
          text: value.text,
          tagMemos: tagMemos || [],
          taggedMemos,
        } as MemoData);

        break;
      }
      case "PUT": {
        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection<MemoDataSchema>("memos");

        const set: any = {};
        if (text !== undefined)
          set['text'] = text;
        set['tagMemos'] = tagMemos === undefined
          ? []
          : Array.isArray(tagMemos) ? tagMemos.map(id => new ObjectId(id)) : [new ObjectId(tagMemos)];

        const value = await myColl.findOne({ _id: new ObjectId(id) });

        if (value && !(!value.creator || value.creator === session?.user?.email)) {
          res.status(403).end();
          break;
        }

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
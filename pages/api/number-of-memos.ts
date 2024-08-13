import type { NextApiRequest, NextApiResponse } from 'next';
import { DB_NAME, clientPromise } from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { method } = req;
    switch (method) {
      case "GET": {
        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection("memos");

        res.status(200).end(String(await myColl.countDocuments()));

        break;
      }
      default: {
        res.setHeader("Allow", ["GET"]);
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

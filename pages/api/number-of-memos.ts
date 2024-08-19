import type { NextApiRequest, NextApiResponse } from 'next';
import { DB_NAME, clientPromise } from '../../lib/mongodb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  try {
    const { method } = req;
    switch (method) {
      case "GET": {
        const myDB = (await clientPromise).db(DB_NAME);
        const myColl = myDB.collection("memos");

        res.status(200).end(String(await myColl.countDocuments({
          $or: [
            {
              creator: { $exists: false },
            },
            {
              creator: session?.user?.email || "",
            },
          ],
        })));

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

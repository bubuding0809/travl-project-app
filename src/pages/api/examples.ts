// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log(req.body);
    res.status(200).json({ message: "Success" });
  } else {
    const { q } = req.query;
    console.log(q);
    res.status(200).json({
      message: "Success",
      data: "Your query is " + q,
    });
  }
};

export default examples;

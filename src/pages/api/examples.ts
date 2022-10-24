// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log(req.body);
    res.status(200).json({ message: "Success" });
  } else {
    console.log("GET request");
    res.status(200).json("Hello World");
  }
};

export default examples;

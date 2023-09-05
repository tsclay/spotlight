// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { convertSnippetToPrism } from "@/utils/snippet";
import initPocketBase from "@/utils/_db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const formData = req.body;
  console.log(formData);
  try {
    const pb = await initPocketBase(req, res);
    formData["snippet"] = convertSnippetToPrism({ body: formData["snippet"], language: formData["language"] })
    console.log(formData)
    const newSnippet = await pb.collection("snippets").create(formData);
    console.log('here is the new snippet ', newSnippet)
    if (
      req.headers["accept"] &&
      req.headers["accept"] === "application/json"
    ) {
      return res.status(200).json(JSON.parse(JSON.stringify(newSnippet)));
    }
    res.redirect(302, "/snippets");
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: 'Something went wrong while creating record.' })
  }
}

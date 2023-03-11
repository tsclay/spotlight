import initPocketBase from "@/utils/_db";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs"

type Data = {
  css_file_name: string;
  css: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const formData = req.body;
  console.log(formData);
  try {
    const pb = await initPocketBase(req, res);
    // formData["snippet"] = convertSnippetToPrism({body: formData["snippet"], language: formData["language"]})
    console.log(formData)
    const selectedTheme = await pb.collection("snippet_themes").getOne(formData.themeId)
    await pb.collection("users").update(pb.authStore.model?.id ?? "", {
        preferred_theme: selectedTheme.id
    })
    console.log('here is the new theme ', selectedTheme)
    const dir = path.resolve("./src", "styles");
    const cssFile = fs.readFileSync(`${dir}/${selectedTheme.file_name}`, "utf-8");
    if (
      req.headers["content-type"] &&
      req.headers["content-type"] === "application/json"
    ) {
      return res.status(200).json({css_file_name: selectedTheme.file_name, css: JSON.parse(JSON.stringify(cssFile))});
    }
    res.redirect("/snippets");
  } catch (error) {
    console.log(error)
    return res.status(400).json({message: 'Something went wrong while creating record.'})
  }
}
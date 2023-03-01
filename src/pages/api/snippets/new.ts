// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const formData = req.body
    console.log(formData)
    if (req.headers['content-type'] && req.headers['content-type'] === 'application/json') {
      return res.status(200).json({...formData})
    }
    res.redirect('/snippets')
}

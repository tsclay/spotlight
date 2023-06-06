// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import initPocketBase from '@/utils/_db'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    try {
        const pb = await initPocketBase(req, res);
        pb.authStore.clear();
        return res.status(200).json({message: 'Success'})
      } catch (error) {
        console.log(error)
        return res.status(400).json({message: 'Something went wrong while creating record.'})
      }
}

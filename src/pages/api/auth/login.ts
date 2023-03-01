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
  console.log('inside auth api')
  const { name, codeVerifier, code, redirectUrl } = req.body
  const pb = await initPocketBase(req, res)
  const authData = await pb.collection('users').authWithOAuth2(name, code, codeVerifier, redirectUrl)

  if (!pb.authStore.isValid) {
    return res.status(400).json({message: "Something went wrong."})
  }

  console.log(authData)
  await pb.collection('users').update(authData.record.id, {
    name: authData.meta?.rawUser.name,
    avatar_url: authData.meta?.rawUser.avatar_url,
    bio: authData.meta?.rawUser.bio,
    github_url: authData.meta?.rawUser.html_url,
    twitter_handle: authData.meta?.rawUser.twitter_username,
  });
  
  res.setHeader('set-cookie', pb.authStore.exportToCookie({sameSite: false}))
  return res.status(200).json({message: "Authenticated."})
}

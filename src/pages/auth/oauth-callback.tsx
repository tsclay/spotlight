import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import PocketBase from "pocketbase";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  return {
    props: {
      ...query
    }
  }
}

type OAuthParamsProps = {
  code: string,
  state: string
}

export default function OAuthRedirectPage(props: OAuthParamsProps) {
  const {code, state} = props
  const router = useRouter()
  const redirectUrl = "http://localhost:3000/auth/oauth-callback";
  useEffect(() => {
    const makeUser = async () => {
      const provider = JSON.parse(localStorage.getItem("provider"));
      console.log('inside oauth useeffect ', provider, props)

      const response = await fetch('/api/auth/login', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          redirectUrl,
          code,
          name: provider.name,
          codeVerifier: provider.codeVerifier
        })
      })

      console.log(response)
      if (response.status == 200) {
        router.push('/snippets')
        return
      }
      router.push('/')
    };
    makeUser()
  }, []);

  return <h1>Authorizing...</h1>;
}

import Layout from "@/components/Layout";
import initPocketBase from "@/utils/_db"
import { GetServerSideProps } from "next"
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";


export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    const pb = await initPocketBase(req, res)
    return {
        props: {
            userData: JSON.parse(JSON.stringify(pb.authStore.model)),
            isAuth: pb.authStore.isValid
        }
    }
}

type UserData = {
    username: string,
    name: string,
    avatar_url: string,
    bio: string | null,
    github_url: string, 
    twitter_handle: string | null
}

function AccountPage(props: {userData: UserData, isAuth: boolean}) {
    const {userData, isAuth} = props
    const router = useRouter()

    useEffect(() => {
        if (!isAuth) {
            router.push('/')
        }
    },[])

    return (
        <div>
            {userData != null && Object.keys(userData).length > 0 ? (
                <div>
                    <Image src={userData.avatar_url} alt={`${userData.name} avatar`} width={100} height={100}/>
                    <p>{userData.name}</p>
                    <p>{userData.username}</p>
                    {userData.bio ? <p>{userData.bio}</p> : null}
                    <a href={userData.github_url}>GitHub</a>
                    {userData.twitter_handle ? <p>{userData.twitter_handle}</p> : null }
                </div>
            ) : null}
        </div>
    )
}

AccountPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default AccountPage
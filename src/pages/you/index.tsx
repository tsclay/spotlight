import Layout from "@/components/Layout";
import initPocketBase from "@/utils/_db"
import { GetServerSideProps } from "next"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { UserData } from "types";


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const pb = await initPocketBase(req, res)
    return {
        props: {
            // userId: JSON.parse(JSON.stringify(pb.authStore.model.id))
            userData: JSON.parse(JSON.stringify(pb.authStore.model)),
            isAuth: pb.authStore.isValid
        }
    }
}



function AccountPage(props: { userData: UserData, isAuth: boolean }) {
    const { userData, isAuth } = props
    const router = useRouter()

    useEffect(() => {
        if (!isAuth) {
            router.push('/')
        }
    }, [])

    return (
        <div className="flex justify-center bg-red-200">
            {userData != null && Object.keys(userData).length > 0 ? (
                <div className="w-3/4 border-blue-200 bg-blue-200 m-4">
                    <Image src={userData.avatar_url} alt={`${userData.name} avatar`} width={100} height={100} />
                    <p><span>{userData.name}</span> <span>({userData.username})</span></p>
                    {userData.bio ? <p>{userData.bio}</p> : null}
                    <a href={userData.github_url}>GitHub</a>
                    {userData.twitter_handle ? <p>{userData.twitter_handle}</p> : null}
                </div>
            ) : null}
        </div>
    )
}

AccountPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout pageProps={page.props}>
            {page}
        </Layout>
    )
}

export default AccountPage

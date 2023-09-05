import initPocketBase from "@/utils/_db";
import { GetServerSideProps } from "next";
import { AuthProviderInfo } from "pocketbase";
import Image from "next/image"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const pb = await initPocketBase(req, res);
  const authMethods = await pb.collection("users").listAuthMethods();
  const svgs = authMethods.authProviders.map(a => {
    switch (a.name) {
      case 'github':
        return {src: '/github-mark.svg', alt: 'Github logo'}
      default:
        break;
    }
  })
  return {
    props: { 
      providers: authMethods.authProviders,
      svgs
    },
  };
};

export default function Login(props: {providers: AuthProviderInfo[], svgs: {src: string, alt: string}[]}) {
  const { providers, svgs } = props;
  const redirectUrl = "http://localhost:3000/auth/oauth-callback"

  return (
    <>
      {providers ? (
        <ul className="flex justify-center border-black border-solid h-32 absolute top-0 left-0 translate-x-2/4 translate-y-2/4 w-2/4 bg-blue-200 mt-8">
          {providers.map((provider, i) => (
            <li key={provider.name} className="w-1/2 bg-slate-100">
              <a
                className="flex justify-between items-center"
                data-provider={JSON.stringify(provider)}
                href={provider.authUrl + redirectUrl}
                onClick={(e) => {
                  console.log(e.target, e.currentTarget)
                  localStorage.setItem(
                    "provider",
                    (e.currentTarget as HTMLAnchorElement).dataset.provider as string
                  )
                }}
              >
                <Image src={svgs[i].src} alt={svgs[i].alt} width={50} height={50}/>
                <span className="basis-3/4">Login with {provider.name[0].toUpperCase() + provider.name.slice(1)}</span>
              </a>
              {/* <form action={provider.authUrl + redirectUrl} method='GET'>
                <button type="submit">{provider.name}</button>
              </form> */}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

import Nav from "./Nav";
import { PropsWithChildren } from "react";
import { SnippetProps } from "types";

type Blah = {
  pageProps: SnippetProps
}

export default function Layout({pageProps, children}: PropsWithChildren<Blah> ) {
  console.log(pageProps)
    return (
      <>
        <Nav userId={pageProps.userData.id} />
        {children}
      </>
    )
  }

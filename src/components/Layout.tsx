import Nav from "./Nav";
import { PropsWithChildren } from "react";



export default function Layout({children}: PropsWithChildren) {
    return (
      <>
        <Nav />
        {children}
      </>
    )
  }
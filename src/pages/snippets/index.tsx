import AddSnippet from "@/components/AddSnippet";
import { GetServerSideProps } from "next";
import { useState, useEffect, ReactElement } from "react";
import initPocketBase from "@/utils/_db";
import type { NextPageWithLayout } from '../_app'
import Layout from "@/components/Layout";

// function useOutsideAlerter(ref) {
//   useEffect(() => {
//     /**
//      * Alert if clicked on outside of element
//      */
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         alert("You clicked outside of me!");
//       }
//     }
//     // Bind the event listener
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       // Unbind the event listener on clean up
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [ref]);
// }

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const pb = await initPocketBase(req, res);
  console.log("THE BLAH BLAH ", pb.authStore.isValid);
  console.log('inside snippets serverprops ', )
  // const authorId = pb.authStore
  // const snippets = await pb.collection('snippets').getList(1,20, {
  //   filter: `author.id = ${authorId}`
  // })
  // const snippets = await (await pb.collection("snippets").getList(1, 20, {
  //   filter: `author.id = '${pb.authStore.model?.id}'`
  // })).items;
  const snippets = await (await pb.collection("snippets").getList(1, 20)).items;
  console.log("THE SNPPIETS ", snippets);
  return {
    props: {
      snippets: JSON.parse(JSON.stringify(snippets)),
      isAuth: pb.authStore.isValid
    },
  };
};

type SnippetProps = {
  snippets: [
    {
      collectionId: string;
      collectionName: string;
      created: Date;
      description: string;
      id: string;
      language: string;
      name: string;
      snippet: string;
      updated: Date;
      expand: {};
    }
  ];
  isAuth: boolean
};

function SnippetsPage(props: SnippetProps) {
  const [showAdd, setShowAdd] = useState(false);
  const { snippets, isAuth } = props;

  console.log(snippets);

  useEffect(() => {
    // console.info('inside of useEffect')
    const handleOutsideClick = (e: Event) => {
      console.log(e.target);
      // console.log(`the showAdd state is ${showAdd}`)
      if (
        !showAdd ||
        (e.target as Element).closest("div#add-snippet-container") ||
        (e.target as Element).closest("button")
      ) {
        // console.warn('not going to change the state in click')
        return;
      }
      setShowAdd(false);
    };
    document.addEventListener("click", handleOutsideClick, false);
    return () => {
      // console.warn('cleaning up in useEffect')
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, [showAdd]);

  return (
    <>
      <div className="p-2">
        {isAuth ? (
        <form
          action="/snippets/new"
          method="GET"
          onSubmit={(e) => {
            e.preventDefault();
            setShowAdd(true);
          }}
        >
          <button type="submit">+</button>
        </form>
        ) :
        null }
        {showAdd ? <AddSnippet /> : null}
        {snippets
          ? snippets.map((s) => (
              <div key={s.id}>
                <h2>{s.name}</h2>
                <p>{s.language}</p>
                <p>{s.description}</p>
                <div dangerouslySetInnerHTML={{__html: s.snippet}}></div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}

SnippetsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default SnippetsPage


import AddSnippet from "@/components/AddSnippet";
import { GetServerSideProps } from "next";
import { useState, useEffect, ReactElement } from "react";
import initPocketBase from "@/utils/_db";
import Layout from "@/components/Layout";
import "prismjs/themes/prism-tomorrow.css";

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const pb = await initPocketBase(req, res);
  console.log("THE BLAH BLAH ", pb.authStore.isValid);
  console.log("The query ", query);
  // const authorId = pb.authStore
  // const snippets = await pb.collection('snippets').getList(1,20, {
  //   filter: `author.id = ${authorId}`
  // })
  const snippets = await (
    await pb.collection("snippets").getList(1, 20, {
      filter: `author.id = '${query.author}'`,
    })
  ).items;
  // const snippets = await (await pb.collection("snippets").getList(1, 20)).items;
  console.log("THE SNPPIETS ", snippets);
  return {
    props: {
      snippets: JSON.parse(JSON.stringify(snippets)),
      isAuth: pb.authStore.isValid,
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
  isAuth: boolean;
};

function SnippetsPage(props: SnippetProps) {
  const [showAdd, setShowAdd] = useState(false);
  const { snippets, isAuth } = props;

  console.log(snippets);

  useEffect(() => {
    const handleOutsideClick = (e: Event) => {
      console.log(e.target);
      if (
        !showAdd ||
        (e.target as Element).closest("div#add-snippet-container") ||
        (e.target as Element).closest("button")
      ) {
        return;
      }
      setShowAdd(false);
    };
    document.addEventListener("click", handleOutsideClick, false);
    return () => {
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
        ) : null}
        {showAdd ? <AddSnippet /> : null}
        {snippets.length > 0 ? (
          snippets.map((s) => (
            <div key={s.id}>
              <h2>{s.name}</h2>
              <p>{s.language}</p>
              <p>{s.description}</p>
              <div dangerouslySetInnerHTML={{ __html: s.snippet }}></div>
            </div>
          ))
        ) : (
          <p>Sorry, no snippets for this user.</p>
        )}
      </div>
    </>
  );
}

SnippetsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SnippetsPage;

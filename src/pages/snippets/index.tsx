import AddSnippet from "@/components/AddSnippet";
import { GetServerSideProps } from "next";
import { useState, useEffect, ReactElement, createRef, useRef, MutableRefObject, RefObject } from "react";
import initPocketBase from "@/utils/_db";
import Layout from "@/components/Layout";
import fs from 'fs'
import path from 'path'

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
  // console.log("THE BLAH BLAH ", pb.authStore.isValid);
  // console.log('inside snippets serverprops ', )
  // const authorId = pb.authStore
  // const snippets = await pb.collection('snippets').getList(1,20, {
  //   filter: `author.id = ${authorId}`
  // })
  // const snippets = await (await pb.collection("snippets").getList(1, 20, {
  //   filter: `author.id = '${pb.authStore.model?.id}'`
  // })).items;
  const snippets = await (await pb.collection("snippets").getList(1, 20)).items;
  const themes = await (await pb.collection("snippet_themes").getList(1)).items;
  // console.log("THE SNPPIETS ", snippets);
  const dir = path.resolve('./src', 'styles')
  let cssFile
  try {
    cssFile = fs.readFileSync(`${dir}/prism-night-owl.min.css`, 'utf-8')
  } catch (error) {
    cssFile = ''
  }
  
  // console.log(dir, cssFile)
  return {
    props: {
      snippets: JSON.parse(JSON.stringify(snippets)),
      isAuth: pb.authStore.model?.id ?? '',
      css: JSON.parse(JSON.stringify(cssFile)),
      themes: JSON.parse(JSON.stringify(themes))
    },
  };
};

function SnippetsPage(props: SnippetProps) {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const { snippets, isAuth, css, themes } = props;
  const [updateSnippets, setUpdateSnippets] = useState<Snippet[]>(snippets)
  const descriptionRefs = useRef(snippets.map(s => createRef()))
  const clipboardRefs = useRef(snippets.map(s => createRef()))
  const lastPressedCopy = useRef<MutableRefObject<null|HTMLButtonElement>>(null)

  // console.log('PROPS ', snippets);
  // console.log('updated snippets ', updateSnippets)

  function updateRefs() {
    // refs.current = refs.current.splice(0, value);
    // for(let i = 0; i < snippets.length; i++) {
    //   console.log('desc ref ', descriptionRefs.current[i])
    //   descriptionRefs.current[i] = descriptionRefs.current[i] || createRef();
    //   clipboardRefs.current[i] = clipboardRefs.current[i] || createRef();
    // }
    // console.log('updated refs before map', descriptionRefs.current)
    descriptionRefs.current = descriptionRefs.current.map((item) => item || createRef());
    clipboardRefs.current = clipboardRefs.current.map((item) => item || createRef());
    // console.log('updated refs after map', descriptionRefs.current)
  }

  const toggleDescription = (ref: RefObject<unknown>) => {
    const p = (ref.current as unknown as HTMLParagraphElement);
    // p.classList.toggle('hidden')
    // p.classList.toggle('max-h-72')
    p.classList.toggle('move')
    // p.classList.toggle('in')
    // p.classList.toggle('max-h-0')
  }

  const handleUpdateSnippets = (oldSnippets: Snippet[], newSnippet: Snippet) => {
    setUpdateSnippets([...oldSnippets, newSnippet])
    descriptionRefs.current.push(createRef())
    clipboardRefs.current.push(createRef())
  }

  const copySnippet = async (ref: RefObject<unknown>) => {
    const btn = (ref.current as unknown as HTMLButtonElement);
    if (!lastPressedCopy.current) {
      lastPressedCopy.current = btn
    }
    if ((lastPressedCopy.current as unknown) !== btn && lastPressedCopy.current) {
      (lastPressedCopy.current as unknown as HTMLButtonElement).innerText = '📋';
      lastPressedCopy.current = btn
    }
    await navigator.clipboard.writeText(btn.nextElementSibling?.textContent ?? 'If you see this, the copy btn is broken.')
    console.log(btn)
    btn.innerText = '✔'
  }

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
      {css ? 
      <style dangerouslySetInnerHTML={{__html: css}}></style>
      : null }
      <div className="p-2 flex flex-col gap-4">
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
          <select name="theme" id="theme">
        {themes.map(t => (
            <option key={t.id} value={t.file_name}>{t.display_name}</option>
            ))}
          </select>
        {showAdd && isAuth ? <AddSnippet author={isAuth} oldSnippets={updateSnippets} updateSnippets={handleUpdateSnippets} onSuccess={() => setShowAdd(false)} /> : null}
        {updateSnippets
          ? updateSnippets.map((s, i) => (
              <div key={s.id} data-author={s.author}>
                <div className="border-t-2 border-x-2 border-b border-solid border-emerald-500 bg-black text-white p-4">
                  <button type="button" className="w-full flex justify-between" onClick={() => toggleDescription(descriptionRefs.current[i])}>
                    <span>{s.name}</span><span>{s.language}</span>
                  </button>
                  <p ref={descriptionRefs.current[i]} className="menu">{s.description}</p>
                </div>
                <div id="snippet-wrapper" className="border-t border-x-2 border-b-2 border-solid border-emerald-500 relative">
                  <button ref={clipboardRefs.current[i]} type="button" className="rounded p-1 absolute z-30 top-2 right-2 bg-slate-300/60" onClick={() => copySnippet(clipboardRefs.current[i])}>📋</button>
                  <div id="code-wrapper" dangerouslySetInnerHTML={{__html: s.snippet}}></div>
                </div>
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


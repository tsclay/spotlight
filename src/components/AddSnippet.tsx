import { useRouter } from "next/router";
import { AddSnippetProps } from "types";
import { SnippetEditor } from "./SnippetEditor";
import { useEffect, useRef, useState } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { Extension } from "@codemirror/state";

export default function AddSnippet(props: AddSnippetProps) {
  const [extensions, setExtensions] = useState<Extension[]>();
  const [mode, setMode] = useState("javascript");
  const [code, setCode] = useState("");
  const editor = useRef(null);
  const { setContainer } = useCodeMirror({
    container: editor.current,
    extensions,
    theme: okaidia,
    height: "500px",
    
  });

  async function handleLangChange(lang: keyof typeof langs) {
    try {
      const {color} = (await import("@uiw/codemirror-extensions-color"))
      if (langs[lang]) {
        setExtensions([color, langs[lang]()]);
      }
      setMode(lang);
      if (lang === "html") {
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (!editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  useEffect(() => {
    handleLangChange("javascript");
  },[])

  async function addNewSnippet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { method, action } = e.target as HTMLFormElement;
    const formData = new FormData(e.target as HTMLFormElement);
    const jsonData = {};
    formData.forEach((v, k, p) => {
      jsonData[k] = v;
    });
    console.log(JSON.stringify(jsonData));
    const res = await fetch(action, {
      method,
      body: JSON.stringify(jsonData),
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    }).then((r) => r.json());
    console.log("here is the res ", res);
    props.onSuccess();
    props.updateSnippets();
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 z-30 w-full bg-slate-300 p-2 md:w-1/2 lg:translate-x-1/2"
        id="add-snippet-container"
      >
        <form
          id="add-snippet"
          method="POST"
          action="/api/snippets/new"
          onSubmit={addNewSnippet}
          className="grid grid-flow-row auto-rows-max gap-3"
        >
          <input type="hidden" name="author" value={props.author} />
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" cols={30} rows={10} />
          <label htmlFor="language">Language</label>
          <select name="language" id="language" onChange={(e) => handleLangChange(e.target.value)}>
            {langs && (Object.keys(langs).sort().map(a => (
              <option value={a}>{a}</option>
              )))}
          </select>
          <label htmlFor="snippet">Snippet</label>
          <div id="snippet" ref={editor} />
              {/* <SnippetEditor /> */}
          <button className="bg-sky-500" type="submit">
            +
          </button>
        </form>
      </div>
    </>
  );
}

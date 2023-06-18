import { useRouter } from "next/router";
import { AddSnippetProps } from "types";
import { SnippetEditor } from "./SnippetEditor";
import { useEffect, useRef, useState } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { Extension } from "@codemirror/state";
import { Editor } from "@monaco-editor/react";

const supportedLanguages = [
  { id: 1, name: "apex" },
  { id: 2, name: "azcli" },
  { id: 3, name: "bat" },
  { id: 4, name: "c" },
  { id: 5, name: "clojure" },
  { id: 6, name: "coffeescript" },
  { id: 7, name: "cpp" },
  { id: 8, name: "csharp" },
  { id: 9, name: "csp" },
  { id: 10, name: "css" },
  { id: 11, name: "dockerfile" },
  { id: 12, name: "fsharp" },
  { id: 13, name: "go" },
  { id: 14, name: "graphql" },
  { id: 15, name: "handlebars" },
  { id: 16, name: "html" },
  { id: 17, name: "ini" },
  { id: 18, name: "java" },
  { id: 19, name: "javascript" },
  { id: 20, name: "json" },
  { id: 21, name: "kotlin" },
  { id: 22, name: "less" },
  { id: 23, name: "lua" },
  { id: 24, name: "markdown" },
  { id: 25, name: "msdax" },
  { id: 26, name: "mysql" },
  { id: 27, name: "objective-c" },
  { id: 28, name: "pascal" },
  { id: 29, name: "perl" },
  { id: 30, name: "pgsql" },
  { id: 31, name: "php" },
  { id: 32, name: "plaintext" },
  { id: 33, name: "postiats" },
  { id: 34, name: "powerquery" },
  { id: 35, name: "powershell" },
  { id: 36, name: "pug" },
  { id: 37, name: "python" },
  { id: 38, name: "r" },
  { id: 39, name: "razor" },
  { id: 40, name: "redis" },
  { id: 41, name: "redshift" },
  { id: 42, name: "ruby" },
  { id: 43, name: "rust" },
  { id: 44, name: "sb" },
  { id: 45, name: "scheme" },
  { id: 46, name: "scss" },
  { id: 47, name: "shell" },
  { id: 48, name: "sol" },
  { id: 49, name: "sql" },
  { id: 50, name: "st" },
  { id: 51, name: "swift" },
  { id: 52, name: "tcl" },
  { id: 53, name: "typescript" },
  { id: 54, name: "vb" },
  { id: 55, name: "xml" },
  { id: 56, name: "yaml" },
];

export default function AddSnippet(props: AddSnippetProps) {
  const [extensions, setExtensions] = useState<Extension[]>();
  const [mode, setMode] = useState("javascript");
  const [code, setCode] = useState("");
  const editor = useRef(null);
  // const { setContainer } = useCodeMirror({
  //   container: editor.current,
  //   extensions,
  //   theme: okaidia,
  //   height: "500px",

  // });

  // async function handleLangChange(lang: keyof typeof langs) {
  //   try {
  //     const {color} = (await import("@uiw/codemirror-extensions-color"))
  //     if (langs[lang]) {
  //       setExtensions([color, langs[lang]()]);
  //     }
  //     setMode(lang);
  //     if (lang === "html") {
  //     }
  //   } catch (error) {}
  // }

  // useEffect(() => {
  //   if (!editor.current) {
  //     setContainer(editor.current);
  //   }
  // }, [editor.current]);

  // useEffect(() => {
  //   handleLangChange("javascript");
  // },[])

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
          {/* <select name="language" id="language" onChange={(e) => handleLangChange(e.target.value)}>
            {langs && (Object.keys(langs).sort().map(a => (
              <option value={a}>{a}</option>
              )))}
          </select> */}
          <select name="language" id="language" onChange={(e) => setMode(e.target.value)}>
            {supportedLanguages && supportedLanguages.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <label htmlFor="snippet">Snippet</label>
          {/* <div id="snippet" ref={editor} /> */}
          <Editor
            theme="vs-dark"
            height="500px"
            defaultLanguage="javascript"
            language={mode}
            defaultValue="// some comment"
          />
          <button className="bg-sky-500" type="submit">
            +
          </button>
        </form>
      </div>
    </>
  );
}

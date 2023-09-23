import Editor, { DiffEditor, useMonaco, loader, Monaco } from "@monaco-editor/react";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { monaco } from "react-monaco-editor";
import { AddSnippetProps } from "types";

const supportedLanguages = [
  { id: 1, name: 'apex', displayName: 'Apex' },
  { id: 2, name: 'azcli', displayName: 'Azure CLI' },
  { id: 3, name: 'bat', displayName: 'Batch' },
  { id: 4, name: 'c', displayName: 'C' },
  { id: 5, name: 'clojure', displayName: 'Clojure' },
  { id: 6, name: 'coffeescript', displayName: 'Coffeescript' },
  { id: 7, name: 'cpp', displayName: 'C++' },
  { id: 8, name: 'csharp', displayName: 'C#' },
  { id: 9, name: 'csp', displayName: 'CSP' },
  { id: 10, name: 'css', displayName: 'CSS' },
  { id: 11, name: 'dockerfile', displayName: 'Dockerfile' },
  { id: 12, name: 'fsharp', displayName: 'F#' },
  { id: 13, name: 'go', displayName: 'Go' },
  { id: 14, name: 'graphql', displayName: 'Graphql' },
  { id: 15, name: 'handlebars', displayName: 'Handlebars' },
  { id: 16, name: 'html', displayName: 'HTML' },
  { id: 17, name: 'ini', displayName: 'Ini' },
  { id: 18, name: 'java', displayName: 'Java' },
  { id: 19, name: 'javascript', displayName: 'Javascript' },
  { id: 20, name: 'json', displayName: 'JSON' },
  { id: 21, name: 'kotlin', displayName: 'Kotlin' },
  { id: 22, name: 'less', displayName: 'Less' },
  { id: 23, name: 'lua', displayName: 'Lua' },
  { id: 24, name: 'markdown', displayName: 'Markdown' },
  { id: 25, name: 'msdax', displayName: 'MSDAX' },
  { id: 26, name: 'mysql', displayName: 'MySQL' },
  { id: 27, name: 'objective-c', displayName: 'Objective-C' },
  { id: 28, name: 'pascal', displayName: 'Pascal' },
  { id: 29, name: 'perl', displayName: 'Perl' },
  { id: 30, name: 'pgsql', displayName: 'pgSQL' },
  { id: 31, name: 'php', displayName: 'PHP' },
  { id: 32, name: 'plaintext', displayName: 'PlainText' },
  { id: 33, name: 'postiats', displayName: 'Postiats' },
  { id: 34, name: 'powerquery', displayName: 'Power Query' },
  { id: 35, name: 'powershell', displayName: 'PowerShell' },
  { id: 36, name: 'pug', displayName: 'Pug' },
  { id: 37, name: 'python', displayName: 'Python' },
  { id: 38, name: 'r', displayName: 'R' },
  { id: 39, name: 'razor', displayName: 'Razor' },
  { id: 40, name: 'redis', displayName: 'Redis' },
  { id: 41, name: 'redshift', displayName: 'Redshift' },
  { id: 42, name: 'ruby', displayName: 'Ruby' },
  { id: 43, name: 'rust', displayName: 'Rust' },
  { id: 44, name: 'sb', displayName: 'SB' },
  { id: 45, name: 'scheme', displayName: 'Scheme' },
  { id: 46, name: 'scss', displayName: 'SCSS' },
  { id: 47, name: 'shell', displayName: 'Shell' },
  { id: 48, name: 'sol', displayName: 'SOL' },
  { id: 49, name: 'sql', displayName: 'SQL' },
  { id: 50, name: 'st', displayName: 'ST' },
  { id: 51, name: 'swift', displayName: 'Swift' },
  { id: 52, name: 'tcl', displayName: 'Tcl' },
  { id: 53, name: 'typescript', displayName: 'Typescript' },
  { id: 54, name: 'vb', displayName: 'VB' },
  { id: 55, name: 'xml', displayName: 'XML' },
  { id: 56, name: 'yaml', displayName: 'YAML' }
]

type NewSnippetBody = {
  author: string,
  name: string,
  language: string,
  snippet: string
}

export const SnippetEditor = (props: AddSnippetProps) => {
  const editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null> = useRef(null);
  const [mode, setMode] = useState("javascript");
  const [code, setCode] = useState("");
  const [randomName, setRandomName] = useState("")
  const { author, onSuccess } = props
  const router = useRouter()

  async function addNewSnippet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const codeValue = (editorRef.current! as monaco.editor.IStandaloneCodeEditor)!.getModel()!.getValue()
    const { method, action } = e.target as HTMLFormElement;
    const formData = new FormData(e.target as HTMLFormElement);
    const jsonData: NewSnippetBody = { author: '', name: '', language: '', snippet: '' }
    formData.forEach((v, k) => {
      if (k in jsonData) {
        jsonData[k as keyof NewSnippetBody] = v as string;
      }
    });
    jsonData["snippet"] = codeValue
    console.log(JSON.stringify(jsonData));
    const res = await fetch(action, {
      method,
      body: JSON.stringify(jsonData),
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
    }).then((r) => r.json());
    console.log("here is the res ", res);
    router.push('/snippets')
  }

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
  }
  function handleEditCode(newValue: string, e: Event) {
    console.log(newValue)
  }

  async function getRandomPhrase() {
    let noun = await fetch('https://random-word-form.herokuapp.com/random/noun').then(r => r.text())
    noun = JSON.parse(noun)
    noun = noun[0]
    let adj = await fetch('https://random-word-form.herokuapp.com/random/adjective').then(r => r.text())
    adj = JSON.parse(adj)
    adj = adj[0]
    setRandomName(`${adj} ${noun}`)
  }

  useEffect(() => {
    getRandomPhrase()
  }, [])

  return (
    <>
      <form
        id="add-snippet"
        method="POST"
        action="/api/snippets/new"
        onSubmit={addNewSnippet}
        className="grid grid-flow-row auto-rows-max"
      >
        <div id="editor-wrapper" className="w-full h-full">
          <Editor
            theme="vs-dark"
            height="96vh"
            language={mode}
            defaultValue="// some comment"
            onMount={handleEditorDidMount}
          />
        </div>
        <div id="controls" className="bg-blue-400 flex p-1 justify-between" style={{ height: '4vh' }}>
          <input type="hidden" name="author" value={props.author} />
          {/* <label htmlFor="name">Name</label> */}
          <input type="text" name="name" id="name" defaultValue={randomName} className="bg-transparent grow" />
          <select
            name="language"
            id="language"
            className="bg-transparent grow"
            defaultValue={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {supportedLanguages &&
              supportedLanguages.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.displayName}
                </option>
              ))}
          </select>
          <button className="bg-blue-400 w-10" type="submit">
            💾
          </button>
        </div>
      </form>
    </>
  );
};

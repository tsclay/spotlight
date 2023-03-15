import { useRouter } from "next/router"
import { AddSnippetProps } from "types"

export default function AddSnippet(props: AddSnippetProps) {
    
    async function addNewSnippet(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      const {method, action} = e.target as HTMLFormElement
      const formData = new FormData(e.target as HTMLFormElement)
      const jsonData = {}
      formData.forEach((v, k, p) => {
          jsonData[k] = v
      })
      console.log(JSON.stringify(jsonData))
      const res = await fetch(action, {
        method,
        body: JSON.stringify(jsonData),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
      }).then(r => r.json())
      console.log('here is the res ', res)
      props.onSuccess()
      props.updateSnippets()
    }
  
    return (
      <>
        <div className="p-2 md:w-1/2 w-full bg-slate-300 fixed left-0 lg:translate-x-1/2 z-10 top-0" id="add-snippet-container">
          <form id="add-snippet" method="POST" action="/api/snippets/new" onSubmit={addNewSnippet} className="grid grid-flow-row auto-rows-max gap-3">
            <input type="hidden" name="author" value={props.author} />
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" />
            <label htmlFor="language">Language</label>
            <input type="text" name="language" id="language" />
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={10}
            />
            <label htmlFor="snippet">Snippet</label>
            <textarea name="snippet" id="snippet" cols={30} rows={10}/>
            <button className="bg-sky-500" type="submit">+</button>
          </form>
        </div>
      </>
    );
  }
  
type Snippet = {
  author: string;
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
};

type SnippetTheme = {
  collectionId: string;
  collectionName: string;
  created: Date;
  display_name: string;
  expand: {};
  file_name: string;
  id: string;
  updated: Date;
};

type SnippetProps = {
  snippets: Snippet[];
  isAuth: string;
  css: string;
  themes: SnippetTheme[];
};

type AddSnippetProps = {
  author: string;
  oldSnippets: Snippet[];
  updateSnippets: (priorSnippets: Snippet[], newSnippet: Snippet) => void;
  onSuccess: () => void;
};

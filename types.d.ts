import { Record } from "pocketbase";

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
  preferredTheme: Record|null
};

type AddSnippetProps = {
  author: string;
  updateSnippets: () => Promise<void>;
  onSuccess: () => void;
};

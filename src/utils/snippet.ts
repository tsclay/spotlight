import Prism from 'prismjs'
import loadLanguages from "prismjs/components/index";

loadLanguages()

export const convertSnippetToPrism = (snippetContent: {
  body: string;
  language: string;
}) => {
  let { body, language } = snippetContent;

  // https://github.com/PrismJS/prism/blob/master/plugins/line-numbers/prism-line-numbers.js#L109
  const NEW_LINE_EXP = /\n(?!$)/g;
  let lineNumbersWrapper;

  Prism.hooks.add("after-tokenize", function (env) {
    const match = env.code.match(NEW_LINE_EXP);
    console.log('the m')
    const linesNum = match ? match.length + 1 : 1;
    const lines = new Array(linesNum + 1).join("<span></span>");

    lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
  });
  const html = Prism.highlight(
    body,
    Prism.languages[language.toLowerCase()],
    language.toLowerCase()
  );
  return `<pre class="line-numbers language-${language.toLowerCase()}"><code class="language-${language.toLowerCase()}">${html}${lineNumbersWrapper}</code></pre>`;
};

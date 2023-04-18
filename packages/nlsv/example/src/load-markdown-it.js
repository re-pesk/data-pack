import MarkdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/+esm';
import FrontMatter from 'https://cdn.jsdelivr.net/npm/markdown-it-front-matter@0.2.3/+esm';
import Sub from 'https://cdn.jsdelivr.net/npm/markdown-it-sub@1.0.0/+esm';
import Sup from 'https://cdn.jsdelivr.net/npm/markdown-it-sup@1.0.0/+esm';
import Footnote from 'https://cdn.jsdelivr.net/npm/markdown-it-footnote@3.0.3/+esm';
import Deflist from 'https://cdn.jsdelivr.net/npm/markdown-it-deflist@2.1.0/+esm';
import Abbr from 'https://cdn.jsdelivr.net/npm/markdown-it-abbr@1.0.4/+esm';
import Emoji from 'https://cdn.jsdelivr.net/npm/markdown-it-emoji@2.0.2/+esm';
import Container from 'https://cdn.jsdelivr.net/npm/markdown-it-bracketed-spans@1.0.1/+esm';
import BracketSpan from 'https://cdn.jsdelivr.net/npm/markdown-it-container@3.0.0/+esm';
import Insert from 'https://cdn.jsdelivr.net/npm/markdown-it-ins@3.0.1/+esm';
import Mark from 'https://cdn.jsdelivr.net/npm/markdown-it-mark@3.0.1/+esm';
import Admon from 'https://cdn.jsdelivr.net/npm/markdown-it-admon@1.0.0/+esm';
import MmdTable from 'https://cdn.jsdelivr.net/npm/markdown-it-multimd-table@4.2.1/+esm';
import YamlTable from 'https://cdn.jsdelivr.net/npm/markdown-it-complex-table@1.0.0/+esm';
import GridTable from 'https://cdn.jsdelivr.net/npm/markdown-it-gridtables@0.6.0/+esm';
import Attrs from 'https://cdn.jsdelivr.net/npm/@sup39/markdown-it-attr@1.2.2/+esm';
import { asidePlugin as Aside } from 'https://cdn.jsdelivr.net/npm/@humanwhocodes/markdown-it-markua-aside@0.2.0/+esm';
// import Anchor from 'https://cdn.jsdelivr.net/npm/markdown-it-anchor@8.6.7/+esm';
import TocDoneRight from 'https://cdn.jsdelivr.net/npm/markdown-it-toc-done-right@4.2.0/+esm';
// import Replacements from 'https://cdn.jsdelivr.net/npm/markdown-it-replacements@1.0.2/+esm';
import YAML from 'https://cdn.jsdelivr.net/npm/yaml@2.2.1/+esm';

export const moduleDataList = [
  ['MarkdownIt', MarkdownIt],
  ['FrontMatter', FrontMatter],
  ['Sub', Sub],
  ['Sup', Sup],
  ['Footnote', Footnote],
  ['Deflist', Deflist],
  ['Abbr', Abbr],
  ['Emoji', Emoji],
  ['Container', Container],
  ['BracketSpan', BracketSpan],
  ['Insert', Insert],
  ['Mark', Mark],
  ['Admon', Admon],
  ['MmdTable', MmdTable],
  ['YamlTable', YamlTable.default],
  ['GridTable', GridTable.default],
  ['Attrs', Attrs],
  ['Aside', Aside],
  // ['Anchor', Anchor],
  ['TocDoneRight', TocDoneRight],
  // ['Replacements', Replacements],
  ['YAML', YAML],
];

export const modules = Object.fromEntries(moduleDataList);

export const moduleOptionList = {
  MarkdownIt: { html: true, xhtmlOut: true, linkify: true, typography: true },
  Container: "spoiler",
  MmdTable : { multiline: true, rowspan: true, headerless: true, multibody: true, autolabel: true },
  // Anchor: { permalink: Anchor.permalink.headerLink() },
  // Anchor: { permalink: modules.Anchor.permalink.linkInsideHeader({ symbol: `&nbsp;#`, placement: 'before' }) },
  YAML: { defer: true },
}

// modules.Replacements.replacements.push({
//   name: 'allcaps',
//   re: /^Bandymas$/g,
//   sub: function (s) { return '# ' + meta.title; },
//   default: true
// });

export const loadParser = (metaData) => {

  moduleOptionList.FrontMatter = (fm) => { 
    if (fm) {
      metaData['frontMatter'] = YAML.parse(fm);
    }
  };

  moduleOptionList.TocDoneRight = { callback(html) {
    if (html) {
      metaData['toc'] = html;
    }
  }};

  const mdParser = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    xhtmlOut: true,
    linkify: true,
    typography: true,
  })

  moduleDataList.forEach(moduleData => {
    if (moduleOptionList[moduleData[0]]) {
      if (moduleOptionList[moduleData[0]].defer) {
        return;
      }
      mdParser.use(modules[moduleData[0]], moduleOptionList[moduleData[0]])
    } else {
      mdParser.use(modules[moduleData[0]])
    }
  })

  return mdParser;
}

export default { loadParser, modules };
import { getNlsvData } from '../../src/nlsv.js';
import { loadParser } from './load-markdown-it.js';

// Initialize MD parser
const metaData = {};
const mdParser = loadParser(metaData);

// Make categories' table
const mdCategoryTable = (categoryList) => {
  let { body, head } = categoryList;
  const mdContent = `{.category-table}

${[...head.values()].map(record => `| ${record.map(field => field.replace(/\|/g, '\\|')).join(' | ')} |`).join(`\n`)}
|:--|:--|:--|:--|
${[...body.values()].map(record => `| ${record.map(field => field.replace(/\|/g, '\\|')).join(' | ')} |`).join(`\n`)}\n`
    .replace(/\\n/g, "<br />");
  return mdParser.render(mdContent).replace(/\\\|/g, '|');
}

// Make categories' list
const mdCategoryList = (categoryList) => {
  const mdContent = `${[...categoryList.body.values()]
    .map(record => {
      const [id, name, , link] = record;
      return `${id.includes('.') ? '  *' : '*'} ${name} [~doc~](${link})`;
    }).join(`\n`)}\n`;
  return mdParser.render(mdContent)
}

// Choose data from category list by category ID and make category link
const makeCategoryLink = (categoryId, categoryList) => {
  const { body } = categoryList;
  if (!body.has(categoryId)) {
    console.log(categoryId);
    return categoryId;
  }
  let catName, catHref, result = '';

  if (body.has(categoryId)) {
    [, catName, , catHref] = body.get(categoryId);
    result = `[${catName}](${catHref})`;
  }

  if (!categoryId.includes('.')) {
    return result;
  }

  let prefix = categoryId.split('.')[0];

  if (body.has(prefix)) {
    [, catName, , catHref] = body.get(prefix);
    prefix = `[${catName}](${catHref})`;
  }

  return `${prefix} &raquo; ${result}`;
}

// Make API pages' table
const mdApiTable = (api_items, categoryList) => {
  const { body } = api_items;
  const mdContent = `{.item-table}

|:--|:--|:--|
${[...body.values()].map(record => {
    const [, name, description, link, categories] = record.map(field => field.replace(/\|/g, '\\|'));
    return `| ${name} [~doc~](${link}) | ${description} | ${categories
      .split(' ')
      .map(cat => makeCategoryLink(cat, categoryList))
      .join('<br />')} |`;
  }).join(`\n`)}\n`
    .replace(/\\n/g, "<br />");
    return mdParser.render(mdContent).replace(/\\\|/g, '|');
  }

const categoryList = await getNlsvData('./data/categories.nlsv');
const api_items = await getNlsvData('./data/api_items.nlsv');

document.querySelector('#category-table').innerHTML = mdCategoryTable(categoryList);
document.querySelector('#category-list').innerHTML = mdCategoryList(categoryList);
document.querySelector('#api-table').innerHTML = mdApiTable(api_items, categoryList);

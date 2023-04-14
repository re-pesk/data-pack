// Get content from file on server
export const getContent = async (url) => {
  return await fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      return response.text();
    });
}

export const splitPathName = (pathName = window.location.pathname) => {
    const pathArray = pathName.split('/');
    const fileName = pathArray.pop();
    const path = pathArray.join('/');
    return { path, fileName };
  }

// Create element from html text
export const htmlToElement = (htmlArg) => {
  const template = document.createElement('template');
  const html = htmlArg.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
};

// Get content from file on server
export const getContent = async (url) => fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return response.text();
  });

// Make body entries to create Map
const makeCategoryBody = (record) => [record[0], record];

// Make header entries to create Map
const makeCategoryHeader = (record, i) => [`header_${i}`, record];

// Make data object from content of .nslv file
export const makeDataObject = (nslvContent) => {
  let head;
  let body;

  // if file has headers
  if (nslvContent.includes('\n\n***\n\n')) {
    // separate them
    [head, body] = nslvContent.split('\n\n***\n\n');
  } else {
    // otherwise create empty headers
    [head, body] = ['', nslvContent];
  }

  // Split body records and fields
  body = body.split('\n\n').map((record) => record.replace(/(?<=\n)-(-?)(?=\n)/g, '$1').split('\n'));

  // Create body Map
  body = new Map(body.map(makeCategoryBody));

  // if headers do not exist, return object with body and empty head
  if (head === '') {
    return { head: [], body };
  }

  // Split headers
  head = head.split('\n\n').map((record) => record.split('\n'));

  // Make headers Map
  head = new Map(head.map(makeCategoryHeader));

  // Return object with headers and body
  return { head, body };
};

// Get content from nlsv file and convert it to data object
export const getNlsvData = async (url) => makeDataObject((await getContent(url)).trim());

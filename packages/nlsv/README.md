# New Line Separated Values (.nlsv)

New Line Separated Values (NLSV) is a type of [DSV] file that uses a new line character to separate fields and records:

* one new line  character (LF, `\n`) is used to separate fields (data of each field is written on its own line),
* sequence of two new line characters (empty line, `\n\n`) separates records,
* and sequence of two new line characters followed by three asterisks and two new line characters (three asterisks with one empty line before and one empty line after, `\n\n***\n\n`) is used to separate headers.

The nlsv.js library provides three functions:

* `async getContent(url)` gets content from a `nlsv` file on server,
* `makeDataObject(nslvContent)` makes data object from content of .nslv file,
* `async getNlsvData(url)` sequencially calls the other two functions to read content of `.nlsv` file and convert it to data object.

This small library was written for a project jQuery-to-JS that aims to provide examples of how to replace jQuery with pure JavaScript. The data used for testing is from the jQuery API documentation.

*[DSV]: Delimiter Separated Values

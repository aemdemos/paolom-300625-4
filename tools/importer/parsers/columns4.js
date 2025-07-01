/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate column blocks
  let columns = Array.from(element.querySelectorAll(':scope > .css-y39ecu > .css-cquqsy'));
  if (columns.length === 0) {
    // fallback to any direct children of the main container
    const container = element.querySelector(':scope > .css-y39ecu');
    if (container) {
      columns = Array.from(container.children);
    } else {
      columns = Array.from(element.children);
    }
  }

  // Compose the cells array: header (single cell), then a row with one cell per column
  const cells = [
    ['Columns'], // header row, exactly as in the example
    columns.map(col => {
      // Use the main content of each column, usually in .css-gxdil1
      let content = col.querySelector('.css-gxdil1');
      if (!content) content = col;
      return content;
    })
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

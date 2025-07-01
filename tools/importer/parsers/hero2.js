/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero2)'];

  // === 1. Background Image (row 2) ===
  // We want the phone mockup, which is the PNG image
  // Find all PNG <img> in the element
  let backgroundImg = null;
  const imgs = element.querySelectorAll('img');
  for (const img of imgs) {
    if (img.src && img.src.match(/\.png($|\?)/i)) {
      backgroundImg = img;
      break;
    }
  }
  // If not found, leave empty, but per requirements
  const backgroundRow = [backgroundImg || ''];

  // === 2. Content Cell (row 3) ===
  // This should include headings, subheading, and CTAs
  // The content is in the left area of the hero (first main vertical stack)
  // Locate the first .css-i5etdy or similar content stack
  let contentCell = '';
  const mainContentContainer = element.querySelector('.css-i5etdy');
  if (mainContentContainer) {
    // For semantic meaning, include textContents (title, subheading, etc)
    const textBlocks = Array.from(mainContentContainer.querySelectorAll('.textContents'));
    // For CTAs, look for [role="link"] (direct children of buttons area)
    // The CTA buttons are located in the next major .css-5knerd sibling
    let ctaBlock = null;
    let ctaContainer = mainContentContainer.parentElement;
    if (ctaContainer) {
      // The CTAs are a sibling of the first content stack
      const ctaParent = ctaContainer.querySelector(':scope > .css-5knerd .css-u0dwzs');
      if (ctaParent) {
        // Get all [role="link"]
        const ctas = Array.from(ctaParent.querySelectorAll('[role="link"]'));
        // Only include those with visible text
        if (ctas.length) {
          ctaBlock = document.createDocumentFragment();
          ctas.forEach(cta => ctaBlock.appendChild(cta));
        }
      }
    }
    // Compose all textBlocks and CTA together for the cell
    const fragment = document.createDocumentFragment();
    textBlocks.forEach(el => fragment.appendChild(el));
    if (ctaBlock) fragment.appendChild(ctaBlock);
    contentCell = fragment.childNodes.length ? fragment : '';
  }

  const cells = [
    headerRow,
    backgroundRow,
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

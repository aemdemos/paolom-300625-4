/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match example exactly)
  const headerRow = ['Hero (hero5)'];

  // --- 1. Extract background image (main hero image) ---
  // Collect all <img> from first-level children and their descendants.
  let allImgs = [];
  const topLevelDivs = element.querySelectorAll(':scope > div');
  for (const div of topLevelDivs) {
    allImgs.push(...div.querySelectorAll('img'));
  }
  // If none found, fallback to any descendant img
  if (allImgs.length === 0) {
    allImgs = Array.from(element.querySelectorAll('img'));
  }
  // From these, try to find the main hero image: prefer .png, fallback to first
  let heroImg = null;
  for (const img of allImgs) {
    if (img.src && img.src.match(/\.png(\?|$)/i)) {
      heroImg = img;
      break;
    }
  }
  if (!heroImg && allImgs.length > 0) heroImg = allImgs[0];

  // --- 2. Extract text region (title, subheading, CTA) ---
  // Find the first child section that contains a .textContents (likely the text region)
  let textRegion = null;
  for (const div of topLevelDivs) {
    if (div.querySelector('.textContents')) {
      textRegion = div;
      break;
    }
  }
  // Fallback: any .textContents anywhere
  if (!textRegion) {
    const fallback = element.querySelector('.textContents');
    if (fallback) textRegion = fallback.closest('div');
  }

  // --- 3. Compose table rows ---
  // Second row: hero image (or empty if missing)
  const secondRow = [heroImg ? heroImg : ''];
  // Third row: text+cta region (or empty if missing)
  const thirdRow = [textRegion ? textRegion : ''];
  const rows = [headerRow, secondRow, thirdRow];

  // --- 4. Create and replace ---
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

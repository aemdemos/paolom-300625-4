/* global WebImporter */
export default function parse(element, { document }) {
  // This block is a horizontal card list: each card is a .css-i5gobc direct child of .css-y39ecu
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Get the main card row container
  let cardRowContainer = element.querySelector('.css-y39ecu');
  if (!cardRowContainer) {
    // Fallback: look for first .css-i5gobc parent
    cardRowContainer = element;
  }

  // Each card is a direct child .css-i5gobc of the container
  const cardElements = Array.from(cardRowContainer.querySelectorAll(':scope > .css-i5gobc'));
  // Fallback: if no direct children, try all .css-i5gobc under this block
  const cards = cardElements.length > 0 ? cardElements : Array.from(cardRowContainer.querySelectorAll('.css-i5gobc'));

  cards.forEach(card => {
    // The icon/image: always the first .css-524dky in the card
    const icon = card.querySelector('.css-524dky');
    // Text content: all .css-cjsrtu, .textContents, and .css-pygv96 (cta) inside the card, in order
    const textBlocks = [];
    card.querySelectorAll('.css-cjsrtu, .textContents, .css-pygv96').forEach(el => textBlocks.push(el));
    rows.push([icon, textBlocks]);
  });

  // Only replace if we have at least one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}

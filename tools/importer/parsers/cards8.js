/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the block header
  const cells = [['Cards (cards8)']];

  // Each card is represented by a .css-i5gobc.css-9hp8h3.css-k3ohag direct child
  const cardWrappers = element.querySelectorAll(':scope > .css-i5gobc.css-9hp8h3.css-k3ohag');
  // There are intermediate .css-5knerd containers with the social icons that directly follow each cardWrapper
  // We'll collect them and, for each card, pair the correct cardWrapper with its icons row

  cardWrappers.forEach(cardWrapper => {
    // ----------- Extract Image (first <img> inside this card) -------------
    const img = cardWrapper.querySelector('img');

    // ----------- Extract Text Content -------------
    // There are two .textContents containers, each with a single <p>
    // We'll gather all <p> elements for maximum flexibility
    const textPs = cardWrapper.querySelectorAll('.textContents p');
    const textCell = [];
    textPs.forEach(p => {
      if (p && p.textContent.trim()) textCell.push(p);
    });

    // ----------- Extract Social Icons -------------
    // Find the next sibling .css-5knerd that contains .css-v2x5c3
    let socials = [];
    let next = cardWrapper.nextElementSibling;
    if (next && next.querySelector('.css-v2x5c3')) {
      const socialContainer = next.querySelector('.css-v2x5c3');
      // Each social is a .css-h0icx9 (role=link)
      const iconLinks = socialContainer.querySelectorAll('.css-h0icx9');
      iconLinks.forEach(iconLink => {
        // Get the second [data-isimage] child if present, else the single one
        const iconDivs = iconLink.querySelectorAll('[data-isimage]');
        let iconImg = null;
        if (iconDivs.length > 1) {
          iconImg = iconDivs[1].querySelector('img');
        } else if (iconDivs.length === 1) {
          iconImg = iconDivs[0].querySelector('img');
        }
        if (iconImg) socials.push(iconImg);
      });
    }
    if (socials.length > 0) {
      const socialSpan = document.createElement('span');
      socials.forEach(icon => { if (icon) socialSpan.appendChild(icon); });
      textCell.push(socialSpan);
    }

    // ----------- Add Card Row (image, textBlock) -------------
    // Reference existing elements directly
    cells.push([
      img || '',
      textCell.length ? textCell : ''
    ]);
  });
  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

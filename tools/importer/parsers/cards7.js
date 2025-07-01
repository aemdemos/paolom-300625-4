/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get text from a node
  function getText(node) {
    return node ? node.textContent.trim() : '';
  }

  // Get all pricing card roots (there are three)
  const cardRoots = Array.from(element.querySelectorAll(':scope > .css-i5gobc'));
  const ctaNodes = Array.from(element.querySelectorAll(':scope > .css-uoh9sn'));

  // Header must match exactly as in example
  const rows = [['Cards (cards7)']];

  cardRoots.forEach((card, idx) => {
    // --- COLUMN 1: Icon ---
    // Get the first feature icon (img or svg)
    let icon = card.querySelector('.css-t8o21a img, .css-t8o21a svg');
    if (!icon) {
      // If not found, fallback to any image/svg under features
      icon = card.querySelector('.css-j0or7i img, .css-j0or7i svg');
    }
    if (!icon) {
      // fallback to another image/svg in the card
      icon = card.querySelector('img, svg');
    }
    if (!icon) {
      // fallback to empty element
      icon = document.createElement('span');
    }

    // --- COLUMN 2: Textual Content ---
    const frag = document.createDocumentFragment();
    // Title (strong)
    const title = card.querySelector('.css-lpnecz .textContents p');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = getText(title);
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    // Price (e.g. $0 / month)
    const priceVal = card.querySelector('.css-7004bb .css-8wph8u p');
    const pricePer = card.querySelector('.css-7004bb .css-myl2ny p, .css-7004bb .css-5dba7r p');
    if (priceVal && pricePer) {
      frag.appendChild(document.createTextNode(getText(priceVal) + ' ' + getText(pricePer)));
      frag.appendChild(document.createElement('br'));
    }
    // Subtitle/Description (Best for...)
    const subtitle = card.querySelector('.css-hfcmt4 p');
    if (subtitle) {
      frag.appendChild(document.createTextNode(getText(subtitle)));
      frag.appendChild(document.createElement('br'));
    }
    // Features: iterating every feature line (with icon and text)
    const featureRows = Array.from(card.querySelectorAll('.css-j0or7i .css-t8o21a'));
    if (featureRows.length > 0) {
      const ul = document.createElement('ul');
      featureRows.forEach(feature => {
        const li = document.createElement('li');
        let featIcon = feature.querySelector('img, svg');
        if (featIcon) li.appendChild(featIcon);
        const featTxt = feature.querySelector('p');
        if (featTxt) {
          if (featIcon) li.appendChild(document.createTextNode(' '));
          li.appendChild(document.createTextNode(getText(featTxt)));
        }
        ul.appendChild(li);
      });
      frag.appendChild(ul);
    }
    // CTA (Get Started link)
    const cta = ctaNodes[idx];
    if (cta) {
      const ctaTxt = cta.querySelector('p');
      if (ctaTxt) {
        frag.appendChild(document.createElement('br'));
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = getText(ctaTxt);
        frag.appendChild(a);
      }
    }
    rows.push([icon, frag]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

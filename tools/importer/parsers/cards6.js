/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract star icons (rating) as an array of img (for the current card only)
  function extractStars(card) {
    // .css-7ylp2l contains the stars, might be in the last .css-5knerd of each card
    const starsWrap = card.querySelector('.css-7ylp2l');
    if (!starsWrap) return [];
    // Get all star SVG img
    return Array.from(starsWrap.querySelectorAll('img'));
  }

  // Helper to extract the image/avatar (first circle image in card)
  function extractAvatar(card) {
    // The avatar is in the first .css-ldomp[data-isimage="true"] img
    const avatarWrap = card.querySelector('.css-ldomp[data-isimage="true"] img');
    return avatarWrap || '';
  }

  // Helper to extract name and role
  function extractNameRole(card) {
    const name = card.querySelector('.css-r1whug p');
    const role = card.querySelector('.css-us51lk p');
    // Compose a fragment with bold name and then role
    const frag = document.createDocumentFragment();
    if (name && name.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent;
      frag.appendChild(strong);
    }
    if (role && role.textContent.trim()) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(document.createTextNode(role.textContent));
    }
    return frag;
  }

  // Helper to extract the testimonial text
  function extractTestimonial(card) {
    const text = card.querySelector('.css-xcgr3e p');
    return text || null;
  }

  // Find all cards: each .css-g0vp85 > * > .css-5knerd is a card
  // Need to get all child .css-g0vp85 elements in order (multiple sets per block)
  const allG0vp85 = Array.from(element.querySelectorAll('.css-g0vp85'));
  const allCards = [];

  allG0vp85.forEach((g0vp85) => {
    const candidates = Array.from(g0vp85.querySelectorAll(':scope > *'));
    candidates.forEach((maybeCard) => {
      // Only process if .css-5knerd exists inside
      if (maybeCard.querySelector('.css-5knerd')) {
        allCards.push(maybeCard);
      }
    });
  });

  // Defensive: fallback if above yields no cards
  if (allCards.length === 0) {
    // fallback to .css-932eil which is always present in each card
    const fallbackCards = Array.from(element.querySelectorAll('.css-932eil'));
    if (fallbackCards.length > 0) {
      fallbackCards.forEach(c => allCards.push(c));
    }
  }

  const rows = allCards.map((card) => {
    // Compose the left cell: avatar
    const avatarImg = extractAvatar(card);
    const leftCell = avatarImg || document.createTextNode('');
    // Compose the right cell: name+role, testimonial, stars
    const contentFrag = document.createDocumentFragment();
    const nameRole = extractNameRole(card);
    if (nameRole && nameRole.childNodes.length > 0) contentFrag.appendChild(nameRole);
    const testimonial = extractTestimonial(card);
    if (testimonial && testimonial.textContent.trim()) {
      contentFrag.appendChild(document.createElement('br'));
      contentFrag.appendChild(testimonial);
    }
    const stars = extractStars(card);
    if (stars.length > 0) {
      contentFrag.appendChild(document.createElement('br'));
      stars.forEach((img) => contentFrag.appendChild(img));
    }
    return [leftCell, contentFrag];
  });

  // Only build table if there is data
  if (rows.length > 0) {
    const headerRow = ['Cards (cards6)'];
    const tableRows = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(block);
  }
}

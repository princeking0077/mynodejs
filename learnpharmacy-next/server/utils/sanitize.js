const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeHtml = (htmlContent) => {
    if (!htmlContent) return htmlContent;
    return DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'b', 'em', 'i', 'u', 's', 'cite', 'blockquote',
            'ul', 'ol', 'li', 'dl', 'dt', 'dd',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
            'a', 'img', 'br', 'hr', 'code', 'pre', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'title', 'rel', 'style', 'width', 'height']
    });
};

module.exports = { sanitizeHtml };

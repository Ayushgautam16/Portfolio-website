const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const openTags = [];
const selfClosing = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'path', 'circle', 'line', 'rect', 'ellipse', 'polygon', 'polyline', 'use', 'stop']);

const tagRegex = /<\/?([a-zA-Z0-9\-]+)[^>]*>/g;

let match;
while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (selfClosing.has(tagName) || fullTag.endsWith('/>')) {
        continue;
    }

    if (fullTag.startsWith('</')) {
        if (openTags.length > 0) {
            const lastTag = openTags[openTags.length - 1];
            if (lastTag.tagName === tagName) {
                openTags.pop();
            } else {
                console.log(`Mismatch at index ${match.index}: expected </${lastTag.tagName}> but found </${tagName}>. Open tags stack: ${openTags.map(t => t.tagName).join(', ')}`);
                break;
            }
        } else {
            console.log(`Mismatch at index ${match.index}: found </${tagName}> but stack is empty`);
            break;
        }
    } else {
        openTags.push({ tagName, index: match.index });
    }
}

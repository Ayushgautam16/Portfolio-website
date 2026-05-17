with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

track_match = re.search(r'<div class="social-links-wrapper">(.*?)</div>\s*</div>\s*</section>', content, re.DOTALL)
if track_match:
    icons_html = track_match.group(1).strip()
    
    # Generate 12 sets
    set_1 = icons_html
    
    clone_html = icons_html.replace('class="slideshow-link pointer-enter"', 'class="slideshow-link pointer-enter" aria-hidden="true" tabindex="-1"').replace('class="slideshow-link instagram-link pointer-enter"', 'class="slideshow-link instagram-link pointer-enter" aria-hidden="true" tabindex="-1"')
    
    full_html = '<!-- Set 1 -->\n' + set_1 + '\n'
    for i in range(2, 13):
        full_html += f'<!-- Set {i} (duplicate for seamless loop) -->\n' + clone_html + '\n'
        
    new_track = '<div class="marquee-wrapper">\n          <div class="marquee-track">\n            ' + full_html + '          </div>\n        </div>\n      </section>'
    
    content = re.sub(r'<div class="social-links-wrapper">.*?</div>\s*</div>\s*</section>', new_track, content, flags=re.DOTALL)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Done replacing.')
else:
    print('Could not find social-links-wrapper')

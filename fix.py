with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

icons = """            <a href="https://x.com/GainsBy_Ayush" target="_blank" class="slideshow-link pointer-enter">
              <img src="images/social-icons/slideshow-img-1.png" alt="X" />
            </a>
            <a href="https://youtube.com/@gainsby_ayush?si=Kvp6uzhLBWP8tLi4" target="_blank" class="slideshow-link pointer-enter">
              <img src="images/social-icons/slideshow-img-2.png" alt="YouTube" />
            </a>
            <a href="https://github.com/Ayushgautam16" target="_blank" class="slideshow-link pointer-enter">
              <img src="images/social-icons/slideshow-img-4.png" alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/ayush-gautam-9baa14248/" target="_blank" class="slideshow-link pointer-enter">
              <img src="images/social-icons/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://instagram.com/GainsBy_Ayush" target="_blank" class="slideshow-link instagram-link pointer-enter">
              <svg class="social-icon instagram-icon" viewBox="0 0 448 512" aria-label="Instagram" role="img">
                <path fill="currentColor" d="M224.1 141c-63.6 0-114 50.4-114 114 0 63.6 50.4 114 114 114s114-50.4 114-114c0-63.6-50.4-114-114-114zm0 186c-39.8 0-72-32.2-72-72 0-39.8 32.2-72 72-72s72 32.2 72 72c0 39.8-32.2 72-72 72zm146.4-194.8c0 14.9-12.1 27-27 27s-27-12.1-27-27 12.1-27 27-27 27 12.1 27 27zm76.1 27.2c-1.7-35.7-9.9-67.3-36.1-93.5-26.2-26.2-57.8-34.4-93.5-36.1-37-2.1-147.8-2.1-184.8 0-35.7 1.7-67.3 9.9-93.5 36.1-26.2 26.2-34.4 57.8-36.1 93.5-2.1 37-2.1 147.8 0 184.8 1.7 35.7 9.9 67.3 36.1 93.5 26.2 26.2 57.8 34.4 93.5 36.1 37 2.1 147.8 2.1 184.8 0 35.7-1.7 67.3-9.9 93.5-36.1 26.2-26.2 34.4-57.8 36.1-93.5 2.1-37 2.1-147.8 0-184.8zm-48.5 224c-7.8 19.6-23 34.8-42.6 42.6-29.5 11.7-99.5 9-132.9 9s-103.4 2.6-132.9-9c-19.6-7.8-34.8-23-42.6-42.6-11.7-29.5-9-99.5-9-132.9s-2.6-103.4 9-132.9c7.8-19.6 23-34.8 42.6-42.6 29.5-11.7 99.5-9 132.9-9s103.4-2.6 132.9 9c19.6 7.8 34.8 23 42.6 42.6 11.7 29.5 9 99.5 9 132.9s2.6 103.4-9 132.9z"></path>
              </svg>
            </a>"""

icons_hidden = """            <a href="https://x.com/GainsBy_Ayush" target="_blank" class="slideshow-link pointer-enter" aria-hidden="true" tabindex="-1">
              <img src="images/social-icons/slideshow-img-1.png" alt="X" />
            </a>
            <a href="https://youtube.com/@gainsby_ayush?si=Kvp6uzhLBWP8tLi4" target="_blank" class="slideshow-link pointer-enter" aria-hidden="true" tabindex="-1">
              <img src="images/social-icons/slideshow-img-2.png" alt="YouTube" />
            </a>
            <a href="https://github.com/Ayushgautam16" target="_blank" class="slideshow-link pointer-enter" aria-hidden="true" tabindex="-1">
              <img src="images/social-icons/slideshow-img-4.png" alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/ayush-gautam-9baa14248/" target="_blank" class="slideshow-link pointer-enter" aria-hidden="true" tabindex="-1">
              <img src="images/social-icons/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://instagram.com/GainsBy_Ayush" target="_blank" class="slideshow-link instagram-link pointer-enter" aria-hidden="true" tabindex="-1">
              <svg class="social-icon instagram-icon" viewBox="0 0 448 512" aria-hidden="true">
                <path fill="currentColor" d="M224.1 141c-63.6 0-114 50.4-114 114 0 63.6 50.4 114 114 114s114-50.4 114-114c0-63.6-50.4-114-114-114zm0 186c-39.8 0-72-32.2-72-72 0-39.8 32.2-72 72-72s72 32.2 72 72c0 39.8-32.2 72-72 72zm146.4-194.8c0 14.9-12.1 27-27 27s-27-12.1-27-27 12.1-27 27-27 27 12.1 27 27zm76.1 27.2c-1.7-35.7-9.9-67.3-36.1-93.5-26.2-26.2-57.8-34.4-93.5-36.1-37-2.1-147.8-2.1-184.8 0-35.7 1.7-67.3 9.9-93.5 36.1-26.2 26.2-34.4 57.8-36.1 93.5-2.1 37-2.1 147.8 0 184.8 1.7 35.7 9.9 67.3 36.1 93.5 26.2 26.2 57.8 34.4 93.5 36.1 37 2.1 147.8 2.1 184.8 0 35.7-1.7 67.3-9.9 93.5-36.1 26.2-26.2 34.4-57.8 36.1-93.5 2.1-37 2.1-147.8 0-184.8zm-48.5 224c-7.8 19.6-23 34.8-42.6 42.6-29.5 11.7-99.5 9-132.9 9s-103.4 2.6-132.9-9c-19.6-7.8-34.8-23-42.6-42.6-11.7-29.5-9-99.5-9-132.9s-2.6-103.4 9-132.9c7.8-19.6 23-34.8 42.6-42.6 29.5-11.7 99.5-9 132.9-9s103.4-2.6 132.9 9c19.6 7.8 34.8 23 42.6 42.6 11.7 29.5 9 99.5 9 132.9s2.6 103.4-9 132.9z"></path>
              </svg>
            </a>"""

full_html = '<!-- Set 1 -->\n' + icons + '\n'
for i in range(2, 11):
    full_html += f'<!-- Set {i} (duplicate for seamless loop) -->\n' + icons_hidden + '\n'

new_section = f'''      <section class="section-social" id="section-social">
        <h1 class="section-heading">Connect With Me</h1>
        <div class="marquee-wrapper">
          <div class="marquee-track">
{full_html}          </div>
        </div>
      </section>'''

# Find the start and end of section-social
start = content.find('<section class="section-social" id="section-social">')
end = content.find('</section>', start) + len('</section>')

if start != -1 and end != -1:
    content = content[:start] + new_section + content[end:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced section-social")
else:
    print("Could not find section-social")

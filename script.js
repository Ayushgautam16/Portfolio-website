// Mouse Circle
const mouseCircle = document.querySelector(".mouse-circle");
const mouseDot = document.querySelector(".mouse-dot");

let mouseCircleBool = true;

const mouseCircleFn = (x, y) => {
    mouseCircleBool &&
        (mouseCircle.style.cssText = `top: ${y}px; left: ${x}px; opacity:1`);

    mouseDot.style.cssText = `top: ${y}px; left: ${x}px; opacity:1`;
};
// End of Mouse Circle

// Animated Circles
const circles = document.querySelectorAll(".circle");
const mainImg = document.querySelector(".main-circle img");

let mX = 0;
let mY = 0;
const z = 100;
const animateCircles = (e, x, y) => {
    if (x < mX) {
        circles.forEach((circle) => {
            circle.style.left = `${z}px`;
        });
        mainImg.style.left = `${z}px`;
    } else if (x > mX) {
        circles.forEach((circle) => {
            circle.style.left = `-${z}px`;
        });
        mainImg.style.left = `-${z}px`;
    }
    if (y < mY) {
        circles.forEach((circle) => {
            circle.style.top = `${z}px`;
        });
        mainImg.style.top = `${z}px`;
    } else if (y > mY) {
        circles.forEach((circle) => {
            circle.style.top = `-${z}px`;
        });
        mainImg.style.top = `-${z}px`;
    }
    mX = e.clientX;
    mY = e.clientY;
};
// End of Animated Circles

let hoveredElPosition = [];

const stickyElement = (x, y, hoveredEl) => {
    // Sticky Elements
    if (hoveredEl && hoveredEl.classList && hoveredEl.classList.contains("sticky")) {
        hoveredElPosition.length < 1 &&
            (hoveredElPosition = [hoveredEl.offsetTop, hoveredEl.offsetLeft]);

        hoveredEl.style.cssText = `top: ${y}px; left: ${x}px`;

        if (
            hoveredEl.offsetTop <= hoveredElPosition[0] - 100 ||
            hoveredEl.offsetTop >= hoveredElPosition[0] + 100 ||
            hoveredEl.offsetLeft <= hoveredElPosition[1] - 100 ||
            hoveredEl.offsetLeft >= hoveredElPosition[1] + 100
        ) {
            hoveredEl.style.cssText = "";
            hoveredElPosition = [];
        }

        hoveredEl.onmouseleave = () => {
            hoveredEl.style.cssText = "";
            hoveredElPosition = [];
        };
    }
    // End of Sticky Elements
};

// Mouse Circle Transform
const mouseCircleTransform = (hoveredEl) => {
    if (hoveredEl && hoveredEl.classList && hoveredEl.classList.contains("pointer-enter")) {
        hoveredEl.onmousemove = () => {
            mouseCircleBool = false;
            mouseCircle.style.cssText = `
            width: ${hoveredEl.getBoundingClientRect().width}px;
            height: ${hoveredEl.getBoundingClientRect().height}px;
            top: ${hoveredEl.getBoundingClientRect().top}px;
            left: ${hoveredEl.getBoundingClientRect().left}px;
            opacity: 1;
            transform: translate(0,0);
            animation: none;
            border-radius: ${getComputedStyle(hoveredEl).borderRadius};
            transition: width .5s, height .5s, top .5s, left .5s, transform .5s, border-radius .5s;
            `;
        };

        hoveredEl.onmouseleave = () => {
            mouseCircleBool = true;
        };
        document.onscroll = () => {
            if (!mouseCircleBool && mouseCircle) {
                mouseCircle.style.top = `${hoveredEl.getBoundingClientRect().top}px`;
            }
        };
    }
};
// End of Mouse Circle Transform

document.body.addEventListener("mousemove", (e) => {
    let x = e.clientX;
    let y = e.clientY;

    mouseCircleFn(x, y);
    animateCircles(e, x, y);

    const hoveredEl = document.elementFromPoint(x, y);

    stickyElement(x, y, hoveredEl);

    mouseCircleTransform(hoveredEl);
});
document.body.addEventListener("mouseleave", () => {
    mouseCircle.style.opacity = "0";
    mouseDot.style.opacity = "0";
});

// Main Button
const mainBtns = document.querySelectorAll(".main-btn");

mainBtns.forEach((btn) => {
    let ripple;

    btn.addEventListener("mouseenter", (e) => {
        const left = e.clientX - e.target.getBoundingClientRect().left;
        const top = e.clientY - e.target.getBoundingClientRect().top;

        ripple = document.createElement("div");
        ripple.classList.add("ripple");
        ripple.style.left = `${left}px`;
        ripple.style.top = `${top}px`;
        btn.prepend(ripple);
    });

    btn.addEventListener("mouseleave", () => {
        btn.removeChild(ripple);
    });
});

// End of Main Button

// Progress Bar
const sections = document.querySelectorAll("section");
const progressBar = document.querySelector(".progress-bar");

const halfCircles = document.querySelectorAll(".half-circle");
const halfCircleTop = document.querySelector(".half-circle-top");
const progressBarCircle = document.querySelector(".progress-bar-circle");

let scrolledPortion = 0;
let scrollBool = false;
let imageWrapper = false;

const progressBarFn = (bigImgWrapper) => {
    imageWrapper = bigImgWrapper;
    let pageHeight = 0;
    const pageViewportHeight = window.innerHeight;

    if (!imageWrapper) {
        pageHeight = document.documentElement.scrollHeight;
        scrolledPortion = window.pageYOffset;
    } else {
        pageHeight = imageWrapper.firstElementChild.scrollHeight;
        scrolledPortion = imageWrapper.scrollTop;
    }

    scrolledPortionDegree =
        (scrolledPortion / (pageHeight - pageViewportHeight)) * 360;

    halfCircles.forEach((el) => {
        el.style.transform = `rotate(${scrolledPortionDegree}deg)`;

        if (scrolledPortionDegree >= 180) {
            halfCircles[0].style.transform = "rotate(180deg)";
            halfCircleTop.style.opacity = "0";
        } else {
            halfCircleTop.style.opacity = "1";
        }
    });
    const scrollBool = scrolledPortion + pageViewportHeight - 0.5 === pageHeight;

    // Arrow Rotation
    if (scrollBool) {
        progressBarCircle.style.transform = "rotate(180deg)";
    } else {
        progressBarCircle.style.transform = "rotate(0)";
    }
    // End of Arrow Rotation
};

// Progress Bar Click
progressBar.addEventListener("click", (e) => {
    e.preventDefault();

    if (!imageWrapper) {
        const sectionPositions = Array.from(sections).map(
            (section) => scrolledPortion + section.getBoundingClientRect().top,
        );

        const position = sectionPositions.find((sectionPosition) => {
            return sectionPosition > scrolledPortion;
        });

        scrollBool ? window.scrollTo(0, 0) : window.scrollTo(0, position);
    } else {
        scrollBool
            ? imageWrapper.scrollTo(0, 0)
            : imageWrapper.scrollTo(0, imageWrapper.scrollHeight);
    }
});
// End of Progress Bar Click

progressBarFn();
// End of Progress Bar

// Navigation
const menuBtn = document.querySelector("#menu-btn");
const navbar = document.querySelector("#navbar");
const navbarLinks = document.querySelector("#navbar-links");
const MOBILE_NAV_BREAKPOINT = 768;

const isMobileNav = () => window.innerWidth <= MOBILE_NAV_BREAKPOINT;

const closeMobileMenu = () => {
    navbar?.classList.remove("menu-open");
    menuBtn?.classList.remove("menu-open");
    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.setAttribute("aria-label", "Open navigation menu");
};

const toggleMobileMenu = () => {
    const willOpen = !navbar.classList.contains("menu-open");
    navbar.classList.toggle("menu-open", willOpen);
    menuBtn.classList.toggle("menu-open", willOpen);
    menuBtn.setAttribute("aria-expanded", String(willOpen));
    menuBtn.setAttribute(
        "aria-label",
        willOpen ? "Close navigation menu" : "Open navigation menu",
    );
};

menuBtn?.addEventListener("click", () => {
    if (!isMobileNav()) return;
    toggleMobileMenu();
});

navbarLinks?.querySelectorAll(".navbar-link").forEach((link) => {
    link.addEventListener("click", () => {
        if (isMobileNav()) closeMobileMenu();
    });
});

window.addEventListener("resize", () => {
    if (!isMobileNav()) closeMobileMenu();
});

const onScroll = () => {
    if (isMobileNav()) closeMobileMenu();
    progressBarFn();
};

document.addEventListener("scroll", onScroll);
onScroll();
// End of Navigation

// About Me Text
const aboutMeText = document.querySelector(".about-me-text");
const aboutMeTextContent =
    "I'm a web developer & I create websites with the best user experiences. Just contact me.";
Array.from(aboutMeTextContent).forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    aboutMeText.appendChild(span);

    span.addEventListener("mouseenter", (e) => {
        e.target.style.animation = "aboutMeTextAnim 10s infinite";
    });
});

const hireCardButtons = document.querySelectorAll(".hire-card-btn");
const hireRoleInput = document.getElementById("hire-role");
const hireForm = document.getElementById("hire-form");

hireCardButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const role = btn.dataset.role || "";
        if (hireRoleInput) hireRoleInput.value = role;
        if (hireForm)
            hireForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// End of About Me Text

// Projects
const container = document.querySelector(".container");
const projects = document.querySelectorAll(".project");
const projectHideBtn = document.querySelector(".project-hide-btn");

projects.forEach((project, i) => {
    project.addEventListener("mouseenter", () => {
        project.firstElementChild.style.top = `-${project.firstElementChild.offsetHeight - project.offsetHeight + 20}px`;
    });
    project.addEventListener("mouseleave", () => {
        project.firstElementChild.style.top = "2rem";
    });

    // Big Project Image
    project.addEventListener("click", () => {
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "project-img-wrapper";
        container.appendChild(imageWrapper);

        const bigImg = document.createElement("img");
        bigImg.className = "project-img";
        const imgPath = project.firstElementChild.getAttribute("src").split(".")[0];
        bigImg.setAttribute("src", `${imgPath}-big.jpg`);
        imageWrapper.appendChild(bigImg);
        document.body.style.overflowY = "hidden";

        document.removeEventListener("scroll", onScroll);

        mouseCircle.style.opacity = 0;

        progressBarFn(imageWrapper);

        imageWrapper.onscroll = () => {
            progressBarFn(imageWrapper);
        };

        projectHideBtn.classList.add("change");

        // Create buttons on body so position:fixed works correctly
        const backBtn = document.createElement("button");
        backBtn.className = "project-preview-back-btn";
        backBtn.innerHTML = "&#8592; Back to Home";
        document.body.appendChild(backBtn);

        const closeBtn = document.createElement("button");
        closeBtn.className = "project-preview-close-btn";
        closeBtn.innerHTML = "&#10005;";
        document.body.appendChild(closeBtn);

        const closePreview = () => {
            projectHideBtn.classList.remove("change");
            imageWrapper.remove();
            backBtn.remove();
            closeBtn.remove();
            document.body.style.overflowY = "scroll";
            document.addEventListener("scroll", onScroll);
            progressBarFn();
        };

        const closeAndGoHome = () => {
            closePreview();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        backBtn.addEventListener("click", closeAndGoHome);
        closeBtn.addEventListener("click", closePreview);

        projectHideBtn.onclick = closePreview;

        // Close preview if user clicks the dark backdrop (not image or buttons)
        imageWrapper.addEventListener("click", (e) => {
            if (e.target === imageWrapper) closePreview();
        });
    });
    // End of Big Project Image

    i >= 6 && (project.style.cssText = "display:none; opacity:0");
});

// Projects Button
const section3 = document.querySelector(".section-3");
const projectsBtn = document.querySelector(".projects-btn");
const projectsBtnText = document.querySelector(".projects-btn span");

const showProjects = (project, i) => {
    setTimeout(() => {
        project.style.display = "flex";
        section3.scrollIntoView({ block: "end" });
    }, 600);
    setTimeout(() => {
        project.style.opacity = "1";
    }, i * 200);
};

const hideProjects = (project, i) => {
    setTimeout(() => {
        project.style.display = "none";
        section3.scrollIntoView({ block: "end" });
    }, 1200);

    setTimeout(() => {
        project.style.opacity = "0";
    }, i * 100);
};

let showHideBool = true;

projectsBtn.addEventListener("click", (e) => {
    e.preventDefault();

    projectsBtn.firstElementChild.nextElementSibling.classList.toggle("change");

    showHideBool
        ? (projectsBtnText.textContent = "Show Less")
        : (projectsBtnText.textContent = "Show More");

    projects.forEach((project, i) => {
        i >= 6 &&
            (showHideBool ? showProjects(project, i) : hideProjects(project, i));
    });
    showHideBool = !showHideBool;
});
// End of Projects Button
// End of Projects

// Section 4
document.querySelectorAll(".service-btn").forEach((service) => {
    service.addEventListener("click", (e) => {
        e.preventDefault();

        const serviceText = service.nextElementSibling;
        serviceText.classList.toggle("change");

        const rightPosition = serviceText.classList.contains("change")
            ? `calc(100% - ${getComputedStyle(service.firstElementChild).width})`
            : 0;

        service.firstElementChild.style.right = rightPosition;
    });
});
// End of Section 4

// Section 5
// Form
const formHeading = document.querySelector(".form-heading");
const formInputs = document.querySelectorAll(".contact-form-input");

if (formHeading) {
    formInputs.forEach((input) => {
        input.addEventListener("focus", () => {
            formHeading.style.opacity = "0";
            setTimeout(() => {
                formHeading.textContent = "Let's Talk";
                formHeading.style.opacity = "1";
            }, 300);
        });

        input.addEventListener("blur", () => {
            formHeading.style.opacity = "0";
            setTimeout(() => {
                formHeading.textContent = "Let's Talk";
                formHeading.style.opacity = "1";
            }, 300);
        });
    });
}

// End of Form
function openFreelanceForm() {
    document.getElementById("freelancePopup").style.display = "flex";
}

function closeFreelanceForm() {
    document.getElementById("freelancePopup").style.display = "none";
}


// SLide Show
const slideshow = document.querySelector(".slideshow");

if (slideshow && slideshow.children.length >= 4) {
    setInterval(() => {
        const firstIcon = slideshow.firstElementChild;
        firstIcon.classList.add("faded-out");

        const thirdIcon = slideshow.children[3];
        thirdIcon.classList.add("light");
        thirdIcon.previousElementSibling.classList.remove("light");

        setTimeout(() => {
            slideshow.removeChild(firstIcon);
            slideshow.appendChild(firstIcon);

            setTimeout(() => {
                firstIcon.classList.remove("faded-out");
            }, 500);
        }, 500);
    }, 3000);
}
// End of Slide Show
function openSponsorForm() {
    document.getElementById("sponsorPopup").style.display = "flex";
}

function closeSponsorForm() {
    document.getElementById("sponsorPopup").style.display = "none";
}
// Form Validation
const contactForm = document.querySelector(".contact-form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const messages = document.querySelectorAll(".message");

const error = (input, message) => {
    if (!input || !input.nextElementSibling) return;
    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.textContent = message;
};

const success = (input) => {
    if (!input || !input.nextElementSibling) return;
    input.nextElementSibling.classList.remove("error");
};

const checkRequiredFields = (inputArr) => {
    inputArr.forEach((input) => {
        if (input && input.value.trim() === "") {
            error(input, `${input.id || 'Field'} is required`);
        }
    });
};

const checkLength = (input, min) => {
    if (!input) return;
    if (input.value.trim().length < min) {
        error(input, `${input.id || 'Field'} must be at least ${min} characters`);
    } else {
        success(input);
    }
};

const checkEmail = (input) => {
    if (!input) return;
    const regEx =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (regEx.test(input.value.trim())) {
        success(input);
    } else {
        error(input, "Email is not valid.");
    }
};

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        if (username) checkLength(username, 2);
        if (subject) checkLength(subject, 2);
        if (message) checkLength(message, 10);
        if (email) checkEmail(email);

        const reqs = [username, email, subject, message].filter(Boolean);
        checkRequiredFields(reqs);

        const notValid = Array.from(messages).find((msg) => {
            return msg.classList.contains("error");
        });
        
        notValid && e.preventDefault();
    });
}
// End of Form Validation
// End of Section 5

// ==========================================
// Customer Reviews & Feedback Feature
// ==========================================
const DEFAULT_REVIEWS = [
    {
        id: 'rev-1',
        name: 'Sarah Jenkins',
        role: 'Product Lead @ TechCorp',
        rating: 5,
        date: 'July 2026',
        text: 'Ayush delivered our full-stack web application on time with flawless animations and responsive design. His attention to detail and performance optimization is top-notch!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        verified: true
    },
    {
        id: 'rev-2',
        name: 'Alex Rivera',
        role: 'Founder @ AI Launchpad',
        rating: 5,
        date: 'June 2026',
        text: 'Outstanding work on our AI automation pipeline and UI integration. Ayush turned complex backend requirements into a smooth, user-friendly interface. Highly recommended!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        verified: true
    },
    {
        id: 'rev-3',
        name: 'Marcus Vance',
        role: 'Engineering Manager @ DevFlow',
        rating: 5,
        date: 'May 2026',
        text: 'Collaborating with Ayush was a fantastic experience. Exceptional mastery in Next.js, Node.js, and clean code practices. Will definitely hire again.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        verified: true
    },
    {
        id: 'rev-4',
        name: 'Priya Sharma',
        role: 'Co-Founder @ InnovateHub',
        rating: 5,
        date: 'April 2026',
        text: 'Transformed our rough product vision into a high-converting, stunning website. His dedication, UI aesthetics, and technical speed are truly impressive.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        verified: true
    }
];

let activeFilter = 'all';
let selectedRating = 5;

const getStoredReviews = () => {
    try {
        const stored = localStorage.getItem('ayush_portfolio_reviews');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to load reviews from localStorage', e);
        return [];
    }
};

const saveReviewsToStorage = (userReviews) => {
    try {
        localStorage.setItem('ayush_portfolio_reviews', JSON.stringify(userReviews));
    } catch (e) {
        console.error('Failed to save review to localStorage', e);
    }
};

const getAllReviews = () => {
    const customReviews = getStoredReviews();
    return [...customReviews, ...DEFAULT_REVIEWS];
};

const renderStarsSVG = (rating) => {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star-icon ${i <= rating ? 'filled' : ''}">★</span>`;
    }
    return starsHtml;
};

const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const renderMarqueeCard = (r) => `
    <div class="marquee-review-card pointer-enter">
        <div class="review-card-header">
            <div class="review-author-info">
                ${r.avatar ? 
                    `<img src="${r.avatar}" alt="${r.name}" class="review-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="review-avatar-fallback" style="display:none;">${getInitials(r.name)}</div>` :
                    `<div class="review-avatar-fallback">${getInitials(r.name)}</div>`
                }
                <div>
                    <h4 class="review-author-name">${r.name} ${r.verified ? '<span class="verified-badge" title="Verified Client">✓ Verified</span>' : ''}</h4>
                    <p class="review-author-role">${r.role}</p>
                </div>
            </div>
            <span class="review-date">${r.date}</span>
        </div>
        <div class="review-rating-row">
            ${renderStarsSVG(r.rating)}
        </div>
        <p class="review-text">"${r.text}"</p>
    </div>
`;

const renderReviews = () => {
    const grid = document.getElementById('reviewsGrid');
    const marqueeTrack = document.getElementById('reviewsMarqueeTrack');

    const reviews = getAllReviews();

    // 1. Populate Marquee Track (Duplicate array for seamless infinite marquee loop)
    if (marqueeTrack) {
        const loopCount = Math.max(3, Math.ceil(12 / (reviews.length || 1)));
        let marqueeHtml = '';
        for (let i = 0; i < loopCount; i++) {
            marqueeHtml += reviews.map(renderMarqueeCard).join('');
        }
        marqueeTrack.innerHTML = marqueeHtml;
    }

    // 2. Filtered Grid
    if (!grid) return;
    let filtered = reviews;

    if (activeFilter === '5') {
        filtered = reviews.filter(r => Number(r.rating) === 5);
    } else if (activeFilter === '4') {
        filtered = reviews.filter(r => Number(r.rating) >= 4 && Number(r.rating) < 5);
    } else if (activeFilter === 'recent') {
        filtered = [...reviews].reverse();
    }

    // Update Overall Stats
    const totalCount = reviews.length;
    const avgScore = totalCount > 0 
        ? (reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / totalCount).toFixed(1)
        : '5.0';

    const avgScoreEl = document.getElementById('reviewsAvgScore');
    const totalCountEl = document.getElementById('reviewsTotalCount');
    const avgStarsEl = document.getElementById('reviewsAvgStars');

    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    if (totalCountEl) totalCountEl.textContent = `Based on ${totalCount} review${totalCount === 1 ? '' : 's'}`;
    if (avgStarsEl) avgStarsEl.innerHTML = renderStarsSVG(Math.round(Number(avgScore)));

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-reviews-msg">
                <p>No reviews match this filter yet.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(r => `
        <div class="review-card pointer-enter" data-id="${r.id}">
            <div class="review-card-header">
                <div class="review-author-info">
                    ${r.avatar ? 
                        `<img src="${r.avatar}" alt="${r.name}" class="review-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="review-avatar-fallback" style="display:none;">${getInitials(r.name)}</div>` :
                        `<div class="review-avatar-fallback">${getInitials(r.name)}</div>`
                    }
                    <div>
                        <h4 class="review-author-name">${r.name} ${r.verified ? '<span class="verified-badge" title="Verified Client">✓ Verified</span>' : ''}</h4>
                        <p class="review-author-role">${r.role}</p>
                    </div>
                </div>
                <span class="review-date">${r.date}</span>
            </div>
            <div class="review-rating-row">
                ${renderStarsSVG(r.rating)}
            </div>
            <p class="review-text">"${r.text}"</p>
        </div>
    `).join('');
};

// Global Review Handlers
window.toggleReviewForm = function() {
    const box = document.getElementById('inlineReviewFormBox');
    const btnText = document.getElementById('writeReviewBtnText');
    if (!box) return;

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        if (btnText) btnText.textContent = 'Close Form';
        const firstInput = document.getElementById('reviewAuthor');
        if (firstInput) firstInput.focus();
    } else {
        box.style.display = 'none';
        if (btnText) btnText.textContent = 'Write a Review';
    }
};

window.filterReviews = function(filterType, btnEl) {
    activeFilter = filterType;
    const filterBtns = document.querySelectorAll('.review-filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    if (btnEl) {
        btnEl.classList.add('active');
    } else {
        const targetBtn = document.querySelector(`.review-filter-btn[data-filter="${filterType}"]`);
        if (targetBtn) targetBtn.classList.add('active');
    }
    renderReviews();
};

window.updateStarUI = function(val) {
    const picker = document.getElementById('starRatingPicker');
    if (!picker) return;
    const stars = picker.querySelectorAll('.star-pick');
    const display = document.getElementById('ratingLabelDisplay');

    stars.forEach(s => {
        const sVal = Number(s.dataset.value);
        if (sVal <= val) {
            s.classList.add('selected');
        } else {
            s.classList.remove('selected');
        }
    });
    if (display) display.textContent = `${val} / 5 Stars`;
};

window.setStarRating = function(val) {
    selectedRating = Number(val);
    window.updateStarUI(selectedRating);
};

window.previewStarRating = function(val) {
    window.updateStarUI(Number(val));
};

window.resetStarPreview = function() {
    window.updateStarUI(selectedRating);
};

window.handleReviewSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();

    const authorInput = document.getElementById('reviewAuthor');
    const roleInput = document.getElementById('reviewRole');
    const avatarInput = document.getElementById('reviewAvatar');
    const websiteInput = document.getElementById('reviewWebsite');
    const textInput = document.getElementById('reviewText');

    if (!authorInput || !roleInput || !textInput) return;

    const author = authorInput.value.trim();
    const role = roleInput.value.trim();
    const avatar = avatarInput ? avatarInput.value.trim() : '';
    const website = websiteInput ? websiteInput.value.trim() : '';
    const text = textInput.value.trim();

    if (!author || !role || !text) {
        if (!author) authorInput.style.borderColor = '#e7be08';
        if (!role) roleInput.style.borderColor = '#e7be08';
        if (!text) textInput.style.borderColor = '#e7be08';
        return;
    }

    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;

    const newReview = {
        id: 'user-' + Date.now(),
        name: author,
        role: role,
        rating: selectedRating,
        date: dateStr,
        text: text,
        avatar: avatar || null,
        website: website || null,
        verified: false
    };

    const existingCustom = getStoredReviews();
    existingCustom.unshift(newReview);
    saveReviewsToStorage(existingCustom);

    // Re-render reviews — new review will be first
    activeFilter = 'all';
    const filterBtns = document.querySelectorAll('.review-filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.review-filter-btn[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');

    renderReviews();

    // Close form box & reset button text
    const box = document.getElementById('inlineReviewFormBox');
    const btnText = document.getElementById('writeReviewBtnText');
    if (box) box.style.display = 'none';
    if (btnText) btnText.textContent = 'Write a Review';

    // Clear fields
    authorInput.value = '';
    roleInput.value = '';
    if (avatarInput) avatarInput.value = '';
    if (websiteInput) websiteInput.value = '';
    textInput.value = '';

    // Reset border colors
    [authorInput, roleInput, textInput].forEach(el => el.style.borderColor = '');

    // Reset avatar preview
    const previewImg = document.getElementById('reviewAvatarPreviewImg');
    const initials = document.getElementById('reviewAvatarInitials');
    if (previewImg) { previewImg.style.display = 'none'; previewImg.src = ''; }
    if (initials) { initials.textContent = '?'; initials.style.display = 'flex'; }

    selectedRating = 5;
    window.updateStarUI(5);

    // Toast notification
    const toast = document.getElementById('reviewToast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // Scroll to the reviews grid so user sees their review immediately
    const grid = document.getElementById('reviewsGrid');
    if (grid) {
        setTimeout(() => {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
};

// Live avatar preview in form
window.previewReviewAvatar = function(url) {
    const previewImg = document.getElementById('reviewAvatarPreviewImg');
    const initials = document.getElementById('reviewAvatarInitials');
    if (!previewImg || !initials) return;

    if (url && url.startsWith('http')) {
        previewImg.src = url;
        previewImg.style.display = 'block';
        initials.style.display = 'none';
        previewImg.onerror = () => {
            previewImg.style.display = 'none';
            initials.style.display = 'flex';
        };
    } else {
        previewImg.style.display = 'none';
        initials.style.display = 'flex';
    }
};

// Update initials bubble as user types their name
window.updateReviewInitials = function(name) {
    const initials = document.getElementById('reviewAvatarInitials');
    if (!initials) return;
    const previewImg = document.getElementById('reviewAvatarPreviewImg');
    if (previewImg && previewImg.style.display === 'block') return; // avatar is showing
    if (!name.trim()) { initials.textContent = '?'; return; }
    initials.textContent = getInitials(name);
};



// Unified Modal Overlay Listener — click outside to close + scroll to top
window.addEventListener("click", function (event) {
    const freelancePopup = document.getElementById("freelancePopup");
    const sponsorPopup = document.getElementById("sponsorPopup");
    const reviewModal = document.getElementById("reviewModal");

    if (freelancePopup && event.target === freelancePopup) {
        freelancePopup.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (sponsorPopup && event.target === sponsorPopup) {
        sponsorPopup.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (reviewModal && event.target === reviewModal) {
        window.closeReviewModal();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

// Render initial reviews immediately
renderReviews();

document.addEventListener('DOMContentLoaded', () => {
    renderReviews();
});



// Mouse Circle
const mouseCircle = document.querySelector(".mouse-circle");
const mouseDot = document.querySelector(".mouse-dot");

let mouseCircleBool = true;

const mouseCircleFn = (x, y) => {
    if (mouseCircle) {
        mouseCircleBool &&
            (mouseCircle.style.cssText = `top: ${y}px; left: ${x}px; opacity:1`);
    }
    if (mouseDot) {
        mouseDot.style.cssText = `top: ${y}px; left: ${x}px; opacity:1`;
    }
};
// End of Mouse Circle

// Animated Circles
const circles = document.querySelectorAll(".circle");
const mainImg = document.querySelector(".main-circle img");

let mX = 0;
let mY = 0;
const z = 100;
const animateCircles = (e, x, y) => {
    if (!mainImg) return;
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
    if (!mouseCircle) return;
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
    if (mouseCircle) mouseCircle.style.opacity = "0";
    if (mouseDot) mouseDot.style.opacity = "0";
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
        if (!imageWrapper.firstElementChild) return;
        pageHeight = imageWrapper.firstElementChild.scrollHeight;
        scrolledPortion = imageWrapper.scrollTop;
    }

    const denominator = pageHeight - pageViewportHeight;
    const scrolledPortionDegree = denominator > 0 ? (scrolledPortion / denominator) * 360 : 0;

    if (halfCircles && halfCircles.length > 0) {
        halfCircles.forEach((el) => {
            el.style.transform = `rotate(${scrolledPortionDegree}deg)`;

            if (scrolledPortionDegree >= 180) {
                if (halfCircles[0]) halfCircles[0].style.transform = "rotate(180deg)";
                if (halfCircleTop) halfCircleTop.style.opacity = "0";
            } else {
                if (halfCircleTop) halfCircleTop.style.opacity = "1";
            }
        });
    }
    const scrollBool = scrolledPortion + pageViewportHeight - 0.5 === pageHeight;

    // Arrow Rotation
    if (progressBarCircle) {
        if (scrollBool) {
            progressBarCircle.style.transform = "rotate(180deg)";
        } else {
            progressBarCircle.style.transform = "rotate(0)";
        }
    }
};

// Progress Bar Click
if (progressBar) {
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
}

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
if (aboutMeText) {
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
}

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

function openProjectPreview(thumbSrc, altText) {
    const dotIndex = thumbSrc.lastIndexOf(".");
    const basePath = dotIndex > -1 ? thumbSrc.slice(0, dotIndex) : thumbSrc;
    const ext = dotIndex > -1 ? thumbSrc.slice(dotIndex) : ".png";
    const bigSrc = `${basePath}-big${ext}`;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "project-img-wrapper";

    const viewport = document.createElement("div");
    viewport.className = "project-img-viewport";

    const bigImg = document.createElement("img");
    bigImg.className = "project-img";
    bigImg.src = bigSrc;
    bigImg.alt = altText || "Project preview";
    bigImg.draggable = false;

    const toolbar = document.createElement("div");
    toolbar.className = "project-zoom-toolbar";
    toolbar.innerHTML = `
        <button type="button" class="project-zoom-btn" data-action="out" aria-label="Zoom out">−</button>
        <span class="project-zoom-level">100%</span>
        <button type="button" class="project-zoom-btn" data-action="in" aria-label="Zoom in">+</button>
        <button type="button" class="project-zoom-btn" data-action="reset">Reset</button>
        <button type="button" class="project-zoom-btn" data-action="fit">Fit</button>
    `;

    const hint = document.createElement("div");
    hint.className = "project-zoom-hint";
    hint.textContent = "Use + / − buttons, mouse wheel, or pinch to zoom • Drag to pan";

    viewport.appendChild(bigImg);
    imageWrapper.appendChild(viewport);
    imageWrapper.appendChild(toolbar);
    imageWrapper.appendChild(hint);
    document.body.appendChild(imageWrapper);
    document.body.style.overflowY = "hidden";
    document.removeEventListener("scroll", onScroll);
    if (mouseCircle) mouseCircle.style.opacity = 0;
    if (projectHideBtn) projectHideBtn.classList.add("change");

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let originX = 0;
    let originY = 0;

    const levelEl = toolbar.querySelector(".project-zoom-level");
    const minScale = 0.4;
    const maxScale = 3;

    const applyTransform = () => {
        bigImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        if (levelEl) levelEl.textContent = `${Math.round(scale * 100)}%`;
    };

    const clampScale = (value) => Math.min(maxScale, Math.max(minScale, value));

    const setScale = (nextScale, centerX, centerY) => {
        const prevScale = scale;
        scale = clampScale(nextScale);

        if (typeof centerX === "number" && typeof centerY === "number") {
            const ratio = scale / prevScale;
            translateX = centerX - (centerX - translateX) * ratio;
            translateY = centerY - (centerY - translateY) * ratio;
        }

        applyTransform();
    };

    const fitToScreen = () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
        viewport.scrollTop = 0;
        viewport.scrollLeft = 0;
    };

    toolbar.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-action]");
        if (!btn) return;
        event.stopPropagation();

        if (btn.dataset.action === "in") setScale(scale + 0.2);
        if (btn.dataset.action === "out") setScale(scale - 0.2);
        if (btn.dataset.action === "reset") fitToScreen();
        if (btn.dataset.action === "fit") fitToScreen();
    });

    viewport.addEventListener("wheel", (event) => {
        event.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const centerX = event.clientX - rect.left + viewport.scrollLeft;
        const centerY = event.clientY - rect.top + viewport.scrollTop;
        const delta = event.deltaY > 0 ? -0.12 : 0.12;
        setScale(scale + delta, centerX, centerY);
    }, { passive: false });

    viewport.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        isDragging = true;
        viewport.classList.add("is-dragging");
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        originX = translateX;
        originY = translateY;
    });

    window.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        translateX = originX + (event.clientX - dragStartX);
        translateY = originY + (event.clientY - dragStartY);
        applyTransform();
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        viewport.classList.remove("is-dragging");
    });

    const closePreview = () => {
        if (projectHideBtn) projectHideBtn.classList.remove("change");
        imageWrapper.remove();
        document.body.style.overflowY = "scroll";
        document.addEventListener("scroll", onScroll);
        progressBarFn();
    };

    if (projectHideBtn) projectHideBtn.onclick = closePreview;

    imageWrapper.addEventListener("click", (event) => {
        if (event.target === imageWrapper || event.target === viewport) closePreview();
    });

    bigImg.addEventListener("click", (event) => event.stopPropagation());
    toolbar.addEventListener("click", (event) => event.stopPropagation());
    hint.addEventListener("click", (event) => event.stopPropagation());

    bigImg.addEventListener("load", fitToScreen);
    applyTransform();
}

projects.forEach((project) => {
    project.addEventListener("mouseenter", () => {
        const img = project.firstElementChild;
        if (!img) return;
        img.style.transform = "scale(1.02)";
    });
    project.addEventListener("mouseleave", () => {
        const img = project.firstElementChild;
        if (!img) return;
        img.style.transform = "";
    });

    project.addEventListener("click", () => {
        const thumb = project.firstElementChild;
        if (!thumb) return;
        openProjectPreview(thumb.getAttribute("src"), thumb.getAttribute("alt"));
    });
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

if (projectsBtn) {
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
}
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

window.addEventListener("click", function (event) {
    const freelancePopup = document.getElementById("freelancePopup");
    const sponsorPopup = document.getElementById("sponsorPopup");

    if (freelancePopup && event.target === freelancePopup) {
        freelancePopup.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (sponsorPopup && event.target === sponsorPopup) {
        sponsorPopup.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});


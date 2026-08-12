(function () {
    "use strict";

    const DEFAULT_REVIEWS = [
        {
            id: "rev-1",
            name: "Sarah Jenkins",
            role: "Product Lead @ TechCorp",
            rating: 5,
            date: "July 2026",
            text: "Ayush delivered our full-stack web application on time with flawless animations and responsive design. His attention to detail and performance optimization is top-notch!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            verified: true,
        },
        {
            id: "rev-2",
            name: "Alex Rivera",
            role: "Founder @ AI Launchpad",
            rating: 5,
            date: "June 2026",
            text: "Outstanding work on our AI automation pipeline and UI integration. Ayush turned complex backend requirements into a smooth, user-friendly interface. Highly recommended!",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            verified: true,
        },
        {
            id: "rev-3",
            name: "Marcus Vance",
            role: "Engineering Manager @ DevFlow",
            rating: 5,
            date: "May 2026",
            text: "Collaborating with Ayush was a fantastic experience. Exceptional mastery in Next.js, Node.js, and clean code practices. Will definitely hire again.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            verified: true,
        },
        {
            id: "rev-4",
            name: "Priya Sharma",
            role: "Co-Founder @ InnovateHub",
            rating: 5,
            date: "April 2026",
            text: "Transformed our rough product vision into a high-converting, stunning website. His dedication, UI aesthetics, and technical speed are truly impressive.",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            verified: true,
        },
    ];

    let activeFilter = "all";
    let selectedRating = 5;
    let uploadedAvatarData = null;

    const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
    const AVATAR_MAX_PX = 200;

    function getStoredReviews() {
        try {
            const stored = localStorage.getItem("ayush_portfolio_reviews");
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load reviews from localStorage", error);
            return [];
        }
    }

    function saveReviewsToStorage(userReviews) {
        try {
            localStorage.setItem("ayush_portfolio_reviews", JSON.stringify(userReviews));
            return true;
        } catch (error) {
            console.error("Failed to save review to localStorage", error);
            return false;
        }
    }

    function getAllReviews() {
        return [...getStoredReviews(), ...DEFAULT_REVIEWS];
    }

    function renderStars(rating) {
        let html = "";
        for (let i = 1; i <= 5; i += 1) {
            html += `<span class="star-icon ${i <= rating ? "filled" : ""}">★</span>`;
        }
        return html;
    }

    function getInitials(name) {
        if (!name) return "A";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function renderAvatar(review) {
        if (review.avatar) {
            const safeName = escapeHtml(review.name);
            const safeAvatar = escapeHtml(review.avatar);
            return `<img src="${safeAvatar}" alt="${safeName}" class="review-avatar-img" loading="lazy" /><div class="review-avatar-fallback" hidden>${getInitials(review.name)}</div>`;
        }
        return `<div class="review-avatar-fallback">${getInitials(review.name)}</div>`;
    }

    function renderReviewCard(review, cardClass) {
        const verifiedBadge = review.verified
            ? '<span class="verified-badge" title="Verified Client">✓ Verified</span>'
            : "";

        return `
        <article class="${cardClass}" data-id="${escapeHtml(review.id)}">
            <div class="review-card-header">
                <div class="review-author-info">
                    ${renderAvatar(review)}
                    <div>
                        <h4 class="review-author-name">${escapeHtml(review.name)} ${verifiedBadge}</h4>
                        <p class="review-author-role">${escapeHtml(review.role)}</p>
                    </div>
                </div>
                <span class="review-date">${escapeHtml(review.date)}</span>
            </div>
            <div class="review-rating-row">${renderStars(Number(review.rating))}</div>
            <p class="review-text">"${escapeHtml(review.text)}"</p>
        </article>`;
    }

    function renderReviews() {
        const grid = document.getElementById("reviewsGrid");
        const marqueeTrack = document.getElementById("reviewsMarqueeTrack");
        const reviews = getAllReviews();

        if (marqueeTrack) {
            const loopCount = Math.max(3, Math.ceil(12 / Math.max(reviews.length, 1)));
            let marqueeHtml = "";
            for (let i = 0; i < loopCount; i += 1) {
                marqueeHtml += reviews.map((review) => renderReviewCard(review, "marquee-review-card")).join("");
            }
            marqueeTrack.innerHTML = marqueeHtml;
        }

        if (!grid) return;

        let filtered = reviews;
        if (activeFilter === "5") {
            filtered = reviews.filter((review) => Number(review.rating) === 5);
        } else if (activeFilter === "4") {
            filtered = reviews.filter((review) => Number(review.rating) >= 4 && Number(review.rating) < 5);
        } else if (activeFilter === "recent") {
            filtered = [...reviews].reverse();
        }

        const totalCount = reviews.length;
        const avgScore =
            totalCount > 0
                ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalCount).toFixed(1)
                : "5.0";

        const avgScoreEl = document.getElementById("reviewsAvgScore");
        const totalCountEl = document.getElementById("reviewsTotalCount");
        const avgStarsEl = document.getElementById("reviewsAvgStars");

        if (avgScoreEl) avgScoreEl.textContent = avgScore;
        if (totalCountEl) {
            totalCountEl.textContent = `Based on ${totalCount} review${totalCount === 1 ? "" : "s"}`;
        }
        if (avgStarsEl) avgStarsEl.innerHTML = renderStars(Math.round(Number(avgScore)));

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="no-reviews-msg"><p>No reviews match this filter yet.</p></div>';
            return;
        }

        grid.innerHTML = filtered.map((review) => renderReviewCard(review, "review-card")).join("");

        grid.querySelectorAll(".review-avatar-img").forEach((img) => {
            img.addEventListener("error", () => {
                img.hidden = true;
                const fallback = img.nextElementSibling;
                if (fallback) fallback.hidden = false;
            });
        });
    }

    function toggleReviewForm(forceOpen) {
        const box = document.getElementById("inlineReviewFormBox");
        const btnText = document.getElementById("writeReviewBtnText");
        if (!box) return;

        const shouldOpen =
            typeof forceOpen === "boolean" ? forceOpen : !box.classList.contains("is-open");

        box.classList.toggle("is-open", shouldOpen);
        if (btnText) {
            btnText.textContent = shouldOpen ? "Close Form" : "Write a Review";
        }

        if (shouldOpen) {
            const firstInput = document.getElementById("reviewAuthor");
            if (firstInput) {
                window.setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    function updateStarUI(value) {
        const picker = document.getElementById("starRatingPicker");
        const display = document.getElementById("ratingLabelDisplay");
        if (!picker) return;

        picker.querySelectorAll(".star-pick").forEach((star) => {
            star.classList.toggle("selected", Number(star.dataset.value) <= value);
        });

        if (display) display.textContent = `${value} / 5 Stars`;
    }

    function filterReviews(filterType, btnEl) {
        activeFilter = filterType;
        document.querySelectorAll(".review-filter-btn").forEach((btn) => {
            btn.classList.remove("active");
        });
        if (btnEl) {
            btnEl.classList.add("active");
        }
        renderReviews();
    }

    function setAvatarPreview(url) {
        const previewImg = document.getElementById("reviewAvatarPreviewImg");
        const initials = document.getElementById("reviewAvatarInitials");
        if (!previewImg || !initials) return;

        if (url) {
            previewImg.src = url;
            previewImg.hidden = false;
            initials.hidden = true;
            previewImg.onerror = () => {
                previewImg.hidden = true;
                previewImg.removeAttribute("src");
                initials.hidden = false;
            };
        } else {
            previewImg.hidden = true;
            previewImg.removeAttribute("src");
            initials.hidden = false;
        }
    }

    function compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const scale = Math.min(1, AVATAR_MAX_PX / Math.max(img.width, img.height));
                    const width = Math.max(1, Math.round(img.width * scale));
                    const height = Math.max(1, Math.round(img.height * scale));
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) {
                        reject(new Error("Could not process image"));
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.82));
                };
                img.onerror = () => reject(new Error("Invalid image file"));
                img.src = reader.result;
            };
            reader.onerror = () => reject(new Error("Could not read file"));
            reader.readAsDataURL(file);
        });
    }

    function showUploadHint(message, isError) {
        const hint = document.getElementById("reviewUploadHint");
        if (!hint) return;
        hint.textContent = message;
        hint.classList.toggle("is-error", Boolean(isError));
    }

    async function handleAvatarUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showUploadHint("Please choose a valid image file.", true);
            event.target.value = "";
            return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
            showUploadHint("Image must be 2MB or smaller.", true);
            event.target.value = "";
            return;
        }

        try {
            uploadedAvatarData = await compressImage(file);
            setAvatarPreview(uploadedAvatarData);
            showUploadHint(file.name, false);
        } catch (error) {
            showUploadHint("Could not upload this image. Try another file.", true);
            uploadedAvatarData = null;
            setAvatarPreview("");
            event.target.value = "";
        }
    }

    function resetAvatarUpload() {
        uploadedAvatarData = null;
        const uploadInput = document.getElementById("reviewAvatarUpload");
        if (uploadInput) uploadInput.value = "";
        setAvatarPreview("");
        showUploadHint("JPG, PNG, WEBP — max 2MB", false);
    }

    function updateReviewInitials(name) {
        const initials = document.getElementById("reviewAvatarInitials");
        const previewImg = document.getElementById("reviewAvatarPreviewImg");
        if (!initials) return;
        if (previewImg && !previewImg.hidden) return;
        initials.textContent = name.trim() ? getInitials(name) : "?";
    }

    function handleReviewSubmit(event) {
        event.preventDefault();

        const authorInput = document.getElementById("reviewAuthor");
        const roleInput = document.getElementById("reviewRole");
        const websiteInput = document.getElementById("reviewWebsite");
        const textInput = document.getElementById("reviewText");

        if (!authorInput || !roleInput || !textInput) return;

        const author = authorInput.value.trim();
        const role = roleInput.value.trim();
        const text = textInput.value.trim();

        if (!author || !role || !text) {
            if (!author) authorInput.style.borderColor = "#e7be08";
            if (!role) roleInput.style.borderColor = "#e7be08";
            if (!text) textInput.style.borderColor = "#e7be08";
            return;
        }

        const now = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const newReview = {
            id: "user-" + Date.now(),
            name: author,
            role: role,
            rating: selectedRating,
            date: `${months[now.getMonth()]} ${now.getFullYear()}`,
            text: text,
            avatar: uploadedAvatarData,
            website: websiteInput && websiteInput.value.trim() ? websiteInput.value.trim() : null,
            verified: false,
        };

        const stored = getStoredReviews();
        stored.unshift(newReview);
        if (!saveReviewsToStorage(stored)) {
            showUploadHint("Could not save review. Try a smaller photo.", true);
            return;
        }

        activeFilter = "all";
        document.querySelectorAll(".review-filter-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.filter === "all");
        });

        renderReviews();
        toggleReviewForm(false);

        authorInput.value = "";
        roleInput.value = "";
        if (websiteInput) websiteInput.value = "";
        textInput.value = "";
        [authorInput, roleInput, textInput].forEach((input) => {
            input.style.borderColor = "";
        });

        resetAvatarUpload();
        selectedRating = 5;
        updateStarUI(5);

        const toast = document.getElementById("reviewToast");
        if (toast) {
            toast.classList.add("show");
            window.setTimeout(() => toast.classList.remove("show"), 4000);
        }

        const grid = document.getElementById("reviewsGrid");
        if (grid && typeof grid.scrollIntoView === "function") {
            window.setTimeout(() => {
                grid.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 200);
        }
    }

    function initReviews() {
        const section = document.getElementById("section-reviews");
        if (!section) return;

        section.dataset.reviewsReady = "true";

        document.getElementById("toggleReviewFormBtn")?.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleReviewForm();
        });

        document.getElementById("closeReviewFormBtn")?.addEventListener("click", (event) => {
            event.preventDefault();
            toggleReviewForm(false);
        });

        document.getElementById("reviewForm")?.addEventListener("submit", handleReviewSubmit);

        document.getElementById("reviewAvatarUpload")?.addEventListener("change", handleAvatarUpload);

        document.getElementById("reviewAuthor")?.addEventListener("input", (event) => {
            updateReviewInitials(event.target.value);
        });

        const starPicker = document.getElementById("starRatingPicker");
        if (starPicker) {
            starPicker.querySelectorAll(".star-pick").forEach((star) => {
                star.addEventListener("click", () => {
                    selectedRating = Number(star.dataset.value);
                    updateStarUI(selectedRating);
                });
                star.addEventListener("mouseenter", () => {
                    updateStarUI(Number(star.dataset.value));
                });
            });
            starPicker.addEventListener("mouseleave", () => {
                updateStarUI(selectedRating);
            });
        }

        document.querySelectorAll(".review-filter-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                filterReviews(btn.dataset.filter, btn);
            });
        });

        updateStarUI(selectedRating);
        renderReviews();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initReviews);
    } else {
        initReviews();
    }
})();

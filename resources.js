// Resources Hub Logic Dashboard

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Systems
    initNavbarMenu();
    initTabNavigation();
    initCheatSheetNavigation();
    initRoadmaps();
    initUploaderSystem();
    initCustomCursor();
    updateDashboardStats();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbarMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const navbarLinks = document.getElementById("navbar-links");

    if (menuBtn && navbarLinks) {
        menuBtn.addEventListener("click", () => {
            const expanded = menuBtn.getAttribute("aria-expanded") === "true";
            menuBtn.setAttribute("aria-expanded", !expanded);
            navbarLinks.classList.toggle("change");
        });
    }
}

function initTabNavigation() {
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetTabId = link.getAttribute("data-tab");
            
            // Switch active link
            tabLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Switch active pane
            tabPanes.forEach(pane => {
                pane.classList.remove("active");
                if (pane.id === targetTabId) {
                    pane.classList.add("active");
                }
            });
        });
    });
}

// Global function to switch tabs from dashboard card clicks
window.switchTab = function(tabId) {
    const targetLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
    if (targetLink) {
        targetLink.click();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};


/* ==========================================================================
   2. CHEAT SHEETS
   ========================================================================== */
function initCheatSheetNavigation() {
    const sidebarBtns = document.querySelectorAll(".sheet-sidebar-btn");
    const sheetContents = document.querySelectorAll(".sheet-content");

    sidebarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetSheetId = btn.getAttribute("data-sheet");

            sidebarBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            sheetContents.forEach(content => {
                content.classList.remove("active");
                if (content.id === targetSheetId) {
                    content.classList.add("active");
                }
            });
        });
    });
}

// Copy Code Snippet
window.copyCode = function(button) {
    const codeBlock = button.nextElementSibling.querySelector("code");
    if (!codeBlock) return;

    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        const originalText = button.textContent;
        button.textContent = "Copied!";
        button.style.background = "#e7be08";
        button.style.color = "#000";

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = "";
            button.style.color = "";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy code: ", err);
    });
};

/* ==========================================================================
   3. INTERACTIVE ROADMAPS
   ========================================================================== */
function initRoadmaps() {
    // Load checkbox completion status from LocalStorage
    const completedNodes = JSON.parse(localStorage.getItem("ayush_completed_roadmap_nodes")) || {};

    // Apply saved completions
    Object.keys(completedNodes).forEach(nodeId => {
        const checkbox = document.getElementById(nodeId);
        if (checkbox) {
            checkbox.checked = completedNodes[nodeId];
            const node = checkbox.closest(".roadmap-node");
            if (node) {
                if (completedNodes[nodeId]) {
                    node.classList.add("completed");
                } else {
                    node.classList.remove("completed");
                }
            }
        }
    });

    // Update progress lines initial render
    updateRoadmapProgress("frontend");
    updateRoadmapProgress("backend");
}

window.selectRoadmap = function(roadmapType) {
    const feBtn = document.querySelector(".roadmap-sel-btn:nth-child(1)");
    const beBtn = document.querySelector(".roadmap-sel-btn:nth-child(2)");
    const feRoadmap = document.getElementById("frontend-roadmap");
    const beRoadmap = document.getElementById("backend-roadmap");

    if (roadmapType === "frontend") {
        feBtn.classList.add("active");
        beBtn.classList.remove("active");
        feRoadmap.classList.add("active");
        beRoadmap.classList.remove("active");
    } else {
        feBtn.classList.remove("active");
        beBtn.classList.add("active");
        feRoadmap.classList.remove("active");
        beRoadmap.classList.add("active");
    }
};

window.toggleNodeStatus = function(nodeIdShort, checkbox) {
    const node = checkbox.closest(".roadmap-node");
    if (!node) return;

    if (checkbox.checked) {
        node.classList.add("completed");
    } else {
        node.classList.remove("completed");
    }

    // Save state in LocalStorage
    const completedNodes = JSON.parse(localStorage.getItem("ayush_completed_roadmap_nodes")) || {};
    completedNodes[checkbox.id] = checkbox.checked;
    localStorage.setItem("ayush_completed_roadmap_nodes", JSON.stringify(completedNodes));

    // Update progress visual
    const roadmapType = checkbox.id.startsWith("fe-") ? "frontend" : "backend";
    updateRoadmapProgress(roadmapType);
};

function updateRoadmapProgress(roadmapType) {
    const container = document.getElementById(`${roadmapType}-roadmap`);
    if (!container) return;

    const totalNodes = container.querySelectorAll(".roadmap-node").length;
    const completedNodes = container.querySelectorAll(".roadmap-node.completed").length;
    const progressFill = document.getElementById(`${roadmapType}-progress`);

    if (progressFill && totalNodes > 0) {
        // Calculate progress percentage
        // If 0 nodes completed, 0% height. If all, 100% height.
        let percentage = (completedNodes / totalNodes) * 100;
        
        // Adjust padding heights for perfect line align
        if (completedNodes === 0) {
            percentage = 0;
        } else if (completedNodes === totalNodes) {
            percentage = 100;
        }
        
        progressFill.style.height = `${percentage}%`;
    }
}


/* ==========================================================================
   4. LOCAL STORAGE FILE UPLOADER
   ========================================================================== */
let selectedFile = null;

function initUploaderSystem() {
    const form = document.getElementById("study-upload-form");
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("upload-file");
    const itemsList = document.getElementById("uploaded-items-list");
    const exportBtn = document.getElementById("export-json-btn");

    if (!form) return;

    // Trigger File Input click on drop zone click
    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    // File Input change
    fileInput.addEventListener("change", (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag over effect
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    // Drag leave
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    // Drop file
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
            fileInput.files = e.dataTransfer.files; // link drop to form file input
        }
    });

    // Handle Form Submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("upload-title").value.trim();
        const category = document.getElementById("upload-category").value;
        const link = document.getElementById("upload-link").value.trim();
        const desc = document.getElementById("upload-desc").value.trim();

        if (!selectedFile) {
            alert("Please select a file to attach.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert("File is too large. Max size is 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const fileData = event.target.result; // base64 URL

            const uploadItem = {
                id: "res_" + Date.now(),
                title,
                category,
                link,
                desc,
                fileName: selectedFile.name,
                fileType: selectedFile.type,
                fileSize: formatBytes(selectedFile.size),
                fileData,
                uploadDate: new Date().toLocaleDateString()
            };

            saveUploadItem(uploadItem);
            form.reset();
            resetDragDropZone();
            renderUploadList();
            updateDashboardStats();
        };

        reader.readAsDataURL(selectedFile);
    });

    // Export JSON Config
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const uploads = JSON.parse(localStorage.getItem("ayush_portfolio_resources")) || [];
            if (uploads.length === 0) {
                alert("No custom resources to export.");
                return;
            }

            // Exclude large raw base64 data to keep JSON light if they just want structural mappings, 
            // but let's include it so they have a full backup config!
            const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(uploads, null, 2));
            const dlAnchor = document.createElement("a");
            dlAnchor.setAttribute("href", jsonString);
            dlAnchor.setAttribute("download", `resources_config_${Date.now()}.json`);
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
        });
    }

    // Search input handler
    const searchInput = document.getElementById("resource-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterResources(query);
        });
    }

    // Initial render
    renderUploadList();
}

function handleFileSelect(file) {
    if (!file) return;
    selectedFile = file;

    const dropZone = document.getElementById("drop-zone");
    const fileInfoText = dropZone.querySelector(".file-info-text");
    const instructionP = dropZone.querySelector("p");

    instructionP.innerHTML = `Selected File: <strong style="color: #e7be08;">${file.name}</strong>`;
    fileInfoText.textContent = `Size: ${formatBytes(file.size)} | Click or Drop again to change.`;
}

function resetDragDropZone() {
    selectedFile = null;
    const dropZone = document.getElementById("drop-zone");
    const fileInfoText = dropZone.querySelector(".file-info-text");
    const instructionP = dropZone.querySelector("p");

    instructionP.innerHTML = `Drag and drop your file here, or <span class="browse-link">browse</span>`;
    fileInfoText.textContent = "Supports PDF, Images, JSON, TXT (Max 5MB)";
}

function saveUploadItem(item) {
    const currentUploads = JSON.parse(localStorage.getItem("ayush_portfolio_resources")) || [];
    currentUploads.push(item);
    localStorage.setItem("ayush_portfolio_resources", JSON.stringify(currentUploads));
}

function getUploadedItems() {
    return JSON.parse(localStorage.getItem("ayush_portfolio_resources")) || [];
}

window.deleteUploadItem = function(id) {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    
    let currentUploads = JSON.parse(localStorage.getItem("ayush_portfolio_resources")) || [];
    currentUploads = currentUploads.filter(item => item.id !== id);
    localStorage.setItem("ayush_portfolio_resources", JSON.stringify(currentUploads));

    renderUploadList();
    updateDashboardStats();
};

function renderUploadList() {
    const listContainer = document.getElementById("uploaded-items-list");
    const uploads = getUploadedItems();

    if (!listContainer) return;

    if (uploads.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state-message">
                <span>📂</span>
                <p>No custom study files uploaded yet.</p>
                <p class="sub-empty-text">Fill out the form on the left to add your cheatsheets or roadmaps!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = "";
    uploads.forEach(item => {
        const card = document.createElement("div");
        card.className = "upload-item-card";
        
        // Verify external reference link
        let linkHTML = "";
        if (item.link) {
            linkHTML = `<a href="${item.link}" target="_blank" class="item-action-btn view-btn pointer-enter">Source Link 🌐</a>`;
        }

        card.innerHTML = `
            <div class="card-header-row">
                <div>
                    <span class="item-category-badge">${item.category}</span>
                    <h3 style="margin-top: 0.6rem;">${item.title}</h3>
                </div>
                <span style="font-size: 1.1rem; color: #555; font-family: 'Poppins', sans-serif;">${item.uploadDate}</span>
            </div>
            <p>${item.desc}</p>
            <div class="card-meta-info">
                <span>📄 File: ${item.fileName}</span>
                <span>⚖️ Size: ${item.fileSize}</span>
            </div>
            <div class="actions-row">
                ${linkHTML}
                <a href="${item.fileData}" download="${item.fileName}" class="item-action-btn dl-btn pointer-enter">Download File 📥</a>
                <button onclick="deleteUploadItem('${item.id}')" class="item-action-btn del-btn pointer-enter">Delete 🗑️</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function updateDashboardStats() {
    const uploadsCountEl = document.getElementById("stat-uploads-count");
    const uploads = getUploadedItems();
    if (uploadsCountEl) {
        uploadsCountEl.textContent = uploads.length;
    }
}

// Format bytes to human readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


/* ==========================================================================
   5. SEARCH FILTER FINDER
   ========================================================================== */
function filterResources(query) {
    // 1. Filter Cheatsheet sections
    const sheetSections = document.querySelectorAll(".sheet-section");
    sheetSections.forEach(section => {
        const textContent = section.textContent.toLowerCase();
        if (textContent.includes(query)) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });

    // Hide empty sheets if all sections inside are hidden
    const sheetContents = document.querySelectorAll(".sheet-content");
    sheetContents.forEach(content => {
        const visibleSections = content.querySelectorAll('.sheet-section[style="display: block;"]').length;
        const totalSecs = content.querySelectorAll('.sheet-section').length;
        
        // If search query is empty, reset display style
        if (query === "") {
            content.querySelectorAll('.sheet-section').forEach(s => s.style.display = "block");
        }
    });

    // 2. Filter roadmap nodes
    const nodes = document.querySelectorAll(".roadmap-node");
    nodes.forEach(node => {
        const titleText = node.querySelector("h3").textContent.toLowerCase();
        const descText = node.querySelector("p").textContent.toLowerCase();
        if (titleText.includes(query) || descText.includes(query)) {
            node.style.opacity = "1";
            node.style.transform = "scale(1)";
        } else if (query !== "") {
            node.style.opacity = "0.3";
            node.style.transform = "scale(0.95)";
        } else {
            node.style.opacity = "1";
            node.style.transform = "scale(1)";
        }
    });

    // 3. Filter My Uploads cards
    const uploadCards = document.querySelectorAll(".upload-item-card");
    uploadCards.forEach(card => {
        const textContent = card.textContent.toLowerCase();
        if (textContent.includes(query)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}


/* ==========================================================================
   6. SIGNATURE INTERACTIVE CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const mouseCircle = document.querySelector(".mouse-circle");
    const mouseDot = document.querySelector(".mouse-dot");
    
    if (!mouseCircle || !mouseDot) return;

    let mouseCircleBool = true;
    let hoveredElPosition = [];

    const mouseCircleFn = (x, y) => {
        if (mouseCircleBool) {
            mouseCircle.style.cssText = `top: ${y}px; left: ${x}px; opacity: 1;`;
        }
        mouseDot.style.cssText = `top: ${y}px; left: ${x}px; opacity: 1;`;
    };

    const stickyElement = (x, y, hoveredEl) => {
        if (hoveredEl && hoveredEl.classList.contains("sticky")) {
            if (hoveredElPosition.length < 1) {
                hoveredElPosition = [hoveredEl.offsetTop, hoveredEl.offsetLeft];
            }

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
    };

    const mouseCircleTransform = (hoveredEl) => {
        if (hoveredEl && hoveredEl.classList.contains("pointer-enter")) {
            hoveredEl.onmousemove = () => {
                mouseCircleBool = false;
                const rect = hoveredEl.getBoundingClientRect();
                mouseCircle.style.cssText = `
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    top: ${rect.top}px;
                    left: ${rect.left}px;
                    opacity: 1;
                    transform: translate(0,0);
                    animation: none;
                    border-radius: ${getComputedStyle(hoveredEl).borderRadius};
                    transition: width .3s, height .3s, top .3s, left .3s, transform .3s, border-radius .3s;
                `;
            };

            hoveredEl.onmouseleave = () => {
                mouseCircleBool = true;
                mouseCircle.style.width = "6rem";
                mouseCircle.style.height = "6rem";
                mouseCircle.style.animation = "mouseCircleAnim 10s infinite linear";
            };
        }
    };

    document.body.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;

        mouseCircleFn(x, y);

        const hoveredEl = document.elementFromPoint(x, y);
        if (hoveredEl) {
            stickyElement(x, y, hoveredEl);
            mouseCircleTransform(hoveredEl);
        }
    });

    document.body.addEventListener("mouseleave", () => {
        mouseCircle.style.opacity = "0";
        mouseDot.style.opacity = "0";
    });
}

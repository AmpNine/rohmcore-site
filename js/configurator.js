const modelViewer = document.querySelector("#product-viewer");

let currentConfiguration = {
    'Mat_Base': null, 
    'Mat_Top': null,
    'Mat_DesignMain': null,
    'Mat_DesignSub': null
};

// --- 1. MENU LOGIC (Updated for Mobile Tabs) ---
window.toggleMenu = (button) => {
    const item = button.parentElement;
    
    // If we are on mobile (screen width 768px or less), close all other panels first
    if (window.innerWidth <= 768) {
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach(i => {
            if (i !== item) i.classList.remove('active');
        });
    }
    
    item.classList.toggle('active');
};

// New function to handle the "Close" button inside the mobile popups
window.closeMobilePopup = (button) => {
    const item = button.closest('.accordion-item');
    if(item) item.classList.remove('active');
};

// --- 2. MODEL SWITCHER ---
window.switchModel = (newSrc) => {
    modelViewer.src = newSrc;
};

// --- 3. COLOR CHANGER & PERSISTENCE ---
window.changeColor = (materialName, hex) => {
    currentConfiguration[materialName] = hex; 
    applyColorToModel(materialName, hex);     
};

function applyColorToModel(materialName, hex) {
    if (!modelViewer.model) return;
    
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    if (material) {
        const rgb = hexToRgb(hex);
        material.pbrMetallicRoughness.setBaseColorFactor([rgb.r/255, rgb.g/255, rgb.b/255, 1]);
    } else {
        console.warn(`Material "${materialName}" not found in this model.`);
    }
}

modelViewer.addEventListener('load', () => {
    Object.keys(currentConfiguration).forEach(matName => {
        const savedColor = currentConfiguration[matName];
        if (savedColor) {
            applyColorToModel(matName, savedColor);
        }
    });
});

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}
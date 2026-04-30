const modelViewer = document.querySelector("#product-viewer");
const layoutContainer = document.querySelector(".configurator-layout");

// 1. Initial Color State (Declared ONLY ONCE)
let currentConfiguration = {
    'Mat_Base': '#D9CAAF', 
    'Mat_Top': '#D9CAAF',
    'Mat_DesignMain': '#302A5A',
    'Mat_DesignSub': '#FF972F'
};

// --- MENU & UI LOGIC ---

window.toggleMenu = (button) => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close others
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
    
    if (!isActive) {
        item.classList.add('active');
        layoutContainer.classList.add('menu-is-open');
    } else {
        layoutContainer.classList.remove('menu-is-open');
    }
};

window.closeMobilePopup = (button) => {
    const item = button.closest('.accordion-item');
    if(item) item.classList.remove('active');
    layoutContainer.classList.remove('menu-is-open');
};

function updateDropdownLabels(activeSrc) {
    const selector = document.querySelector("#design-selector");
    const options = selector.options;

    for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        
        let cleanName = opt.text.replace('• ', '').replace(' (Selected)', '');
        
        if (opt.value === activeSrc) {
            opt.text = `• ${cleanName}`; 
            opt.style.fontWeight = "bold"; 
        } else {
            opt.text = cleanName;
            opt.style.fontWeight = "normal";
        }
    }
}

// --- 3D MODEL & COLOR LOGIC ---

window.switchModel = (newSrc) => {
    modelViewer.src = newSrc;
    updateDropdownLabels(newSrc); 
};

window.changeColor = (materialName, hex, element) => {
    // UI selection ring
    if (element) {
        const row = element.closest('.swatch-row');
        row.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
    }

    currentConfiguration[materialName] = hex; 
    applyColorToModel(materialName, hex);     
};

function applyColorToModel(materialName, hex) {
    if (!modelViewer.model) return;
    
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    if (material) {
        const rgb = hexToRgb(hex); 
        
        // Gamma Correction for accurate rendering
        const rLinear = Math.pow(rgb.r / 255, 2.2);
        const gLinear = Math.pow(rgb.g / 255, 2.2);
        const bLinear = Math.pow(rgb.b / 255, 2.2);
        
        material.pbrMetallicRoughness.setBaseColorFactor([rLinear, gLinear, bLinear, 1]);
    }
}

// Ensure the initial colors apply on load
modelViewer.addEventListener('load', () => {
    Object.keys(currentConfiguration).forEach(matName => {
        applyColorToModel(matName, currentConfiguration[matName]);
    });
});

// Run once on page load to set the initial "Koi" highlight in the dropdown
window.addEventListener('DOMContentLoaded', () => {
    updateDropdownLabels(modelViewer.src);
});

// Utility function
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}
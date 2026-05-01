const modelViewer = document.querySelector("#product-viewer");
const layoutContainer = document.querySelector(".configurator-layout");

// 1. Unified Application State
let config = {
    'TopColor': '#D9CAAF',
    'BaseColor': '#D9CAAF',
    'DesignMain': '#302A5A',
    'DesignSub': '#FF972F',
    'ActiveBase': 'Mat_Base_1' // Determines which base gets alpha = 1
};

// All possible bases baked into the GLB
const ALL_BASES = ['Mat_Base_1', 'Mat_Base_2', 'Mat_Base_3', 'Mat_Base_4'];

// --- MENU & UI LOGIC ---

window.toggleMenu = (button) => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
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

// --- CONFIGURATION LOGIC ---

// New function to handle the shape switching
window.changeBaseShape = (baseName, element) => {
    if (element) {
        const row = element.closest('.style-row');
        row.querySelectorAll('.style-btn').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
    }
    
    config.ActiveBase = baseName;
    applyAllMaterials();
};

window.changeColor = (part, hex, element) => {
    if (element) {
        const row = element.closest('.swatch-row');
        row.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
    }

    // Update the conceptual state
    config[part] = hex; 
    
    applyAllMaterials();     
};


// --- CORE 3D RENDERING LOGIC ---

window.switchModel = (newSrc) => {
    modelViewer.src = newSrc;
    updateDropdownLabels(newSrc); 
};

// "Traffic Cop" function: Updates the whole model based on current state
function applyAllMaterials() {
    if (!modelViewer.model) return;

    // 1. Paint the Top and Designs
    applyColorToMaterial('Mat_Top', config.TopColor, 1);
    applyColorToMaterial('Mat_DesignMain', config.DesignMain, 1);
    applyColorToMaterial('Mat_DesignSub', config.DesignSub, 1);

    // 2. Loop through all bases. Only the Active base gets alpha = 1.
    ALL_BASES.forEach(baseName => {
        const isVisible = (baseName === config.ActiveBase);
        const alpha = isVisible ? 1 : 0;
        
        // Pass the base color to ALL bases, but hide the ones we don't want
        applyColorToMaterial(baseName, config.BaseColor, alpha);
    });
}

// The Worker function: Handles Gamma math and Alpha channels
function applyColorToMaterial(materialName, hex, alpha) {
    if (!modelViewer.model) return;
    
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    if (material) {
        const rgb = hexToRgb(hex); 
        
        const rLinear = Math.pow(rgb.r / 255, 2.2);
        const gLinear = Math.pow(rgb.g / 255, 2.2);
        const bLinear = Math.pow(rgb.b / 255, 2.2);
        
        // Pass [R, G, B, Alpha]. Alpha is 1 (visible) or 0 (invisible).
        material.pbrMetallicRoughness.setBaseColorFactor([rLinear, gLinear, bLinear, alpha]);
    }
}

// Ensure the initial colors and hidden bases apply correctly on load
modelViewer.addEventListener('load', () => {
    applyAllMaterials();
});

// Run once on page load to set the initial "Koi" highlight in the dropdown
window.addEventListener('DOMContentLoaded', () => {
    updateDropdownLabels(modelViewer.src);
});

// Utility
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}
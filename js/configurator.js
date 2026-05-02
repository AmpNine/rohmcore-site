const modelViewer = document.querySelector("#product-viewer");

// Application State
let config = {
    'TopColor': '#D9CAAF',
    'BaseColor': '#D9CAAF',
    'DesignMain': '#302A5A',
    'DesignSub': '#FF972F',
    'ActiveBase': 'Mat_Base_Blank' // This matches your Rhino material name
};

const ALL_BASES = ['Mat_Base_Blank', 'Mat_Base_Ring', 'Mat_Base_Keychain', 'Mat_Base_CHargingHandle'];

// Change which base is visible
window.changeBaseShape = (baseName, element) => {
    // UI: Update selected button state
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
    config[part] = hex; 
    applyAllMaterials();     
};

function applyAllMaterials() {
    if (!modelViewer.model) return;

    // Apply standard colors
    applyColorToMaterial('Mat_Top', config.TopColor, 1);
    applyColorToMaterial('Mat_DesignMain', config.DesignMain, 1);
    applyColorToMaterial('Mat_DesignSub', config.DesignSub, 1);

    // Visibility Logic for the 4 Bases
    ALL_BASES.forEach(baseName => {
        const isVisible = (baseName === config.ActiveBase);
        const alpha = isVisible ? 1 : 0;
        
        // We apply the same BaseColor to all, but only the active one is shown
        applyColorToMaterial(baseName, config.BaseColor, alpha);
    });
}

function applyColorToMaterial(materialName, hex, alpha) {
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    if (material) {
        const rgb = hexToRgb(hex);
        const r = Math.pow(rgb.r / 255, 2.2);
        const g = Math.pow(rgb.g / 255, 2.2);
        const b = Math.pow(rgb.b / 255, 2.2);
        
        // [Red, Green, Blue, Alpha]
        material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, alpha]);
    }
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}

modelViewer.addEventListener('load', applyAllMaterials);
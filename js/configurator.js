const modelViewer = document.querySelector("#product-viewer");

// --- 1. APPLICATION STATE ---
let config = {
    'Mat_Top': '#D9CAAF',
    'Mat_Base': '#D9CAAF',
    'Mat_DesignMain': '#302A5A',
    'Mat_DesignSub': '#FF972F',
    'ActiveBase': 'Mat_Base_Blank' // Default shape
};

// Exact Rhino material names
const ALL_BASES = ['Mat_Base_Blank', 'Mat_Base_Ring', 'Mat_Base_Keychain', 'Mat_Base_ChargingHandle'];

// --- 2. MATERIAL & SHAPE LOGIC ---
window.changeBaseShape = (baseName, element) => {
    // UI: Update selected button state
    if (element) {
        const row = element.closest('.style-row');
        if(row) row.querySelectorAll('.style-btn').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
    }
    
    config.ActiveBase = baseName;
    applyAllMaterials();
};

window.changeColor = (part, hex, element) => {
    // UI: Update selected swatch state
    if (element) {
        const row = element.closest('.swatch-row');
        if(row) row.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
    }
    
    config[part] = hex; 
    applyAllMaterials();     
};

function applyAllMaterials() {
    if (!modelViewer.model || !modelViewer.model.materials) return;

    // Apply standard colors
    applyColorToMaterial('Mat_Top', config['Mat_Top'], 1);
    applyColorToMaterial('Mat_DesignMain', config['Mat_DesignMain'], 1);
    applyColorToMaterial('Mat_DesignSub', config['Mat_DesignSub'], 1);

    // Visibility Logic for the 4 Bases
    ALL_BASES.forEach(baseName => {
        const isVisible = (baseName === config.ActiveBase);
        const alpha = isVisible ? 1 : 0; 
        
        // We apply the same BaseColor to all, but only the active one gets 100% alpha
        applyColorToMaterial(baseName, config['Mat_Base'], alpha);
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

// --- 3. UI ACCORDION & MODEL SWITCHING LOGIC ---

window.toggleMenu = (btn) => {
    const item = btn.closest('.accordion-item');
    item.classList.toggle('active');
};

window.closeMobilePopup = (btn) => {
    const item = btn.closest('.accordion-item');
    item.classList.remove('active');
};

window.switchModel = (url) => {
    modelViewer.src = url;
};

// Re-apply colors and shapes every time a new .glb finishes loading
modelViewer.addEventListener('load', applyAllMaterials);
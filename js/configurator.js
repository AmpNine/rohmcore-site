const modelViewer = document.querySelector("#product-viewer");

// State object to remember the user's color choices across model swaps
let currentConfiguration = {
    'Mat_Base': null, 
    'Mat_Top': null,
    'Mat_DesignMain': null,
    'Mat_DesignSub': null
};

// --- 1. ACCORDION LOGIC ---
window.toggleMenu = (button) => {
    const item = button.parentElement;
    item.classList.toggle('active');
};

// --- 2. MODEL SWITCHER ---
window.switchModel = (newSrc) => {
    modelViewer.src = newSrc;
};

// --- 3. COLOR CHANGER & PERSISTENCE ---
window.changeColor = (materialName, hex) => {
    // Save the choice so it persists when switching designs
    currentConfiguration[materialName] = hex; 
    applyColorToModel(materialName, hex);     
};

function applyColorToModel(materialName, hex) {
    if (!modelViewer.model) return;
    
    // Find the specific material assigned in Rhino
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    
    if (material) {
        const rgb = hexToRgb(hex);
        // Apply the color [R, G, B, Alpha]
        material.pbrMetallicRoughness.setBaseColorFactor([rgb.r/255, rgb.g/255, rgb.b/255, 1]);
    } else {
        console.warn(`Material "${materialName}" not found in this model.`);
    }
}

// Every time a new model finishes loading, re-apply the saved colors
modelViewer.addEventListener('load', () => {
    Object.keys(currentConfiguration).forEach(matName => {
        const savedColor = currentConfiguration[matName];
        if (savedColor) {
            applyColorToModel(matName, savedColor);
        }
    });
});

// Helper: Hex to RGB conversion
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}
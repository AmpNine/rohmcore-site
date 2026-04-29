const modelViewer = document.querySelector("#product-viewer");

// MUST MATCH YOUR RHINO LAYER NAMES EXACTLY
const allDesignLayers = [
    'Blank_Bar', 
    'Koi', 
    'LighthouseSun', 
    'Wave', 
    'BonsaiSun', 
    'Ginkgo', 
    'MonsteraSun'
];

// --- 1. ACCORDION LOGIC ---
window.toggleMenu = (button) => {
    const item = button.parentElement;
    item.classList.toggle('active');
};

// --- 2. DESIGN SWITCHER ---
window.selectDesign = (targetLayerName) => {
    if (!modelViewer.model) return;

    allDesignLayers.forEach((layerName) => {
        // Find all parts (nodes) that belong to this layer
        const nodes = modelViewer.model.nodes.filter(n => n.name.includes(layerName));
        
        nodes.forEach(node => {
            if (layerName === targetLayerName) {
                node.show();
            } else {
                node.hide();
            }
        });
    });
};

// --- 3. COLOR CHANGER ---
window.changeColor = (materialName, hex) => {
    if (!modelViewer.model) return;
    
    // Find the specific material assigned in Rhino
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    
    if (material) {
        const rgb = hexToRgb(hex);
        // Apply the color [R, G, B, Alpha]
        material.pbrMetallicRoughness.setBaseColorFactor([rgb.r/255, rgb.g/255, rgb.b/255, 1]);
    } else {
        console.warn(`Material "${materialName}" not found in model.`);
    }
};

// Helper: Hex to RGB conversion
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}

// Initialize: Hide everything except the first design when the model loads
modelViewer.addEventListener('load', () => {
    window.selectDesign('Blank_Bar');
});
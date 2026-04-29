const modelViewer = document.querySelector("#product-viewer");

// Exact names from your Rhino Layer screenshot
const allDesignLayers = [
    'Blank_Bar', 
    'Koi', 
    'LighthouseSun', 
    'Wave', 
    'BonsaiSun', 
    'Ginkgo', 
    'MonsteraSun'
];

// 1. Accordion Toggle
window.toggleMenu = (button) => {
    const item = button.parentElement;
    const panel = item.querySelector('.accordion-panel');
    const isCurrentlyActive = item.classList.contains('active');

    if (isCurrentlyActive) {
        item.classList.remove('active');
        panel.style.display = 'none';
    } else {
        item.classList.add('active');
        panel.style.display = 'block';
    }
};

// 2. Design Visibility Logic
window.selectDesign = (targetLayerName) => {
    if (!modelViewer.model) return;

    allDesignLayers.forEach((layerName) => {
        // Find every part (node) associated with this layer
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

// 3. Color Logic
window.changeColor = (materialName, hex) => {
    if (!modelViewer.model) return;
    
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    if (material) {
        const rgb = hexToRgb(hex);
        material.pbrMetallicRoughness.setBaseColorFactor([rgb.r/255, rgb.g/255, rgb.b/255, 1]);
    }
};

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}

// Optional: Set default design once model loads
modelViewer.addEventListener('load', () => {
    window.selectDesign('Blank_Bar');
});
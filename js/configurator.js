// This ensures the 3D model is fully ready before we try to touch it
const modelViewer = document.querySelector("#product-viewer");

// --- 1. ACCORDION LOGIC ---
// We attach it to 'window' so the HTML onclick can find it
window.toggleMenu = (button) => {
    const item = button.parentElement;
    const panel = item.querySelector('.accordion-panel');
    const isCurrentlyActive = item.classList.contains('active');

    // Close all other panels first (Optional: keeps it tidy)
    document.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('active');
        const p = el.querySelector('.accordion-panel');
        if (p) p.style.display = 'none';
    });

    // Toggle the clicked one
    if (!isCurrentlyActive) {
        item.classList.add('active');
        panel.style.display = 'block';
    }
};

// --- 2. DESIGN SWITCHING (RHINO LAYERS) ---
window.selectDesign = (button, targetLayerName) => {
    // A. Open the menu visually
    window.toggleMenu(button);

    // B. Logic for the 3D model
    if (!modelViewer.model) return;

    // We look through all "nodes" (the parts of your GLB/Rhino layers)
    modelViewer.model.nodes.forEach((node) => {
        // If the node name contains "Design_", we decide whether to show or hide it
        if (node.name.includes("Design")) {
            if (node.name.includes(targetLayerName)) {
                node.show(); // Show the one we clicked
            } else {
                node.hide(); // Hide the others
            }
        }
    });
};

// --- 3. COLOR CHANGING ---
window.changeColor = (materialNames, hex) => {
    if (!modelViewer.model) return;
    
    const rgb = hexToRgb(hex);
    
    materialNames.forEach(name => {
        const material = modelViewer.model.materials.find(m => m.name === name);
        if (material) {
            material.pbrMetallicRoughness.setBaseColorFactor([rgb.r/255, rgb.g/255, rgb.b/255, 1]);
        }
    });
};

// Helper: Hex to RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}
const modelViewer = document.querySelector("#product-viewer");
const layoutContainer = document.querySelector(".configurator-layout");

let currentConfiguration = {
    'Mat_Base': null, 
    'Mat_Top': null,
    'Mat_DesignMain': null,
    'Mat_DesignSub': null
};

// --- UI LOGIC ---
window.toggleMenu = (button) => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
    
    if (!isActive) {
        item.classList.add('active');
        layoutContainer.classList.add('menu-is-open'); // Shrinks model-viewer on mobile
    } else {
        layoutContainer.classList.remove('menu-is-open');
    }
};

window.closeMobilePopup = (button) => {
    const item = button.closest('.accordion-item');
    if(item) item.classList.remove('active');
    layoutContainer.classList.remove('menu-is-open');
};

// --- COLOR LOGIC ---
window.changeColor = (materialName, hex) => {
    currentConfiguration[materialName] = hex; 
    applyColorToModel(materialName, hex);     
};

function applyColorToModel(materialName, hex) {
    if (!modelViewer.model) return;
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    
    if (material) {
        const rgb = hexToRgb(hex);
        
        // GAMMA CORRECTION: sRGB to Linear conversion
        // Prevents the "washed out" look in 3D engines
        const rLinear = Math.pow(rgb.r / 255, 2.2);
        const gLinear = Math.pow(rgb.g / 255, 2.2);
        const bLinear = Math.pow(rgb.b / 255, 2.2);
        
        material.pbrMetallicRoughness.setBaseColorFactor([rLinear, gLinear, bLinear, 1]);
    }
}

modelViewer.addEventListener('load', () => {
    Object.keys(currentConfiguration).forEach(matName => {
        const savedColor = currentConfiguration[matName];
        if (savedColor) applyColorToModel(matName, savedColor);
    });
});

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b};
}

window.switchModel = (newSrc) => {
    modelViewer.src = newSrc;
};
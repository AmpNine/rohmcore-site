const modelViewer = document.querySelector("#product-viewer");
const layoutContainer = document.querySelector(".configurator-layout");

// State persistence from your old code
let currentConfiguration = {
    'Mat_Base': null, 
    'Mat_Top': null,
    'Mat_DesignMain': null,
    'Mat_DesignSub': null
};

// --- MENU LOGIC (Merged) ---
window.toggleMenu = (button) => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close others
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
    
    if (!isActive) {
        item.classList.add('active');
        // SHRINK logic: Only applies on mobile via CSS class
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

// 1. Update the switchModel function to trigger the highlight
window.switchModel = (newSrc) => {
    modelViewer.src = newSrc;
    updateDropdownLabels(newSrc); // Trigger the visual highlight
};

// 2. The logic to add the dot and bolding
function updateDropdownLabels(activeSrc) {
    const selector = document.querySelector("#design-selector");
    const options = selector.options;

    for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        
        // Clean up: Remove any existing dots and bolding marks
        // We use a regex to remove the dot and any leading/trailing whitespace
        let cleanName = opt.text.replace('• ', '').replace(' (Selected)', '');
        
        if (opt.value === activeSrc) {
            // Add the visual indicators
            opt.text = `• ${cleanName}`; 
            opt.style.fontWeight = "bold"; // Works in some browsers (Chrome/Firefox)
        } else {
            // Reset others
            opt.text = cleanName;
            opt.style.fontWeight = "normal";
        }
    }
}

// 3. Run it once on page load to set the initial "Koi" highlight
window.addEventListener('DOMContentLoaded', () => {
    updateDropdownLabels(modelViewer.src);
});

window.changeColor = (materialName, hex) => {
    currentConfiguration[materialName] = hex; 
    applyColorToModel(materialName, hex);     
};

function applyColorToModel(materialName, hex) {
    if (!modelViewer.model) return;
    
    const material = modelViewer.model.materials.find(m => m.name === materialName);
    if (material) {
        const rgb = hexToRgb(hex); // Ensure you have your hexToRgb helper function
        
        // The "Secret Sauce": Gamma Correction
        // We divide by 255 to get a 0-1 scale, then apply the 2.2 power
        const rLinear = Math.pow(rgb.r / 255, 2.2);
        const gLinear = Math.pow(rgb.g / 255, 2.2);
        const bLinear = Math.pow(rgb.b / 255, 2.2);
        
        // Apply the corrected linear values to the model
        material.pbrMetallicRoughness.setBaseColorFactor([rLinear, gLinear, bLinear, 1]);
    }
}

// Re-apply configuration when a new model loads
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
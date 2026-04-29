// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const modelViewer = document.querySelector("#product-viewer");
    const baseUrl = "https://raw.githack.com/AmpNine/rohmcore-st/main/";
  
    // 1. Swap Design Pack
    window.switchDesignPack = (fileName, clickedButton) => {
      // Update Model
      modelViewer.src = baseUrl + fileName;
  
      // Update Button UI styling (remove active from all, add to clicked)
      const buttons = document.querySelectorAll('.variant-btn');
      buttons.forEach(btn => btn.classList.remove('active'));
      clickedButton.classList.add('active');
    };
  
    // 2. Change Colors
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
  
    // Helper function for hex to PBR rgb conversion
    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return {r, g, b};
    }
});
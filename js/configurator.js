document.addEventListener("DOMContentLoaded", () => {
    const modelViewer = document.querySelector("#product-viewer");
    const baseUrl = "https://raw.githack.com/AmpNine/rohmcore-site/main/assets/models/";
  
    // 1. Accordion Toggle Logic
    window.toggleMenu = (button) => {
        const item = button.parentElement;
        const panel = item.querySelector('.accordion-panel');
        
        if (item.classList.contains('active')) {
            item.classList.remove('active');
            panel.style.display = 'none';
        } else {
            item.classList.add('active');
            panel.style.display = 'block';
        }
    };

    // 2. Select Design (Opens Menu AND Swaps Model)
    window.selectDesign = (button, fileName) => {
        // Swap the 3D model
        modelViewer.src = baseUrl + fileName;

        // Optional: Close all other design menus so only one is open
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach(item => {
            // Keep the "Case Components" menu open, but close other Designs
            if(item.querySelector('span').innerText.includes('Design')) {
                item.classList.remove('active');
                item.querySelector('.accordion-panel').style.display = 'none';
            }
        });

        // Open the clicked menu
        toggleMenu(button);
    };
  
    // 3. Change Colors (Same as before)
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
  
    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return {r, g, b};
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const modelViewer = document.querySelector("#product-viewer");
    const baseUrl = "assets/models/";
  
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
    document.addEventListener("DOMContentLoaded", () => {
    const modelViewer = document.querySelector("#product-viewer");

    // 1. Accordion Toggle Logic (Kept as you had it)
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

    // 2. NEW Select Design Logic (Toggles Rhino Layers)
    window.selectDesign = (button, layerName) => {
        // Access the underlying 3D scene
        const scene = modelViewer.toObject3D();
        
        if (scene) {
            // We look through every piece of the model
            scene.traverse((obj) => {
                // If the piece's name starts with "Design_", we handle it
                // Note: Rhino layers often export with "Design_Whatever"
                if (obj.name.includes("Design")) {
                    // If the name matches what we clicked, show it. Otherwise, hide it.
                    obj.visible = (obj.name === layerName);
                }
            });
        }

        // Accordion visual logic
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach(item => {
            if(item.querySelector('span').innerText.includes('Design')) {
                item.classList.remove('active');
                const panel = item.querySelector('.accordion-panel');
                if(panel) panel.style.display = 'none';
            }
        });

        toggleMenu(button);
    };

    // 3. Change Colors (Kept as you had it, works great for materials)
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
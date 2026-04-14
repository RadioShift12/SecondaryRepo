import { Security } from "./security.js";
import { Zoo } from "./zoo.js";

export const UI = {

    
    renderAnimals: (container) => {
        if (!container) return;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const animalSelect = document.getElementById('animal-select');
        function populateAnimalOptions() {
            if (!animalSelect) return;
            animalSelect.textContent = "";

            
            const openAnimals = Zoo.getAnimals().filter(a => a.availability === 'open');
            
            openAnimals.forEach(animal => {
                const opt = document.createElement('option');
                opt.value = animal.name;
                opt.textContent = `${animal.name} (${animal.species})`;
                animalSelect.appendChild(opt);
            });
        }
        Zoo.getAnimals().forEach((animal, index) => {
            const card = document.createElement("div");
            card.className = `animal-card ${animal.availability}`;

            const title = document.createElement("h3");
            title.textContent = Security.sanitize(animal.name);

            const species = document.createElement("p");
            species.textContent = `Species: ${animal.species}`;

            const health = document.createElement("p");
            health.textContent = `Health: ${animal.status}`;
            
            const btnToggle = document.createElement("button");
            btnToggle.textContent = "Toggle";
            btnToggle.onclick = () => {
                animal.toggleAvailability();
                UI.renderAnimals(container);
            };

            const btnHealth = document.createElement("button");
            btnHealth.textContent = "Edit Health";

            btnHealth.onclick = () => {
                if (!Security.isAdmin()) {
                    Security.log("AUTH", "Admin required");
                    return;
                }

                UI.openHealthModal(index);
            };
            populateAnimalOptions();
            card.append(title, species, health, btnToggle, btnHealth);
            container.appendChild(card);
        });
    },

    openHealthModal: (index) => {
        const modal = document.getElementById("health-modal");
        const input = document.getElementById("health-input");

        Zoo.state.currentEditingIndex = index;
        input.value = Zoo.getAnimals()[index].status;

        modal.classList.remove("hidden");
    }
};
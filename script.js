document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Nav Links
    document.querySelectorAll('.nav-links a, .nav-cta, .cta-large').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 3. Archipelago Controls
    const mapImg = document.getElementById('ph-map');
    const archipelagoBtns = document.querySelectorAll('.btn-archipelago');
    const regionsGrids = document.querySelectorAll('.regions-grid');
    const explorePlaceholder = document.getElementById('explore-placeholder');
    let currentTarget = null; // Starts zoomed out (null)

    archipelagoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            // If clicking the already active tab -> Zoom out and show Explore Card
            if (currentTarget === target) {
                btn.classList.remove('active');
                currentTarget = null;

                if (mapImg) {
                    mapImg.className = 'ph-map'; // Reset to full map
                }

                // Hide all grids
                regionsGrids.forEach(grid => {
                    grid.classList.remove('active-archipelago');
                    setTimeout(() => {
                        if (!grid.classList.contains('active-archipelago')) {
                            grid.classList.add('hidden-archipelago');
                        }
                    }, 300);
                });
                
                // Show Explore Placeholder
                if (explorePlaceholder) {
                    explorePlaceholder.classList.remove('hidden-archipelago');
                    setTimeout(() => explorePlaceholder.classList.add('active-archipelago'), 50);
                }
                return;
            }

            // Normal Tab change
            currentTarget = target;

            // Update UI buttons
            archipelagoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Map Zoom immediately (smooth CSS transition straight to new target)
            if (mapImg) {
                mapImg.className = `ph-map zoom-${target}`;
            }

            // Hide Explore Placeholder
            if (explorePlaceholder) {
                explorePlaceholder.classList.remove('active-archipelago');
                setTimeout(() => {
                    if (!explorePlaceholder.classList.contains('active-archipelago')) {
                        explorePlaceholder.classList.add('hidden-archipelago');
                    }
                }, 300);
            }

            // Show appropriate region grid
            regionsGrids.forEach(grid => {
                if (grid.id === `${target}-grid`) {
                    grid.classList.remove('hidden-archipelago');
                    setTimeout(() => grid.classList.add('active-archipelago'), 50);
                } else {
                    grid.classList.remove('active-archipelago');
                    setTimeout(() => {
                        if(!grid.classList.contains('active-archipelago')) {
                            grid.classList.add('hidden-archipelago');
                        }
                    }, 300);
                }
            });
        });
    });

    // 3. Generate Type Effectiveness Chart
    const types = [
        "Normal", "Apoy", "Tubig", "Hangin", "Hayop", "Kulam", 
        "Kidlat", "Diwa", "Puno", "Anino", "Lupa", "Araw", "Buwan"
    ];

    const typeMatrix = [
        [ 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0.5, 1, 1 ],
        [ 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 1, 0.5, 1, 1 ],
        [ 1, 2, 0.5, 1, 1, 1, 0.5, 1, 2, 1, 2, 1, 1 ],
        [ 1, 1, 1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 1, 1 ],
        [ 1, 1, 1, 0.5, 1, 0.5, 1, 1, 2, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 2, 0.5, 1, 2, 1, 2, 1, 1, 1 ],
        [ 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 0, 1, 1 ],
        [ 0, 1, 1, 1, 1, 1, 0.5, 1, 2, 1, 2, 1, 1 ],
        [ 1, 0.5, 2, 0.5, 1, 1, 1, 1, 0.5, 1, 2, 1, 1 ],
        [ 0, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 1, 0.5, 1 ],
        [ 0.5, 2, 1, 0, 1, 1, 2, 1, 0.5, 1, 1, 1, 1 ],
        [ 1, 2, 1, 1, 1, 1, 1, 2, 2, 0.5, 1, 0.5, 1 ],
        [ 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0.5 ]
    ];

    const chartContainer = document.getElementById('type-chart-container');
    
    if (chartContainer) {
        let tableHTML = '<table><thead><tr><th>Defense &rarr;<br>&darr; Attack</th>';
        
        // Headers
        types.forEach(type => {
            tableHTML += `<th class="col-header"><img src="./img/TypeImages/${type.toLowerCase()}.png" alt="${type}" style="width:24px; vertical-align:middle; display:inline-block;" title="${type}"></th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // Rows
        typeMatrix.forEach((row, rIndex) => {
            tableHTML += `<tr>`;
            tableHTML += `<th><img src="./img/TypeImages/${types[rIndex].toLowerCase()}.png" alt="${types[rIndex]}" style="width:24px; vertical-align:middle; display:inline-block; margin-right:5px;" title="${types[rIndex]}"> ${types[rIndex]}</th>`;
            
            row.forEach((multiplier) => {
                let cellClass = '';
                if (multiplier === 0) cellClass = 'cell-0';
                else if (multiplier === 0.5) cellClass = 'cell-05';
                else if (multiplier === 2) cellClass = 'cell-2';
                else cellClass = 'cell-1';

                let displayStr = multiplier === 0.5 ? '½' : multiplier;
                
                tableHTML += `<td class="${cellClass}">${displayStr}x</td>`;
            });
            tableHTML += `</tr>`;
        });

        tableHTML += '</tbody></table>';
        chartContainer.innerHTML = tableHTML;
    }

    // 4. Form Submit Handling
    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "Sent via Kasunduan!";
            btn.style.backgroundColor = "var(--clr-type-puno)";
            
            setTimeout(() => {
                form.reset();
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
            }, 3000);
        });
    }

});

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    const customerNameInput = document.getElementById('customerNameInput');
    const locationInput = document.getElementById('locationInput');
    const dateInput = document.getElementById('dateInput');
    const projectCostInput = document.getElementById('projectCostInput');

    const previewCustomerName = document.getElementById('previewCustomerName');
    const previewLocation = document.getElementById('previewLocation');
    const previewDate = document.getElementById('previewDate');
    const previewCost = document.getElementById('previewCost');
    const quotationNoDisplay = document.getElementById('quotationNoDisplay');
    const footerDateTime = document.getElementById('footerDateTime');
    const specsPreviewBody = document.getElementById('specsPreviewBody');
    const editorSpecsBody = document.getElementById('editorSpecsBody');

    const backBtn = document.getElementById('backBtn');
    const printPreviewBtn = document.getElementById('printPreviewBtn');

    const generateBottomBtn = document.getElementById('generateBottomBtn');
    const addSpecBtn = document.getElementById('addSpecBtn');
    const projectTypeSelect = document.getElementById('spec-project-type');
    const batteryRow = document.getElementById('batteryRow');

    // Initialize values
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];

    // Set initial Quotation number
    updateQuotationNumber();

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        generateQuotation();
    });

    generateBottomBtn.addEventListener('click', () => {
        generateQuotation();
        // Trigger auto download after a short delay to allow DOM to update
        setTimeout(() => {
            printQuotationFunc();
        }, 500);
    });

    const printQuotationFunc = () => {
        // Set document title so browser uses Customer Name as default filename
        const customerName = customerNameInput.value.trim() || 'Solar_Quotation';
        const originalTitle = document.title;
        document.title = customerName;

        window.print();

        // Restore title after print dialog closes
        setTimeout(() => {
            document.title = originalTitle;
        }, 100);
    };

    printBtn.addEventListener('click', printQuotationFunc);
    downloadBtn.addEventListener('click', printQuotationFunc);
    printPreviewBtn.addEventListener('click', printQuotationFunc);

    backBtn.addEventListener('click', () => {
        document.body.classList.remove('preview-mode');
    });

    // Project Type Change Logic
    projectTypeSelect.addEventListener('change', () => {
        const type = projectTypeSelect.value;
        if (type === 'Off-Grid' || type === 'Hybrid') {
            batteryRow.style.display = 'table-row';
        } else {
            batteryRow.style.display = 'none';
        }
    });

    // Add Specification Row logic
    addSpecBtn.addEventListener('click', () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" placeholder="Spec Name"></td>
            <td><input type="text" placeholder="Details"></td>
            <td><button class="delete-spec-btn">🗑️</button></td>
        `;
        editorSpecsBody.appendChild(newRow);
    });

    // Delete Specification Logic (Event Delegation)
    editorSpecsBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-spec-btn')) {
            const row = e.target.closest('tr');
            row.remove();
        }
    });

    function updateQuotationNumber() {
        let currentID = localStorage.getItem('lastQuotationID');
        if (!currentID) {
            currentID = 1;
        } else {
            currentID = parseInt(currentID);
        }

        quotationNoDisplay.textContent = `QT${currentID.toString().padStart(3, '0')}`;
    }

    function generateQuotation() {
        // Update IDs
        let currentID = localStorage.getItem('lastQuotationID');
        if (!currentID) {
            currentID = 1;
        } else {
            currentID = parseInt(currentID);
        }

        // Fill Preview Data
        previewCustomerName.textContent = customerNameInput.value || '[Customer Name]';
        previewLocation.textContent = locationInput.value || '[Location]';

        // Format Date
        const selectedDate = new Date(dateInput.value);
        previewDate.textContent = selectedDate.toLocaleDateString('en-GB'); // dd/mm/yyyy

        previewCost.textContent = projectCostInput.value || '0';

        // Update Specs Table in Preview
        const specRows = editorSpecsBody.querySelectorAll('tr');
        specsPreviewBody.innerHTML = '';

        specRows.forEach(row => {
            // Skip hidden rows (like Battery if On-Grid)
            if (row.style.display === 'none') return;

            let specName, specValue;

            // Check if it's the Project Type row (contains a select)
            const selectEl = row.querySelector('select');
            if (selectEl) {
                specName = row.cells[0].textContent;
                specValue = selectEl.value;
            } else {
                // Check if it's a dynamic row with input in both cells
                const inputs = row.querySelectorAll('input');
                if (inputs.length === 2) {
                    specName = inputs[0].value;
                    specValue = inputs[1].value;
                } else if (inputs.length === 1) {
                    // Regular static row
                    specName = row.cells[0].textContent;
                    specValue = inputs[0].value;
                }
            }

            if (specName && specValue) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${specName}</td>
                    <td>${specValue}</td>
                `;
                specsPreviewBody.appendChild(newRow);
            }
        });

        // Update Footer Date/Time
        const now = new Date();
        footerDateTime.textContent = now.toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        // Set Quotation No
        const formattedID = `QT${currentID.toString().padStart(3, '0')}`;
        quotationNoDisplay.textContent = formattedID;

        // Increment for NEXT time (if user prints or explicitly generates)
        // For simplicity, we increment on "Generate" click
        localStorage.setItem('lastQuotationID', currentID + 1);

        // Show preview (optional for screen layout)
        document.body.classList.add('preview-mode');

        alert(`Quotation ${formattedID} generated successfully!`);
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.error('Service Worker registration failed', err));
        });
    }
});

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

    const backBtn = document.getElementById('backBtn');
    const printPreviewBtn = document.getElementById('printPreviewBtn');

    // Initialize values
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];

    // Set initial Quotation number
    updateQuotationNumber();

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        generateQuotation();
    });

    const printQuotationFunc = () => {
        window.print();
    };

    printBtn.addEventListener('click', printQuotationFunc);
    downloadBtn.addEventListener('click', printQuotationFunc);
    printPreviewBtn.addEventListener('click', printQuotationFunc);

    backBtn.addEventListener('click', () => {
        document.body.classList.remove('preview-mode');
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
        const specInputs = document.querySelectorAll('#specsTable tbody tr');
        specsPreviewBody.innerHTML = '';

        specInputs.forEach(row => {
            const specName = row.cells[0].textContent;
            const specValue = row.querySelector('input').value;

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${specName}</td>
                <td>${specValue}</td>
            `;
            specsPreviewBody.appendChild(newRow);
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
});

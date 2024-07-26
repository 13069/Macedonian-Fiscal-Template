// Function to update receipt text
function updateReceiptText(selector, newText) {
    document.querySelector(selector).innerText = newText;
}

// Function to generate a random 7-digit number
function generateRandomNumber() {
    return Math.floor(1000000 + Math.random() * 9000000);
}

// Function to update both instances of the random numbers with the same value
function updateRandomNumbers() {
    var randomNumber = generateRandomNumber();
    document.querySelectorAll('.random-numbers').forEach(function (element) {
        element.textContent = randomNumber;
    });
}

// Function to save the receipt as an image and a PDF
function saveReceipt() {
    const receiptElement = document.querySelector('.receipt');

    // Use html2canvas to capture the receipt as an image
    html2canvas(receiptElement, {
        scale: 2,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Use jsPDF to create a PDF and add the image to it
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: [canvas.width / 96 * 2.54, canvas.height / 96 * 2.54] // Convert px to cm (1 inch = 2.54 cm, 1 inch = 96 px)
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 96 * 2.54, canvas.height / 96 * 2.54);

        // Save the PDF
        pdf.save('receipt.pdf');
    });
}

// Update receipt text when contenteditable fields are changed
document.querySelectorAll('[contenteditable="true"]').forEach(function (element) {
    element.addEventListener('input', function () {
        var id = element.getAttribute('id');
        var newText = element.innerText;
        switch (id) {
            case 'receiptTitle':
                updateReceiptText('.header p.bold-large', newText);
                break;
            case 'companyName':
                updateReceiptText('.header p:nth-of-type(3)', newText);
                break;
            case 'companyAddress':
                updateReceiptText('.header p:nth-of-type(4)', newText);
                break;
            case 'storeBranch':
                updateReceiptText('.header p:nth-of-type(5)', newText);
                break;
            case 'customerId':
                updateReceiptText('.header p:nth-of-type(6)', newText);
                break;
            case 'taxNumber':
                updateReceiptText('.header p:nth-of-type(7)', newText);
                break;
            case 'vatNumber':
                updateReceiptText('.header p:nth-of-type(8)', newText);
                break;
            case 'date-time':
                updateReceiptText('.date-time p', newText);
                break;
        }
    });
});

// Call the function to generate random numbers initially
updateRandomNumbers();

// Function to generate Data Matrix code
function generateDataMatrix(text) {
    let canvas = document.getElementById('datamatrix-code');
    let context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    bwipjs.toCanvas('datamatrix-code', {
        bcid: 'datamatrix',  // Barcode type
        text: text,          // Text to encode
        scale: 2,            // Adjust scaling factor to fit 100x100px
        includetext: false   // Show human-readable text
    }, function (err) {
        if (err) {
            console.error(err);
        }
    });
}

function generateRandomDataMatrixText() {
    const prefix = 'AC';
    const digits = '0123456789';
    let text = prefix;

    // Generate next 98 digits
    for (let i = 0; i < 98; i++) {
        text += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return text;
}

// Update the random number and Data Matrix code on page load
window.onload = function() {
    // Update random 7-digit number
    updateRandomNumbers();
    
    // Generate and update Data Matrix code
    const dataMatrixText = generateRandomDataMatrixText();
    generateDataMatrix(dataMatrixText);

    // Extract the first 2 characters and the next 9 digits
    const first11Chars = dataMatrixText.slice(0, 11);

    // Update the content of the codes div with adjusted font size
    const codesDiv = document.querySelector('.codes');
    codesDiv.innerHTML = `
        <p class="right-align" style="font-weight: bold; font-size: 0.2cm;"><b>${first11Chars}</b></p>
        <p class="right-align" style="font-weight: bold; font-size: 0.2cm;"><b>${first11Chars}</b></p>
    `;
};

// Handle item deletion on delete key press
document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete') {
        let activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('item-row')) {
            activeElement.remove();
        } else if (activeElement && activeElement.closest('.item-row')) {
            activeElement.closest('.item-row').remove();
        }
    }
});

//"Оваа скрипта е разработена исклучиво за образовни цели и не треба да се користи за стварни трговски или финансиски трансакции. Лицето што го користи овој код треба да биде свесно дека авторот, Леонид Крстевски, не презема никаква одговорност за било какви грешки или штети што можат да произлезат од употребата на оваа скрипта. Во случај на примена во стварни ситуации, корисникот треба да ја разгледа одговарајучата легислатива и да се консултира со правни или финансиски стручњаци пред да преземе било какви акции."
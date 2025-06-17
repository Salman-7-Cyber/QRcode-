function isValidPassport(passport) {
  const hasLetters = /[A-Za-z]/.test(passport);
  const hasNumbers = /\d/.test(passport);
  const isValidFormat = /^[A-Za-z0-9]+$/.test(passport);
  return hasLetters && hasNumbers && isValidFormat;
}

function generateBarcode() {
  const input = document.getElementById("passportInput").value.trim();
  const error = document.getElementById("errorMsg");
  const barcodeDiv = document.getElementById("barcode");
  barcodeDiv.innerHTML = "";
  error.textContent = "";

  if (!isValidPassport(input)) {
    error.textContent = "رقم الجواز يجب أن يحتوي على أرقام وحروف فقط.";
    return;
  }

  const svg = document.createElement("svg");
  JsBarcode(svg, input, {
    format: "CODE128",
    displayValue: true
  });
  barcodeDiv.appendChild(svg);
}

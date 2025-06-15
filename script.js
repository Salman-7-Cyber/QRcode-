const tableBody = document.getElementById("passport-table");
const manualInput = document.getElementById("manualInput");
const nationalitySelect = document.getElementById("nationalitySelect");
const centerSelect = document.getElementById("centerSelect");

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toEnglishNumbers(str) {
  return str.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

function parseInput(inputText) {
  const lines = inputText.trim().split("\n");
  const passports = [];
  const seen = new Set();

  lines.forEach((line, index) => {
    const parts = line.trim().split(/[\s,]+/);
    let passport = "";
    let name = "";

    for (const part of parts) {
      if (/[A-Za-z]/.test(part) && /\d/.test(part)) {
        passport = part;
      } else {
        name += part + " ";
      }
    }

    passport = passport.trim();
    name = name.trim();

    if (passport) {
      passports.push({
        index: index + 1,
        passport,
        name: name || "-",
        nationality: nationalitySelect.value || "-",
        center: centerSelect.value || "-",
        isDuplicate: seen.has(passport),
      });
      seen.add(passport);
    }
  });

  return passports;
}

function generateTable() {
  const input = manualInput.value;
  const passports = parseInput(input);
  tableBody.innerHTML = "";

  passports.forEach((item) => {
    const row = document.createElement("tr");
    if (item.isDuplicate) row.style.backgroundColor = "orange";

    row.innerHTML = `
      <td>${item.index}</td>
      <td><strong>${item.passport}</strong></td>
      <td>${item.name}</td>
      <td>${item.nationality}</td>
      <td>${item.center}</td>
      <td><svg class="barcode"></svg><div>${item.passport}</div></td>
    `;

    const svg = row.querySelector("svg.barcode");
    JsBarcode(svg, toEnglishNumbers(item.passport), {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 60,
      displayValue: false
    });

    tableBody.appendChild(row);
  });
}

document.getElementById("excelFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (evt) {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    let result = "";

    json.forEach((row) => {
      let line = "";
      row.forEach((cell) => {
        if (typeof cell === "string") line += cell + " ";
      });
      result += line.trim() + "\n";
    });

    manualInput.value = result;
  };

  reader.readAsArrayBuffer(file);
});

function clearTable() {
  tableBody.innerHTML = "";
  manualInput.value = "";
}

function print() {
  window.print();
}

function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const data = [["#", "رقم الجواز", "الاسم", "الجنسية", "المركز"]];
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    data.push([
      cells[0].innerText,
      cells[1].innerText,
      cells[2].innerText,
      cells[3].innerText,
      cells[4].innerText,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "الجوازات");
  XLSX.writeFile(wb, "qr_passports.xlsx");
}

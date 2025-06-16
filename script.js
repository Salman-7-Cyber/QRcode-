document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("excelFile").addEventListener("change", handleExcelUpload);
});

function toggleTheme() {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
}

function generateTable() {
  const input = document.getElementById("inputArea").value.trim().split("\n");
  const nationality = document.getElementById("nationalityInput").value || "-";
  const center = document.getElementById("centerInput").value || "-";
  const table = document.getElementById("passport-table");
  table.innerHTML = "";

  const seen = new Set();

  input.forEach((line, i) => {
    const parts = line.trim().split(/[\s,،]+/);
    const passport = parts.find(p => /[A-Za-z]/.test(p) && /\d/.test(p)) || "";
    const name = parts.find(p => /^[\u0600-\u06FFa-zA-Z\s]+$/.test(p) && !/\d/.test(p)) || "-";
    if (!passport) return;

    const isDuplicate = seen.has(passport);
    seen.add(passport);

    const tr = document.createElement("tr");
    if (isDuplicate) tr.classList.add("duplicate");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${passport}</td>
      <td>${name}</td>
      <td>${nationality}</td>
      <td>${center}</td>
      <td><svg class="barcode"></svg></td>
    `;
    table.appendChild(tr);

    JsBarcode(tr.querySelector("svg.barcode"), passport, {
      format: "CODE128",
      displayValue: true,
      fontSize: 16,
      height: 60
    });
  });
}

function handleExcelUpload(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const lines = [];
    for (let row of rows) {
      let passport = row.find(cell => typeof cell === 'string' && /[A-Za-z]/.test(cell) && /\d/.test(cell));
      let name = row.find(cell => typeof cell === 'string' && /^[\u0600-\u06FFa-zA-Z\s]+$/.test(cell) && !/\d/.test(cell));
      if (passport) lines.push(`${passport}, ${name || ''}`);
    }
    document.getElementById("inputArea").value = lines.join("\n");
  };
  reader.readAsArrayBuffer(file);
}

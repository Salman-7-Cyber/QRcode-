function toggleTheme() {
  const theme = document.body.getAttribute('data-theme');
  document.body.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
}

document.getElementById('excelFile').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const input = [];

    rows.forEach(row => {
      const passport = row.find(cell => typeof cell === 'string' && /[A-Za-z]/.test(cell) && /\d/.test(cell));
      const name = row.find(cell => typeof cell === 'string' && /^[A-Za-z\s\u0600-\u06FF]+$/.test(cell) && !/\d/.test(cell));
      if (passport) input.push(`${passport},${name || ''}`);
    });

    document.getElementById('inputArea').value = input.join("\n");
  };
  reader.readAsArrayBuffer(e.target.files[0]);
});

function generateTable() {
  const table = document.getElementById("passport-table");
  table.innerHTML = "";
  const lines = document.getElementById("inputArea").value.trim().split("\n");
  const nationality = document.getElementById("nationality").value || "-";
  const center = document.getElementById("center").value || "-";
  const seen = new Set();

  lines.forEach((line, i) => {
    const parts = line.split(",");
    const passport = parts[0]?.trim() || "";
    const name = parts[1]?.trim() || "-";
    if (!passport) return;

    const tr = document.createElement("tr");
    if (seen.has(passport)) tr.classList.add("duplicate");
    seen.add(passport);

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${passport}</td>
      <td>${name}</td>
      <td>${nationality}</td>
      <td>${center}</td>
      <td><svg id="barcode-${i}"></svg></td>
    `;
    table.appendChild(tr);
    JsBarcode(`#barcode-${i}`, passport, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 40,
      displayValue: true
    });
  });
}

function printTable() {
  const original = document.body.innerHTML;
  const printContent = document.getElementById("print-section").innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  location.reload();
}

function exportToExcel() {
  const rows = [["رقم", "رقم الجواز", "الاسم", "الجنسية", "المركز"]];
  document.querySelectorAll("#passport-table tr").forEach(row => {
    const data = [...row.children].map(td => td.innerText.trim());
    data.pop(); // remove barcode
    rows.push(data);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "QR");
  XLSX.writeFile(wb, "qr_passports.xlsx");
}

function clearAll() {
  document.getElementById("inputArea").value = "";
  document.getElementById("passport-table").innerHTML = "";
}

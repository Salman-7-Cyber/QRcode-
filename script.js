document.getElementById('excelFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    let lines = [];
    const header = json[0];

    const passportIndex = header.findIndex(h => /رقم\s?الجواز/i.test(h));
    const nameIndex = header.findIndex(h => /اسم\s?الحاج/i.test(h));

    for (let i = 1; i < json.length; i++) {
      const row = json[i];
      const passport = row[passportIndex]?.trim();
      const name = row[nameIndex]?.trim() || "-";
      if (passport && /[A-Za-z]/.test(passport)) {
        lines.push(`${passport}, ${name}`);
      }
    }

    document.getElementById("inputArea").value = lines.join("\n");
  };
  reader.readAsArrayBuffer(file);
});

function generateTable() {
  const table = document.getElementById("passport-table");
  table.innerHTML = "";
  const input = document.getElementById("inputArea").value.trim().split("\n");

  const nationality = document.getElementById("nationality").value || "-";
  const center = document.getElementById("center").value || "-";

  const seen = new Set();
  const duplicates = new Set();

  const cleaned = input.map(line => {
    const parts = line.split(",");
    const passport = parts.find(p => /[A-Za-z]/.test(p))?.trim() || "";
    const name = parts.find(p => /^[^0-9]*$/.test(p?.trim()))?.trim() || "-";
    return { passport, name };
  }).filter(e => e.passport);

  cleaned.forEach((item, i) => {
    const tr = document.createElement("tr");

    if (seen.has(item.passport)) {
      tr.classList.add("duplicate");
      duplicates.add(item.passport);
    } else {
      seen.add(item.passport);
    }

    const td1 = document.createElement("td");
    td1.textContent = i + 1;

    const td2 = document.createElement("td");
    td2.textContent = item.passport;
    td2.style.fontWeight = "bold";

    const td3 = document.createElement("td");
    td3.textContent = item.name;

    const td4 = document.createElement("td");
    td4.textContent = nationality;

    const td5 = document.createElement("td");
    td5.textContent = center;

    const td6 = document.createElement("td");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, item.passport, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 14
    });
    svg.classList.add("barcode");
    td6.appendChild(svg);

    [td1, td2, td3, td4, td5, td6].forEach(td => tr.appendChild(td));
    table.appendChild(tr);
  });

  document.getElementById("stats").textContent =
    `عدد الجوازات: ${cleaned.length} - عدد المكررات: ${duplicates.size}`;

  const now = new Date();
  document.getElementById("footer-info").textContent =
    `تم التوليد بتاريخ: ${now.toLocaleDateString("ar-SA")} - ${now.toLocaleTimeString("ar-SA")}`;
}

function toggleTheme() {
  const current = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

function clearAll() {
  document.getElementById("inputArea").value = "";
  document.getElementById("passport-table").innerHTML = "";
  document.getElementById("stats").textContent = "";
  document.getElementById("footer-info").textContent = "";
}

function exportToExcel() {
  const table = document.querySelector("table");
  const wb = XLSX.utils.table_to_book(table, { sheet: "QR Table" });
  XLSX.writeFile(wb, "passport-barcodes.xlsx");
}

function exportToPDF() {
  window.print();
}

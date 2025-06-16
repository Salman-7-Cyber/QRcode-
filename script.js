document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("generateBtn").addEventListener("click", generateTable);
  document.getElementById("excelFile").addEventListener("change", handleFile);
});

function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute("data-theme");
  body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const lines = [];
    for (let row of rows) {
      const passport = row.find(cell => typeof cell === "string" && /[A-Za-z]/.test(cell) && /\d/.test(cell));
      const name = row.find(cell => typeof cell === "string" && /^[A-Za-z\u0600-\u06FF\s]+$/.test(cell));
      if (passport) lines.push(`${passport},${name || ""}`);
    }

    document.getElementById("inputArea").value = lines.join("\n");
  };

  reader.readAsArrayBuffer(file);
}

function generateTable() {
  const input = document.getElementById("inputArea").value.trim().split("\n");
  const nationality = document.getElementById("nationalityInput").value.trim();
  const center = document.getElementById("centerInput").value.trim();
  const table = document.getElementById("passport-table");
  const seen = {};
  table.innerHTML = "";

  input.forEach((line, i) => {
    const [passport, name = ""] = line.split(",");
    if (!passport) return;

    const tr = document.createElement("tr");
    if (seen[passport]) tr.classList.add("duplicate");
    seen[passport] = true;

    const td1 = document.createElement("td");
    td1.textContent = i + 1;

    const td2 = document.createElement("td");
    td2.textContent = passport;

    const td3 = document.createElement("td");
    td3.textContent = name;

    const td4 = document.createElement("td");
    td4.textContent = nationality || "-";

    const td5 = document.createElement("td");
    td5.textContent = center || "-";

    const td6 = document.createElement("td");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, passport, {
      format: "CODE128",
      displayValue: true,
      fontSize: 16,
      height: 70
    });
    td6.appendChild(svg);

    tr.append(td1, td2, td3, td4, td5, td6);
    table.appendChild(tr);
  });

  const now = new Date();
  document.getElementById("footer-info").textContent =
    "طُبع بتاريخ: " + now.toLocaleDateString("ar-SA") + " " + now.toLocaleTimeString("ar-SA");
}

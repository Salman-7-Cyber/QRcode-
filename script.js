// زر الوضع الليلي
document.getElementById("themeToggle").addEventListener("click", function () {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
});

// تحقق فقط من رقم الجواز وتوليد الباركود
document.getElementById("manualForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const passport = document.getElementById("passport").value.trim();
  const message = document.getElementById("manualMessage");

  // يجب أن يحتوي على حروف وأرقام إنجليزية فقط
  const hasLetters = /[A-Za-z]/.test(passport);
  const hasNumbers = /[0-9]/.test(passport);
  const passportRegex = /^[A-Za-z0-9]+$/;
  const passportValid = hasLetters && hasNumbers && passportRegex.test(passport);

  if (!passportValid) {
    message.textContent = "❌ رقم الجواز يجب أن يحتوي على حروف وأرقام إنجليزية فقط.";
    message.style.color = "red";
    return;
  }

  message.textContent = "✅ تم توليد الباركود بنجاح.";
  message.style.color = "green";

  JsBarcode("#barcode", passport, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 60,
    displayValue: true
  });
});

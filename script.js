// زر تغيير الثيم
document.getElementById("themeToggle").addEventListener("click", function () {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
});

// التحقق من النموذج وتوليد الباركود
document.getElementById("manualForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const passport = document.getElementById("passport").value.trim();
  const message = document.getElementById("manualMessage");

  // شرط الاسم: حروف إنجليزية فقط
  const nameRegex = /^[A-Za-z\s]+$/;

  // شرط الجواز: حروف وأرقام معًا فقط
  const hasLetters = /[A-Za-z]/.test(passport);
  const hasNumbers = /[0-9]/.test(passport);
  const passportRegex = /^[A-Za-z0-9]+$/;
  const passportValid = hasLetters && hasNumbers && passportRegex.test(passport);

  if (!nameRegex.test(name)) {
    message.textContent = "❌ الاسم يجب أن يحتوي على حروف إنجليزية فقط بدون أرقام أو رموز.";
    message.style.color = "red";
    return;
  }

  if (!passportValid) {
    message.textContent = "❌ رقم الجواز يجب أن يحتوي على حروف وأرقام إنجليزية فقط.";
    message.style.color = "red";
    return;
  }

  // إذا الشروط صحيحة
  message.textContent = "✅ البيانات صحيحة! تم توليد الباركود.";
  message.style.color = "green";

  JsBarcode("#barcode", passport, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 60,
    displayValue: true
  });
});

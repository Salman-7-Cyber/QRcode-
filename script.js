document.getElementById("manualForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const passport = document.getElementById("passport").value.trim();
  const message = document.getElementById("manualMessage");

  // ✅ شرط الاسم: فقط حروف إنجليزية
  const nameRegex = /^[A-Za-z\s]+$/;

  // ✅ شرط الجواز: يحتوي على حروف وأرقام إنجليزية معًا
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

  // ✅ إذا جميع الشروط متحققة
  message.textContent = "✅ البيانات صحيحة! تم توليد الباركود.";
  message.style.color = "green";

  // توليد الباركود باستخدام رقم الجواز
  JsBarcode("#barcode", passport, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 60,
    displayValue: true
  });
});

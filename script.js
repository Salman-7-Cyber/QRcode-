// أول شيء: نجيب الزر من الصفحة
const themeToggle = document.getElementById("themeToggle");

// نضيف "حدث" عند الضغط على الزر
themeToggle.addEventListener("click", function () {
  // نقرأ القيمة الحالية للثيم من الـ body
  const currentTheme = document.body.getAttribute("data-theme");

  // إذا الوضع الحالي "light"، نخليه "dark"، والعكس صحيح
  if (currentTheme === "light") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
  }
});

/* الوضع الليلي */
body[data-theme="dark"] {
  background-color: #121212;
  color: #f0f0f0;
}

body[data-theme="dark"] header {
  background-color: #1e1e1e;
}

body[data-theme="dark"] #themeToggle {
  background-color: #333;
  color: #f0f0f0;
}

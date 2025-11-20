console.log("Document viewer loaded.");

// 줌 기능 예시
let scale = 1;
const page = document.querySelector(".document-page");

document.getElementById("zoomIn").onclick = () => {
    scale += 0.1;
    page.style.transform = `scale(${scale})`;
};

document.getElementById("zoomOut").onclick = () => {
    scale = Math.max(0.5, scale - 0.1);
    page.style.transform = `scale(${scale})`;
};
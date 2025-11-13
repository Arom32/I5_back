document.addEventListener("click", (e) => {
    if (e.target.classList.contains("word")) {
      const word = e.target.innerText;
  
      fetch(`/meaning/?word=${word}`)
        .then(res => res.json())
        .then(data => {
          const tooltip = document.getElementById("tooltip");
          tooltip.innerHTML = `
            <strong>${word}</strong><br>
            뜻: ${data.meaning}<br>
            쉬운 표현: ${data.simple}
          `;
          tooltip.style.display = "block";
          tooltip.style.left = e.pageX + "px";
          tooltip.style.top = e.pageY + "px";
        });
    }
  });
  
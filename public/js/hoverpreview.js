(() => {
	const previewableLinks = document.querySelectorAll("a.previewable");
	const previewWindow = document.createElement("iframe");
	previewWindow.style.position = "fixed";
	previewWindow.style.backgroundColor = "white";
	previewWindow.style.border = "1px solid black";
	previewWindow.style.width = "400px";
	previewWindow.style.height = "300px";
	previewWindow.style.display = "none";
	document.body.appendChild(previewWindow);

	let isHovered = false;

	previewableLinks.forEach((link) => {
		link.addEventListener("mouseover", (event) => {
			if (window.innerWidth < 800) return;
			previewWindow.src = link.getAttribute("href");
			previewWindow.style.display = "block";
			if (event.clientY + 300 > window.innerHeight) {
				previewWindow.style.top = `${window.innerHeight - 300}px`;
			} else {
				previewWindow.style.top = `${event.clientY + 2}px`;
			}
			previewWindow.style.left = `${event.clientX + 2}px`;
		});
		link.addEventListener("mouseleave", () => {
			if (window.innerWidth < 800) return;
			if (!isHovered) {
				previewWindow.style.display = "none";
			}
		});
	});

	previewWindow.addEventListener("mouseover", () => {
		if (window.innerWidth < 800) return;
		isHovered = true;
		previewWindow.style.display = "block";
	});
	previewWindow.addEventListener("mouseleave", () => {
		if (window.innerWidth < 800) return;
		isHovering = false;
		previewWindow.style.display = "none";
	});
})();

const copyButtons = document.querySelectorAll('button[data-copy]');
console.log(copyButtons);
copyButtons.forEach(button => {
	button.addEventListener('click', () => {
		console.log(document.location.href);
		fetch(document.location.href, {
			method: 'GET',
			headers: {
				Accept: button.attributes['data-copy'].nodeValue
			}
		}).then(res => {
			if (!res.ok) {
				throw new Error('Could not get data')
			}
			return res.text();
		}).then(data => {
			navigator.clipboard.writeText(data);
			const currentText = button.innerHTML;
			button.innerHTML = 'Copied!';
			setTimeout(() => {
				button.innerHTML = currentText;
			}, 2000);
		});
	});
});

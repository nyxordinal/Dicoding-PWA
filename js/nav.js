document.addEventListener('DOMContentLoaded', function () {

	// SIDEBAR NAVIGATION
	const elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	loadNav();

	function loadNav() {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status !== 200) return;

				// Muat daftar tautan menu
				document.querySelectorAll(".topnav, .sidenav")
					.forEach(function (elm) {
						elm.innerHTML = xhttp.responseText;
					});

				// Daftarkan event listener untuk setiap tautan menu
				document.querySelectorAll('.sidenav a, .topnav a')
					.forEach(function (elm) {
						elm.addEventListener('click', function (event) {
							// Tutup sidenav
							const sidenav = document.querySelector('.sidenav');
							M.Sidenav.getInstance(sidenav).close();

							// Muat konten halaman yang dipanggil 
							page = event.target.getAttribute('href').substr(1);
							loadPage(page);
						});
					});

				// Add event listener for discover button in jumbotron
				const aboutButton = document.getElementById("discover-btn");
				aboutButton.addEventListener('click', function (event) {
					// Load competition page
					loadPage('competition');
				})

				// Add event listener for logo
				const logo = document.getElementById("logo");
				logo.addEventListener('click', function (event) {
					// Load home page
					loadPage('home');
				})
			}
		};
		xhttp.open("GET", 'nav.html', true);
		xhttp.send();
	}

	// Load page content
	let page = window.location.hash.substr(1);
	if (page === '') page = 'home';
	loadPage(page);

	function loadPage(page) {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				const content = document.querySelector(".body-content");
				if (this.status === 200) {
					content.innerHTML = xhttp.responseText;
				} else if (this.status === 404) {
					content.innerHTML = "<p>Page Not Found.</p>";
				} else {
					content.innerHTML = "<p>Ups.. the page cannot be accessed.</p>";
				}
			}
		};
		xhttp.open("GET", 'pages/' + page + '.html', true);
		xhttp.send();

		// fetch data based of active page
		if (page === "competition") {
			// fetch competitions data
			getCompetitions();
		} else if (page === "team") {
			// fetch teams data
			getTeams();
		} else if (page === "favorite") {
			// fetch favorite competition
			getFavoriteCompetitions();
			// fetch favorite team
			getFavoriteTeams();
		}
	}

});
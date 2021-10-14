const hide = document.querySelectorAll(".hide");

const flashCard = document.querySelectorAll(".card-alert");

const closeCard = () => flashCard.forEach((el) => (el.style.display = none));

hide.forEach((el) =>
	el.addEventListener("click", () => {
		flashCard.forEach((el) => (el.style.display = "none"));
	}),
);

const fadeOut = () => {
	flashCard.forEach((card) => card.classList.add("fadeEffect"));
};

fadeOut();

const autoClose = () =>
	setInterval(() => {
		flashCard.forEach((el) => (el.style.display = "none"));
	}, 7000);

autoClose();

/*
;;; ___ ;;;
*/

//eval([]);

const root = document.getElementById("root");
const $sp1 = document.getElementById("sp1");
const theRoot = document.getElementById("theRoot");

/**
 *
 * @param {Element} i
 */
function fullScreen(i) {
	i.style.width = "100%";
	i.style.height = "100%";
}

fetch("/example.txt", (res) => {
	window.example = res.text();
});

function checkRoomCode() {
	const roomCodeList = [
		document.getElementById("n1").value,
		document.getElementById("n2").value,
		document.getElementById("n3").value,
		document.getElementById("n4").value,
		document.getElementById("n5").value,
		document.getElementById("n6").value,
	];
	let back = false;
	roomCodeList.forEach((i) => {
		if (i == "") {
			console.log(i);
			if (back) return; // 알림이 여러번 뜨는 것을 방지
			alert("코드를 채워주세요.");
			back = true;
			return;
		}
	});
	if (back) return false;

	// When the value looks good
	document.getElementById("submitted").checked = "true";

	window.roomCodeVal = Number(roomCodeList.join(""));
	console.log(window.roomCodeVal);
	initTheWebSocket(window.roomCodeVal);
	return true;
}

function getUUID() {
	if (localStorage.getItem("uuid")) {
		window.uuidVal = localStorage.getItem("uuid");
		return window.uuidVal;
	}
	/*window.uuidVal =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);*/
	window.uuidVal = crypto.randomUUID();
	localStorage.setItem("uuid", window.uuidVal);
	return window.uuidVal;
}

function initTheWebSocket(code) {
	const ws = new WebSocket("ws://localhost:3000" + "?rn=" + code);

	ws.onopen = () => {
		ws.send(JSON.stringify({ c: "register", uuid: window.uuidVal }));
	};
	ws.onmessage = (e) => {
		console.log(e.data);
	};
	ws.onclose = () => {
		console.log("closed");
	};
	ws.onerror = () => {
		console.log("error");
	};
}

function initTheRoomCode() {
	getUUID();
	document.getElementById("n1").value = "";
	document.getElementById("n2").value = "";
	document.getElementById("n3").value = "";
	document.getElementById("n4").value = "";
	document.getElementById("n5").value = "";
	document.getElementById("n6").value = "";
	if (location.hash.length == 1 + 6) {
		// 1: #, 6: room code

		/*for (let i = 0; i < 6; i++) {
			document.getElementById("n" + (i + 1)).value = location.hash[i + 1];
			document.getElementById("n" + (i + 1)).focus();
		}*/
		let count = 0;
		setTimeout(() => {
			const intervalId = setInterval(() => {
				if (count == 6) {
					document.getElementsByClassName("submit")[0].focus();
					clearInterval(intervalId);
					return;
				}
				document.getElementById("n" + (count + 1)).value =
					location.hash[count + 1];
				document.getElementById("n" + (count + 1)).focus();
				count++;
			}, 100);
		}, 400);

		/*setTimeout(
			() => document.getElementsByClassName("submit")[0].focus(),
			1000,
		);*/
	}

	setTimeout(() => (document.getElementById("submitted").checked = false), 500);
	theRoot.classList.add("init");
	/*document.getElementById("submitted").addEventListener("change", (e) => {
		console.log(1);
		console.log(e);
		if (e.target.checked) {
			const roomCodeList = [
				document.getElementById("n1").value,
				document.getElementById("n2").value,
				document.getElementById("n3").value,
				document.getElementById("n4").value,
				document.getElementById("n5").value,
				document.getElementById("n6").value,
			];

			window.roomCodeVal = Number(roomCodeList.join(""));
			console.log(window.roomCodeVal);
		}
	});*/
}

/**
 *
 * @param {Element} i
 */
function fadeIn(i) {
	i.classList.remove("hid");
	i.classList.add("fadeIn");
	// if (i.attributes?.next?.value == "sp3") return;
	console.log(i.id);
	if (i.id == "theRoot") {
		if (document.getElementsByClassName("init").length == 0) {
			initTheRoomCode();
		}
		return;
	}
	window.titleEvent = root.addEventListener("click", () => {
		setTimeout(() => {
			if (!window.licenseVal) {
				fadeOut(i);
				return;
			}
			setTimeout(() => {
				window.licenseVal = false;
			}, 10);
		}, 10);
	});
	i.addEventListener("animationend", () => {
		setTimeout(() => {
			fadeOut(i);
		}, 3000);
	});
}

/**
 *
 * @param {Element} i
 */
function fadeOut(i) {
	root.removeEventListener("click", window.titleEvent);
	i.classList.remove("fadeIn");
	i.classList.add("fadeOut");
	let next = i.attributes?.next?.value;
	if (!next) return;
	//i.classList.add("fadeOut");
	next = document.getElementById(next);
	i.addEventListener("animationend", () => {
		i.classList.add("hid");
		if (next) {
			fadeIn(next);
			return;
		}
		//console.log(next);
	});
}

window.addEventListener("load", () => {
	document.getElementById("submitted").checked = true;
	setTimeout(() => {
		fadeIn($sp1);
	}, 500);
});

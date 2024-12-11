<script lang="ts">
  import "./Passcode.scss";
  import { browser } from "$app/environment";
  if (browser)
    (document.getElementById("submitted") as HTMLInputElement).checked = false;
  //import { hasContext } from "svelte";

  //let inputRefs: HTMLInputElement[] = []; // 입력 필드 참조 배열
  //let inputValues = ["", "", "", "", "", ""]; // 입력값을 저장할 배열
  let inputValues: string[] = [];
  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    //event.target.nextElementSibling?.focus();
    //input.nextElementSibling?.focus();

    if (/[^0-9.]/.test(input.value)) {
      // 숫자가 아닌 값이 있을 때
      input.value = input.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
    } else {
      // 숫자일 때
      // input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      const next = input.nextElementSibling as HTMLElement;
      next?.focus();
      // inputValues.push(input.value);
    }
  }

  function getRoomCode() {
    inputValues[0] = (document.getElementById("n1") as HTMLInputElement).value;
    inputValues[1] = (document.getElementById("n2") as HTMLInputElement).value;
    inputValues[2] = (document.getElementById("n3") as HTMLInputElement).value;
    inputValues[3] = (document.getElementById("n4") as HTMLInputElement).value;
    inputValues[4] = (document.getElementById("n5") as HTMLInputElement).value;
    inputValues[5] = (document.getElementById("n6") as HTMLInputElement).value;

    console.log(inputValues);
  }

  function checkRoomCode() {
    getRoomCode();
    /*const roomCodeList = [];*/
    const roomCodeList = inputValues;
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
    console.log(Number(roomCodeList.join("")));
    if (back) return false;
    checkFromServer(roomCodeList.join(""));
    // When the value looks good
    //document.getElementById("submitted").checked = "true";

    //window.roomCodeVal = Number(roomCodeList.join(""));
    //console.log(window.roomCodeVal);
    //initTheWebSocket(window.roomCodeVal);
    return true;
  }

  let isExecuted = false;
  function checkFromServer(rc: string) {
    if (isExecuted) return;
    isExecuted = true;
    console.log(rc);
    let name = prompt("이름은?");
    if (!name) {
      // name이 없으면
      setTimeout(() => {
        isExecuted = false;
        checkFromServer(rc); // 재귀 호출(콜스택 오버플로우 방지를 위해 다른 쓰레드로 넘김)
      }, 0);
      return; // 함수 종료
    }
    // post 방 코드
    fetch(`/b/api/room/${rc}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          (document.getElementById("submitted") as HTMLInputElement).checked =
            true;
          // (document.getElementById("roomCode") as HTMLElement).style.display =
          //   "none";
          (document.getElementById("roomCode") as HTMLElement).classList.add(
            "hidden"
          );
          // (document.getElementById("welcome") as HTMLElement).style.display =
          //   "block";
          (document.getElementById("welcome") as HTMLElement).classList.remove(
            "hidden"
          );
          (document.getElementById("welcome") as HTMLElement).innerText =
            `${name}님, 환영합니다.`;
          //alert(`방 코드: ${data.id}`);
          //fillRoomCode(data.id);
          connectWs(Number(data.id), name);
        });
      } else {
        alert("방 접속 실패");
      }
    });
  }

  let reconnectInterval: NodeJS.Timeout;

  function connectWs(code: number, name: string) {
    try {
      clearInterval(reconnectInterval);
    } catch {}
    if (!code) return;
    const url = location.origin.replace("http", "ws").split("/admin")[0];
    let ws: WebSocket = new WebSocket(`${url}/b/ws?rn=${code}&name=${name}`);
    ws.onopen = () => {
      console.log("connected");
      // ws.send(JSON.stringify({ name: name }));
      ws.send("register " + name);
    };
    const quiz = document.getElementById("quiz");
    const quizTitle = document.getElementById("quizTitle");
    const quizPadding = document.getElementById("quizPadding");
    const quizContent = document.getElementById("quizContent");
    const quizSubmit = document.getElementById("quizSubmit");
    if (!quiz || !quizTitle || !quizPadding || !quizContent || !quizSubmit)
      return;
    ws.onmessage = (event) => {
      // console.log(event.data);
      const data = event.data;
      console.log(data);
      if (data == "registered") {
        quizTitle.innerText = data.split(" ")[1];
      } else if (data == "start") {
        (document.getElementById("welcome") as HTMLElement).classList.add(
          "hidden"
        );
        // alert("시작");
        quiz.style.display = "block";
        quizTitle.innerText = name;
        quizPadding.innerText = "invisible";
      } else if (data == "ready") {
        (document.getElementById("welcome") as HTMLElement).classList.add(
          "hidden"
        );
      }
    };
    ws.onclose = (event) => {
      console.error(event);
      reconnectInterval = setInterval(connectWs, 3000, code, name);
    };
    // @ts-expect-error window에 ws를 넣어줌 (디버그 목적임 ㅇㅇ)
    window.ws = ws;
  }
</script>

<div id="roomCode">
  <h1 style="font-size: 2em;">방 코드를 입력해주세요.</h1>
  <input id="submitted" type="checkbox" tabindex="-1" />

  <form id="roomCodeForm">
    <input
      class="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      id="n1"
      autocomplete="off"
      on:input={handleInput}
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
      autofocus
    />

    <input
      class="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      autocomplete="off"
      on:input={handleInput}
      id="n2"
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
    />

    <input
      class="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      autocomplete="off"
      on:input={handleInput}
      id="n3"
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
    />

    <input
      class="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      autocomplete="off"
      on:input={handleInput}
      id="n4"
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
    />

    <input
      class="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      autocomplete="off"
      on:input={handleInput}
      id="n5"
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
    />

    <input
      class="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      autocomplete="off"
      on:input={handleInput}
      id="n6"
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
    />

    <button
      class="submit"
      on:keypress={checkRoomCode}
      on:click={checkRoomCode}
      aria-label="방 코드 확인"
      tabindex="0"
    ></button>
    <!--
			for="submitted"
			type="button"
		-->
    <!--for="submitted"-->

    <span class="indicator"></span>
  </form>
</div>
<h2 id="welcome" class="hidden">님, 환영합니다.</h2>
<div id="quiz" class="hidden">
  <h1 id="quizTitle">퀴즈</h1>
  <h1 id="quizPadding" style="color: rgba(0, 0, 0, 0);">error</h1>
  <div id="quizContent" class="hidden"></div>
  <button id="quizSubmit" class="hidden">제출</button>
</div>

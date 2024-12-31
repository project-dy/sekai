<script lang="ts">
  import "./Admin.scss";
  import { browser } from "$app/environment";
  import type { metadataMap } from "$types/index.d.ts";
  let obj: metadataMap;
  let ws: WebSocket;
  let handle = () => {
    if (browser) {
      // const name = prompt("방 이름은?");
      const name = "random";
      if (!name) return;
      // CSR(브라우저)에서만 동작
      const url = `/b/api/room/create`; // API URL
      fetch(url, {
        // API 호출
        method: "POST", // HTTP Method: POST: 데이터 전송
        headers: {
          // HTTP Header
          "Content-Type": "application/json", // 데이터 타입: JSON (이 형식으로 보냄)
        },
        body: JSON.stringify({ name: name }), // 정보 넣기
      }).then((res) => {
        console.log(res); // 결과 출력
        if (res.ok) {
          // 성공시
          res.json().then((data) => {
            console.log(data); // 결과 출력
            // alert(`방 코드: ${data.id}`); // 결과 출력
            fillRoomCode(data.id);
          });
        } else {
          // 실패시
          alert("방 생성 실패"); // 결과 출력
        }
      });
    }
  };
  function fillRoomCode(code: string) {
    const codeArray = String(code).split(""); // TypeScript는 타입을 추론하지만 해당 타입으로 들어온다는 보장이 없기 때문에 string으로 변환
    const roomCodeForm = document.getElementById("roomCodeForm");
    if (!roomCodeForm) return;
    const inputsElement = roomCodeForm.getElementsByTagName("input");
    const inputs = Array.from(inputsElement);
    for (let i = 0; i < codeArray.length; i++) {
      inputs[i].value = codeArray[i];
    }
    const roomCode = document.getElementById("roomCode");
    if (!roomCode) return;
    roomCode.style.display = "block";
    connectWs(Number(code));
    const theButton = document.getElementById("theButton");
    if (!theButton) return;
    theButton.innerText = "시작";
    handle = async () => {
      ws.send("adminStart");
      const id: string =
        atob(new URL(location.href).searchParams.get("id") || "") ||
        (await navigator.clipboard.readText()) ||
        prompt("id") ||
        "info";
      console.log(id);
      ws.send("");
      ws.send("adminQuizReady");
    };
    // theButton.onclick = () => {
    // };
  }
  let reconnectInterval: NodeJS.Timeout;
  function connectWs(code: number) {
    try {
      clearInterval(reconnectInterval);
    } catch {}
    if (!code) return;
    const url = location.origin.replace("http", "ws").split("/admin")[0];
    ws = new WebSocket(`${url}/b/ws?rn=admin${code}&name=admin`); // 웹소켓 연결
    ws.onopen = () => {
      try {
        clearInterval(reconnectInterval);
      } catch {}
      console.log("connected");
      ws.send("adminInit");
    };
    let audio: HTMLAudioElement;
    ws.onmessage = (event) => {
      console.log(event.data);
      const data: string = event.data;
      if (!data) return;
      // console.log(data);
      if (data.startsWith("register")) {
        addList(data.split("register ")[1]);
      } else if (data.startsWith("youtube")) {
        try {
          audio.pause();
        } catch {}
        audio = new Audio(data.replace("youtube", "/b/audio"));
        audio.volume = 1;
        audio.load();
        audio.play();
        audio.loop = true;
        // @ts-expect-error window에 audio를 넣어줌 (디버그 목적임 ㅇㅇ)
        window.audio = audio;
      } else if (data.startsWith("ytMeta")) {
        obj = JSON.parse(data.replace("ytMeta", ""));
      } else if (data == "ready") {
        (document.getElementById("ready") as HTMLDivElement).classList.remove(
          "hidden"
        );
      }
    };
    ws.onclose = (event) => {
      console.error(event);
      reconnectInterval = setInterval(connectWs, 3000, code);
      location.replace("./#popup1");
    };
    // @ts-expect-error window에 ws를 넣어줌 (디버그 목적임 ㅇㅇ)
    window.ws = ws;
  }
  function addList(name: string) {
    // const list = document.getElementById("list");
    // if (list) {
    //   list.textContent += name;
    // }
    const list = document.getElementById("list");
    if (!list) return;
    // const li = document.createElement("li");
    // li.textContent = name;
    // list.appendChild(li);
    const button = document.createElement("button");
    button.textContent = name;
    button.style.padding = "2px";
    button.style.margin = "1em";
    list.appendChild(button);
  }
</script>

<div id="roomCodeDiv">
  <button id="theButton" on:click={handle}> 방 생성 </button>

  <div id="roomCode" style="display:none;">
    <input id="submitted" type="checkbox" tabindex="-1" />

    <form id="roomCodeForm">
      <input
        type="number"
        min="0"
        max="9"
        maxlength="1"
        placeholder=" "
        id="n1"
        disabled
        pattern="[0-9]*"
        inputmode="numeric"
        value=""
        autofocus
      />
      <input
        type="number"
        min="0"
        max="9"
        maxlength="1"
        placeholder=" "
        disabled
        id="n2"
        pattern="[0-9]*"
        inputmode="numeric"
        value=""
      />
      <input
        type="number"
        min="0"
        max="9"
        maxlength="1"
        placeholder=" "
        disabled
        id="n3"
        pattern="[0-9]*"
        inputmode="numeric"
        value=""
      />
      <input
        type="number"
        min="0"
        max="9"
        maxlength="1"
        placeholder=" "
        disabled
        id="n4"
        pattern="[0-9]*"
        inputmode="numeric"
        value=""
      />

      <input
        type="number"
        min="0"
        max="9"
        maxlength="1"
        placeholder=" "
        disabled
        id="n5"
        pattern="[0-9]*"
        inputmode="numeric"
        value=""
      />

      <input
        type="number"
        min="0"
        max="9"
        maxlength="1"
        placeholder=" "
        disabled
        id="n6"
        pattern="[0-9]*"
        inputmode="numeric"
        value=""
      />

      <button class="submit" disabled aria-label="방 코드 확인" tabindex="0"
      ></button>
      <!--
        for="submitted"
        type="button"
      -->
      <!--for="submitted"-->

      <span class="indicator"></span>
    </form>
  </div>

  <div id="list"></div>

  <div id="ready" class="full hidden">
    <h1>준비</h1>
  </div>

  <div id="player">

  </div>
</div>
<!-- <a class="button" href="#popup1">Let me Pop up</a> -->

<div id="popup1" class="overlay">
  <div class="popup">
    <h2>Here i am</h2>
    <a class="close" href="#list">&times;</a>
    <div class="content">
      Thank to pop me out of that button, but now i'm done so you can close this
      window.
    </div>
  </div>
</div>

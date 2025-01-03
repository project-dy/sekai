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
  let id = "info";
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
      id =
        atob(new URL(location.href).searchParams.get("id") || "") ||
        // (await navigator.clipboard.readText()) ||
        prompt("id") ||
        "info";
      console.log(id);
      // ws.send("");
      ws.send("adminQuizReady");
    };
    // theButton.onclick = () => {
    // };
  }
  let currentSong: string;
  let currentAnswers: string[];
  let reconnectInterval: ReturnType<typeof setTimeout>;
  function connectWs(code: number) {
    try {
      clearInterval(reconnectInterval);
      // eslint-disable-next-line no-empty
    } catch {} // 에러 핸들링 필요 없음
    if (!code) return;
    const url = location.origin.replace("http", "ws").split("/admin")[0];
    ws = new WebSocket(`${url}/b/ws?rn=admin${code}&name=admin`); // 웹소켓 연결
    ws.onopen = () => {
      try {
        clearInterval(reconnectInterval);
        // eslint-disable-next-line no-empty
      } catch {} // 에러 핸들링 필요 없음
      console.log("connected");
      ws.send("adminInit");
    };
    let arr: string[] = [];
    function fisherYatesShuffle() {
      // 배열을 섞는 함수
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // 값 교환
      }
    }

    function getRandomUniqueValue() {
      // 배열이 비어 있으면 null을 리턴
      if (arr.length === 0) return null;
      fisherYatesShuffle(); // 배열을 섞음
      const value = arr[0]; // 첫 번째 값을 뽑음
      arr.shift(); // 뽑은 값을 배열에서 제거
      return value;
    }
    let audio: HTMLAudioElement;
    let scoreByUser: { [key: string]: number } = {};
    function renderScore() {
      // 점수 순으로 사용자 정렬
      const sortedUsers = Object.entries(scoreByUser)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      console.log(sortedUsers);

      // 랭킹 표에 데이터를 추가
      const rankingTable = document.getElementById("rankingTable")!;
      rankingTable.innerHTML = "";

      if (rankingTable !== null)
        sortedUsers.forEach((entry, index) => {
          const row = document.createElement("tr");
          // 순위 셀
          const rankCell = document.createElement("td");
          rankCell.textContent = String(index + 1); // 순위
          row.appendChild(rankCell);

          // 사용자 이름 셀
          const nameCell = document.createElement("td");
          nameCell.textContent = entry[0]; // 사용자 이름
          row.appendChild(nameCell);

          // 점수 셀
          const scoreCell = document.createElement("td");
          scoreCell.textContent = String(entry[1]); // 점수
          row.appendChild(scoreCell);

          // 표에 행 추가
          rankingTable.appendChild(row);
        });
    }
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
          // eslint-disable-next-line no-empty
        } catch {}
        // audio = new Audio(data.replace("youtube", "/b/audio"));
        audio = document.getElementById("audioPlayer") as HTMLAudioElement;
        audio.src = data.replace("youtube", "/b/audio");
        audio.volume = 1;
        audio.load();
        audio.play();
        audio.loop = false;
        // @ts-expect-error window에 audio를 넣어줌 (디버그 목적임 ㅇㅇ)
        window.audio = audio;
        ws.send("adminShow");
      } else if (data.startsWith("ytMeta")) {
        obj = JSON.parse(data.replace("ytMeta", ""));
      } else if (data == "ready") {
        (document.getElementById("ready") as HTMLDivElement).classList.remove(
          "hidden"
        );
        (document.getElementById("wrap") as HTMLDivElement).classList.add(
          "hidden"
        );
        ws.send(`adminYoutubeList ${id}`);
      } else if (data.startsWith("setSong")) {
        currentSong = data.replace("setSong", "").split("$")[0];
        currentAnswers = JSON.parse(data.replace("setSong", "").split("$")[1]);
        console.log(id, currentAnswers);
        ws.send(`adminYoutube ${id} ${currentSong}`);
      } else if (data.startsWith("answer")) {
        function convert(str: string): string {
          function convertToHalfWidth(str: string) {
            return str
              .replaceAll("　", " ")
              .replace(
                /[\uFF01-\uFF5E\uFF10-\uFF19\u3000]/g,
                function (char: string) {
                  // 전각 문자 → 반각 문자 변환
                  return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
                }
              );
          }

          // const fullWidthStr = "Ｈｅｌｌｏ　１２３";
          // const halfWidthStr = convertToHalfWidth(fullWidthStr);

          // console.log(halfWidthStr); // 출력: Hello 123

          function removeUnwantedChars(str: string) {
            // 알파벳, 숫자, 공백, 일본어, 일본어 한자, 한국어를 제외한 모든 특수문자 제거
            return str.replace(
              /[^\w\s\u3040-\u30FF\u31F0-\u31FF\u4E00-\u9FFF\uAC00-\uD7AF]/g,
              ""
            );
          }

          // const inputStr = "Hello! こんにちは, 今日は 2025年 #한글 예시 🏮";
          // const cleanedStr = removeUnwantedChars(inputStr);

          // console.log(cleanedStr); // 출력: Hello こんにちは 今日は 2025年 한글 예시

          let answer: string = str;
          // if (!answer) return;
          answer = answer.replaceAll(" ", "");
          answer = convertToHalfWidth(answer);
          answer = removeUnwantedChars(answer);
          answer = answer.toLocaleLowerCase();
          return answer;
        }
        const username = data.replace("answer", "").split("$")[0];
        const userAnswer = convert(data.replace("answer", "").split("$")[1]);
        let correctAnswers: string[] = [];
        currentAnswers.forEach((e) => {
          correctAnswers.push(convert(e));
        });
        // 정답 리스트에 답이 있는지
        if (correctAnswers.includes(userAnswer)) {
          const currentTime = audio.currentTime * 1000;
          let score = 2000 - 0.04 * currentTime;
          if (0 > score) score = 0;
          score = Math.round(score);
          if (!scoreByUser[username]) scoreByUser[username] = 0;
          scoreByUser[username] += score;
          // debugger;
          ws.send(`adminCorrect ${username} ${score}`);
        } else {
          ws.send(`adminCorrect ${username} 0`);
        }
        renderScore();
      } else if (data.startsWith("ytList")) {
        arr = JSON.parse(data.replace("ytList", ""));
        (document.getElementById("ready") as HTMLDivElement).addEventListener(
          "click",
          () => {
            const random = getRandomUniqueValue();
            if (random === null) return;
            if (random) {
              ws.send(`adminSetSong ${id} ${random}`);
            }
          }
          // { once: true },
        );
        (document.getElementById("ready") as HTMLDivElement).click();
      }
    };
    ws.onclose = (event) => {
      console.error(event);
      reconnectInterval = setInterval(connectWs, 3000, code);
      location.replace("./#popup1");
    };
    // @ts-expect-error window에s를 넣어줌 (디버그 목적임 ㅇㅇ)
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
  <div id="wrap">
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
  </div>

  <div id="ready" class="hidden">
    <div id="spe">
      <button id="nextSong" aria-label="다음 노래">다음 노래</button>
      <br />
      <h1 id="status" class="hidden">준비</h1>
      <br />
      <audio id="audioPlayer" controls />
      <br />
      <table id="rankingTable" />
    </div>
  </div>
</div>
<!-- <a class="button" href="#popup1">Let me Pop up</a> -->

<div id="popup1" class="overlay full">
  <div class="popup">
    <h2>Here i am</h2>
    <a class="close" href="#list">&times;</a>
    <div class="content">
      Thank to pop me out of that button, but now i'm done so you can close this
      window.
    </div>
  </div>
</div>

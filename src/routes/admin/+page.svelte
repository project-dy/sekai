<script lang="ts">
  import "./+page.css";
  // import svelteLogo from "$lib/images/svelte.svg";
  // import viteLogo from "$lib/images/vite.svg";
  // import Counter from "$lib/Counter.svelte";
  // import Command from "$lib/Command.svelte";
  import Admin from "$lib/Admin.svelte";

  // import { browser } from "$app/environment";

  let ws: WebSocket;
  /*if (browser) {
    // CSR(브라우저)에서만 동작
    const rnParam = "admin"; // 웹소켓 연결을 위한 룸넘버 파라미터(관리자 파라미터)
    ws = new WebSocket(
      `ws://${location.href.split("/")[2]}/b/socket?rn=${rnParam}`, // 접속할 웹소켓 주소
    );
    ws.onopen = () => {
      // 접속 성공시
      console.log("WebSocket connection established");
    };
    ws.onmessage = (event) => {
      // 메시지 수신시
      console.log(event.data); // 수신한 데이터 출력 (raw)
      const data = JSON.parse(event.data); // 수신한 데이터를 JSON으로 파싱
      console.log(data); // 수신한 데이터 출력 (JSON formatted)
    };
  }*/
</script>

<main>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + SvelteKit</h1> -->

  <div class="card">
    <!-- <Counter /> -->
    <!-- <Command /> -->
    <Admin />
  </div>
<!-- 
  <p>
    Check out <a
      href="https://github.com/sveltejs/kit#readme"
      target="_blank"
      rel="noreferrer">SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p> -->
</main>

<style>
  /* .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  } */
</style>

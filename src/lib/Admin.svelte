<script lang="ts">
  import { browser } from "$app/environment";
  const increment = () => {
    if (browser) { // CSR(브라우저)에서만 동작
      const url = `/b/api/room/create`; // API URL
      fetch(url, { // API 호출
        method: 'POST', // HTTP Method: POST: 데이터 전송
        headers: { // HTTP Header
          'Content-Type': 'application/json' // 데이터 타입: JSON (이 형식으로 보냄)
        },
        body: JSON.stringify({name: prompt('방 이름은?')}) // 정보 넣기
      }).then((res) => {
        console.log(res); // 결과 출력
      });
    }
  };
</script>

<button on:click={increment}>
  방 생성
</button>
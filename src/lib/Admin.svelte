<script lang="ts">
  import { browser } from "$app/environment";
  const increment = () => {
    if (browser) {
      const url = `/b/api/room/create`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: prompt('방 이름은?')}) // Add your request payload here
      }).then((res) => {
        console.log(res);
      });
    }
  };
</script>

<button on:click={increment}>
  방 생성
</button>
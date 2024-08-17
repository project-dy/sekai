<script lang="ts">
  export let ws: WebSocket;
  import { browser } from "$app/environment";
  let wsMessage: string;
  if (browser) {
    const rnParam = "admin";
    if (!ws) {
      ws = new WebSocket(
        `ws://${location.href.split("/")[2]}/b/socket?rn=${rnParam}`,
      );
    }
    ws.onopen = () => {
      console.log("WebSocket connection established");
      //wsMessage = "WebSocket connection established\n";
      wsMessage = "";
    };
    ws.onmessage = (event) => {
      console.log(event.data);
      const data = JSON.parse(event.data);
      console.log(data);
      wsMessage = `${data.m}\n`;
    };
  }
</script>

<main>
  <h3>
    {wsMessage}
  </h3>
</main>

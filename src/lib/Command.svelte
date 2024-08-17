<script lang="ts">
  export let ws: WebSocket;
  import "./Command.scss";
  //import { hasContext } from "svelte";

  //let inputRefs: HTMLInputElement[] = []; // 입력 필드 참조 배열
  //let inputValues = ["", "", "", "", "", ""]; // 입력값을 저장할 배열
  let inputValue: string = "";

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    //event.target.nextElementSibling?.focus();
    //input.nextElementSibling?.focus();
    /*const next = input.nextElementSibling as HTMLElement;
    next?.focus();*/
    inputValue = input.value;
  }

  function checkInput() {
    if (!inputValue) return false;
    submitInput(inputValue);
    return true;
  }

  function formatInput(p: string[]) {
    const command = p[0];
    let dataList = p.slice(1);
    // parameters may be like a=1 b=2 c=3
    // we need to convert them to an object and it'll be changed to JSON.
    interface Data {
      command: string;
      params: { [key: string]: string }[];
      flags: string[];
    }
    // const data = {};
    // data.command = command;
    // data.params = [];
    // data.flags = [];
    const data: Data = {
      command: command,
      params: [],
      flags: [],
    };
    dataList.forEach((e, i) => {
      // if param starts with --
      if (e.startsWith("--")) {
        const key = e.slice(2);
        data.flags.push(key);
        return;
      }

      if (e.startsWith("-")) {
        const key = e.slice(1).split("");
        key.forEach((k) => {
          data.flags.push(k);
        });
      }

      const [key, value] = e.split("=");
      if (!value) {
        data.params.push({ string: key });
        return;
      }
      //data["params"][key] = value;
      data.params.push({ [key]: value });
    });
    const jsonData = JSON.stringify(data);
    return jsonData;
    // console.log(`Sending command: ${jsonData}`);
    // //ws.send(jsonData);
    // console.log("Command sent");
  }

  function submitInput(inputValue: string) {
    console.log(inputValue);
    //ws.send(inputValue);
    const inputList = inputValue.split(" ");
    ws.send(formatInput(inputList));
  }
</script>

<div id="roomCode">
  <input id="submitted" type="checkbox" tabindex="-1" />

  <form id="roomCodeForm">
    <input
      type="text"
      placeholder=" "
      id="n1"
      on:input={handleInput}
      value=""
      autofocus
    />
    <!-- <input
      type="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      on:input={handleInput}
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
      on:input={handleInput}
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
      on:input={handleInput}
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
      on:input={handleInput}
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
      on:input={handleInput}
      id="n6"
      pattern="[0-9]*"
      inputmode="numeric"
      value=""
    /> -->

    <!-- on:keypress={checkInput} -->
    <button
      class="submit"
      on:click={checkInput}
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

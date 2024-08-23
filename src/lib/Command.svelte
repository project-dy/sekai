<script lang="ts">
  //export let ws: WebSocket;
  import "./Command.scss";
  //import { hasContext } from "svelte";

  //let inputRefs: HTMLInputElement[] = []; // 입력 필드 참조 배열
  //let inputValues = ["", "", "", "", "", ""]; // 입력값을 저장할 배열
  let inputValue: string = "";

  function handleInput(event: Event) { // 입력값 변경시
    const input = event.target as HTMLInputElement;
    //event.target.nextElementSibling?.focus();
    //input.nextElementSibling?.focus();
    /*const next = input.nextElementSibling as HTMLElement;
    next?.focus();*/
    inputValue = input.value;
  }

  function checkInput() { // 입력값 확인
    if (!inputValue) return false;
    submitInput(inputValue);
    return true;
  }

  function submitInput(inputValue: string) {
    console.log(inputValue);
    //ws.send(inputValue);
    //ws.send(formatInput(inputList));
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

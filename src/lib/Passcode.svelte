<script lang="ts">
  import "./Passcode.scss";
  //import { hasContext } from "svelte";

  //let inputRefs: HTMLInputElement[] = []; // 입력 필드 참조 배열
  //let inputValues = ["", "", "", "", "", ""]; // 입력값을 저장할 배열
  let inputValues: string[] = [];

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    //event.target.nextElementSibling?.focus();
    //input.nextElementSibling?.focus();
    const next = input.nextElementSibling as HTMLElement;
    next?.focus();
    inputValues.push(input.value);
  }

  function checkRoomCode() {
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

    // When the value looks good
    //document.getElementById("submitted").checked = "true";

    //window.roomCodeVal = Number(roomCodeList.join(""));
    //console.log(window.roomCodeVal);
    //initTheWebSocket(window.roomCodeVal);
    return true;
  }
</script>

<div id="roomCode">
  <input id="submitted" type="checkbox" tabindex="-1" />

  <form id="roomCodeForm">
    <input
      type="number"
      min="0"
      max="9"
      maxlength="1"
      placeholder=" "
      id="n1"
      on:input={handleInput}
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

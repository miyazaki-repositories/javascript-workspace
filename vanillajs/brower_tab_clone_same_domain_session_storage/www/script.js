import { add, del, refresh } from "./scripts/index.js";
import { EVENT } from "./scripts/broadcast.js";

window.addEventListener("DOMContentLoaded", (event) => {
  // https://stackoverflow.com/questions/70433259/browser-tab-knows-when-it-has-been-duplicated
  const channel = new BroadcastChannel("example");
  channel.postMessage(EVENT.OPEN_PAGE);
  channel.onmessage = (event) => {
    if (event.data === EVENT.OPEN_PAGE) {
      console.log(EVENT.OPEN_PAGE);
      channel.postMessage(EVENT.DUPLICATE_PAGE);
    }
    if (event.data === EVENT.DUPLICATE_PAGE) {
      console.log(EVENT.DUPLICATE_PAGE);
      window.alert('このページは複数のタブで同時に操作できません')
      window.close();
    }
  };

  // 画面からセッションストレージに値セットしたり削除したりするイベント設定
  const addButton = document.getElementById("add_button");
  addButton.addEventListener("click", add);
  const delButton = document.getElementById("delete_button");
  delButton.addEventListener("click", del);
  const refreshButton = document.getElementById("refresh_button");
  refreshButton.addEventListener("click", refresh);
  refresh();
});

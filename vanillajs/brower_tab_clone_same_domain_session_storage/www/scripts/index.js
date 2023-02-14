const rows_name = "row_value";

function createNewKey(key) {
  const newKey = `${key}_`;
  if (window.sessionStorage.getItem(newKey)) {
    return createNewKey(newKey);
  } else {
    return newKey;
  }
}

export function add(event) {
  const newItem = {
    key: document.getElementById("input_key").value,
    value: document.getElementById("input_value").value,
  };
  if (newItem.key?.length && newItem.value.length) {
    if (window.sessionStorage.getItem(newItem.key)) {
      // 既に存在するキーの場合、末尾にアンダーバーを追加して登録
      newItem.key = createNewKey(newItem.key);
    }
    window.sessionStorage.setItem(newItem.key, newItem.value);
    refresh();
  } else {
    window.alert("plz input key and value :(");
  }
}

export function del(event) {
  window.sessionStorage.clear();
  refresh();
}

export function refresh(event) {
  const tableElm = document.getElementById("values_table");
  tableElm.querySelectorAll("tr").forEach((thElm) => {
    // 表示リセットのためテーブルのヘッダー行以外を削除
    if (thElm.querySelector("td")) {
      thElm.remove();
    }
  });

  const keys = Object.keys(window.sessionStorage).sort((a, b) => {
    return a.localeCompare(b, "en", {
      numeric: true,
    });
  });
  if (keys.length) {
    document.getElementsByName(rows_name).forEach((_, index) => {
      document.getElementsByName(rows_name)[index].remove();
    });
    keys.forEach((key) => {
      const rowEleText = `
        <tr name="${rows_name}">
          <td>${key}</td>
          <td>${sessionStorage.getItem(key)}</td>
        </tr>
      `;
      tableElm.insertAdjacentHTML("beforeend", rowEleText);
    });
  }
}

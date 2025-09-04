const firebaseConfig = {
  apiKey: "AIzaSyAKFXx_Lg3uVVHZPagCXfBOFNlfyi57FXs",
  authDomain: "shohakusaiszn126-1-5.firebaseapp.com",
  databaseURL: "https://shohakusaiszn126-1-5-default-rtdb.firebaseio.com",
  projectId: "shohakusaiszn126-1-5",
  storageBucket: "shohakusaiszn126-1-5.firebasestorage.app",
  messagingSenderId: "716915522027",
  appId: "1:716915522027:web:15de0202348ee194bd41ae",
  measurementId: "G-2R1T2P33L8",
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// データベースの変更を監視して混雑状況表示を更新する
const boothsRef = database.ref("booths");
boothsRef.on("value", (snapshot) => {
  const booths = snapshot.val();
  const boothListDiv = document.getElementById("booth-list");
  boothListDiv.innerHTML = "";
  if (booths) {
    for (let boothId in booths) {
      const booth = booths[boothId];
      const boothDiv = document.createElement("div");
      boothDiv.className = "booth-item";
      const nameElement = document.createElement("h2");
      nameElement.className = "booth-name";
      nameElement.textContent = booth.name || boothId;
      const statusElement = document.createElement("p");
      statusElement.className = `booth-status status-${booth.status}`;
      statusElement.textContent = booth.status;
      boothDiv.appendChild(nameElement);
      boothDiv.appendChild(statusElement);
      boothListDiv.appendChild(boothDiv);
    }
  } else {
    boothListDiv.textContent = "データがありません。";
  }
});

// 新しい機能：呼び出し中の整理券番号を表示する
const calledTicketsRef = database.ref("calledTickets");
calledTicketsRef.on("value", (snapshot) => {
  const tickets = snapshot.val();
  const ticketsList = document.getElementById("called-tickets-list");
  const noTicketsDisplay = document.getElementById("no-tickets-display");
  ticketsList.innerHTML = "";
  if (tickets) {
    noTicketsDisplay.style.display = "none";
    // 取得したデータをリストに変換し、for..ofでループする
    Object.values(tickets).forEach((ticketNumber) => {
      const li = document.createElement("li");
      li.className = "called-ticket-number";
      li.textContent = ticketNumber;
      ticketsList.appendChild(li);
    });
  } else {
    noTicketsDisplay.style.display = "block";
  }
});

// 混雑状況リセットボタンのクリックイベント
document.getElementById("reset-button").addEventListener("click", () => {
  const confirmation = confirm("本当にすべての混雑状況をリセットしますか？");
  if (confirmation) {
    boothsRef
      .remove()
      .then(() => {
        alert("すべての混雑状況がリセットされました。");
      })
      .catch((error) => {
        alert("リセットに失敗しました: " + error.message);
        console.error("リセットエラー:", error);
      });
  }
});

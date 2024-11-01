// 送信する時刻（24時間形式で設定）
const sendTimes = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"];

// 指定した時刻にメッセージを送信する関数
async function checkAndSend() {
  const now = new Date();
  const currentTime = now.toLocaleTimeString("ja-JP", { hour12: false, hour: "2-digit", minute: "2-digit" });

  if (sendTimes.includes(currentTime)) {
    await client.sendSquareMessage({ squareChatMid, text: `保護Bot稼働中 ${currentTime}` });
  }

  // 1分後に再度チェック
  setTimeout(checkAndSend, 60 * 1000);
}

// チェックを開始
checkAndSend();

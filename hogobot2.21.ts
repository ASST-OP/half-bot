import { Client } from "jsr:@evex/linejs@1.7.1";
import { FileStorage } from "jsr:@evex/linejs@1.7.1/storage";

const client = new Client({
  storage: new FileStorage("./storage.json"),
});
client.on("ready", (user) => {
  console.log(`Logged in as ${user.displayName} (${user.mid})`);
});
client.on("pincall", (pincode) => {
  console.log(`pincode: ${pincode}`);
});
client.on("update:cert", d => console.log("cert:", d));
client.on("update:authtoken", (d) => console.log("AuthToken:", d));
const currentDateTime = `${new Date().toLocaleString()}.${Math.floor(new Date().getMilliseconds() / 100)}`;

await client.login({
  device: "IOSIPAD",
  authToken: "FJ9HunAdsc9CV6DMNtCb.tQ7bqB3AvpZ91q2EQoGOwW.l+IznsrClXfDU7YXVk4fBTXjeFWwF1Q9osRdLqUQ8OI=",
  polling: [],
});
const syncToken: Record<string, string> = {};

const squareChatMids = ["m6fb395949c79240780f37668e5f898a9", "mcfa28b4d1dd65f35ca21547072c52c14", "m48efef63a86cdc09742195c2a7e45aaf", "m97efcadbc6b4d341e02e7481e990bbf5", "mb1001dbfbe18a763a2d07db64fbf8b6f", "m5fce012dcaee113159482752aeac7a08"];

await client.sendSquareMessage({ squareChatMid: "m6fb395949c79240780f37668e5f898a9", text: `[！]保護Bot起動 ${currentDateTime}`});

while (true) {
  for (const squareChatMid of squareChatMids) {
    const response = await client.fetchSquareChatEvents({
      squareChatMid,
      syncToken: syncToken[squareChatMid],
    });
    syncToken[squareChatMid] = response.syncToken;
    for (const event of response.events) {
      if (
        event.type === "RECEIVE_MESSAGE" &&
        event.payload.receiveMessage
      ) {
        console.log(event.payload.receiveMessage.squareMessage.message.text)
        if (event.payload.receiveMessage.squareMessage.message.text === "非表示にしたメッセージです。") {
          console.log("delete:", event.payload.receiveMessage.squareMessage.message._from, new Date(event.payload.receiveMessage.squareMessage.message.deliveredTime as number).toLocaleTimeString())
          await client.destroySquareMessage({ messageId: event.payload.receiveMessage.squareMessage.message.id, squareChatMid })
        }
      }
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

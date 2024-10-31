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

await client.login({
  device: "IOSIPAD",
  authToken: "FJUH9kNaIW66izLZFFWb.tQ7bqB3AvpZ91q2EQoGOwW.mlejVSp3AXjvuihuVUaPItV5AZVmKh/+o9laoHXU7bc=",
  polling: [],
});
const syncToken: Record<string, string> = {};

const squareChatMids = ["m6fb395949c79240780f37668e5f898a9"];

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
        } else if (event.payload.receiveMessage.squareMessage.message.text === "!ping") {
        await client.sendSquareMessage({ squareChatMid: "m6fb395949c79240780f37668e5f898a9", text: 'テスト ${new Date().toLocaleString()}.${Math.floor(new Date().getMilliseconds() / 100)}'});
        }
      }
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

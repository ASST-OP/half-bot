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
client.on("update:cert", d => console.log("cert:", d))
client.on("update:authtoken", (d) => console.log("AuthToken:", d))

await client.login({
  device: "IOSIPAD",
  authToken: "FJzLJer7Uh2BIHa1ATqb.tQ7bqB3AvpZ91q2EQoGOwW.qlZRgj3+vJ+Aj6y8bppSK8pjU3L9RsMQBpB+VFMdakQ=",
  polling: [],
});
let continuationToken;
const squareChatMid = "m6fb395949c79240780f37668e5f898a9";
const memberMid = "p51ea935c217a2aa5e3dac50abbf9e11b";
while (true) {
  const response = await client.fetchSquareChatEvents({
    squareChatMid,
    continuationToken,
  });
  continuationToken = response.continuationToken;
  for (const event of response.events) {
    if (
      event.type === "RECEIVE_MESSAGE" &&
      event.payload.receiveMessage
    ) {
      if (event.payload.receiveMessage.squareMessage.message.text === "非表示にしたメッセージです。") {
        console.log("delete:", event.payload.receiveMessage.squareMessage.message.text, event.payload.receiveMessage.squareMessage.message._from)
        await client.destroySquareMessage({ messageId: event.payload.receiveMessage.squareMessage.message.id, squareChatMid })
      }
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
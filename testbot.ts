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
  authToken: "FJUH9kNaIW66izLZFFWb.tQ7bqB3AvpZ91q2EQoGOwW.mlejVSp3AXjvuihuVUaPItV5AZVmKh/+o9laoHXU7bc=",
  polling: [],
});
console.log(await client.findSquareByInvitationTicketV2({ invitationTicket: "https://line.me/ti/g2/qBW1Z12oPRvmtUV5KumByXZ9WqhrHd8oXanaAg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default" }))

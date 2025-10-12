import { before } from "@lib/api/patcher";
import { findByProps } from "@metro";
import { regexEscaper, isEnabled } from "..";

const Message = findByProps("sendMessage", "startEditMessage");

export default () =>
  before("startEditMessage", Message, (args) => {
    if (!isEnabled) return;

    const escaped = regexEscaper("`[ EDITED ]`\n\n");
    const regexPattern = new RegExp(escaped, "gmi");

    const [, , msg] = args;
    if (typeof msg !== "string") return;

    const parts = msg.split(regexPattern);
    const final = parts[parts.length - 1] ?? "";

    args[2] = final;
  });

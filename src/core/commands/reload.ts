import { Strings } from "@core/i18n";
import { ApplicationCommand } from "@lib/api/commands/types";
import { BundleUpdaterManager } from "@lib/api/native/modules";

export default () =>
  <ApplicationCommand>{
    name: "reload",
    description: Strings.COMMAND_RELOAD_DESC,
    options: [],
    execute() {
      BundleUpdaterManager.reload();
    },
  };
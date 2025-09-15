import { instead } from "@lib/api/patcher";

export const noop = (prop: string, parent: any) => instead(prop, parent, () => {});

import packageJson from "../package.json"
import { paths } from "./route-helpers/paths"

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: "AI Shop Helper",
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_SERVER_URL ?? "",
  assetsDir: process.env.NEXT_ASSETS_DIR ?? "",
  /**
   * Auth
   * @method jwt
   */
  auth: {
    method: "jwt",
    skip: false,
    redirectPath: paths.dashboard.root,
  },
}

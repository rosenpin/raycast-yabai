import { showHUD } from "@raycast/api";
import { exec } from "child_process";
import os from "os";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function main() {
  try {
    // Get current user's username
    const username = os.userInfo().username;

    // Determine yabai path based on CPU architecture
    const yabaiPath = process.arch === "arm64" ? "/opt/homebrew/bin/yabai" : "/usr/local/bin/yabai";

    // Create a new space
    await execAsync(`${yabaiPath} -m space --destroy && ${yabaiPath} -m space --focus recent`, { env: { ...process.env, USER: username } });
    // Show HUD notification
    await showHUD(`Destroyed Space`);
  } catch (error) {
    console.error("Error executing yabai commands", error);
    await showHUD(`Error: ${error.message}`);
  }
}

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
    await execAsync(`${yabaiPath} -m space --create`, { env: { ...process.env, USER: username } });

    // Get the last space index that is not native fullscreen
    const { stdout: spacesOutput } = await execAsync(`${yabaiPath} -m query --spaces`, { env: { ...process.env, USER: username } });
    const spaces = JSON.parse(spacesOutput);
    const lastSpaceIndex = spaces.filter((space) => !space["is-native-fullscreen"]).pop().index;

    // Focus the last space
    await execAsync(`${yabaiPath} -m space --focus ${lastSpaceIndex}`, { env: { ...process.env, USER: username } });

    // Show HUD notification
    await showHUD(`Created space: ${lastSpaceIndex}`);
  } catch (error) {
    console.error("Error executing yabai commands", error);
    await showHUD(`Error: ${error.message}`);
  }
}

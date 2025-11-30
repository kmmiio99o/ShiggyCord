import { defineCorePlugin } from "..";
import { findByProps } from "@metro";
import { logger } from "@lib/utils/logger";
import { settings } from "@lib/api/settings";
import { React } from "@metro/common";

const { TableRowGroup, TableRow, TableSwitchRow, Stack } = findByProps(
  "TableRowGroup",
  "TableRow",
  "TableSwitchRow",
  "Stack",
);
const { ScrollView } = require("react-native");

// Get ReactNative for NativeModules
const { ReactNative } = window as any;
const { DCDSoundManager } = ReactNative?.NativeModules || {};

// Sound settings type
type SoundSettings = {
  enabled: boolean;
  probability: number;
};

declare module "@lib/api/settings" {
  interface Settings {
    startupSound?: SoundSettings;
  }
}

const soundUrl =
  "https://github.com/kmmiio99o/kmmiio99o.github.io/raw/refs/heads/main/music/shiggycord.mp3";
const soundId = 6971;
let soundDuration = -1;
let timeoutId: NodeJS.Timeout | null = null;
let isPlaying = false;
let isPrepared = false;

// Function to prepare the sound
const prepareSound = function (): Promise<any> {
  return new Promise(function (resolve) {
    if (!DCDSoundManager) {
      logger.error("DCDSoundManager not available");
      resolve(null);
      return;
    }

    DCDSoundManager.prepare(
      soundUrl,
      "music",
      soundId,
      function (error: any, sound: any) {
        if (error) {
          logger.error("Failed to prepare sound:", error);
          resolve(null);
        } else {
          resolve(sound);
        }
      },
    );
  });
};

// Function to play the sound
async function playSound() {
  if (!DCDSoundManager) {
    logger.error("DCDSoundManager not available for playback");
    return;
  }

  if (isPlaying) {
    if (timeoutId != null) clearTimeout(timeoutId);
    DCDSoundManager.stop(soundId);
    isPlaying = false;
  }

  isPlaying = true;

  try {
    await DCDSoundManager.play(soundId);

    if (soundDuration > 0) {
      timeoutId = setTimeout(function () {
        isPlaying = false;
        DCDSoundManager.stop(soundId);
        timeoutId = null;
      }, soundDuration);
    }
  } catch (error) {
    logger.error("Error playing sound:", error);
    isPlaying = false;
  }
}

// Check if we should play based on probability
function shouldPlaySound(): boolean {
  const probability = settings.startupSound?.probability ?? 2;
  const random = Math.random() * 100;
  return random <= probability;
}

export default defineCorePlugin({
  manifest: {
    id: "bunny.enhancements",
    version: "0.1.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "Shiggy Enhancements",
      description:
        "Fixes common discord bugs because discord wont, and adds some features. (Originally Kettu Enhancements)",
      authors: [{ name: "cocobo1" }, { name: "Shiggy Team" }],
    },
  },

  SettingsComponent() {
    const { useState, useEffect } = React;
    const [config, setConfig] = useState<SoundSettings>({
      enabled: settings.startupSound?.enabled ?? true,
      probability: settings.startupSound?.probability ?? 2,
    });

    useEffect(() => {
      settings.startupSound = config;
    }, [config]);

    const updateConfig = (
      key: keyof SoundSettings,
      value: boolean | number,
    ) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    };

    // Get UI components including TextInput
    const {
      TableRowGroup: _TRG,
      TableRow: _TR,
      TableSwitchRow: _TSR,
      Stack: _S,
      TextInput: _TextInput,
    } = findByProps(
      "TableRowGroup",
      "TableRow",
      "TableSwitchRow",
      "Stack",
      "TextInput",
    );

    // Fallback if table components aren't available
    if (!_TRG || !_TSR || !_TR || !_S) {
      const FallbackText =
        "Startup Sound UI unavailable (missing TableRow components).";
      return React.createElement(
        ScrollView,
        { style: { flex: 1, padding: 12 } },
        FallbackText,
      );
    }

    const TableRowGroup = _TRG;
    const TableRow = _TR;
    const TableSwitchRow = _TSR;
    const Stack = _S;
    const TextInput = _TextInput;

    // Handle probability input change
    const handleProbabilityChange = (v: string) => {
      const num = parseInt(v);
      if (!isNaN(num) && num >= 0 && num <= 100) {
        updateConfig("probability", num);
      } else if (v === "") {
        updateConfig("probability", 0);
      }
    };

    // Create settings elements
    const settingsElements = [];

    // Startup Sound toggle with probability display
    settingsElements.push(
      React.createElement(
        TableRowGroup,
        { title: "Startup Sound", key: "startup-sound" },
        React.createElement(TableSwitchRow, {
          label: "Enable Startup Sound",
          value: config.enabled,
          onValueChange: (v: boolean) => updateConfig("enabled", v),
        }),
        React.createElement(TableRow, {
          label: "Play Chance",
          subLabel: `Current: ${config.probability}% chance to play on startup`,
        }),
      ),
    );

    // Probability input in its own invisible group
    if (TextInput) {
      settingsElements.push(
        React.createElement(
          TableRowGroup,
          { title: "", key: "probability-input-group" },
          React.createElement(TextInput, {
            placeholder: "Enter probability (0-100)",
            value: config.probability.toString(),
            onChange: handleProbabilityChange,
            key: "probability-input",
          }),
        ),
      );
    }

    // About section
    settingsElements.push(
      React.createElement(
        TableRowGroup,
        { title: "About", key: "about" },
        React.createElement(TableRow, {
          label: "Description",
          subLabel:
            "Shiggy Enhancements, more options, more features. Originally Kettu Enhancements with additinal features.",
          disabled: true,
        }),
      ),
    );

    return React.createElement(
      ScrollView,
      { style: { flex: 1 } },
      React.createElement(
        Stack,
        { spacing: 8, style: { padding: 10 } },
        ...settingsElements,
      ),
    );
  },

  start() {
    logger.log("Shiggy Enhancements: Starting plugin");

    // Initialize sound settings
    settings.startupSound = settings.startupSound || {
      enabled: true,
      probability: 2,
    };

    // Check if DCDSoundManager is available
    if (!DCDSoundManager) {
      logger.error("DCDSoundManager not found - startup sound disabled");
      return;
    }

    // Play startup sound if enabled and probability check passes
    if (settings.startupSound.enabled && shouldPlaySound()) {
      logger.log(
        `Attempting to play startup sound (${settings.startupSound.probability}% chance)`,
      );

      // Always prepare the sound fresh each time
      prepareSound()
        .then(function (sound) {
          if (sound) {
            isPrepared = true;
            soundDuration = sound.duration || 5000;
            logger.log(`Sound prepared, duration: ${soundDuration}ms`);
            playSound();
            logger.log(
              `Startup sound played (${settings.startupSound?.probability}% chance)`,
            );
          } else {
            logger.error("Failed to prepare sound");
          }
        })
        .catch((error) => {
          logger.error("Error in sound preparation:", error);
        });
    } else if (settings.startupSound.enabled) {
      logger.log(
        `Startup sound skipped due to probability (${settings.startupSound?.probability}% chance)`,
      );
    }
  },

  stop() {
    logger.log("Shiggy Enhancements: Stopping plugin");

    // Stop and cleanup audio
    if (DCDSoundManager && isPlaying) {
      DCDSoundManager.stop(soundId);
      isPlaying = false;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Reset preparation state so it can play again next time
    isPrepared = false;
  },
});

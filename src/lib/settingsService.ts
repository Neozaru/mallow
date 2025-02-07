"use client";

// Define the structure of the settings
interface ApiKeys {
  coinbaseKeyName: string;
  coinbaseApiSecret: string;
  krakenApiKey: string;
  krakenApiSecret: string;
  binanceApiKey: string;
  binanceApiSecret: string;
}

export interface OnChainAccount {
  address: EvmAddressInternal;
  chainType: 'evm';
}

interface Settings {
  apiKeys: ApiKeys;
  onChainAccounts: OnChainAccount[];
  manualPositions: YieldPositionManual[];
}

// Define the key name for localStorage
const SETTINGS_KEY = 'settings';

// Create a settings service to abstract localStorage access
class SettingsService {
  // Helper method to get settings from localStorage
  private static getSettingsFromLocalStorage(): Settings | null {
    const settingsString = localStorage.getItem(SETTINGS_KEY)
    if (settingsString) {
      return JSON.parse(settingsString) as Settings;
    }
    return null;
  }

  // Helper method to save settings to localStorage
  private static saveSettingsToLocalStorage(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  }

  // Method to get all settings
  static getSettings(): Settings {
    const settings = this.getSettingsFromLocalStorage();
    if (settings) {
      return settings;
    }
    return {
      apiKeys: {
        coinbaseKeyName: '',
        coinbaseApiSecret: '',
        krakenApiKey: '',
        krakenApiSecret: '',
        binanceApiKey: '',
        binanceApiSecret: '',
      },
      onChainAccounts: [],
      manualPositions: [],
    };
  }

  // Method to update API keys and save them to localStorage
  static updateSettings(settings: Settings): void {
    this.saveSettingsToLocalStorage({
      ...this.getSettings(),
      ...settings
    })
  }
}

export default SettingsService;

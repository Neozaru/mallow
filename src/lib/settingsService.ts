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

  static hasSetExchangeKeys(): boolean {
    const settings = this.getSettings();
    return Object.values(settings.apiKeys).some(key => key !== '');
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

  static async downloadSettingsToFile(): Promise<void> {
    const settings = this.getSettings()
    const date = new Date().toISOString().split('T')[0]
    const fileName = `mallow-pro-settings-${date}.json`
  
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    })
  
    const url = URL.createObjectURL(blob)
  
    // Create a hidden anchor tag (cleanly in memory)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.style.display = 'none'
  
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  
    URL.revokeObjectURL(url)
  }

  static async loadSettingsFromFile(file: File | undefined): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject('No input file given.')
      }
      const reader = new FileReader()
  
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string
          const parsed = JSON.parse(text)
          // Optional: validate structure here before saving
          this.saveSettingsToLocalStorage(parsed)
          resolve()
        } catch (error) {
          reject(error)
        }
      }
  
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }
}

export default SettingsService;

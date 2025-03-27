interface ToggleProps {
  label: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export default function ToggleButton({ label, enabled, setEnabled }: ToggleProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer select-none">
      <span className="text-lg font-medium text-white">{label}</span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          enabled ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}

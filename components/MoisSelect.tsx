"use client";
interface MoisSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export default function MoisSelect({ value, onChange }: MoisSelectProps) {
  const moisDisponibles = [
    "janvier","février","mars","avril","mai","juin",
    "juillet","août","septembre","octobre","novembre","décembre",
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 mb-4"
    >
      {moisDisponibles.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
}

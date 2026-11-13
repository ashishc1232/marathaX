import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDateISO: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(iso: string): TimeLeft {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function Countdown({ targetDateISO }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDateISO));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDateISO)), 1000);
    return () => clearInterval(id);
  }, [targetDateISO]);

  const units: { value: number; label: string }[] = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div
              className="text-3xl sm:text-5xl font-black text-primary tabular-nums leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {pad(unit.value)}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {unit.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl sm:text-4xl font-black text-primary/40 leading-none pb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

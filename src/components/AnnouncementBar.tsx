import { useState, useEffect } from 'react';
import { Link } from 'react-router';

interface AnnouncementBarProps {
  targetDate: string;
  ctaHref: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function AnnouncementBar({ targetDate, ctaHref }: AnnouncementBarProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-black h-10 flex items-center justify-center px-4">
      <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
        NEXT EVENT &nbsp;&bull;&nbsp;{' '}
        <span>
          {pad(timeLeft.days)} d : {pad(timeLeft.hours)} h : {pad(timeLeft.minutes)} m : {pad(timeLeft.seconds)} s
        </span>
        &nbsp;&bull;&nbsp;{' '}
        <Link to={ctaHref} className="underline hover:no-underline font-black">
          FIND OUT MORE
        </Link>
      </p>
    </div>
  );
}

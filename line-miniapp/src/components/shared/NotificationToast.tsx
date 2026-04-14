import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Notification } from '@/types';

const icons: Record<Notification['type'], string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const colors: Record<Notification['type'], string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
};

export function NotificationToast() {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-11/12 max-w-sm">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${colors[n.type]}`}
          onClick={() => dismissNotification(n.id)}
        >
          <span className="text-xl">{icons[n.type]}</span>
          <span className="flex-1 text-sm font-medium">{n.message}</span>
          <button className="text-current opacity-60 hover:opacity-100 ml-1">✕</button>
        </div>
      ))}
    </div>
  );
}

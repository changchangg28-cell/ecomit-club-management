import React from 'react';
import { Link } from 'react-router-dom';

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  icon: string;
  features: string[];
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  subtitle,
  icon,
  features,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 max-w-3xl mx-auto text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-primary flex items-center justify-center shadow-lg mb-6 relative">
        <span className="material-symbols-outlined text-[40px]">{icon}</span>
        <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase">
          Phase 2
        </span>
      </div>

      <h1 className="font-display-lg text-display-lg text-primary mb-2">{title}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8">{subtitle}</p>

      <div className="w-full rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 text-left mb-8">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">rocket_launch</span>
          <span>Các tính năng dự kiến ra mắt trong Phase 2:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">
                check_circle
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Về Dashboard Tổng Quan</span>
        </Link>
        <Link
          to="/live-center"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container font-label-lg text-label-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">sensors</span>
          <span>Mở Live Center (#12)</span>
        </Link>
      </div>
    </div>
  );
};

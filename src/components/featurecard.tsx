"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: FeatureCardProps) {
  const colorClasses = {
    "rwanda-blue": "bg-rwanda-blue hover:bg-blue-600",
    "rwanda-green": "bg-rwanda-green hover:bg-green-600",
    "rwanda-yellow": "bg-rwanda-yellow hover:bg-yellow-500",
    "rwanda-gold": "bg-rwanda-gold hover:bg-yellow-400",
  };

  return (
    <Link href={href}>
      <div className="group bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
        <div
          className={`${
            colorClasses[color as keyof typeof colorClasses] ||
            colorClasses["rwanda-blue"]
          } w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  );
}

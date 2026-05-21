import Link from 'next/link';
import { Thermometer, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">HeatShield AI</span>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              AI-powered urban heat island intelligence platform for smarter, cooler cities.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-orange-500/20 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Platform',
              links: ['Heat Map', 'Predictions', 'Alerts', 'Dashboard', 'Admin'],
              hrefs: ['/heatmap', '/predictions', '/alerts', '/dashboard', '/admin'],
            },
            {
              title: 'Solutions',
              links: ['Urban Planning', 'Emergency Response', 'Climate Research', 'Smart Infrastructure'],
              hrefs: ['#', '#', '#', '#'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact', 'Privacy Policy'],
              hrefs: ['#', '#', '#', '#', '#'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, i) => (
                  <li key={link}>
                    <Link href={col.hrefs[i] || '#'} className="text-sm text-slate-600 hover:text-orange-400 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-700">
            &copy; 2026 HeatShield AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

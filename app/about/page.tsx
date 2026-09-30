'use client';

import Image from 'next/image';
import {
  Info, Users, MapPin, Mail, Globe, Send,
  Check, Clock, Shield, Target, Rocket, FileText, ExternalLink,
  Award, Briefcase, TrendingUp, Heart,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ARV_CONFIG } from '@/lib/arv-config';

export default function AboutPage() {
  const team = [
    {
      name: ARV_CONFIG.team.owner.name,
      role: ARV_CONFIG.team.owner.role,
      roleEn: ARV_CONFIG.team.owner.roleEn,
      icon: <Award size={24} />,
      color: 'gold' as const,
      initial: 'ع',
    },
    {
      name: ARV_CONFIG.team.developer.name,
      role: ARV_CONFIG.team.developer.role,
      roleEn: ARV_CONFIG.team.developer.roleEn,
      icon: <Briefcase size={24} />,
      color: 'blue' as const,
      initial: 'س',
    },
    {
      name: ARV_CONFIG.team.marketing.name,
      role: ARV_CONFIG.team.marketing.role,
      roleEn: ARV_CONFIG.team.marketing.roleEn,
      icon: <TrendingUp size={24} />,
      color: 'green' as const,
      initial: 'س',
    },
  ];

  const roadmap = [
    {
      phase: 'مرحله ۱',
      title: 'زیرساخت اولیه',
      desc: 'راه‌اندازی وب‌سایت، افزونه ARV، کیف پول، سیستم امتیازدهی',
      status: 'done' as const,
    },
    {
      phase: 'مرحله ۲',
      title: 'مستندسازی',
      desc: 'سپیدنامه، توکنومیک، مستندات فنی، شرایط کاربران',
      status: 'done' as const,
    },
    {
      phase: 'مرحله ۳',
      title: 'بررسی حقوقی',
      desc: 'تعیین ماهیت حقوقی، مرجع ذی‌صلاح، اخذ مجوزها',
      status: 'pending' as const,
    },
    {
      phase: 'مرحله ۴',
      title: 'امنیت',
      desc: 'تست قرارداد، ممیزی امنیتی، کنترل دسترسی',
      status: 'pending' as const,
    },
    {
      phase: 'مرحله ۵',
      title: 'آماده‌سازی',
      desc: 'تکمیل قرارداد، مستندات، آزمون نهایی',
      status: 'pending' as const,
    },
    {
      phase: 'مرحله ۶',
      title: 'انتشار رسمی',
      desc: 'عرضه قانونی و راه‌اندازی Mainnet',
      status: 'pending' as const,
    },
  ];

  const links = [
    {
      label: 'وب‌سایت رسمی',
      value: 'arvandkhabar.ir',
      href: ARV_CONFIG.social.website,
      icon: <Globe size={18} />,
      color: 'gold' as const,
    },
    {
      label: 'GitHub',
      value: 'sasan0916-cell/arv-dapp-pro',
      href: ARV_CONFIG.social.github,
      icon: <Globe size={18} />,
      color: 'blue' as const,
    },
    {
      label: 'BscScan',
      value: 'testnet.bscscan.com',
      href: ARV_CONFIG.links.bscscanToken,
      icon: <ExternalLink size={18} />,
      color: 'green' as const,
    },
    {
      label: 'Twitter',
      value: '@arvtoken',
      href: ARV_CONFIG.social.twitter,
      icon: <Send size={18} />,
      color: 'blue' as const,
    },
    {
      label: 'Telegram',
      value: '@arvtoken',
      href: ARV_CONFIG.social.telegram,
      icon: <Send size={18} />,
      color: 'blue' as const,
    },
    {
      label: 'تماس',
      value: 'info@arvandkhabar.ir',
      href: 'mailto:info@arvandkhabar.ir',
      icon: <Mail size={18} />,
      color: 'purple' as const,
    },
  ];

  const features = [
    {
      title: 'کاربرد واقعی',
      desc: 'توکن ARV برای استفاده در اکوسیستم اروند خبر',
      icon: <Target size={20} />,
    },
    {
      title: 'شفافیت کامل',
      desc: 'توزیع ۶۰/۴۰ شفاف و قابل حسابرسی',
      icon: <Shield size={20} />,
    },
    {
      title: 'انطباق قانونی',
      desc: 'حرکت در مسیر اخذ مجوزهای لازم',
      icon: <FileText size={20} />,
    },
    {
      title: 'غیرمتمرکز',
      desc: 'کیف پول غیرامانی و مستقل',
      icon: <Rocket size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Header />
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

          {/* Hero */}
          <GlowCard glowColor="gold" className="text-center">
            <div className="py-4">
              <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden shadow-2xl shadow-[var(--arv-gold)]/30 mb-4">
                <Image
                  src="/arv-logo.png"
                  alt="ARV Logo"
                  fill
                  sizes="96px"
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="gold-gradient">{ARV_CONFIG.token.name}</span>
              </h1>
              <p className="text-sm text-[var(--arv-text-muted)] mb-4">
                {ARV_CONFIG.token.symbol} • {ARV_CONFIG.token.standard} • {ARV_CONFIG.network.nameShort}
              </p>
              <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed max-w-2xl mx-auto">
                ARV توکن کاربردی اکوسیستم رسانه‌ای اروند خبر است. هدف ما ایجاد یک زیرساخت غیرمتمرکز
                برای حمایت از آزادی خبر، شفافیت و مشارکت جامعه است.
              </p>
            </div>
          </GlowCard>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <GlowCard key={i} glowColor="gold" delay={i * 0.05}>
                <div className="w-10 h-10 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center mb-3 text-[var(--arv-gold)]">
                  {feature.icon}
                </div>
                <div className="font-bold text-sm mb-1">{feature.title}</div>
                <div className="text-xs text-[var(--arv-text-muted)] leading-relaxed">
                  {feature.desc}
                </div>
              </GlowCard>
            ))}
          </div>

          {/* Team */}
          <GlowCard glowColor="gold">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Users size={20} className="text-[var(--arv-gold)]" />
              تیم پروژه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[var(--arv-blue)]/20 border border-[var(--arv-gold)]/20 text-center"
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 text-2xl font-bold ${
                      member.color === 'gold'
                        ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                        : member.color === 'blue'
                        ? 'bg-blue-400/15 text-blue-400'
                        : 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                    }`}
                  >
                    {member.initial}
                  </div>
                  <div className="font-bold mb-1">{member.name}</div>
                  <div className="text-xs text-[var(--arv-text-muted)]">
                    {member.role}
                  </div>
                  <div className="text-xs text-[var(--arv-text-muted)]/70 mt-1">
                    {member.roleEn}
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Roadmap */}
          <GlowCard glowColor="purple">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-purple-400" />
              نقشه راه پروژه
            </h2>

            <div className="space-y-3">
              {roadmap.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    item.status === 'done'
                      ? 'bg-[var(--arv-success)]/10 border border-[var(--arv-success)]/30'
                      : 'bg-[var(--arv-blue)]/20 border border-[var(--arv-blue)]/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.status === 'done'
                        ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                        : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
                    }`}
                  >
                    {item.status === 'done' ? <Check size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--arv-text-muted)]">
                        {item.phase}
                      </span>
                      <span className="font-bold text-sm">{item.title}</span>
                    </div>
                    <div className="text-xs text-[var(--arv-text-muted)] leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Links */}
          <GlowCard glowColor="blue">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Globe size={20} className="text-blue-400" />
              لینک‌های رسمی
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--arv-blue)]/20 border border-[var(--arv-blue)]/40 hover:border-[var(--arv-gold)]/40 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      link.color === 'gold'
                        ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                        : link.color === 'blue'
                        ? 'bg-blue-400/15 text-blue-400'
                        : link.color === 'green'
                        ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                        : 'bg-purple-400/15 text-purple-400'
                    }`}
                  >
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      {link.label}
                    </div>
                    <div className="text-sm font-bold truncate" dir="ltr">
                      {link.value}
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--arv-text-muted)]" />
                </a>
              ))}
            </div>
          </GlowCard>

          {/* Disclaimer */}
          <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-2">
                <div className="font-bold text-[var(--arv-warning)]">
                  سلب مسئولیت
                </div>
                <p className="leading-relaxed">
                  ARV در حال حاضر یک توکن در مرحله توسعه و آزمایش است و فعال به‌عنوان سرمایه‌گذاری
                  یا ابزار مالی ارائه نمی‌شود. اطلاعات این سایت صرفاً برای معرفی پروژه و کاربردهای آن است.
                </p>
                <p className="leading-relaxed">
                  فعالیت ARV باید بر پایه سه اصل انجام شود:
                  <strong className="text-white"> کاربرد واقعی — شفافیت — انطباق قانونی</strong>
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Footer */}
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--arv-text-muted)] mb-2">
              <Heart size={12} className="text-[var(--arv-danger)]" />
              ساخته شده با عشق برای اکوسیستم اروند خبر
            </div>
            <div className="text-xs text-[var(--arv-text-muted)]">
              نسخه ۱.۰.۰ • {new Date().getFullYear()}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

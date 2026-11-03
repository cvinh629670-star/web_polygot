import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Command,
  Crown,
  Flame,
  Headphones,
  Layers,
  MessageCircle,
  Plus,
  Search,
  ShieldAlert,
  Skull,
  Sparkles,
  Sprout,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const languages = [
  { id: 'en', label: 'Tiếng Anh', flag: '🇬🇧', word: 'Hello', meaning: 'Xin chào', phonetic: '/həˈləʊ/' },
  { id: 'ko', label: 'Tiếng Hàn', flag: '🇰🇷', word: '안녕하세요', meaning: 'Xin chào', phonetic: 'annyeonghaseyo' },
  { id: 'zh', label: 'Tiếng Trung', flag: '🇨🇳', word: '你好', meaning: 'Xin chào', phonetic: 'nǐ hǎo' },
  { id: 'ja', label: 'Tiếng Nhật', flag: '🇯🇵', word: 'こんにちは', meaning: 'Xin chào', phonetic: 'konnichiwa' },
];

const sections = [
  { id: 'vocab', label: 'Từ vựng', description: 'Thêm và quản lý ngân hàng từ của bạn', icon: BookOpen },
  { id: 'flashcards', label: 'Thẻ ôn tập', description: 'Ghi nhớ từ bằng lặp lại ngắt quãng', icon: Layers },
  { id: 'listening', label: 'Luyện nghe', description: 'Khám phá từ vựng qua những câu chuyện', icon: Headphones },
  { id: 'production', label: 'Luyện giao tiếp', description: 'Thực hành trong tình huống thực tế', icon: MessageCircle },
  { id: 'game', label: 'Zombie Survival', description: 'Thử sức với trò chơi từ vựng', icon: Skull },
  { id: 'nemesis', label: 'Kẻ thù ác', description: 'Chinh phục những từ thường quên', icon: ShieldAlert, count: 'nemesis' },
  { id: 'vip', label: 'Từ vựng VIP', description: 'Những từ bạn đã thành thạo', icon: Crown, count: 'mastered' },
];

const formatNumber = value => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);
const normalizeSearch = value => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

export function Navigation({ snapshot, actions }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pg-navigation no-scrollbar flex items-center gap-1 overflow-x-auto py-2" aria-label="Các khu vực học tập">
      {sections.map(({ id, label, icon: Icon, count }) => {
        const active = snapshot.tab === id;
        return (
          <Button
            key={id}
            type="button"
            variant="ghost"
            className={`pg-nav-button relative shrink-0 gap-2 whitespace-nowrap rounded-xl px-3.5 text-xs font-semibold ${active ? 'pg-nav-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            aria-controls={`view-${id}`}
            onClick={() => actions.navigate(id)}
          >
            {active && (
              <motion.span
                layoutId="pg-active-navigation"
                className="pg-nav-indicator absolute inset-0 rounded-xl"
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 35 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
              {count && Number(snapshot[count]) > 0 && (
                <span className="pg-nav-count rounded-md px-1.5 py-0.5 text-[10px] leading-none">{formatNumber(snapshot[count])}</span>
              )}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

function QuickAccess({ snapshot, actions, showTrigger = true }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const shortcutOpener = useRef(null);

  useEffect(() => {
    const handleShortcut = event => {
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        shortcutOpener.current = document.activeElement;
        setOpen(value => !value);
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const changeOpen = value => {
    setOpen(value);
    if (!value) setQuery('');
  };
  const navigate = tab => {
    changeOpen(false);
    actions.navigate(tab);
  };
  const filteredSections = sections.filter(section => normalizeSearch(`${section.label} ${section.description}`).includes(normalizeSearch(query.trim())));

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={`pg-quick-access gap-2 rounded-xl bg-white/70 dark:bg-slate-900/70 ${showTrigger ? '' : 'hidden'}`} tabIndex={showTrigger ? undefined : -1} aria-hidden={showTrigger ? undefined : true}>
          <Command className="size-3.5" aria-hidden="true" />
          <span>Truy cập nhanh</span>
          <kbd className="ml-1 hidden rounded border border-current/15 px-1.5 py-0.5 text-[10px] opacity-60 sm:inline">Ctrl K</kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="pg-command-dialog sm:max-w-lg"
        onCloseAutoFocus={event => {
          if (shortcutOpener.current instanceof HTMLElement && shortcutOpener.current.isConnected) {
            event.preventDefault();
            shortcutOpener.current.focus();
            shortcutOpener.current = null;
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Hôm nay bạn muốn học gì?</DialogTitle>
          <DialogDescription>Chọn khu vực học tập hoặc đổi ngôn ngữ của bạn.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-ui-muted-foreground" aria-hidden="true" />
          <Input autoFocus value={query} onChange={event => setQuery(event.target.value)} className="pl-10" placeholder="Tìm khu vực học tập…" aria-label="Tìm khu vực học tập" />
        </div>
        <div className="max-h-[45vh] space-y-1 overflow-y-auto" aria-label="Kết quả tìm kiếm">
          {filteredSections.map(({ id, label, description, icon: Icon }) => (
            <Button key={id} type="button" variant="ghost" className="h-auto w-full justify-start gap-3 px-3 py-3 text-left" onClick={() => navigate(id)}>
              <span className="pg-command-icon flex size-10 shrink-0 items-center justify-center rounded-xl bg-ui-primary/10 text-ui-primary"><Icon className="size-5" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1 whitespace-normal"><span className="block text-sm font-semibold">{label}</span><span className="mt-0.5 block text-xs font-normal text-ui-muted-foreground">{description}</span></span>
              <ChevronRight className="size-4 shrink-0 text-ui-muted-foreground" aria-hidden="true" />
            </Button>
          ))}
          {filteredSections.length === 0 && <p role="status" className="py-8 text-center text-sm text-ui-muted-foreground">Không tìm thấy khu vực phù hợp.</p>}
        </div>
        <div className="border-t border-ui-border pt-4">
          <p className="mb-3 text-xs font-semibold text-ui-muted-foreground">Ngôn ngữ đang học</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {languages.map(language => (
              <Button
                key={language.id}
                type="button"
                variant={snapshot.lang === language.id ? 'secondary' : 'outline'}
                className="gap-1.5 px-2 text-xs"
                aria-pressed={snapshot.lang === language.id}
                onClick={() => { actions.setLanguage(language.id); changeOpen(false); }}
              >
                <span aria-hidden="true">{language.flag}</span>{language.label}
                {snapshot.lang === language.id && <Check className="size-3 shrink-0" aria-hidden="true" />}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HeroIllustration({ language, reducedMotion }) {
  return (
    <div className="pg-hero-art" aria-hidden="true">
      <div className="pg-hero-orbit pg-hero-orbit-one" />
      <div className="pg-hero-orbit pg-hero-orbit-two" />
      <motion.div className="pg-wordcard pg-wordcard-back" initial={false} animate={{ rotate: -12 }} transition={{ duration: reducedMotion ? 0 : 0.5 }}>
        <span className="pg-wordcard-kicker">POLYGLOT SRS</span>
        <span className="pg-wordcard-symbol">あ</span>
      </motion.div>
      <motion.div className="pg-wordcard pg-wordcard-front" initial={reducedMotion ? false : { opacity: 0, y: 12, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 7 }} transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.1 }}>
        <div className="flex items-center justify-between gap-6"><span className="pg-wordcard-kicker">MỘT LỜI CHÀO MỚI</span><span>{language.flag}</span></div>
        <span className="pg-wordcard-word">{language.word}</span>
        <span className="pg-wordcard-phonetic">{language.phonetic}</span>
        <span className="pg-wordcard-divider" />
        <span className="pg-wordcard-meaning">{language.meaning}</span>
        <div className="mt-4 flex items-center gap-1.5 text-[10px] opacity-60"><Layers className="size-3" /><span>Mỗi lần ôn, nhớ thêm một chút.</span></div>
      </motion.div>
      <span className="pg-hero-spark pg-hero-spark-one"><Sparkles className="size-5" /></span>
      <span className="pg-hero-spark pg-hero-spark-two"><Plus className="size-4" /></span>
    </div>
  );
}

export function Dashboard({ snapshot, actions }) {
  const reducedMotion = useReducedMotion();
  const language = languages.find(item => item.id === snapshot.lang) || languages[0];
  const total = Math.max(0, Number(snapshot.total) || 0);
  const mastered = Math.max(0, Number(snapshot.mastered) || 0);
  const mastery = total ? Math.min(100, Math.round(mastered / total * 100)) : 0;
  const stats = [
    { label: 'Tổng từ vựng', value: total, icon: BookOpen, tone: 'blue', detail: 'Ngân hàng từ của bạn' },
    { label: 'Chưa học', value: snapshot.unlearned, icon: Sprout, tone: 'amber', detail: 'Sẵn sàng để khám phá' },
    { label: 'Đang ghi nhớ', value: snapshot.learning, icon: Brain, tone: 'violet', detail: 'Ôn đều để nhớ lâu hơn' },
    { label: 'Đã thành thạo', value: mastered, icon: Crown, tone: 'emerald', detail: 'Từ vựng đạt cấp SRS 8+' },
  ];

  if (snapshot.tab !== 'vocab') return <QuickAccess snapshot={snapshot} actions={actions} showTrigger={false} />;

  return (
    <div className="pg-dashboard space-y-5 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><span aria-hidden="true">{language.flag}</span>Không gian học {language.label.toLocaleLowerCase('vi')}</p>
        <QuickAccess snapshot={snapshot} actions={actions} />
      </div>

      <motion.section className="pg-hero relative isolate overflow-hidden rounded-3xl" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.4 }} aria-labelledby="pg-hero-title">
        <div className="pg-hero-grid" aria-hidden="true" />
        <div className="pg-hero-content relative z-10 px-6 py-8 sm:px-9 sm:py-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="pg-hero-badge gap-1.5 rounded-full px-3 py-1.5"><Sparkles className="size-3.5" aria-hidden="true" />{formatNumber(snapshot.due)} TỪ SẴN SÀNG ÔN</Badge>
            {Number(snapshot.streak) > 0 && <span className="flex items-center gap-1 text-xs text-blue-100"><Flame className="size-3.5 text-orange-300" aria-hidden="true" />{formatNumber(snapshot.streak)} ngày liên tục</span>}
          </div>
          <h2 id="pg-hero-title" className="max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">Mỗi từ mới,<br /><span className="pg-hero-highlight">một thế giới mở ra.</span></h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/85">Xây vốn từ {language.label.toLocaleLowerCase('vi')} theo nhịp của bạn. Ôn tập đúng lúc, ghi nhớ bền lâu với lặp lại ngắt quãng.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="button" className="pg-hero-primary gap-2 rounded-xl px-5" onClick={actions.review} disabled={total === 0}><Layers className="size-4" aria-hidden="true" />Bắt đầu ôn tập<ArrowRight className="size-4" aria-hidden="true" /></Button>
            <Button type="button" variant="outline" className="pg-hero-secondary gap-2 rounded-xl px-5" onClick={actions.addWord}><Plus className="size-4" aria-hidden="true" />{total === 0 ? 'Thêm từ đầu tiên' : 'Thêm từ mới'}</Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-blue-100/75"><span className="size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />{Number(snapshot.due) > 0 ? `${formatNumber(snapshot.due)} từ sẵn sàng để ôn tập` : total > 0 ? 'Chưa có từ đến hạn ôn tập' : 'Hành trình bắt đầu từ từ đầu tiên của bạn'}</p>
        </div>
        <HeroIllustration key={language.id} language={language} reducedMotion={reducedMotion} />
      </motion.section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4" aria-label={`Thống kê từ vựng ${language.label.toLocaleLowerCase('vi')}`}>
        {stats.map(({ label, value, icon: Icon, tone, detail }) => (
          <Card key={label} className={`pg-stat-card pg-stat-${tone} rounded-2xl`}>
            <CardContent className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span><span className="pg-stat-icon flex size-9 shrink-0 items-center justify-center rounded-xl"><Icon className="size-4" aria-hidden="true" /></span></div>
              <p className="pg-stat-value text-3xl font-extrabold tracking-tight tabular-nums">{formatNumber(value)}</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="pg-mastery-card rounded-2xl">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
          <div className="flex shrink-0 items-center gap-3">
            <span className="pg-mastery-icon flex size-10 items-center justify-center rounded-xl"><TrendingUp className="size-5" aria-hidden="true" /></span>
            <div><p className="text-sm font-bold">Từng bước thành thạo</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{total ? `${formatNumber(mastered)}/${formatNumber(total)} từ đã thành thạo` : 'Thêm từ mới để bắt đầu theo dõi tiến độ'}</p></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between gap-3"><span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Tiến độ ghi nhớ</span><span className="text-xs font-bold tabular-nums">{mastery}%</span></div>
            <Progress value={mastery} aria-label="Tỷ lệ từ vựng đã thành thạo" className="h-2" />
          </div>
          <Tooltip>
            <TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="hidden size-8 shrink-0 rounded-full text-slate-400 sm:inline-flex" aria-label="Cách tính tiến độ thành thạo"><CircleHelp className="size-4" aria-hidden="true" /></Button></TooltipTrigger>
            <TooltipContent className="max-w-64 text-xs">Tỷ lệ từ đạt cấp SRS 8 trở lên trong ngân hàng từ của ngôn ngữ đang học.</TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Command,
  Crown,
  BookText,
  PenLine,
  Layers,
  Plus,
  Search,
  ShieldAlert,
  Skull,
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
  { id: 'en', label: 'Tiếng Anh', flag: '🇬🇧' },
  { id: 'ko', label: 'Tiếng Hàn', flag: '🇰🇷' },
  { id: 'zh', label: 'Tiếng Trung', flag: '🇨🇳' },
  { id: 'ja', label: 'Tiếng Nhật', flag: '🇯🇵' },
];

const numberFormatter = new Intl.NumberFormat('vi-VN');

const sections = [
  { id: 'vocab', label: 'Từ vựng', description: 'Thêm và quản lý ngân hàng từ của bạn', icon: BookOpen },
  { id: 'flashcards', label: 'Thẻ ôn tập', description: 'Ghi nhớ từ bằng lặp lại ngắt quãng', icon: Layers },
  { id: 'listening', label: 'Luyện ngữ pháp', description: 'Làm bài tập và xem giải thích ngữ pháp', icon: BookText },
  { id: 'game', label: 'Zombie Survival', description: 'Thử sức với trò chơi từ vựng', icon: Skull },
  { id: 'nemesis', label: 'Kẻ thù ác', description: 'Chinh phục những từ thường quên', icon: ShieldAlert, count: 'nemesis' },
  { id: 'vip', label: 'Từ vựng VIP', description: 'Những từ bạn đã thành thạo', icon: Crown, count: 'mastered' },
];

function sectionsForLanguage(language) {
  if (language !== 'zh') return sections;
  return sections.map(section => section.id === 'listening'
    ? { ...section, label: 'Luyện viết Hán tự', description: 'Xem thứ tự nét và luyện viết chữ Hán', icon: PenLine }
    : section);
}

const formatNumber = value => numberFormatter.format(Number(value) || 0);
const normalizeSearch = value => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

// Tạo thanh điều hướng và cập nhật trạng thái phòng đang mở.
export function Navigation({ snapshot, actions }) {
  const reducedMotion = useReducedMotion();
  const navigationRef = useRef(null);
  const activeButtonRef = useRef(null);

  useEffect(() => {
    const navigation = navigationRef.current;
    const activeButton = activeButtonRef.current;
    if (!navigation || !activeButton || navigation.scrollWidth <= navigation.clientWidth) return;

    const { left, right } = navigation.getBoundingClientRect();
    const active = activeButton.getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(navigation).paddingLeft);
    const offset = active.left < left + gutter
      ? active.left - left - gutter
      : Math.max(0, active.right - right + gutter);
    if (Math.abs(offset) > 1) navigation.scrollBy({ left: offset, behavior: 'instant' });
  }, [snapshot.tab, snapshot.lang]);

  return (
    <div ref={navigationRef} className="pg-navigation">
      {sectionsForLanguage(snapshot.lang).map(({ id, label, icon: Icon, count }) => {
        const active = snapshot.tab === id;
        return (
          <Button
            key={id}
            ref={active ? activeButtonRef : undefined}
            type="button"
            variant="ghost"
            className="pg-nav-button"
            aria-current={active ? 'page' : undefined}
            aria-controls={`view-${id}`}
            onClick={() => actions.navigate(id)}
          >
            {active && (
              <motion.span
                layoutId="pg-active-navigation"
                className="pg-nav-indicator"
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 35 }}
                aria-hidden="true"
              />
            )}
            <span className="pg-nav-content">
              <span className="pg-nav-icon" aria-hidden="true"><Icon /></span>
              <span>{label}</span>
              {count && Number(snapshot[count]) > 0 && (
                <span className="pg-nav-count">{formatNumber(snapshot[count])}</span>
              )}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

// Lọc lệnh và xử lý phím tắt trong hộp truy cập nhanh.
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
  const filteredSections = sectionsForLanguage(snapshot.lang).filter(section => normalizeSearch(`${section.label} ${section.description}`).includes(normalizeSearch(query.trim())));

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={`pg-quick-access gap-2 rounded-lg ${showTrigger ? '' : 'hidden'}`} tabIndex={showTrigger ? undefined : -1} aria-hidden={showTrigger ? undefined : true}>
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

// Hiển thị tiến độ học từ dữ liệu SRS của ngôn ngữ hiện tại.
export function Dashboard({ snapshot, actions }) {
  const language = languages.find(item => item.id === snapshot.lang) || languages[0];
  const total = Math.max(0, Number(snapshot.total) || 0);
  const mastered = Math.max(0, Number(snapshot.mastered) || 0);
  const mastery = total ? Math.min(100, Math.round(mastered / total * 100)) : 0;
  const stats = [
    { label: 'Tổng từ vựng', value: total, icon: BookOpen, tone: 'blue' },
    { label: 'Chưa học', value: snapshot.unlearned, icon: Sprout, tone: 'amber' },
    { label: 'Đang ghi nhớ', value: snapshot.learning, icon: Brain, tone: 'violet' },
    { label: 'Đã thành thạo', value: mastered, icon: Crown, tone: 'emerald' },
  ];

  if (snapshot.tab !== 'vocab') return <QuickAccess snapshot={snapshot} actions={actions} showTrigger={false} />;

  return (
    <div className="pg-dashboard space-y-5 pb-7">
      <div className="pg-dashboard-header flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="pg-dashboard-language"><span aria-hidden="true">{language.flag}</span>{language.label}</p>
          <h2 className="pg-dashboard-title">Không gian học</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="pg-due-count">{formatNumber(snapshot.due)} TỪ SẴN SÀNG ÔN</Badge>
          {total > 0 && <Button type="button" size="sm" onClick={actions.review}>Bắt đầu ôn tập</Button>}
          <Button type="button" size="sm" variant="outline" onClick={actions.addWord}><Plus aria-hidden="true" />Thêm từ mới</Button>
          <QuickAccess snapshot={snapshot} actions={actions} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4" aria-label={`Thống kê từ vựng ${language.label.toLocaleLowerCase('vi')}`}>
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className={`pg-stat-card pg-stat-${tone} rounded-2xl`}>
            <CardContent className="pg-stat-content">
              <span className="pg-stat-icon flex size-10 shrink-0 items-center justify-center rounded-xl"><Icon className="size-5" aria-hidden="true" /></span>
              <div>
                <p className="pg-stat-value tabular-nums">{formatNumber(value)}</p>
                <p className="pg-stat-label">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="pg-mastery-card rounded-2xl">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
          <div className="flex shrink-0 items-center gap-3">
            <span className="pg-mastery-icon flex size-10 items-center justify-center rounded-xl"><TrendingUp className="size-5" aria-hidden="true" /></span>
            <div><p className="text-sm font-bold">Tiến độ thành thạo</p><p className="mt-1 text-xs text-ui-muted-foreground">{total ? `${formatNumber(mastered)}/${formatNumber(total)} từ đã thành thạo` : 'Thêm từ để bắt đầu theo dõi'}</p></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 text-right text-xs font-bold tabular-nums">{mastery}%</div>
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

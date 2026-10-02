import { useMemo, useState, type FormEvent } from "react";
import {
  Bell, BookOpen, CalendarDays, Camera, Check, ChevronLeft, ChevronRight,
  CircleAlert, Clock3, Filter, Home, LockKeyhole, MapPin, Menu, MessageCircle,
  Plus, Search, Send, Settings, SlidersHorizontal, Sparkles, Target, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type View = "home" | "activities" | "calendar" | "lessons" | "social" | "settings";
type SocialView = "feed" | "friends" | "profile";
type Activity = { id: number; title: string; type: string; date: string; time: string; location: string; distance: number; people: number; details: string; joined?: boolean; past?: boolean };

const initialActivities: Activity[] = [
  { id: 1, title: "Board games & cocoa", type: "Indoors social", date: "Oct 3", time: "6:30 PM", location: "Cedar Community Room", distance: 1.2, people: 8, details: "A low-key evening with strategy games, cards, and warm drinks.", joined: true },
  { id: 2, title: "Easy lakeside walk", type: "Outdoors relaxed", date: "Oct 5", time: "10:00 AM", location: "North Lake Trail", distance: 2.4, people: 6, details: "A conversational two-mile loop. Comfortable shoes recommended." },
  { id: 3, title: "Beginner pickleball", type: "Outdoors active", date: "Oct 6", time: "4:00 PM", location: "Westside Courts", distance: 3.8, people: 10, details: "All equipment is provided. No experience needed." },
  { id: 4, title: "Coffee & sketching", type: "Creative", date: "Oct 8", time: "11:00 AM", location: "Juniper Cafe", distance: 0.7, people: 4, details: "Bring a notebook or borrow supplies from the host." },
];

const lessons = [
  { n: 1, title: "Designed to keep you scrolling", duration: "7 min", status: "open" },
  { n: 2, title: "Notice your attention cues", duration: "6 min", status: "locked" },
  { n: 3, title: "Build a better default", duration: "8 min", status: "locked" },
  { n: 4, title: "Reconnect with intention", duration: "5 min", status: "locked" },
];

const friends = [
  { name: "Maya Chen", initials: "MC", note: "Met at Saturday hike", color: "bg-avatar-one" },
  { name: "Dev Brooks", initials: "DB", note: "Met at game night", color: "bg-avatar-two" },
];

function PhotoPlaceholder({ className, label = "Photo" }: { className?: string; label?: string }) {
  return <div className={cn("grid place-items-center bg-photo text-muted-foreground", className)} aria-label={`${label} placeholder`}><Camera className="size-6" /></div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</label>;
}

export function MomentumApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("home");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [habits, setHabits] = useState([true, false, false]);
  const [activities, setActivities] = useState(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("All types");
  const [postOpen, setPostOpen] = useState(false);
  const [postError, setPostError] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [lessonOpen, setLessonOpen] = useState(false);
  const [lessonError, setLessonError] = useState("");
  const [unlockedLessons, setUnlockedLessons] = useState(1);
  const [activeLesson, setActiveLesson] = useState(1);
  const [goal, setGoal] = useState("");
  const [savedGoal, setSavedGoal] = useState("Leave my phone charging outside the bedroom each night.");
  const [socialView, setSocialView] = useState<SocialView>("feed");
  const [friendOpen, setFriendOpen] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<"general" | "profile">("general");

  const shownActivities = useMemo(() => activities.filter((a) =>
    a.title.toLowerCase().includes(filterName.toLowerCase()) && (filterType === "All types" || a.type === filterType)
  ), [activities, filterName, filterType]);

  const navigate = (next: View) => { setView(next); setMobileNav(false); setSelectedActivity(null); };

  if (!loggedIn) return <LoginScreen onEnter={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-app text-foreground">
      <header className="sticky top-0 z-40 border-b border-glass bg-header px-4 py-3 backdrop-blur-xl md:px-7">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <button onClick={() => navigate("home")} className="flex items-center gap-2" aria-label="Momentum home">
            <span className="grid size-9 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground">M</span>
            <span className="font-display text-lg font-semibold">Momentum</span>
          </button>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => navigate("home")} aria-label="Home"><Home /></Button>
            <Button variant="ghost" size="icon" onClick={() => setMessagesOpen((v) => !v)} aria-label="Messages" className={messagesOpen ? "bg-accent" : ""}><MessageCircle /></Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("settings")} aria-label="Settings"><Settings /></Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNav((v) => !v)} aria-label="Open navigation"><Menu /></Button>
            <div className="ml-2 hidden items-center gap-2 border-l border-border pl-3 sm:flex">
              <PhotoPlaceholder className="size-9 rounded-lg" label="Chase profile photo" />
              <div><p className="text-sm font-semibold leading-none">Chase</p><p className="mt-1 text-[11px] text-muted-foreground">Day 12</p></div>
            </div>
          </div>
        </div>
      </header>

      {view !== "home" && (
        <div className="sticky top-[65px] z-30 border-b border-glass bg-header px-4 py-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-1">
            {(["activities", "lessons", "social"] as View[]).map((tab) => (
              <Button key={tab} variant={view === tab ? "default" : "ghost"} size="sm" onClick={() => navigate(tab)} className="capitalize">{tab}</Button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 md:grid-cols-[220px_minmax(0,1fr)] md:px-7 md:py-7">
        <aside className={cn("glass-panel h-fit p-3 md:sticky md:top-24", mobileNav ? "block" : "hidden md:block")}>
          <nav className="space-y-1">
            <NavItem icon={Home} label="Home" active={view === "home"} onClick={() => navigate("home")} />
            <NavItem icon={Sparkles} label="Activities" active={view === "activities"} onClick={() => navigate("activities")} />
            <NavItem icon={CalendarDays} label="Calendar" active={view === "calendar"} onClick={() => navigate("calendar")} />
            <NavItem icon={BookOpen} label="Lessons" active={view === "lessons"} onClick={() => navigate("lessons")} />
            <NavItem icon={Users} label="Social" active={view === "social"} onClick={() => navigate("social")} />
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <NavItem icon={Settings} label="Settings" active={view === "settings"} onClick={() => navigate("settings")} />
          </div>
        </aside>

        <main className="min-w-0 rise">
          {view === "home" && <HomeView habits={habits} setHabits={setHabits} goal={savedGoal} navigate={navigate} />}
          {view === "activities" && <ActivitiesView activities={shownActivities} filterOpen={filterOpen} setFilterOpen={setFilterOpen} filterName={filterName} setFilterName={setFilterName} filterType={filterType} setFilterType={setFilterType} onSelect={setSelectedActivity} onPost={() => setPostOpen(true)} />}
          {view === "calendar" && <CalendarView activities={activities} onSelect={setSelectedActivity} />}
          {view === "lessons" && <LessonsView unlocked={unlockedLessons} onOpen={(n) => { setActiveLesson(n); setLessonOpen(true); }} onLocked={() => setLessonError("Complete the previous lesson before opening this one.")} error={lessonError} />}
          {view === "social" && <SocialViewPage tab={socialView} setTab={setSocialView} friendOpen={friendOpen} setFriendOpen={setFriendOpen} />}
          {view === "settings" && <SettingsView tab={settingsTab} setTab={setSettingsTab} />}
        </main>
      </div>

      {messagesOpen && <MessagesPanel onClose={() => setMessagesOpen(false)} />}
      {selectedActivity && <ActivityModal activity={selectedActivity} onClose={() => { setSelectedActivity(null); setRsvpMessage(""); }} message={rsvpMessage} onJoin={() => {
        if (selectedActivity.id === 2 && activities.some((a) => a.joined && a.date === "Oct 5")) setRsvpMessage("This activity overlaps another commitment or starts within 30 minutes of it.");
        else { setActivities((all) => all.map((a) => a.id === selectedActivity.id ? { ...a, joined: true } : a)); setRsvpMessage("You're in. This commitment has been added to your calendar and cannot be unreserved."); }
      }} />}
      {postOpen && <PostActivityModal error={postError} onClose={() => { setPostOpen(false); setPostError(""); }} onSubmit={(event) => {
        event.preventDefault(); const form = new FormData(event.currentTarget); const required = ["title", "date", "time", "location", "details"];
        if (required.some((key) => !String(form.get(key) ?? "").trim())) { setPostError("Please complete the title, date, time, location, and details."); return; }
        setActivities((all) => [...all, { id: Date.now(), title: String(form.get("title")), type: "Community", date: String(form.get("date")), time: String(form.get("time")), location: String(form.get("location")), distance: 0, people: 1, details: String(form.get("details")) }]);
        setPostOpen(false); setPostError("");
      }} />}
      {lessonOpen && <LessonModal lesson={activeLesson} goal={goal} setGoal={setGoal} error={lessonError} onClose={() => { setLessonOpen(false); setLessonError(""); }} onFinish={() => {
        if (goal.trim().split(/\s+/).filter(Boolean).length < 5) { setLessonError("Your goal needs at least 5 words before you can finish this lesson."); return; }
        setSavedGoal(goal); setLessonOpen(false); setLessonError(""); setGoal("");
        setUnlockedLessons((u) => Math.min(u + 1, lessons.length));
      }} />}
    </div>
  );
}

function LoginScreen({ onEnter }: { onEnter: () => void }) {
  const [signup, setSignup] = useState(false);
  return <main className="grid min-h-screen place-items-center bg-app px-4 py-8">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-glass bg-glass shadow-glass backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
      <section className="flex min-h-[320px] flex-col justify-between bg-primary p-8 text-primary-foreground md:p-12">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary-foreground/15 font-display font-bold">M</span><span className="font-display text-xl font-semibold">Momentum</span></div>
        <div><p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground/70">Less scrolling. More living.</p><h1 className="max-w-md font-display text-4xl font-semibold leading-tight md:text-5xl">Make room for what feels real.</h1><p className="mt-4 max-w-md text-sm leading-6 text-primary-foreground/75">Build intentional habits, discover nearby activities, and stay connected without the endless feed.</p></div>
        <p className="text-xs text-primary-foreground/60">Private by default · Built for meaningful connection</p>
      </section>
      <section className="p-7 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Welcome</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{signup ? "Create your account" : "Welcome back"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{signup ? "Start making time for what matters." : "Sign in to continue your progress."}</p>
        <form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); onEnter(); }}>
          {signup && <div><FieldLabel>Name</FieldLabel><Input defaultValue="Chase" required /></div>}
          <div><FieldLabel>Email</FieldLabel><Input type="email" placeholder="chase@example.com" required /></div>
          <div><FieldLabel>Password</FieldLabel><Input type="password" placeholder="Enter your password" required /></div>
          <Button type="submit" className="h-11 w-full">{signup ? "Create account" : "Sign in"}</Button>
        </form>
        <button className="mt-5 w-full text-center text-sm text-muted-foreground" onClick={() => setSignup((v) => !v)}>{signup ? "Already have an account? " : "New to Momentum? "}<span className="font-semibold text-primary">{signup ? "Sign in" : "Sign up"}</span></button>
      </section>
    </div>
  </main>;
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: typeof Home; label: string; active: boolean; onClick: () => void }) {
  return <Button variant="ghost" onClick={onClick} className={cn("w-full justify-start", active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary")}><Icon />{label}</Button>;
}

function PageHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="section-label">{eyebrow}</p><h1 className="font-display text-3xl font-semibold leading-tight">{title}</h1></div>{action}</div>;
}

function HomeView({ habits, setHabits, goal, navigate }: { habits: boolean[]; setHabits: (v: boolean[]) => void; goal: string; navigate: (v: View) => void }) {
  const habitData = ["Morning walk before checking notifications", "Read for 20 minutes", "Phone out of reach after 9 PM"];
  return <div>
    <PageHeading eyebrow="Good afternoon" title="Let's make today count, Chase." />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,.8fr)]">
      <div className="space-y-5">
        <section className="glass-panel overflow-hidden p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="section-label">Next scheduled activity</p><h2 className="font-display text-2xl font-semibold">Board games & cocoa</h2><div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarDays className="size-4" />Saturday, Oct 3</span><span className="flex items-center gap-1.5"><Clock3 className="size-4" />6:30 PM</span></div></div><div className="grid size-14 place-items-center rounded-xl bg-secondary text-primary"><Sparkles /></div></div>
          <Button className="mt-6" onClick={() => navigate("activities")}>View activity <ChevronRight /></Button>
        </section>
        <section className="glass-panel p-5 md:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="section-label">Daily practice</p><h2 className="font-display text-xl font-semibold">Goals & habits</h2></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{habits.filter(Boolean).length} of 3</span></div>
          <div className="space-y-2">{habitData.map((habit, i) => <button key={habit} onClick={() => setHabits(habits.map((h, n) => n === i ? !h : h))} className="flex w-full items-center gap-3 rounded-lg border border-glass bg-glass-strong p-3 text-left transition hover:-translate-y-0.5 hover:bg-accent"><span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 border-primary/35", habits[i] && "bg-primary text-primary-foreground")} >{habits[i] && <Check className="size-3.5" />}</span><span className={cn("text-sm font-medium", habits[i] && "text-muted-foreground line-through")}>{habit}</span></button>)}</div>
          <div className="mt-4 rounded-lg bg-goal p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Lesson goal</p><p className="mt-1 text-sm leading-6">{goal}</p></div>
        </section>
      </div>
      <aside className="space-y-5">
        <section className="glass-panel p-5"><p className="section-label">Explore</p><div className="mt-3 space-y-2"><QuickLink icon={Sparkles} label="Find an activity" text="Meet people nearby" onClick={() => navigate("activities")} /><QuickLink icon={BookOpen} label="Continue lessons" text="Learn with intention" onClick={() => navigate("lessons")} /><QuickLink icon={Users} label="Visit social" text="See recent friend updates" onClick={() => navigate("social")} /></div></section>
        <section className="glass-panel p-5"><div className="flex items-center justify-between"><div><p className="section-label">Your momentum</p><p className="font-display text-3xl font-semibold">12 days</p></div><Target className="size-9 text-primary" /></div><div className="mt-4 flex gap-1.5">{[1,1,1,1,1,1,0].map((on, i) => <span key={i} className={cn("h-2 flex-1 rounded-full bg-muted", on && "bg-primary")} />)}</div></section>
      </aside>
    </div>
  </div>;
}

function QuickLink({ icon: Icon, label, text, onClick }: { icon: typeof Home; label: string; text: string; onClick: () => void }) { return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-accent"><span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary"><Icon /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-muted-foreground">{text}</span></span><ChevronRight className="size-4 text-muted-foreground" /></button>; }

function ActivitiesView({ activities, filterOpen, setFilterOpen, filterName, setFilterName, filterType, setFilterType, onSelect, onPost }: any) {
  return <div><PageHeading eyebrow="Discover" title="Activities near you" action={<div className="flex gap-2"><Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}><Filter />Filter</Button><Button onClick={onPost}><Plus />Post activity</Button></div>} />
    {filterOpen && <section className="glass-panel mb-5 grid gap-3 p-4 md:grid-cols-4"><div className="md:col-span-2"><FieldLabel>Activity name</FieldLabel><Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Try board games" /></div><div><FieldLabel>Type</FieldLabel><select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option>All types</option><option>Indoors social</option><option>Outdoors relaxed</option><option>Outdoors active</option><option>Creative</option></select></div><div><FieldLabel>Distance</FieldLabel><Input type="range" min="1" max="20" defaultValue="10" /></div><div><FieldLabel>Min participants</FieldLabel><Input type="number" placeholder="2" /></div><div><FieldLabel>Max participants</FieldLabel><Input type="number" placeholder="20" /></div></section>}
    <div className="grid gap-4 lg:grid-cols-2">{activities.map((a: Activity) => <button key={a.id} onClick={() => onSelect(a)} className="glass-panel group p-5 text-left transition hover:-translate-y-1 hover:shadow-glass"><div className="flex items-start gap-4"><PhotoPlaceholder className="size-20 shrink-0 rounded-lg" label={`${a.title} cover photo`} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">{a.type}</span><ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-1" /></div><h2 className="mt-2 font-display text-lg font-semibold">{a.title}</h2><p className="mt-1 text-xs text-muted-foreground">{a.date} · {a.time}</p></div></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="size-3.5" />{a.distance} mi</span><span className="flex items-center gap-1"><Users className="size-3.5" />{a.people} attending</span>{a.joined && <span className="font-semibold text-primary">Joined</span>}</div></button>)}</div>
    {!activities.length && <div className="glass-panel p-10 text-center"><Search className="mx-auto text-muted-foreground" /><p className="mt-3 font-semibold">No activities match those filters.</p></div>}
  </div>;
}

function CalendarView({ activities, onSelect }: { activities: Activity[]; onSelect: (a: Activity) => void }) {
  const [a0, , a2, a3] = activities.length >= 4 ? activities : initialActivities;
  const events: Activity[] = [{ ...a0!, date: "Oct 3", joined: true }, { ...a2!, id: 7, title: "Neighborhood cleanup", date: "Sep 26", past: true, joined: true }, { ...a3!, id: 8, title: "Sunday craft circle", date: "Oct 11", joined: true }];
  return <div><PageHeading eyebrow="Your commitments" title="October 2026" action={<div className="flex gap-1"><Button variant="outline" size="icon" aria-label="Previous month"><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next month"><ChevronRight /></Button></div>} />
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]"><section className="glass-panel overflow-hidden p-3 md:p-5"><div className="grid grid-cols-7 text-center text-xs font-semibold uppercase text-muted-foreground">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div className="py-2" key={d}>{d}</div>)}</div><div className="grid grid-cols-7 overflow-hidden rounded-lg border border-border">{Array.from({length:35},(_,i)=>i-3).map((day,i)=><div key={i} className="min-h-20 border-b border-r border-border bg-glass-strong p-1.5 text-xs md:min-h-28"><span className={cn(day<1||day>31 ? "text-muted-foreground/30":"text-muted-foreground",day===1&&"grid size-6 place-items-center rounded-full bg-primary text-primary-foreground")}>{day<1?27+day:day>31?day-31:day}</span>{day===3&&<button onClick={()=>onSelect(events[0]!)} className="mt-2 w-full rounded-md bg-primary p-1.5 text-left text-[10px] font-semibold text-primary-foreground">6:30 · Games</button>}{day===11&&<button onClick={()=>onSelect(events[2]!)} className="mt-2 w-full rounded-md bg-calendar p-1.5 text-left text-[10px] font-semibold">11:00 · Craft</button>}</div>)}</div></section><aside className="glass-panel h-fit p-5"><p className="section-label">RSVP'd activities</p><div className="mt-3 space-y-3">{events.map(e=><button key={e.id} onClick={()=>onSelect(e)} className="w-full rounded-lg border border-glass bg-glass-strong p-3 text-left"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-primary">{e.date}</span><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",e.past?"bg-muted text-muted-foreground":"bg-secondary text-secondary-foreground")}>{e.past?"Past":"Upcoming"}</span></div><p className="mt-1 text-sm font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{e.time}</p></button>)}</div></aside></div>
  </div>;
}

function LessonsView({ unlocked, onOpen, onLocked, error }: { unlocked: number; onOpen: (n: number) => void; onLocked: () => void; error: string }) {
  return <div><PageHeading eyebrow="Guided learning" title="Build a healthier attention habit" />{error && <AlertText text={error} />}<div className="grid gap-4 lg:grid-cols-[1fr_300px]"><section className="space-y-3">{lessons.map((l,i)=>{ const open = l.n <= unlocked; return <button key={l.n} onClick={open?()=>onOpen(l.n):onLocked} className={cn("glass-panel flex w-full items-center gap-4 p-5 text-left transition",open?"hover:-translate-y-0.5":"opacity-65")}><span className={cn("grid size-11 shrink-0 place-items-center rounded-lg font-display font-bold",open?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground")}>{open?l.n:<LockKeyhole className="size-4" />}</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson {l.n} · {l.duration}</span><span className="mt-1 block font-display text-lg font-semibold">{l.title}</span></span><ChevronRight className="size-4 text-muted-foreground" /></button>; })}</section><aside className="glass-panel h-fit p-5"><BookOpen className="size-8 text-primary"/><h2 className="mt-4 font-display text-xl font-semibold">One lesson at a time</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Finish each reflection to unlock what comes next. Your goals appear on your home screen.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{width:`${(unlocked/lessons.length)*100}%`}} /></div><p className="mt-2 text-xs font-semibold text-muted-foreground">{unlocked} of {lessons.length} available</p></aside></div></div>;
}

function SocialViewPage({ tab, setTab, friendOpen, setFriendOpen }: { tab: SocialView; setTab: (v: SocialView) => void; friendOpen: string | null; setFriendOpen: (v: string | null) => void }) {
  const shownProfile = friendOpen ?? "Chase Rivera";
  return <div><PageHeading eyebrow="Your circle" title="Social" /><div className="mb-5 flex gap-1 rounded-lg bg-glass p-1 backdrop-blur"><Button variant={tab==="feed"?"default":"ghost"} size="sm" onClick={()=>{setTab("feed");setFriendOpen(null)}}>Feed</Button><Button variant={tab==="friends"?"default":"ghost"} size="sm" onClick={()=>{setTab("friends");setFriendOpen(null)}}>Friends</Button><Button variant={tab==="profile"?"default":"ghost"} size="sm" onClick={()=>{setTab("profile");setFriendOpen(null)}}>My profile</Button></div>
    {tab==="feed"&&<div className="mx-auto max-w-2xl space-y-4"><SocialPost name="Maya Chen" time="25 minutes ago" text="Just signed up for the lakeside walk. Who else is coming?" activity="Easy lakeside walk"/><SocialPost name="Dev Brooks" time="Yesterday" text="Game night was exactly the reset I needed this week."/><SocialPost name="Maya Chen" time="2 days ago" text="Completed my goal: no phone during lunch for five days."/><SocialPost name="Dev Brooks" time="3 days ago" text="Looking for two more people for beginner pickleball." activity="Beginner pickleball"/></div>}
    {tab==="friends"&&<div className="grid gap-4 sm:grid-cols-2">{friends.map(f=><button key={f.name} onClick={()=>{setFriendOpen(f.name);setTab("profile")}} className="glass-panel flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5"><PhotoPlaceholder className={cn("size-14 rounded-xl",f.color)} label={`${f.name} profile photo`} /><div><p className="font-display text-lg font-semibold">{f.name}</p><p className="text-xs text-muted-foreground">{f.note}</p></div><ChevronRight className="ml-auto size-4 text-muted-foreground"/></button>)}</div>}
    {tab==="profile"&&<ProfileView name={shownProfile} own={!friendOpen} />}
  </div>;
}

function SocialPost({name,time,text,activity}:{name:string;time:string;text:string;activity?:string}) { return <article className="glass-panel p-5"><div className="flex items-center gap-3"><PhotoPlaceholder className="size-10 rounded-lg" label={`${name} profile photo`}/><div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-muted-foreground">{time} · Friends</p></div></div><p className="mt-4 text-sm leading-6">{text}</p>{activity&&<div className="mt-4 rounded-lg bg-goal p-4"><p className="text-xs font-semibold uppercase text-primary">Activity</p><p className="mt-1 font-semibold">{activity}</p></div>}<div className="mt-4 flex gap-4 border-t border-border pt-3 text-xs font-semibold text-muted-foreground"><button>Encourage</button><button>Comment</button></div></article>; }

function ProfileView({name,own}:{name:string;own:boolean}) { return <div className="grid gap-5 xl:grid-cols-[280px_1fr]"><aside className="glass-panel h-fit p-5 text-center"><PhotoPlaceholder className="mx-auto size-24 rounded-2xl" label={`${name} profile photo`}/><h2 className="mt-4 font-display text-2xl font-semibold">{name}</h2><p className="mt-1 text-sm text-muted-foreground">Denver, Colorado</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-lg bg-glass-strong p-3"><p className="font-display text-xl font-semibold">12</p><p className="text-[11px] text-muted-foreground">Activities</p></div><div className="rounded-lg bg-glass-strong p-3"><p className="font-display text-xl font-semibold">{own?"2":"1"}</p><p className="text-[11px] text-muted-foreground">Active</p></div></div></aside><section className="space-y-4"><article className="glass-panel overflow-hidden"><PhotoPlaceholder className="h-44 w-full" label="Post photo"/><div className="p-5"><div className="flex justify-between"><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">Active</span><span className="text-xs text-muted-foreground">Oct 3</span></div><h3 className="mt-3 font-display text-lg font-semibold">Board games & cocoa</h3><p className="mt-1 text-sm text-muted-foreground">Looking forward to a relaxed night with good people.</p></div></article><article className="glass-panel p-5"><div className="flex justify-between"><span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">Inactive</span><span className="text-xs text-muted-foreground">Sep 26</span></div><h3 className="mt-3 font-display text-lg font-semibold">Neighborhood cleanup</h3><p className="mt-1 text-sm text-muted-foreground">A great morning making the park feel cared for.</p><p className="mt-4 rounded-lg bg-glass-strong p-3 text-sm">“We filled eight bags and met three new neighbors.”</p></article></section></div>; }

function SettingsView({tab,setTab}:{tab:"general"|"profile";setTab:(v:"general"|"profile")=>void}) { return <div><PageHeading eyebrow="Account" title="Settings"/><div className="grid gap-5 md:grid-cols-[200px_1fr]"><aside className="glass-panel h-fit p-2"><Button variant={tab==="general"?"default":"ghost"} className="w-full justify-start" onClick={()=>setTab("general")}><SlidersHorizontal/>General</Button><Button variant={tab==="profile"?"default":"ghost"} className="mt-1 w-full justify-start" onClick={()=>setTab("profile")}><Users/>Profile</Button></aside><section className="glass-panel p-5 md:p-7">{tab==="general"?<><h2 className="font-display text-xl font-semibold">Privacy & notifications</h2><div className="mt-5 divide-y divide-border"><SettingRow title="Post privacy" detail="Friends"/><SettingRow title="Message requests" detail="People from shared activities"/><SettingRow title="Activity visibility" detail="Friends"/><ToggleRow title="Activity reminders"/><ToggleRow title="New message notifications"/><ToggleRow title="Weekly progress summary"/></div></>:<><div className="flex items-center gap-4"><PhotoPlaceholder className="size-16 rounded-xl" label="Profile photo"/><div><h2 className="font-display text-xl font-semibold">Chase Rivera</h2><Button variant="outline" size="sm" className="mt-2"><Camera/>Change photo</Button></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><FieldLabel>Email</FieldLabel><Input defaultValue="chase@example.com"/></div><div><FieldLabel>Phone</FieldLabel><Input defaultValue="(303) 555-0142"/></div><div><FieldLabel>Address</FieldLabel><Input defaultValue="Denver, CO"/></div><div><FieldLabel>Age</FieldLabel><Input type="number" defaultValue="29"/></div><div><FieldLabel>Gender</FieldLabel><Input defaultValue="Prefer not to say"/></div></div><Button className="mt-6">Save changes</Button></>}</section></div></div>; }
function SettingRow({title,detail}:{title:string;detail:string}){return <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">Choose who can access this information</p></div><Button variant="outline" size="sm">{detail}<ChevronRight/></Button></div>}
function ToggleRow({title}:{title:string}){return <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">Keep Chase informed</p></div><Switch defaultChecked/></div>}

function MessagesPanel({onClose}:{onClose:()=>void}) { const [selected,setSelected]=useState("Maya Chen"); return <div className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm" onClick={onClose}><section onClick={e=>e.stopPropagation()} className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-background shadow-2xl"><header className="flex items-center justify-between border-b border-border p-4"><div><p className="section-label">Connected conversations</p><h2 className="font-display text-2xl font-semibold">Messages</h2></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close messages"><X/></Button></header><div className="grid min-h-0 flex-1 sm:grid-cols-[230px_1fr]"><aside className="border-r border-border p-3"><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground"/><Input className="pl-9" placeholder="Search conversations"/></div><Button variant="outline" className="mt-3 w-full"><Plus/>New chat</Button><div className="mt-3 space-y-1">{friends.map(f=><button key={f.name} onClick={()=>setSelected(f.name)} className={cn("w-full rounded-lg p-3 text-left",selected===f.name&&"bg-accent")}><p className="text-sm font-semibold">{f.name}</p><p className="truncate text-xs text-muted-foreground">See you at the next activity!</p></button>)}</div></aside><div className="flex min-h-0 flex-col"><div className="border-b border-border p-4 text-sm font-semibold">{selected}</div><div className="flex-1 space-y-3 overflow-y-auto p-4"><div className="mr-12 rounded-lg bg-muted p-3 text-sm">Are you still coming to board game night?</div><div className="ml-12 rounded-lg bg-primary p-3 text-sm text-primary-foreground">Yes! I’ll be there a few minutes early.</div><div className="mr-12 rounded-lg bg-muted p-3 text-sm">Perfect — see you then.</div></div><div className="flex gap-2 border-t border-border p-4"><Input placeholder="Write a message"/><Button size="icon" aria-label="Send message"><Send/></Button></div></div></div></section></div>; }

function ActivityModal({activity,onClose,onJoin,message}:{activity:Activity;onClose:()=>void;onJoin:()=>void;message:string}) { return <ModalShell onClose={onClose}><PhotoPlaceholder className="h-44 w-full rounded-lg" label={`${activity.title} cover photo`}/><div className="mt-5 flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">{activity.type}</span><h2 className="mt-3 font-display text-2xl font-semibold">{activity.title}</h2></div>{activity.joined&&<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Joined</span>}</div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p className="flex gap-2"><CalendarDays className="size-4 text-primary"/>{activity.date} at {activity.time}</p><p className="flex gap-2"><MapPin className="size-4 text-primary"/>{activity.location}</p><p className="flex gap-2"><Users className="size-4 text-primary"/>{activity.people} participants</p></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{activity.details}</p>{message&&<AlertText text={message} success={message.startsWith("You're")}/>}<Button className="mt-5 w-full" onClick={onJoin} disabled={activity.joined}>{activity.joined?"Already joined":"Join activity"}</Button></ModalShell>; }

function PostActivityModal({onClose,onSubmit,error}:{onClose:()=>void;onSubmit:(e:FormEvent<HTMLFormElement>)=>void;error:string}) { return <ModalShell onClose={onClose}><p className="section-label">Bring people together</p><h2 className="font-display text-2xl font-semibold">Post an activity</h2><form className="mt-5 space-y-4" onSubmit={onSubmit}><div><FieldLabel>Title *</FieldLabel><Input name="title" placeholder="Activity title"/></div><div className="grid gap-4 sm:grid-cols-2"><div><FieldLabel>Date *</FieldLabel><Input name="date" type="date"/></div><div><FieldLabel>Time *</FieldLabel><Input name="time" type="time"/></div></div><div><FieldLabel>Location *</FieldLabel><Input name="location" placeholder="Where will you meet?"/></div><div><FieldLabel>Details *</FieldLabel><Textarea name="details" className="min-h-28" placeholder="What should people know?"/></div>{error&&<AlertText text={error}/>}<Button className="w-full" type="submit">Publish activity</Button></form></ModalShell>; }

const lessonContent: Record<number, { title: string; duration: string; intro: string; stats: { value: string; label: string }[]; outro: string; prompt: string; placeholder: string }> = {
  1: { title: "Designed to keep you scrolling", duration: "7 minutes", intro: "Many apps are built around a variable reward loop: each refresh might reveal something funny, affirming, or surprising. That uncertainty teaches the brain to check again, even when the last check was not satisfying.", stats: [{ value: "96", label: "average daily checks" }, { value: "4.8h", label: "average screen time" }, { value: "23m", label: "to regain focus" }], outro: "Notifications, infinite feeds, and streaks remove natural stopping cues. Noticing the cue is the first step: pause, name what you hoped to find, and choose whether the next check serves that need.", prompt: "Write a specific plan for interrupting one automatic phone-checking habit.", placeholder: "When I notice myself reaching for my phone..." },
  2: { title: "Notice your attention cues", duration: "6 minutes", intro: "Most phone checks are not decisions — they are reactions. A buzz, a moment of boredom, or a lull in conversation acts as a cue, and your hand moves before your mind has weighed in.", stats: [{ value: "3s", label: "from cue to reach" }, { value: "70%", label: "of checks are automatic" }, { value: "1", label: "cue to watch today" }], outro: "This week, your only job is to notice. Each time you catch a cue — a notification, a quiet moment, a feeling of restlessness — name it out loud or in your head. Awareness weakens the loop before you change a single habit.", prompt: "Write down the one cue you will watch for today.", placeholder: "The cue I will watch for is..." },
};
function LessonModal({lesson,goal,setGoal,error,onClose,onFinish}:{lesson:number;goal:string;setGoal:(v:string)=>void;error:string;onClose:()=>void;onFinish:()=>void}) { const c=lessonContent[lesson]??lessonContent[1]!; const words=goal.trim()?goal.trim().split(/\s+/).length:0; return <ModalShell onClose={onClose} wide><p className="section-label">Lesson {lesson} · {c.duration}</p><h2 className="font-display text-3xl font-semibold">{c.title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{c.intro}</p><div className="my-5 grid gap-3 sm:grid-cols-3">{c.stats.map(s=><Stat key={s.label} value={s.value} label={s.label}/>)}</div><p className="text-sm leading-7 text-muted-foreground">{c.outro}</p><div className="mt-6 rounded-lg bg-goal p-4"><FieldLabel>Your goal</FieldLabel><p className="mb-3 text-sm font-medium">{c.prompt}</p><Textarea value={goal} onChange={e=>setGoal(e.target.value)} className="min-h-32 bg-background" placeholder={c.placeholder}/><p className="mt-2 text-xs text-muted-foreground">{words}/5 words minimum</p></div>{error&&<AlertText text={error}/>}<Button className="mt-5 w-full" onClick={onFinish}>Save goal & finish lesson</Button></ModalShell>; }
function Stat({value,label}:{value:string;label:string}){return <div className="rounded-lg border border-glass bg-glass-strong p-4"><p className="font-display text-2xl font-semibold text-primary">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>}
function AlertText({text,success=false}:{text:string;success?:boolean}) { return <div className={cn("mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive",success&&"bg-primary/10 text-primary")}><CircleAlert className="mt-0.5 size-4 shrink-0"/><span>{text}</span></div>; }
function ModalShell({children,onClose,wide=false}:{children:React.ReactNode;onClose:()=>void;wide?:boolean}) { return <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4 backdrop-blur-sm" onClick={onClose}><section onClick={e=>e.stopPropagation()} className={cn("relative max-h-[90vh] w-full overflow-y-auto rounded-xl border border-glass bg-background p-5 shadow-2xl md:p-7",wide?"max-w-2xl":"max-w-lg")}><Button variant="ghost" size="icon" className="absolute right-3 top-3 z-10" onClick={onClose} aria-label="Close"><X/></Button>{children}</section></div>; }

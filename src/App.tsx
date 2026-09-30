import {
  AlertCircle,
  ArrowDownToLine,
  Award,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileArchive,
  FileText,
  FolderUp,
  Handshake,
  Home,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Timer,
  TrendingUp,
  UploadCloud,
  UserRoundCheck,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "site" | "portal" | "admin";
type DueState = "paid" | "soon" | "overdue";
type TaskStatus = "missing" | "review" | "done";

type ClientTask = {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
};

type ClientDocument = {
  id: string;
  clientId: string;
  name: string;
  category: string;
  uploadedBy: "office" | "client";
  uploadedAt: string;
  size: string;
  shared: boolean;
  note: string;
  dataUrl: string;
};

type Client = {
  id: string;
  name: string;
  sector: string;
  contact: string;
  email: string;
  taxNo: string;
  plan: string;
  monthlyDue: number;
  balance: number;
  nextDueDate: string;
  lastActivity: string;
  accessCode: string;
  tasks: ClientTask[];
  documents: ClientDocument[];
};

const STORAGE_KEY = "osman-coban-smmm-demo-v1";
const ADMIN_PIN = "2026";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const dayFromNow = (days: number) => {
  const date = startOfToday();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const nextMonth = (date: string) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next.toISOString();
};

const makeId = () => Math.random().toString(36).slice(2, 10);

const textFile = (title: string, lines: string[]) =>
  `data:text/plain;charset=utf-8,${encodeURIComponent([title, "", ...lines].join("\n"))}`;

const demoDocument = (
  clientId: string,
  name: string,
  category: string,
  shared: boolean,
  note: string
): ClientDocument => ({
  id: makeId(),
  clientId,
  name,
  category,
  uploadedBy: "office",
  uploadedAt: dayFromNow(-2),
  size: "32 KB",
  shared,
  note,
  dataUrl: textFile(name, [
    "Bu dosya GitHub Pages demo ortamı için oluşturulmuş örnek içeriktir.",
    "Üretimde dosyalar güvenli depolama alanında saklanmalıdır.",
  ]),
});

const createDemoClients = (): Client[] => {
  const akdenizDocs = [
    demoDocument("akdeniz", "2026 Eylül KDV Beyan Özeti.txt", "Beyanname", true, "Mükellefe paylaşıldı"),
    demoDocument("akdeniz", "SGK Tahakkuk Bilgilendirme.txt", "SGK", true, "Ay sonu kontrolü"),
  ];

  return [
    {
      id: "akdeniz",
      name: "Akdeniz İnşaat Ltd.",
      sector: "İnşaat ve taahhüt",
      contact: "Mehmet Arslan",
      email: "m.arslan@example.com",
      taxNo: "342 118 9042",
      plan: "Aylık tam hizmet",
      monthlyDue: 9500,
      balance: 9500,
      nextDueDate: dayFromNow(-8),
      lastActivity: "KDV özeti paylaşıldı",
      accessCode: "AKD-2026",
      tasks: [
        { id: "t1", title: "Eylül banka ekstreleri", dueDate: dayFromNow(-3), status: "missing" },
        { id: "t2", title: "Taşeron hakediş listesi", dueDate: dayFromNow(2), status: "review" },
      ],
      documents: akdenizDocs,
    },
    {
      id: "kepez",
      name: "Kepez Klinik Sağlık Hiz.",
      sector: "Sağlık",
      contact: "Dr. Selin Kaya",
      email: "selin.kaya@example.com",
      taxNo: "581 219 7761",
      plan: "Beyanname + bordro",
      monthlyDue: 7200,
      balance: 7200,
      nextDueDate: dayFromNow(4),
      lastActivity: "Personel bildirimi bekleniyor",
      accessCode: "KLP-2026",
      tasks: [
        { id: "t3", title: "Yeni personel giriş bilgileri", dueDate: dayFromNow(1), status: "missing" },
        { id: "t4", title: "Gider fişleri", dueDate: dayFromNow(5), status: "review" },
      ],
      documents: [
        demoDocument("kepez", "Aylık Bordro Kontrol Listesi.txt", "Bordro", true, "Onay bekliyor"),
      ],
    },
    {
      id: "toros",
      name: "Toros Gıda Pazarlama",
      sector: "Gıda toptan",
      contact: "Ayhan Demir",
      email: "ayhan.demir@example.com",
      taxNo: "738 440 1268",
      plan: "Defter + danışmanlık",
      monthlyDue: 6400,
      balance: 0,
      nextDueDate: dayFromNow(19),
      lastActivity: "Aidat ödendi",
      accessCode: "TRS-2026",
      tasks: [
        { id: "t5", title: "E-fatura mutabakatı", dueDate: dayFromNow(7), status: "done" },
        { id: "t6", title: "Stok sayım tutanağı", dueDate: dayFromNow(10), status: "review" },
      ],
      documents: [
        demoDocument("toros", "Eylül Mutabakat Notu.txt", "Mutabakat", true, "Kontrol edildi"),
      ],
    },
    {
      id: "nova",
      name: "Nova Turizm A.Ş.",
      sector: "Turizm",
      contact: "Ece Yılmaz",
      email: "ece.yilmaz@example.com",
      taxNo: "193 870 5573",
      plan: "Kurumsal danışmanlık",
      monthlyDue: 11800,
      balance: 11800,
      nextDueDate: dayFromNow(9),
      lastActivity: "Sözleşme yenileme dönemi",
      accessCode: "NVA-2026",
      tasks: [
        { id: "t7", title: "Acenta komisyon dökümü", dueDate: dayFromNow(8), status: "missing" },
        { id: "t8", title: "Dövizli işlem listesi", dueDate: dayFromNow(12), status: "review" },
      ],
      documents: [
        demoDocument("nova", "Dönemsel Risk Notu.txt", "Danışmanlık", false, "İç çalışma"),
      ],
    },
  ];
};

const getDueState = (client: Client): DueState => {
  if (client.balance <= 0) return "paid";
  const today = startOfToday().getTime();
  const due = new Date(client.nextDueDate).getTime();
  const days = Math.ceil((due - today) / 86_400_000);
  if (days < 0) return "overdue";
  if (days <= 10) return "soon";
  return "paid";
};

const stateLabels: Record<DueState, string> = {
  paid: "Düzenli",
  soon: "Yaklaşıyor",
  overdue: "Gecikti",
};

const taskLabels: Record<TaskStatus, string> = {
  missing: "Eksik",
  review: "İncelemede",
  done: "Tamam",
};

function App() {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createDemoClients();
    try {
      return JSON.parse(saved) as Client[];
    } catch {
      return createDemoClients();
    }
  });
  const [view, setView] = useState<View>("site");
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? "akdeniz");
  const [filter, setFilter] = useState<"all" | DueState | "docs">("all");
  const [toast, setToast] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(
    () => localStorage.getItem("osman-admin-unlocked") === "true"
  );
  const [reminderText, setReminderText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0];

  const totals = useMemo(() => {
    const overdue = clients.filter((client) => getDueState(client) === "overdue");
    const soon = clients.filter((client) => getDueState(client) === "soon");
    const missingDocs = clients.reduce(
      (sum, client) => sum + client.tasks.filter((task) => task.status === "missing").length,
      0
    );
    const totalBalance = clients.reduce((sum, client) => sum + client.balance, 0);
    return { overdue, soon, missingDocs, totalBalance };
  }, [clients]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = `${client.name} ${client.contact} ${client.sector}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    if (filter === "docs") return client.tasks.some((task) => task.status === "missing");
    return getDueState(client) === filter;
  });

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const updateClient = (clientId: string, updater: (client: Client) => Client) => {
    setClients((current) => current.map((client) => (client.id === clientId ? updater(client) : client)));
  };

  const handleAdminLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("pin") === ADMIN_PIN) {
      setAdminUnlocked(true);
      localStorage.setItem("osman-admin-unlocked", "true");
      notify("Yönetim paneli açıldı.");
      return;
    }
    notify("PIN hatalı. Demo PIN: 2026");
  };

  const resetDemo = () => {
    const fresh = createDemoClients();
    setClients(fresh);
    setSelectedClientId(fresh[0].id);
    setReminderText("");
    notify("Demo verileri yenilendi.");
  };

  const markPaid = (clientId: string) => {
    updateClient(clientId, (client) => ({
      ...client,
      balance: 0,
      nextDueDate: nextMonth(client.nextDueDate),
      lastActivity: "Aidat ödemesi işlendi",
    }));
    notify("Aidat kaydı ödendi olarak güncellendi.");
  };

  const toggleTask = (clientId: string, taskId: string) => {
    updateClient(clientId, (client) => ({
      ...client,
      tasks: client.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "missing" : "done" }
          : task
      ),
      lastActivity: "Evrak görev durumu güncellendi",
    }));
  };

  const addClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) return;
    const id = makeId();
    const monthlyDue = Number(form.get("monthlyDue") || 0);
    const newClient: Client = {
      id,
      name,
      sector: String(form.get("sector") || "Genel hizmet"),
      contact: String(form.get("contact") || "Yetkili"),
      email: String(form.get("email") || "mukellef@example.com"),
      taxNo: String(form.get("taxNo") || "000 000 0000"),
      plan: String(form.get("plan") || "Aylık hizmet"),
      monthlyDue,
      balance: monthlyDue,
      nextDueDate: dayFromNow(12),
      lastActivity: "Yeni mükellef kaydı açıldı",
      accessCode: `${name.slice(0, 3).toLocaleUpperCase("tr-TR")}-2026`,
      tasks: [
        { id: makeId(), title: "Açılış evrak seti", dueDate: dayFromNow(5), status: "missing" },
      ],
      documents: [],
    };
    setClients((current) => [newClient, ...current]);
    setSelectedClientId(id);
    event.currentTarget.reset();
    notify("Yeni mükellef demo listesine eklendi.");
  };

  const createReminder = (client: Client) => {
    const message = `Merhaba ${client.contact}, ${client.name} için ${formatDate(
      client.nextDueDate
    )} vadeli ${formatCurrency(
      client.balance
    )} tutarındaki aidat kaydı açık görünüyor. Uygun olduğunuzda ödeme bilgisini portaldan iletebilir veya ofisle paylaşabilirsiniz. Osman Çoban SMMM`;
    setReminderText(message);
    notify("Hatırlatma taslağı hazırlandı.");
  };

  const addUploadedFiles = async (
    fileList: FileList | null,
    clientId: string,
    uploadedBy: "office" | "client",
    category: string,
    shared: boolean
  ) => {
    if (!fileList?.length) return;
    const files = Array.from(fileList);
    const docs = await Promise.all(
      files.map(async (file) => ({
        id: makeId(),
        clientId,
        name: file.name,
        category,
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        shared,
        note: uploadedBy === "client" ? "Mükellef yükledi" : "Ofis yükledi",
        dataUrl: await fileToDataUrl(file),
      }))
    );
    updateClient(clientId, (client) => ({
      ...client,
      documents: [...docs, ...client.documents],
      lastActivity: uploadedBy === "client" ? "Mükellef evrak yükledi" : "Ofis evrak paylaştı",
    }));
    notify(`${docs.length} evrak yüklendi.`);
  };

  const toggleDocumentShare = (clientId: string, documentId: string) => {
    updateClient(clientId, (client) => ({
      ...client,
      documents: client.documents.map((doc) =>
        doc.id === documentId ? { ...doc, shared: !doc.shared } : doc
      ),
    }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("site")} aria-label="Ana sayfa">
          <span className="brand-wordmark">
            <span className="brand-name-row">
              <strong>Osman Çoban</strong>
              <em>SMMM</em>
            </span>
            <small>Serbest Muhasebeci Mali Müşavir</small>
          </span>
        </button>

        <nav className="nav-actions" aria-label="Site bölümleri">
          <NavButton active={view === "site"} icon={<Home />} label="Ana Sayfa" onClick={() => setView("site")} />
          <NavButton
            active={view === "portal"}
            icon={<UserRoundCheck />}
            label="Mükellef İşlemleri"
            shortLabel="Mükellef"
            onClick={() => setView("portal")}
          />
          <NavButton
            active={view === "admin"}
            icon={<LayoutDashboard />}
            label="Ofis Paneli"
            onClick={() => setView("admin")}
          />
        </nav>
      </header>

      <main>
        {view === "site" && (
          <SiteHome
            totals={totals}
            clients={clients}
            setView={setView}
            selectedClient={selectedClient}
          />
        )}

        {view === "portal" && selectedClient && (
          <ClientPortal
            clients={clients}
            selectedClient={selectedClient}
            setSelectedClientId={setSelectedClientId}
            onUpload={addUploadedFiles}
            onTaskToggle={toggleTask}
            onPayNotice={markPaid}
          />
        )}

        {view === "admin" &&
          (adminUnlocked ? (
            <AdminPanel
              clients={clients}
              filteredClients={filteredClients}
              totals={totals}
              selectedClient={selectedClient}
              filter={filter}
              searchTerm={searchTerm}
              reminderText={reminderText}
              setFilter={setFilter}
              setSearchTerm={setSearchTerm}
              setSelectedClientId={setSelectedClientId}
              onAddClient={addClient}
              onMarkPaid={markPaid}
              onCreateReminder={createReminder}
              onUpload={addUploadedFiles}
              onTaskToggle={toggleTask}
              onToggleShare={toggleDocumentShare}
              onReset={resetDemo}
            />
          ) : (
            <AdminLogin onSubmit={handleAdminLogin} />
          ))}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  shortLabel,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  shortLabel?: string;
  onClick: () => void;
}) {
  return (
    <button className={`${active ? "nav-button active" : "nav-button"}${shortLabel ? " has-short" : ""}`} onClick={onClick}>
      {icon}
      <span className="full-label">{label}</span>
      {shortLabel && <span className="short-label">{shortLabel}</span>}
    </button>
  );
}

function SiteHome({
  totals,
  clients,
  setView,
  selectedClient,
}: {
  totals: { overdue: Client[]; soon: Client[]; missingDocs: number; totalBalance: number };
  clients: Client[];
  selectedClient: Client;
  setView: (view: View) => void;
}) {
  return (
    <>
      <section className="hero-section marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Antalya Kepez serbest muhasebeci mali müşavir</span>
          <h1>İşinizi büyütürken muhasebeniz geride kalmasın.</h1>
          <p>
            Osman Çoban SMMM; şirket kuruluşu, aylık muhasebe, bordro, beyanname ve mali
            danışmanlık süreçlerinde işletmenizin yanında olur. Evraklar düzenli ilerler,
            tarihler kaçmaz, siz işinize odaklanırsınız.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#gorusme-formu">
              <Handshake />
              Mükellef olmak istiyorum
            </a>
            <a className="secondary-action" href="tel:+905000000000">
              <Phone />
              Hızlı görüşme
            </a>
          </div>
          <div className="trust-row" aria-label="Güven noktaları">
            <span><ShieldCheck /> Ruhsatlı SMMM hizmeti</span>
            <span><Timer /> Dönemsel takip</span>
            <span><FileCheck2 /> Dijital evrak akışı</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Modern mali müşavirlik çalışma ortamı">
          <img src="./hero-advisory.png" alt="Dijital muhasebe danışmanlığı ve evrak inceleme masası" />
          <div className="hero-proof-card">
            <span>Bu ay takipte</span>
            <strong>{clients.length} aktif mükellef</strong>
            <small>{selectedClient.name} için son işlem: {selectedClient.lastActivity}</small>
          </div>
        </div>
      </section>

      <section className="credibility-band" aria-label="Hizmet özeti">
        <MarketingStat icon={<Award />} value="SMMM" label="Mesleki yetkinlik" />
        <MarketingStat icon={<Landmark />} value="Vergi" label="Beyanname ve mevzuat takibi" />
        <MarketingStat icon={<Building2 />} value="KOBİ" label="İşletme odaklı danışmanlık" />
        <MarketingStat icon={<TrendingUp />} value="Düzen" label="Aylık rapor ve hatırlatma" />
      </section>

      <section className="section-block services-section">
        <div className="section-heading">
          <span className="eyebrow">Hangi konuda destek alırsınız?</span>
          <h2>Muhasebe işlerinizi yalnızca kayda değil, karara dönüştüren çalışma düzeni.</h2>
        </div>
        <div className="service-strip">
          <ServiceItem icon={<BriefcaseBusiness />} title="Şirket kuruluşu ve açılış" text="Vergi dairesi, oda, SGK ve başlangıç yükümlülükleri için kontrollü açılış süreci." />
          <ServiceItem icon={<ClipboardCheck />} title="Aylık muhasebe takibi" text="Gelir-gider kayıtları, mutabakatlar, defter düzeni ve dönem kapanışları." />
          <ServiceItem icon={<FileCheck2 />} title="Beyanname ve SGK" text="KDV, muhtasar, geçici vergi, bordro ve SGK bildirgeleri için tarih kaçırmayan takip." />
          <ServiceItem icon={<TrendingUp />} title="Mali danışmanlık" text="Nakit akışı, gider kontrolü ve karar dönemlerinde anlaşılır finansal yorum." />
        </div>
      </section>

      <section className="section-block split-story">
        <div>
          <span className="eyebrow">Neden Osman Çoban?</span>
          <h2>Mükellef, evrak peşinde koşan değil; sürecini görebilen işletme sahibi olmalı.</h2>
          <p>
            İyi mali müşavirlik yalnızca beyanname göndermek değildir. Doğru tarihte doğru
            evrağı istemek, ödemeleri ve yükümlülükleri görünür tutmak, işletme sahibine
            sade ve zamanında bilgi vermektir.
          </p>
        </div>
        <div className="benchmark-grid">
          <BenchmarkItem title="Net iletişim" text="Eksik evrak, ödeme ve beyanname konuları anlaşılır şekilde bildirilir." />
          <BenchmarkItem title="Dijital kolaylık" text="Mükellefler evraklarını portal üzerinden iletebilir ve paylaşılan dosyaları indirebilir." />
          <BenchmarkItem title="Takvim disiplini" text="Vergi ve SGK dönemleri, aidat ve evrak beklentileri düzenli izlenir." />
          <BenchmarkItem title="Yerel erişim" text="Antalya ve Kepez çevresindeki işletmeler için ulaşılabilir, pratik danışmanlık." />
        </div>
      </section>

      <section className="section-block process-section">
        <div className="section-heading">
          <span className="eyebrow">Çalışma akışı</span>
          <h2>İlk görüşmeden düzenli takibe kadar sade bir süreç.</h2>
        </div>
        <div className="process-grid">
          <ProcessStep number="01" title="Ön görüşme" text="İşletme türünüz, çalışan sayınız, belge yoğunluğunuz ve ihtiyaçlarınız netleştirilir." />
          <ProcessStep number="02" title="Geçiş ve kurulum" text="Defter, beyanname, SGK ve evrak akışı için düzenli takip sistemi kurulur." />
          <ProcessStep number="03" title="Aylık takip" text="Belgeler toplanır, eksikler hatırlatılır, dönemsel yükümlülükler kontrol edilir." />
          <ProcessStep number="04" title="Danışmanlık" text="Vergi ve finansal karar dönemlerinde işletmeye anlaşılır yönlendirme yapılır." />
        </div>
      </section>

      <section className="portal-note">
        <div>
          <span className="eyebrow">İşi kolaylaştıran dijital düzen</span>
          <h2>Portal, hizmetin vitrini değil; sizinle ofis arasındaki pratik köprü.</h2>
          <p>
            Mükellefler evraklarını yükleyebilir, paylaşılan belgeleri indirebilir ve açık
            durumları görebilir. Ofis tarafında ise geciken aidatlar, eksik evraklar ve
            müşteri kayıtları tek yerden takip edilir.
          </p>
        </div>
        <div className="portal-note-actions">
          <button className="secondary-action" onClick={() => setView("portal")}>
            <UserRoundCheck />
            Mükellef işlemlerini gör
          </button>
          <button className="ghost-action" onClick={() => setView("admin")}>
            <LayoutDashboard />
            Ofis paneli
          </button>
        </div>
        <div className="mini-dashboard" aria-label="Arka plan takip özeti">
          <MetricCard icon={<AlertCircle />} label="Geciken takip" value={String(totals.overdue.length)} tone="danger" />
          <MetricCard icon={<CalendarClock />} label="Yaklaşan işlem" value={String(totals.soon.length)} tone="warning" />
          <MetricCard icon={<FileText />} label="Eksik evrak" value={String(totals.missingDocs)} tone="info" />
        </div>
      </section>

      <section className="contact-band" id="gorusme-formu">
        <div>
          <span className="eyebrow">Yeni mükellef başvurusu</span>
          <h2>İşletmeniz için doğru muhasebe düzenini birlikte kuralım.</h2>
          <p>Formu gönderin; kuruluş, defter, bordro veya mevcut muhasebe geçişiniz için ön görüşme planlansın.</p>
        </div>
        <form
          className="quick-form"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            form.reset();
            window.alert("Başvuru demo olarak alındı. Gerçek yayında bu alan e-posta, WhatsApp veya CRM'e bağlanır.");
          }}
        >
          <input aria-label="Ad soyad veya firma adı" placeholder="Ad soyad / firma adı" required />
          <input aria-label="Telefon veya e-posta" placeholder="Telefon veya e-posta" required />
          <select aria-label="İhtiyaç türü" defaultValue="">
            <option value="" disabled>İhtiyaç türü</option>
            <option>Şirket kuruluşu</option>
            <option>Aylık muhasebe</option>
            <option>Bordro ve SGK</option>
            <option>Danışmanlık</option>
          </select>
          <button className="primary-action" type="submit">
            <Mail />
            Görüşme iste
          </button>
        </form>
      </section>
    </>
  );
}

function ClientPortal({
  clients,
  selectedClient,
  setSelectedClientId,
  onUpload,
  onTaskToggle,
  onPayNotice,
}: {
  clients: Client[];
  selectedClient: Client;
  setSelectedClientId: (id: string) => void;
  onUpload: (
    files: FileList | null,
    clientId: string,
    uploadedBy: "office" | "client",
    category: string,
    shared: boolean
  ) => Promise<void>;
  onTaskToggle: (clientId: string, taskId: string) => void;
  onPayNotice: (clientId: string) => void;
}) {
  const dueState = getDueState(selectedClient);
  const sharedDocuments = selectedClient.documents.filter(
    (doc) => doc.shared || doc.uploadedBy === "client"
  );

  return (
    <section className="workspace-layout">
      <aside className="client-switcher">
        <span className="eyebrow">Mükellef girişi</span>
        <h2>Portal</h2>
        <label>
          Mükellef seç
          <select value={selectedClient.id} onChange={(event) => setSelectedClientId(event.target.value)}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} · {client.accessCode}
              </option>
            ))}
          </select>
        </label>
        <div className="access-note">
          <KeyRound />
          <span>Demo kodu seçili mükellef satırında gösterilir. Üretimde bu alan tek kullanımlık güvenli bağlantıya çevrilir.</span>
        </div>
      </aside>

      <div className="portal-content">
        <section className="portal-hero">
          <div>
            <span className={`status-pill ${dueState}`}>{stateLabels[dueState]}</span>
            <h1>{selectedClient.name}</h1>
            <p>{selectedClient.plan} · {selectedClient.sector}</p>
          </div>
          <button className="secondary-action" onClick={() => onPayNotice(selectedClient.id)}>
            <CircleDollarSign />
            Ödeme bildirdim
          </button>
        </section>

        <section className="metric-grid portal-metrics">
          <MetricCard icon={<CircleDollarSign />} label="Açık aidat" value={formatCurrency(selectedClient.balance)} tone={dueState === "overdue" ? "danger" : "success"} />
          <MetricCard icon={<CalendarClock />} label="Son ödeme" value={formatDate(selectedClient.nextDueDate)} tone="warning" />
          <MetricCard icon={<FileText />} label="Paylaşılan evrak" value={String(sharedDocuments.length)} tone="info" />
          <MetricCard icon={<ClipboardCheck />} label="Bekleyen görev" value={String(selectedClient.tasks.filter((task) => task.status !== "done").length)} tone="success" />
        </section>

        <section className="two-column">
          <div className="panel">
            <div className="panel-heading">
              <span>Bekleyen evraklar</span>
              <strong>{selectedClient.tasks.length}</strong>
            </div>
            <div className="task-list">
              {selectedClient.tasks.map((task) => (
                <button
                  key={task.id}
                  className={`task-row ${task.status}`}
                  onClick={() => onTaskToggle(selectedClient.id, task.id)}
                >
                  <span>
                    <strong>{task.title}</strong>
                    <small>{formatDate(task.dueDate)}</small>
                  </span>
                  <em>{taskLabels[task.status]}</em>
                </button>
              ))}
            </div>
          </div>

          <div className="panel upload-panel">
            <div className="panel-heading">
              <span>Evrak yükle</span>
              <UploadCloud />
            </div>
            <label className="dropzone">
              <input
                type="file"
                multiple
                onChange={(event) =>
                  onUpload(event.currentTarget.files, selectedClient.id, "client", "Mükellef evrakı", true)
                }
              />
              <FolderUp />
              <strong>Dosyaları seç</strong>
              <small>Banka ekstresi, fatura, bordro bilgisi veya ödeme dekontu</small>
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <span>Evrak arşivi</span>
            <FileArchive />
          </div>
          <DocumentList documents={sharedDocuments} onToggleShare={null} />
        </section>
      </div>
    </section>
  );
}

function AdminLogin({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="login-section">
      <form className="login-card" onSubmit={onSubmit}>
        <span className="eyebrow">Ofis içi takip alanı</span>
        <h1>Ofis paneli</h1>
        <p>Bu alan Osman Çoban SMMM ofisinin aidat, evrak ve mükellef süreçlerini takip etmesi için hazırlanmıştır.</p>
        <label>
          Demo PIN
          <input name="pin" placeholder="2026" inputMode="numeric" autoComplete="off" />
        </label>
        <button className="primary-action" type="submit">
          <ShieldCheck />
          Ofis paneline gir
        </button>
        <small>Demo PIN: 2026</small>
      </form>
    </section>
  );
}

function AdminPanel({
  clients,
  filteredClients,
  totals,
  selectedClient,
  filter,
  searchTerm,
  reminderText,
  setFilter,
  setSearchTerm,
  setSelectedClientId,
  onAddClient,
  onMarkPaid,
  onCreateReminder,
  onUpload,
  onTaskToggle,
  onToggleShare,
  onReset,
}: {
  clients: Client[];
  filteredClients: Client[];
  totals: { overdue: Client[]; soon: Client[]; missingDocs: number; totalBalance: number };
  selectedClient: Client;
  filter: "all" | DueState | "docs";
  searchTerm: string;
  reminderText: string;
  setFilter: (filter: "all" | DueState | "docs") => void;
  setSearchTerm: (value: string) => void;
  setSelectedClientId: (id: string) => void;
  onAddClient: (event: FormEvent<HTMLFormElement>) => void;
  onMarkPaid: (clientId: string) => void;
  onCreateReminder: (client: Client) => void;
  onUpload: (
    files: FileList | null,
    clientId: string,
    uploadedBy: "office" | "client",
    category: string,
    shared: boolean
  ) => Promise<void>;
  onTaskToggle: (clientId: string, taskId: string) => void;
  onToggleShare: (clientId: string, documentId: string) => void;
  onReset: () => void;
}) {
  const dueState = getDueState(selectedClient);

  return (
    <section className="admin-shell">
      <div className="admin-title">
        <div>
          <span className="eyebrow">Ofis içi operasyon</span>
          <h1>Mükellef operasyon paneli</h1>
        </div>
        <button className="ghost-action" onClick={onReset}>
          <RefreshCcw />
          Demo verisini yenile
        </button>
      </div>

      <section className="metric-grid">
        <MetricCard icon={<CircleDollarSign />} label="Açık bakiye" value={formatCurrency(totals.totalBalance)} tone="success" />
        <MetricCard icon={<AlertCircle />} label="Geciken aidat" value={String(totals.overdue.length)} tone="danger" />
        <MetricCard icon={<CalendarClock />} label="Yaklaşan aidat" value={String(totals.soon.length)} tone="warning" />
        <MetricCard icon={<FileText />} label="Eksik evrak" value={String(totals.missingDocs)} tone="info" />
      </section>

      <section className="admin-grid">
        <div className="panel client-table-panel">
          <div className="table-tools">
            <div className="search-box">
              <Search />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Mükellef ara"
                aria-label="Mükellef ara"
              />
            </div>
            <div className="segmented">
              <FilterButton active={filter === "all"} label="Tümü" onClick={() => setFilter("all")} />
              <FilterButton active={filter === "overdue"} label="Geciken" onClick={() => setFilter("overdue")} />
              <FilterButton active={filter === "soon"} label="Yaklaşan" onClick={() => setFilter("soon")} />
              <FilterButton active={filter === "docs"} label="Evrak" onClick={() => setFilter("docs")} />
            </div>
          </div>

          <div className="client-table" role="table" aria-label="Mükellef aidat listesi">
            <div className="client-row table-head" role="row">
              <span>Mükellef</span>
              <span>Aidat</span>
              <span>Vade</span>
              <span>Durum</span>
              <span>İşlem</span>
            </div>
            {filteredClients.map((client) => {
              const state = getDueState(client);
              return (
                <div
                  className={`client-row ${selectedClient.id === client.id ? "selected" : ""}`}
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  role="row"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelectedClientId(client.id);
                  }}
                >
                  <span>
                    <strong>{client.name}</strong>
                    <small>{client.contact}</small>
                  </span>
                  <span>{formatCurrency(client.balance)}</span>
                  <span>{formatDate(client.nextDueDate)}</span>
                  <span className={`status-pill ${state}`}>{stateLabels[state]}</span>
                  <span className="row-actions">
                    <button
                      type="button"
                      title="Ödendi işaretle"
                      onClick={(event) => {
                        event.stopPropagation();
                        onMarkPaid(client.id);
                      }}
                    >
                      <CheckCircle2 />
                    </button>
                    <button
                      type="button"
                      title="Hatırlatma taslağı"
                      onClick={(event) => {
                        event.stopPropagation();
                        onCreateReminder(client);
                      }}
                    >
                      <Bell />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="panel detail-panel">
          <span className={`status-pill ${dueState}`}>{stateLabels[dueState]}</span>
          <h2>{selectedClient.name}</h2>
          <p>{selectedClient.sector} · {selectedClient.taxNo}</p>
          <dl className="detail-list">
            <div>
              <dt>Yetkili</dt>
              <dd>{selectedClient.contact}</dd>
            </div>
            <div>
              <dt>E-posta</dt>
              <dd>{selectedClient.email}</dd>
            </div>
            <div>
              <dt>Aylık aidat</dt>
              <dd>{formatCurrency(selectedClient.monthlyDue)}</dd>
            </div>
            <div>
              <dt>Portal kodu</dt>
              <dd>{selectedClient.accessCode}</dd>
            </div>
          </dl>

          <div className="panel-divider" />
          <div className="task-list compact">
            {selectedClient.tasks.map((task) => (
              <button
                key={task.id}
                className={`task-row ${task.status}`}
                onClick={() => onTaskToggle(selectedClient.id, task.id)}
              >
                <span>
                  <strong>{task.title}</strong>
                  <small>{formatDate(task.dueDate)}</small>
                </span>
                <em>{taskLabels[task.status]}</em>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="admin-grid lower">
        <div className="panel">
          <div className="panel-heading">
            <span>Ofisten evrak paylaş</span>
            <UploadCloud />
          </div>
          <label className="dropzone">
            <input
              type="file"
              multiple
              onChange={(event) =>
                onUpload(event.currentTarget.files, selectedClient.id, "office", "Ofis evrakı", true)
              }
            />
            <FolderUp />
            <strong>{selectedClient.name} için dosya seç</strong>
            <small>Paylaşılan dosya mükellef portalında görünür.</small>
          </label>
          <DocumentList documents={selectedClient.documents} onToggleShare={onToggleShare} />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <span>Hatırlatma taslağı</span>
            <MessageSquareText />
          </div>
          <textarea
            readOnly
            value={reminderText || "Listeden geciken bir mükellef seçip zil simgesine basın."}
            aria-label="Hatırlatma taslağı"
          />
          <button
            className="secondary-action full"
            onClick={() => navigator.clipboard?.writeText(reminderText)}
            disabled={!reminderText}
          >
            <ClipboardCheck />
            Metni kopyala
          </button>
        </div>

        <form className="panel new-client-form" onSubmit={onAddClient}>
          <div className="panel-heading">
            <span>Yeni mükellef</span>
            <Plus />
          </div>
          <input name="name" placeholder="Firma adı" required />
          <input name="contact" placeholder="Yetkili kişi" />
          <input name="sector" placeholder="Sektör" />
          <input name="email" placeholder="E-posta" type="email" />
          <input name="taxNo" placeholder="Vergi no" />
          <input name="plan" placeholder="Hizmet paketi" />
          <input name="monthlyDue" placeholder="Aylık aidat" type="number" min="0" />
          <button className="primary-action" type="submit">
            <Plus />
            Kaydı aç
          </button>
        </form>
      </section>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "success" | "warning" | "danger" | "info";
}) {
  return (
    <div className={`metric-card ${tone}`}>
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function MarketingStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <article className="marketing-stat">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </article>
  );
}

function ServiceItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="service-item">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function BenchmarkItem({ title, text }: { title: string; text: string }) {
  return (
    <article className="benchmark-item">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function ProcessStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="process-step">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick} type="button">
      {label}
    </button>
  );
}

function DocumentList({
  documents,
  onToggleShare,
}: {
  documents: ClientDocument[];
  onToggleShare: ((clientId: string, documentId: string) => void) | null;
}) {
  if (!documents.length) {
    return <p className="empty-state">Henüz evrak yok.</p>;
  }

  return (
    <div className="document-list">
      {documents.map((doc) => (
        <div className="document-row" key={doc.id}>
          <span className="doc-icon">
            <FileText />
          </span>
          <span>
            <strong>{doc.name}</strong>
            <small>
              {doc.category} · {doc.size} · {formatDate(doc.uploadedAt)}
            </small>
          </span>
          <div className="document-actions">
            {onToggleShare && (
              <button type="button" onClick={() => onToggleShare(doc.clientId, doc.id)}>
                {doc.shared ? "Gizle" : "Paylaş"}
              </button>
            )}
            <a href={doc.dataUrl} download={doc.name} title="İndir">
              <ArrowDownToLine />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default App;

import { ScoutProgram } from '../types/scout';

export const INITIAL_PROGRAMS: ScoutProgram[] = [
  {
    id: 'prog-sifrovaci-orientak',
    title: 'Tajemství starého lesníka: Družinový šifrovací závod',
    summary: 'Napínavý terénní závod družin s orientací pomocí mapy a buzoly, luštěním zašifrovaných zpráv a hledáním indicií v přírodě.',
    description: `### Úvodní motivace
Družiny nachází vzkaz od starého hajného, který před mnoha lety ukryl v revíru cennou zprávu pro další generace ochránců přírody. Každá družina dostane ústřižek mapy a první šifru.

### Průběh programu:
1. **Příprava a zadání (15 min):** Rozdělení mapových výřezů, kontrola buzol, vysvětlení bezpečnostních pravidel v terénu.
2. **Terénní část (60 min):** Družina postupuje po 5 stanovištích. Na každém stanovišti je úkol:
   - Stanoviště 1: Šifra s morseovkou a posunem písmen (Caesarova šifra).
   - Stanoviště 2: Určení azimutu na výrazný orientační bod a odhad vzdálenosti.
   - Stanoviště 3: Poznávačka 6 druhů stromů a bylin v okolí.
   - Stanoviště 4: Společný týmový úkol – přenesení vzkazu přes "bažinu" bez dotyku země.
   - Stanoviště 5: Složení finálního hesla ze získaných indicií.
3. **Závěrečná reflexe u ohně / klubovny (15 min):** Vyhodnocení strategie, diskuse o tom, jak družina dělila role (navigátor, šifrant, stopař).`,
    educationalGoals: 'Rozvoj samostatnosti družiny, posílení schopnosti orientace v terénu bez mobilního telefonu, upevnění týmové komunikace a logického myšlení pod mírným časovým tlakem.',
    materials: 'Výřezy mapy, buzoly, zalaminované šifry na stanovištích, fáborky na značení, stopky, zápisníky a tužky pro každou družinu.',
    durationMinutes: 90,
    minParticipants: 8,
    maxParticipants: 24,
    ageCategories: ['skauti_skautky'],
    scoutMethods: ['druzina', 'priroda', 'uceni_zkusenosti', 'symbolicky_ramec'],
    physicalDemand: 7,
    intellectualDemand: 8,
    creativity: 5,
    teamwork: 9,
    preparationDemand: 7,
    environment: 'outside',
    weather: ['sunny', 'rain'],
    tags: ['Šifry', 'Orientace s buzolou', 'Družinová soudržnost', 'Přírodověda', 'Závod'],
    attachmentUrl: 'https://docs.google.com/document/d/sample-scout-sifrovaci-zavod',
    attachmentName: 'Podrobná metodika a sady šifer v PDF / Google Docs',
    authorId: 'scout_master_jirka',
    authorName: 'Jirka „Javor“ Svoboda',
    authorEmail: 'javor.skaut@gmail.com',
    createdAt: '2026-09-15T14:30:00Z',
    ratingAverage: 4.8,
    ratingCount: 12,
    favoriteCount: 28
  },
  {
    id: 'prog-ostrov-trosecniku',
    title: 'Ostrov trosečníků: Stavba nouzového přístřešku a filtrace vody',
    summary: 'Praktický workshop zálesáckých dovedností. Družiny musí z přírodních materiálů postavit funkční přístřešek na přenocování a sestavit filtrační systém na vodu.',
    description: `### Úvodní motivace
Družina se ocitla v neznámé divočině po fingované nehodě. Do soumraku zbývá omezený čas a hrozí déšť. Úkolem je zajistit sucho a pitnou vodu.

### Průběh aktivity:
1. **Teoretický vstup a ukázka uzlů (20 min):** Vedoucí ukáže vazbu trojnožky, tesák a lodní uzel. Zároveň představí vrstvy improvizované filtrace (uhlí, písek, štěrk, plátno).
2. **Realizace přístřešku (60 min):** Každá družina si zvolí bezpečné místo. Pomocí padákové šňůry, klád a chvojí staví přístřešek minimálně pro celou družinu.
3. **Konstrukce filtru a zkouška těsnosti (30 min):** Z PET lahve družina sestaví filtr a čistí zkalenou vodu. Vedoucí otestuje odolnost přístřešku "bouří" (postříkáním vodou z konve).
4. **Reflexe (10 min):** Zhodnocení stability, bezpečnosti uložení nožů a seker, pocitu bezpečí.`,
    educationalGoals: 'Osvojení praktických tábornických dovedností, bezpečná práce se zálesáckým nářadím, pochopení principů čištění vody v krizových situacích, posílení důvěry ve vlastní schopnosti.',
    materials: 'Paracord / provázky, pracovní rukavice, sekerky, nože, rozříznuté PET lahve, aktivní uhlí, jemný písek, štěrk, filtrační plátno, konev s vodou.',
    durationMinutes: 120,
    minParticipants: 6,
    maxParticipants: 30,
    ageCategories: ['skauti_skautky', 'roveri_rangers'],
    scoutMethods: ['priroda', 'uceni_zkusenosti', 'druzina', 'osobni_rozvoj'],
    physicalDemand: 8,
    intellectualDemand: 6,
    creativity: 7,
    teamwork: 8,
    preparationDemand: 6,
    environment: 'outside',
    weather: ['sunny', 'rain'],
    tags: ['Přežití v přírodě', 'Uzlování', 'Táborový oheň', 'Družinová soudržnost'],
    attachmentUrl: 'https://drive.google.com/sample-trosecnici-materialy',
    attachmentName: 'Návod na filtry a bezpečnostní karta',
    authorId: 'scout_lead_eliska',
    authorName: 'Eliška „Veverka“ Nováková',
    authorEmail: 'eliska.novakova@skaut.cz',
    createdAt: '2026-08-20T10:15:00Z',
    ratingAverage: 4.9,
    ratingCount: 18,
    favoriteCount: 42
  },
  {
    id: 'prog-kouzelna-lucerna-vlcata',
    title: 'Kouzelná lucerna a zvířátka v nouzi: Lesní dobrodružství pro vlčata',
    summary: 'Pohádková hra pro vlčata a světlušky plná pohybu, zkoumání smyslů a pomoci lesním zvířátkům připravit se na příchod zimy.',
    description: `### Příběhový rámec
Moudrá sova přilétá se zprávou, že skřítci v lese poztráceli kouzelné krystaly světla a zvířátka nemohou najít své spižírny na zimu. Světlušky a vlčata se stávají zachránci lesa.

### Průběh:
1. **Zahřívací hra - Zvířecí rodinky (10 min):** Děti dostanou lísteček se zvířátkem a se zavázanýma očima se hledají podle vydávaných zvuků.
2. **Smyslová stezka (25 min):**
   - Hmat: Poznávaní přírodnin v krabici (šiška, mech, žalud, kůra).
   - Čich a chuť: Lesní čaje a bylinky.
   - Sluch: Ptačí zpěv a tiché plížení kolem spícího medvěda (vedoucího).
3. **Stavba domečků pro ježky a broučky (10 min):** Drobné týmy staví z mechu a klacíků bezpečný úkryt u paty stromu.`,
    educationalGoals: 'Rozvíjení empatie k živé přírodě, stimulace smyslového vnímání, spolupráce v šestkách, odvaha a překonání obav ze tmy či neznáma.',
    materials: 'Šátky na oči, krabice s otvory na ruce, přírodniny (mech, kůra, šišky), plyšový nebo loutkový maskot sovy, lampionky.',
    durationMinutes: 45,
    minParticipants: 6,
    maxParticipants: 20,
    ageCategories: ['vlcata_svetlousky'],
    scoutMethods: ['symbolicky_ramec', 'priroda', 'uceni_zkusenosti', 'slib_a_zakon'],
    physicalDemand: 4,
    intellectualDemand: 3,
    creativity: 8,
    teamwork: 6,
    preparationDemand: 4,
    environment: 'both',
    weather: ['sunny', 'rain'],
    tags: ['Přírodověda', 'Kreativní tvoření', 'Zahřívací energizer'],
    attachmentUrl: 'https://docs.google.com/document/d/sample-kouzelna-lucerna',
    attachmentName: 'Pohádkový scénář pro rádce vlčat a světlušek',
    authorId: 'scout_katka',
    authorName: 'Kateřina „Brouček“ Malá',
    authorEmail: 'katka.broucek@skaut.cz',
    createdAt: '2026-09-02T16:00:00Z',
    ratingAverage: 4.7,
    ratingCount: 9,
    favoriteCount: 19
  },
  {
    id: 'prog-komunitni-mise-roveri',
    title: 'Komunitní mise: Roveřská služba v místním útulku a seniorcentru',
    summary: 'Roveřský projekt praktické pomoci v obci podle hesla "Sloužím". Spojuje přípravu, kontakt s komunitou a hlubokou reflexi smyslu skautingu.',
    description: `### Cíl projektu
Skauting nekončí v klubovně. Kmen roveřů a rangers si vybere reálnou potřebu ve své městské části a během půldenního bloku ji aktivně vyřeší.

### Fáze projektu:
1. **Analýza a domluva předem (příprava):** Kontaktování organizace, ujasnění harmonogramu a potřebného nářadí.
2. **Realizace pomoci na místě (120 min):**
   - Úprava zahrady a natření laviček v domově pro seniory / venčení a úklid kotců v psím útulku.
   - Osobní povídání s klienty u čaje a poslech jejich životních příběhů.
3. **Kulatý stůl a reflexe (45 min):** Společné posezení u čaje, sdílení emocí, reflexe osobních předsudků a skautského slibu („být prospěšný své vlasti a lidem kolem sebe“).
4. **Závazek do budoucna (15 min):** Stanovení, zda projekt zopakovat pravidelně.`,
    educationalGoals: 'Naplnění skautského hesla "Sloužím", mezigenerační porozumění, odbourání předsudků, posílení projektového řízení v roverském kmeni.',
    materials: 'Pracovní rukavice, nářadí po domluvě s institucí, drobné dárky nebo pečené buchty na společné setkání, zápisníky na reflexi.',
    durationMinutes: 180,
    minParticipants: 4,
    maxParticipants: 16,
    ageCategories: ['roveri_rangers'],
    scoutMethods: ['zapojeni_spolecnost', 'slib_a_zakon', 'osobni_rozvoj', 'dospeli_pruvodci'],
    physicalDemand: 5,
    intellectualDemand: 6,
    creativity: 5,
    teamwork: 8,
    preparationDemand: 8,
    environment: 'both',
    weather: ['sunny', 'rain'],
    tags: ['Diskuse a etika', 'Komunikace', 'Družinová soudržnost'],
    attachmentUrl: 'https://docs.google.com/document/d/sample-rover-sluzba-metodika',
    attachmentName: 'Metodika roveřských projektů služby Junáka',
    authorId: 'rover_martin',
    authorName: 'Martin „Kormidelník“ Dvořák',
    authorEmail: 'kormidelnik@roveri.cz',
    createdAt: '2026-07-12T11:20:00Z',
    ratingAverage: 5.0,
    ratingCount: 15,
    favoriteCount: 35
  },
  {
    id: 'prog-zlata-horecka-snih',
    title: 'Zlatá horečka na Klondiku: Zimní strategická hra na sněhu',
    summary: 'Rychlá a dynamická zimní hra na sněhu pro oddíl. Družiny těží "zlato", brání své zlatokopecké kolíky a obchodují s proviantem.',
    description: `### Úvodní legenda
Píše se rok 1897. V údolí řeky Klondike bylo nalezeno zlato. Do mrazivého Dawson City přichází družiny prospektorů, kteří musí přežít krutou zimu a vytěžit nejvíce nuggetů.

### Pravidla a mechanika:
1. **Okolní terén a základny (15 min):** Každá družina si postaví na sněhu opevnění (sněhovou zídku) a vztyčí svoji vlaječku.
2. **Těžba a souboje o claims (45 min):**
   - V centrální "zlatonosné řece" jsou ukryty žluté míčky (nuggety).
   - Družiníci smí nosit pouze jeden nugget naráz.
   - Souboje probíhají formou strhávání fáborku za pasem (život) nebo předem domluvenou sněhovou koulí pod pas.
   - Zmrzlí hráči se vrací rozmrazit k ohni na 2 minuty.
3. **Závěrečný summit a vyhlášení nejúspěšnějšího zlatokopa (15 min):** Vážení zlata, poděkování a zahřátí horkým čajem z várnice.`,
    educationalGoals: 'Strategické plánování v týmu, pohyb na čerstvém zimním vzduchu, zvládnutí pobytu v mrazu s úsměvem, fair-play při sportovním zápolení.',
    materials: 'Žluté tenisáky nebo plastové míčky (zlato), barevné stuhy na životy, termosky s horkým čajem, lopaty na sníh, lékárnička.',
    durationMinutes: 75,
    minParticipants: 10,
    maxParticipants: 35,
    ageCategories: ['vlcata_svetlousky', 'skauti_skautky'],
    scoutMethods: ['symbolicky_ramec', 'druzina', 'priroda', 'uceni_zkusenosti'],
    physicalDemand: 9,
    intellectualDemand: 5,
    creativity: 6,
    teamwork: 8,
    preparationDemand: 5,
    environment: 'outside',
    weather: ['snow'],
    tags: ['Závod', 'Strategie', 'Družinová soudržnost', 'Noční hra'],
    attachmentUrl: 'https://docs.google.com/document/d/sample-klondike-pravidla',
    attachmentName: 'Herní karty claims a certifikáty zlatokopů',
    authorId: 'scout_ondra',
    authorName: 'Ondřej „Rys“ Horák',
    authorEmail: 'rys.horak@skaut.cz',
    createdAt: '2026-01-18T15:45:00Z',
    ratingAverage: 4.8,
    ratingCount: 14,
    favoriteCount: 31
  },
  {
    id: 'prog-vodni-pevnost-leto',
    title: 'Bitva o vodní tvrz: Taktická osvěžující hra do letního horka',
    summary: 'Ideální táborový program do parného letního dne. Družiny staví z plachet a větví vodní obléhací stanoviště a chrání své posvátné totemy.',
    description: `### Rámec hry
Za horkého letního odpoledne se u rybníka či potoka utkají kmeny v boji o záchranu vysychající oázy. Hra je navržena tak, aby se všichni ochladili, ale zároveň museli taktizovat.

### Průběh:
1. **Příprava vodní munice a staveb (20 min):** Plnění houbiček vodou, stavba lehkých přístřešků na břehu, příprava vodních děl (stříkačky ze dřeva či plastu).
2. **Taktická fáze hry (30 min):**
   - Úkolem je přenést posvátnou vodu v děravých kelímcích do centrální nádoby svého kmene.
   - Soupeři smí bránit pouze vodní municí (mokré molitanové houby). Zásah znamená návrat na start.
3. **Vodní turnaj družin a úklid (10 min):** Rychlá reflexe a důkladný sběr všech zbytků pomůcek z louky a břehu.`,
    educationalGoals: 'Bezpečné chování u vody, radost z pohybu a osvěžení v horku, týmová koordinace a fair-play respektování vodních zásahů.',
    materials: 'Molitanové houbičky na nádobí (bez plastového odpadu), kbelíky, plachty, kelímky s drobnou dírkou, stopky.',
    durationMinutes: 60,
    minParticipants: 8,
    maxParticipants: 30,
    ageCategories: ['vlcata_svetlousky', 'skauti_skautky'],
    scoutMethods: ['druzina', 'priroda', 'uceni_zkusenosti'],
    physicalDemand: 8,
    intellectualDemand: 4,
    creativity: 6,
    teamwork: 8,
    preparationDemand: 4,
    environment: 'outside',
    weather: ['heat', 'sunny'],
    tags: ['Voda a koupání', 'Strategie', 'Závod', 'Zahřívací energizer'],
    attachmentName: 'Schéma herního pole a bezpečnost u vody',
    authorId: 'scout_lead_eliska',
    authorName: 'Eliška „Veverka“ Nováková',
    authorEmail: 'eliska.novakova@skaut.cz',
    createdAt: '2026-07-05T13:00:00Z',
    ratingAverage: 4.9,
    ratingCount: 11,
    favoriteCount: 22
  },
  {
    id: 'prog-eticka-kavarna-moralka',
    title: 'Kavárna na kraji vesmíru: Etická dilemata a skautský zákon',
    summary: 'Klubovnový diskusní program pro starší skauty, rovery i oldskauty. Řešení modelových morálních situací v bezpečném prostředí se svíčkami a čajem.',
    description: `### Úvodní atmosféra
Klubovna je upravena do podoby tiché kavárny s tlumeným světlem, svíčkami a příjemnou hudbou. Účastníci sedí v malých skupinkách u stolků.

### Průběh:
1. **Kavárenský lístek dilemat (15 min):** Každý stolek si "objedná" jedno morální dilema ze skautského a každodenního života (např. loajalita k partě vs. pravdomluvnost; ochrana přírody vs. ekonomický tlak rodiny; kyberšikana na oddílovém chatu).
2. **Kulaté stoly (30 min):** Každých 10 minut jeden zástupce stolu rotuje a přináší nové argumenty. Hledají se souvislosti se skautským zákonem („Skaut je pravdomluvný...“, „Skaut je přítelem všech lidí dobré vůle...“).
3. **Syntéza a tichá osobní reflexe (15 min):** Každý si zapíše do svého deníku jedno osobní předsevzetí do následujícího měsíce.`,
    educationalGoals: 'Prohloubení chápání skautského zákona nikoli jako dogmatu, ale jako živého morálního kompasu; schopnost kultivovaně argumentovat a naslouchat odlišnému názoru.',
    materials: 'Svíčky, čaj a sušenky, kartičky s popisem etických dilemat, hudební podkres, deníky pro účastníky.',
    durationMinutes: 60,
    minParticipants: 6,
    maxParticipants: 18,
    ageCategories: ['roveri_rangers', 'oldskauti'],
    scoutMethods: ['slib_a_zakon', 'osobni_rozvoj', 'dospeli_pruvodci'],
    physicalDemand: 1,
    intellectualDemand: 9,
    creativity: 6,
    teamwork: 7,
    preparationDemand: 4,
    environment: 'inside',
    weather: ['rain', 'snow', 'sunny'],
    tags: ['Diskuse a etika', 'Reflexe', 'Komunikace'],
    attachmentUrl: 'https://docs.google.com/document/d/sample-eticka-dilemata-kavarna',
    attachmentName: 'Sada 15 modelových situací a metodických otázek pro moderátora',
    authorId: 'scout_martin_old',
    authorName: 'Ing. Tomáš „Sojka“ Vrána',
    authorEmail: 'sojka.vrana@skaut.cz',
    createdAt: '2026-03-10T18:00:00Z',
    ratingAverage: 4.9,
    ratingCount: 16,
    favoriteCount: 39
  },
  {
    id: 'prog-nocni-hvezdna-hlidka',
    title: 'Ztracená hlídka: Noční orientace podle hvězd a zvuků lesa',
    summary: 'Atmosférická noční výprava se zkouškou odvahy, pozorováním souhvězdí a tichým postupem lesem za svitu měsíce.',
    description: `### Motivace
V dávných dobách se mořeplavci i poutníci řídili pouze oblohou. Dnešní noc patří tichu, hvězdám a důvěře ve vlastní smysly.

### Průběh:
1. **Příprava za šera (20 min):** Seznámení s mapou noční oblohy (Polárka, Velký vůz, Kasiopeja, Orion), adaptace očí na tmu (zákaz bílého světla, pouze červené LED).
2. **Noční stopovačka (50 min):** Dvojice vyráží s odstupem po trase značené odrazkami či chemickým světlem. Cestou plní úkoly:
   - Určení severu podle Polárky.
   - 5 minut naprostého ticha a zápis zvuků nočního lesa.
   - Přenášení křehkého světélka (čajové svíčky ve sklenici) bez zhasnutí.
3. **Společné sdílení u ohně s horkým čajem (35 min):** Vyprávění mytologických příběhů souhvězdí, překonání strachu ze tmy.`,
    educationalGoals: 'Překonání strachu ze tmy a neznáma, osvojení základů astronomické orientace, citlivost k nočnímu životu v přírodě, vnitřní zklidnění.',
    materials: 'Otočná mapa hvězdné oblohy, červené fólie na baterky, odrazky na stromech, zavařovací sklenice se svíčkami, termosky.',
    durationMinutes: 105,
    minParticipants: 4,
    maxParticipants: 16,
    ageCategories: ['skauti_skautky', 'roveri_rangers'],
    scoutMethods: ['priroda', 'osobni_rozvoj', 'symbolicky_ramec', 'uceni_zkusenosti'],
    physicalDemand: 6,
    intellectualDemand: 7,
    creativity: 6,
    teamwork: 7,
    preparationDemand: 7,
    environment: 'outside',
    weather: ['sunny'],
    tags: ['Noční hra', 'Orientace s buzolou', 'Přežití v přírodě', 'Reflexe'],
    attachmentName: 'Hvězdná mapa a návod na výrobu bezpečné svítilny',
    authorId: 'scout_master_jirka',
    authorName: 'Jirka „Javor“ Svoboda',
    authorEmail: 'javor.skaut@gmail.com',
    createdAt: '2026-06-25T22:00:00Z',
    ratingAverage: 5.0,
    ratingCount: 21,
    favoriteCount: 47
  }
];

export const INITIAL_REVIEWS_RECORD: Record<string, Array<{
  id: string;
  programId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}>> = {
  'prog-sifrovaci-orientak': [
    {
      id: 'rev-1',
      programId: 'prog-sifrovaci-orientak',
      userId: 'user-misa',
      userName: 'Míša (středisko Blaník)',
      rating: 5,
      comment: 'Vyzkoušeli jsme na podzimní výpravě s oddílem skautek. Druhé stanoviště s azimutem bylo super, doporučuji dát šifry do nepromokavých zip sáčků, když mrholí!',
      createdAt: '2026-09-20T19:30:00Z'
    },
    {
      id: 'rev-2',
      programId: 'prog-sifrovaci-orientak',
      userId: 'user-petr',
      userName: 'Petr „Kukačka“',
      rating: 5,
      comment: 'Parádní příprava, šetří spoustu času. Děti nejvíc bavilo to bažinové stanoviště.',
      createdAt: '2026-09-28T14:10:00Z'
    }
  ],
  'prog-ostrov-trosecniku': [
    {
      id: 'rev-3',
      programId: 'prog-ostrov-trosecniku',
      userId: 'user-filip',
      userName: 'Filip „Bobr“',
      rating: 5,
      comment: 'Filtrace vody byla pecka. Družiny si to vyzkoušely naostro a přístřešek vydržel i noční přeháňku.',
      createdAt: '2026-08-25T08:15:00Z'
    }
  ],
  'prog-kouzelna-lucerna-vlcata': [
    {
      id: 'rev-4',
      programId: 'prog-kouzelna-lucerna-vlcata',
      userId: 'user-lenka',
      userName: 'Lenka – vedoucí světlušek',
      rating: 5,
      comment: 'Naše světlušky byly nadšené! Hlavně domečky z mechu pro broučky stavěly ještě hodinu po skončení.',
      createdAt: '2026-09-10T17:40:00Z'
    }
  ]
};

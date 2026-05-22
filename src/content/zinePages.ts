import type { ZinePageDef, ZineSpreadDef } from './types';

/**
 * The whole zine, as data.
 *
 * Plain string lines auto-parse **bold** and *italic* markdown. For colour
 * highlights, use Run arrays (rarely needed in v4 — the prose carries the
 * weight). Boxes are collapsible on web, always expanded in print/PDF.
 */

// ---------- COVER ----------

const coverPage: ZinePageDef = {
  id: 'cover',
  alone: true,
  bg: '#0a0a0a',
  blocks: [{ kind: 'cover' }],
};

// ---------- SPREAD 1 — PANOPTICON / INTRO ----------

const panopticonPage: ZinePageDef = {
  id: 'panopticon',
  vCenter: true,
  blocks: [
    { kind: 'h', lines: ['The Panopticon'] },
    {
      kind: 'p',
      lines: [
        'In 1791, the philosopher Jeremy Bentham drew up a design for the perfect prison: a ring of cells around a single watchtower. From the tower, a guard can see into every cell, but no prisoner can see into the tower. They never know *when* they are being watched — only that they always *might* be.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Two centuries later, Michel Foucault saw what that design really does. After a while, the guard becomes unnecessary. Never sure whether anyone is looking, the prisoners begin to act as if someone always is. They watch themselves. Power stops being something done to them and becomes something they do to themselves.',
      ],
    },
  ],
};

const introPage: ZinePageDef = {
  id: 'intro',
  blocks: [
    { kind: 'h', lines: ['"I have nothing to hide."'] },
    {
      kind: 'p',
      lines: [
        'The sentence sounds harmless, and it usually ends the conversation. But it hides an assumption: that surveillance only matters if you have done something wrong. That is exactly the tower\'s logic — and it has never been true.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Being watched has never depended on guilt. It depends on who you are. The same data trail is harmless for one person and dangerous for another: for someone seeking an abortion where it is banned, for someone leaving a violent partner, for someone without the right papers, for someone who organizes against power. Surveillance follows the lines a society has already drawn — around gender, race, class, and status — and deepens them.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'So the useful question is not whether you have something to hide. It is who is made visible, to whom, and at what cost.',
      ],
    },
  ],
};

// ---------- SPREAD 2 — CASE 1 · THE BODY ----------

const case1Left: ZinePageDef = {
  id: 'case01-left',
  blocks: [
    { kind: 'tag', variant: 'warm', text: 'CASE 01 · THE BODY', rec: true },
    { kind: 'h', lines: ['Her period tracker became evidence.'] },
    {
      kind: 'p',
      lines: [
        'In 2022, in Nebraska, a teenager was prosecuted for ending a pregnancy. Part of the case against her was a handful of Facebook messages she had sent her own mother. The same year, in the UK, a fifteen-year-old who lost a pregnancy was made to hand over her search history and texts so police could decide whether she had broken the law.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Tracking your cycle can feel like an act of care — the app remembers what you would rather not have to, learns your rhythm, offers a quiet sense of authority over your own body. There is nothing naïve about wanting that. What is easy to miss is that the data does not stay with you. Most cycle apps keep everything on a company\'s servers: a record, in a place you will never see, of when you had sex, when a period was late, when a pregnancy began or ended. Information you wrote down as self-knowledge becomes something held *about* you — and, when the law turns, used *against* you.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'This is not new. Feminist scholars like Rachel Dubrofsky and Shoshana Magnet have shown that the female body, the queer body, the racialized body have always been watched more closely than others. Controlling reproduction is one of the oldest forms of surveillance there is. What has changed is only the instrument: now it is an app.',
      ],
    },
    {
      kind: 'source',
      text: 'Privacy International, *All Eyes on my Period* (2023); Mozilla, *Privacy Not Included* (2022).',
    },
  ],
};

const case1Right: ZinePageDef = {
  id: 'case01-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 1 · FIVE MINUTES · [▓░░░]' },
    { kind: 'h', lines: ['Give away less, starting today.'] },
    {
      kind: 'p',
      lines: [
        'None of this asks you to change how you live. These are the smallest possible steps, and each one quietly starves the machine that profiles you.',
      ],
    },
    {
      kind: 'step',
      lead: 'Choose an app that keeps data on your phone.',
      body: [
        'Some cycle apps store everything locally, never on a company\'s server — *Euki* is one privacy researchers recommend. What never leaves your phone cannot be demanded from a server later.',
      ],
    },
    {
      kind: 'step',
      lead: 'Block the trackers in your browser.',
      body: [
        '*uBlock Origin* (free, open source) stops the invisible scripts that record what you read and search, including health questions. It is not about hiding ads; it is about the profile being built behind the page.',
      ],
    },
    {
      kind: 'step',
      lead: 'Change your search engine.',
      body: [
        '*DuckDuckGo* does not keep a history of what you look up. For anything to do with your body, that difference matters.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'None of this makes you invisible — but it sharply cuts how much is gathered about you, and from how many directions at once.',
      ],
    },
    {
      kind: 'box',
      title: 'Swiss law cuts both ways',
      blocks: [
        {
          kind: 'p',
          lines: [
            'Switzerland is often sold as a privacy haven. The truth is more interesting: it protects you from *foreign* watching while doing fairly little about companies that gather your data here.',
          ],
        },
        {
          kind: 'p',
          lines: [
            '**The weak side.** Since September 2023, the revised data law (revDSG) lets you ask a company what it holds on you and demand deletion. But where the EU fines a *company* up to €20 million, Switzerland fines a responsible *person* up to 250,000 CHF — pocket change for a tech giant — and lets firms process your data by default, leaving you to object after the fact. A company that harvests your data here has little to fear. That gap is not an oversight; it is a political choice. *That* is state harm: not what the state does, but what it allows.',
          ],
        },
        {
          kind: 'p',
          lines: [
            '**The strong side.** What protects your data is not where the server sits but which country\'s law the *company* answers to. A US company must hand data to US authorities under the *CLOUD Act* even if the server is in Zurich. A genuinely Swiss company is outside that reach — Switzerland sits outside the EU, the US, and the "Fourteen Eyes" intelligence-sharing pact, and its prosecutors must eventually *tell* the person they watched. This is why services like *Proton* host here, and why the Swiss government itself has warned public offices away from US cloud providers.',
          ],
        },
        {
          kind: 'p',
          lines: [
            '**The catch.** No paradise: Switzerland runs its own mass data retention (Case 4), and in 2025 Proton began moving servers abroad to stay ahead of a proposed new surveillance law. Shielded from the foreign state, exposed to the home one — both at once.',
          ],
        },
      ],
    },
  ],
};

// ---------- SPREAD 3 — CASE 2 · THE PARTNER ----------

const case2Left: ZinePageDef = {
  id: 'case02-left',
  blocks: [
    { kind: 'tag', variant: 'warm', text: 'CASE 02 · THE PARTNER', rec: true },
    { kind: 'h', lines: ['The watcher in the house.'] },
    {
      kind: 'p',
      lines: [
        'Not everyone who tracks you is a company or a government. Sometimes it is the person who knows your passwords, sleeps beside you, and has reason to want to know where you are.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'There is a category of apps built for exactly this. They are sold as "child safety" or "employee monitoring," but what they do is let one person secretly read another\'s messages, hear through their microphone, and follow their location in real time. The software hides itself — no icon, nothing in the app list — so the person being watched often realizes only when their partner knows something they could not otherwise know. Researchers and shelters call this *stalkerware*, and in one survey three out of four domestic-violence shelters reported clients who had been tracked this way. The targets are overwhelmingly women.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Surveillance inside a relationship is not really a technical problem; it is an old one wearing new tools. The demand to know *where were you, who were you with* becomes an app running silently in a pocket. It is the logic of control that feminists have named for decades — coercion that does not need to raise a hand, only to watch.',
      ],
    },
    {
      kind: 'safety',
      lines: [
        'If you think you are being monitored, do not search for help on the device itself — the person watching may see it. Use another device, and reach a support service.',
      ],
    },
    {
      kind: 'source',
      text: 'Coalition Against Stalkerware; NPR (2014); Kaspersky (2023).',
    },
  ],
};

const case2Right: ZinePageDef = {
  id: 'case02-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 2 · ONE AFTERNOON · [▓▓░░]' },
    { kind: 'h', lines: ['Take the device back.'] },
    {
      kind: 'p',
      lines: [
        'A phone should answer to you and no one else. These steps put distance between you and anyone reading along — whether that is a company or a person in your own home.',
      ],
    },
    {
      kind: 'step',
      lead: 'Check what your apps can reach.',
      body: [
        'In settings, look at which apps have your location, microphone, and camera. Most do not need them; switch those off. An app you do not remember installing is a warning worth taking seriously.',
      ],
    },
    {
      kind: 'step',
      lead: 'Lock the way in.',
      body: [
        'Use a long passcode rather than a four-digit PIN, known to you alone. On shared Apple or Google accounts, set your own password and turn on two-factor login.',
      ],
    },
    {
      kind: 'step',
      lead: 'Prefer software you can actually inspect.',
      body: [
        'Programs whose code is open can be checked by anyone (see box). For messages, *Signal* is both encrypted end to end and open to inspection.',
      ],
    },
    {
      kind: 'step',
      lead: 'If you suspect stalkerware, get help from outside.',
      body: [
        'Removing it can alert the person who installed it, so it is safer to plan that step with a support service than to do it alone.',
      ],
    },
    {
      kind: 'box',
      title: 'What "open source" means, and why it is safer',
      blocks: [
        {
          kind: 'p',
          lines: [
            'Most software is a sealed box. You see what it does on the surface, never how it works underneath, and never what it might be doing quietly on the side. You are simply asked to trust the company.',
          ],
        },
        {
          kind: 'p',
          lines: [
            '*Open-source* software publishes its blueprint — the source code — for anyone to read. Thousands of independent people do read it, which means a hidden backdoor is far likelier to be noticed and named. It is the difference between a lock whose mechanism is a trade secret and one whose design has been laid open and tested by experts worldwide.',
          ],
        },
        {
          kind: 'p',
          lines: [
            'It exists at every level: apps like *Signal*, *uBlock Origin*, and the password managers *Bitwarden* and *KeePassXC*; the *Firefox* browser; and whole operating systems — *Linux Mint* in place of Windows or macOS, or *GrapheneOS*, a stripped-down Android without Google, on a phone. Open does not automatically mean safe. It means checkable — and checkability is what trust should rest on.',
          ],
        },
      ],
    },
  ],
};

// ---------- SPREAD 4 — CASE 3 · THE STATE ----------

const case3Left: ZinePageDef = {
  id: 'case03-left',
  blocks: [
    { kind: 'tag', variant: 'warm', text: 'CASE 03 · THE STATE', rec: true },
    { kind: 'h', lines: ['What it cannot seize, it buys.'] },
    {
      kind: 'p',
      lines: [
        'The data from the first two cases — locations, profiles, the exhaust of everyday apps — does not stay with the companies that collect it. It is sold on to *data brokers*, firms whose entire business is buying and reselling personal information. And brokers sell to anyone who pays, including governments.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'This is the loophole. A constitution may forbid the state from *seizing* your data without a judge\'s order, but it says nothing about the state simply *buying* the same data on the open market. In the United States, the immigration agency ICE has used exactly this to trace people across whole neighborhoods without ever going before a court: a phone that rests somewhere each night is read as a home, the place it spends each day as a workplace.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'It does not fall on everyone alike. It concentrates on particular communities — migrants, and people of color above all. The scholar Simone Browne calls this *racializing surveillance*: watching that sorts people by race and fixes who is judged to belong and who is treated as out of place. Browne traces an unbroken line from the branding of enslaved people and the lantern laws that forced Black people to carry a light after dark, through to today\'s biometric scans. The technology keeps changing; the logic of who gets watched does not.',
      ],
    },
    {
      kind: 'source',
      text: 'Simone Browne, *Dark Matters* (2015); reporting by 404 Media, Wired, AP.',
    },
  ],
};

const case3Right: ZinePageDef = {
  id: 'case03-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 3 · A FEW WEEKENDS · [▓▓▓░]' },
    { kind: 'h', lines: ['Leave fewer traces.'] },
    {
      kind: 'p',
      lines: [
        'This level is about producing less of the data that brokers and agencies feed on. It takes a little more effort, but it can be done one piece at a time.',
      ],
    },
    {
      kind: 'step',
      lead: 'Turn off your location history.',
      body: [
        'Switch off the Timeline in Google Maps, then go into your phone\'s settings and check which apps can reach your location at all — many keep tracking in the background, long after you have closed them.',
      ],
    },
    {
      kind: 'step',
      lead: 'Use a VPN.',
      body: [
        'It hides your IP address, and with it part of your location. Choose a trustworthy paid provider rather than a free one, since free VPNs often earn their money by selling the very data they promise to protect. (Case 4\'s box explains what a VPN does and does not do.)',
      ],
    },
    {
      kind: 'step',
      lead: 'Leave Google gradually.',
      body: [
        'Move your email to a privacy-minded provider such as *Proton Mail*, your maps to an *OpenStreetMap*-based app — one service at a time, not all at once.',
      ],
    },
    {
      kind: 'step',
      lead: 'Keep your identities apart.',
      body: [
        'When a single email address is the key to everything, one leak opens your whole life. Keep separate addresses for officialdom, for shopping, for friends; an alias service like *SimpleLogin* makes that practical, and a password manager makes it survivable.',
      ],
    },
    {
      kind: 'box',
      title: 'Self-hosting: keeping your data with you',
      blocks: [
        {
          kind: 'p',
          lines: [
            'A "free" cloud service is usually paid for in data. Self-hosting reverses the deal: your files, photos, and notes live on a small server that is yours, at home or with a provider you trust, where no one mines or resells them.',
          ],
        },
        {
          kind: 'p',
          lines: [
            'It is far less daunting than it sounds. The gentle way in is a *Raspberry Pi* — a mini-computer costing around 70 CHF — running *Nextcloud*, open software that replaces Google Drive, Photos, and Calendar on hardware you own. The same little machine can run *Pi-hole*, which blocks trackers and ads for every device in the home at once. And if you would rather not touch hardware at all, trustworthy providers will host Nextcloud for you while the data stays yours.',
          ],
        },
        {
          kind: 'p',
          lines: [
            'Not everyone needs this. But it proves there is an alternative to trading your life for a free account — and the more people choose it, the more ordinary that alternative becomes.',
          ],
        },
      ],
    },
  ],
};

// ---------- SPREAD 5 — CASE 4 · DISSENT ----------

const case4Left: ZinePageDef = {
  id: 'case04-left',
  blocks: [
    { kind: 'tag', variant: 'warm', text: 'CASE 04 · DISSENT', rec: true },
    { kind: 'h', lines: ['Watched for paint on a bike path.'] },
    {
      kind: 'p',
      lines: [
        'In 2023, a climate activist in Geneva sprayed paint on a cycle path. It triggered a surveillance operation far larger than the act — and he only learned of it two years later. Since then he has changed how he lives: at meetings he leaves his phone and laptop in a locker. *You never know*, he says.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'That sentence is the whole mechanism. Surveillance does not have to catch you to work on you. It is enough to know that it could be there, and you begin to edit yourself — to skip the meeting, soften the post, stay home. This is the *chilling effect*, and it falls hardest on the people a democracy most needs: the ones willing to disagree. Switzerland knows the pattern well. When it came out in 1989 that the state had kept secret files on hundreds of thousands of people — trade unionists, peace and anti-nuclear campaigners, the women\'s movement, anyone deemed "nonconformist" — it set off the largest protest in the country\'s postwar history.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'But Browne names the other half of the story too: *dark sousveillance*, watching from below. Slipping out of sight, turning the powerful\'s own tools back on them, keeping each other safe — from the networks that helped enslaved people escape to the phone that films a police stop. Refusing to be seen on someone else\'s terms is itself a long political practice.',
      ],
    },
    {
      kind: 'source',
      text: 'Swiss *Fichenaffäre* inquiry (1989); Blick on the Geneva case (2025); Browne (2015).',
    },
  ],
};

const case4Right: ZinePageDef = {
  id: 'case04-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 4 · WHEN THE STAKES ARE HIGH · [▓▓▓▓]' },
    { kind: 'h', lines: ['Protect yourself, and the people beside you.'] },
    {
      kind: 'p',
      lines: [
        'Most days, most people will not need this level. But anyone who organizes, demonstrates, or investigates should know it — and the first thing to know is that here, safety is never something you achieve alone.',
      ],
    },
    {
      kind: 'step',
      lead: 'Keep your messages encrypted.',
      body: [
        'Use *Signal* for messages and calls, with disappearing messages switched on. In a group, the protection is only as strong as its least careful member, so it has to be everyone or it barely counts.',
      ],
    },
    {
      kind: 'step',
      lead: 'Prepare a device before an action.',
      body: [
        'Carry as little sensitive data as possible. Lock it with a passcode rather than your face or fingerprint, which can be compelled from you more easily and are less protected in law. When in doubt, bring a cheap second phone with nothing on it.',
      ],
    },
    {
      kind: 'step',
      lead: 'Install updates the moment they arrive.',
      body: [
        'They close the very gaps that spy software relies on; it is the plainest and most effective defense there is.',
      ],
    },
    {
      kind: 'step',
      lead: 'Turn visibility around.',
      body: [
        'Browne\'s *dark sousveillance* also means documenting — filming abuses, sharing what happened, warning each other. Knowledge passed between people protects the whole group.',
      ],
    },
    {
      kind: 'box',
      title: 'VPN and encryption, in plain words',
      blocks: [
        {
          kind: 'p',
          lines: [
            'Two words turn up constantly. Here is what they actually mean.',
          ],
        },
        {
          kind: 'p',
          lines: [
            '*Encryption* scrambles a message so that only its intended reader can unscramble it — a sealed, opaque envelope instead of a postcard. When it is *end-to-end* (as in Signal), not even the company carrying the message can read it; only you and the person you write to can. It is the single most important protection there is, and it guards the *content* of what you say.',
          ],
        },
        {
          kind: 'p',
          lines: [
            'A *VPN* (virtual private network) sends your internet traffic through an encrypted tunnel to the provider\'s server before it reaches the wider web. Your internet provider can no longer see which sites you visit, and the sites see the VPN\'s address instead of yours, hiding part of where you are. What it does *not* do is make you anonymous or protect what you type into a site — and it moves your trust from your internet provider to the VPN company, which is why a trustworthy, paid, no-logs provider matters. In short: encryption hides *what you say*; a VPN hides *where you are*. Serious situations want both.',
          ],
        },
      ],
    },
  ],
};

// ---------- SPREAD 6 — OUTRO / ESCAPE ----------

const outroPage: ZinePageDef = {
  id: 'outro',
  vCenter: true,
  blocks: [
    { kind: 'h', lines: ['No one becomes invisible.', 'That was never the goal.'] },
    {
      kind: 'p',
      lines: [
        'Every step takes something back from the machine, and the more people take even the small ones, the more expensive and unreliable mass surveillance becomes for everyone. Perfection is not the measure. Beginning at Level 1 already changes the arithmetic.',
      ],
    },
    {
      kind: 'p',
      tone: 'dim',
      lines: ['Three things worth carrying out of here:'],
    },
    {
      kind: 'p',
      lines: [
        '**It is not yours to fix alone.** "Just change your settings" quietly moves the burden onto individuals. The real remedy is political — laws that forbid the data trade, not fines a corporation pays out of petty cash.',
      ],
    },
    {
      kind: 'p',
      lines: [
        '**Privacy is something you give to others.** Block a tracker, use Signal, keep your identities apart, and you protect everyone you are in contact with, not only yourself. It is an act of solidarity before it is an act of self-defense.',
      ],
    },
    {
      kind: 'p',
      lines: [
        '**The deepest harm is the looking away.** Surveillance never lands on everyone equally; it follows the lines already cut by gender, race, class, and status. A missing protection is not neutral. It is a decision — and decisions can be contested.',
      ],
    },
  ],
};

const escapePage: ZinePageDef = {
  id: 'escape',
  blocks: [
    { kind: 'h', lines: ['Escaping the Panopticon'] },
    {
      kind: 'p',
      lines: [
        'The tower\'s power was never the guard. It was the not-knowing — the way uncertainty made each prisoner stand watch over themselves.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'That is why none of this is only about software. Every tracker blocked, every message sealed, every refusal of the default does two things at once: it hides you from the tower, and it refuses the job of being your own guard. No one tears the tower down by themselves. But you do not have to perform for it either — and when enough people step out of the light at the same moment, the tower has nothing left to watch.',
      ],
    },
    {
      kind: 'cta',
      lines: ['Start at Level 1. Today.'],
    },
  ],
};

const referencesList = [
  '404 Media. (n.d.). Investigations on ICE, Palantir systems, and data-broker loopholes. https://www.404media.co/',
  'Amnesty International Switzerland. (n.d.). Materials on data retention and BUEPF. https://www.amnesty.ch/',
  'Associated Press. (2025). Reporting on data-sharing between CMS and DHS/ICE.',
  'Blick. (2025, February 19). Reporting on covert surveillance of climate activists in Geneva. https://www.blick.ch/politik/',
  'Browne, Simone. (2015). *Dark matters: On the surveillance of blackness*. Duke University Press.',
  'Coalition Against Stalkerware. (n.d.). *Information for media*. https://stopstalkerware.org/information-for-media/',
  'Dubrofsky, Rachel E., & Magnet, Shoshana Amielle (Eds.). (2015). *Feminist surveillance studies*. Duke University Press.',
  'Electronic Frontier Foundation. (n.d.). *Surveillance self-defense*. https://ssd.eff.org/',
  'Federal Data Protection and Information Commissioner (FDPIC). (n.d.). *The revised Federal Act on Data Protection (revFADP)*. https://www.edoeb.admin.ch/',
  'Foucault, Michel. (1977). *Discipline and punish: The birth of the prison* (Alan Sheridan, Trans.). Vintage Books. (Original work published 1975).',
  'grundrechte.ch. (n.d.). *From the fiche scandal to modern intelligence systems*. https://grundrechte.ch/',
  'Haraway, Donna J. (1988). Situated knowledges: The science question in feminism and the privilege of partial perspective. *Feminist Studies, 14*(3), 575-599. https://doi.org/10.2307/3178066',
  'Mozilla Foundation. (2022). *Privacy not included: Reproductive health apps and wearables*. https://foundation.mozilla.org/en/privacynotincluded/',
  'Privacy International. (2023). *All eyes on my period: Period tracking apps and the future of privacy in a post-Roe world*. https://privacyinternational.org/long-read/5593/all-eyes-my-period-period-tracking-apps-and-future-privacy-post-roe-world',
  'Proton AG. (2023, April 21). *Why Proton won\'t comply with US anti-abortion data requests*. https://proton.me/blog/data-privacy-abortion',
  'Proton AG. (n.d.). *Why is Proton based in Switzerland?* https://proton.me/blog/switzerland',
  'required AG. (2024). *revFADP - New Swiss data protection law since September 1, 2023*. https://required.com/de/blog/revdsg-datenschutzgesetz/',
  'Smith, Andrea. (2015). Not-seeing: State surveillance, settler colonialism, and gender violence. In Rachel E. Dubrofsky & Shoshana Amielle Magnet (Eds.), *Feminist surveillance studies* (pp. 21-38). Duke University Press.',
  'Swiss Confederation. (2023). *Federal Act on Data Protection (FADP)* (Status as of September 1, 2023). Fedlex. https://www.fedlex.admin.ch/',
  'Swiss Confederation. (n.d.). *Federal Act on the Surveillance of Post and Telecommunications (BUEPF)*. Fedlex. https://www.fedlex.admin.ch/',
  'Zuboff, Shoshana. (2019). *The age of surveillance capitalism: The fight for a human future at the new frontier of power*. PublicAffairs.',
];

// ---------- BACK ----------

const backPage: ZinePageDef = {
  id: 'back',
  blocks: [
    {
      kind: 'p',
      tone: 'dim',
      lines: [
        'This page itself does not track you. Once you open external links, the destination sites apply their own policies and tracking may happen there.',
      ],
    },
    { kind: 'toolkit' },
    {
      kind: 'box',
      title: 'References',
      blocks: referencesList.map((entry) => ({ kind: 'p', lines: [entry] })),
    },
  ],
};

// ---------- ASSEMBLY ----------

export const zineSpreads: ZineSpreadDef[] = [
  { id: 'cover', layout: 'single', left: coverPage },
  { id: 'spread-1', left: panopticonPage, right: introPage },
  { id: 'case-01', left: case1Left, right: case1Right },
  { id: 'case-02', left: case2Left, right: case2Right },
  { id: 'case-03', left: case3Left, right: case3Right },
  { id: 'case-04', left: case4Left, right: case4Right },
  { id: 'spread-6', left: outroPage, right: escapePage },
  { id: 'back', layout: 'single', left: backPage },
];

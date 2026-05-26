import type { Run, Tone, ZinePageDef, ZineSpreadDef } from './types';

/**
 * The whole zine, as data.
 *
 * Plain string lines auto-parse **bold** and *italic* markdown, plus an
 * automatic keyword colouriser for body prose. For *deliberate* highlights
 * — especially in titles — use the Run helpers below. They bypass the
 * auto-colouriser and stake out the dramatic, content-specific accents.
 *
 *   hl()      → red box behind the word (use on the THREAT noun in each
 *               case-LEFT title; do not over-use elsewhere)
 *   w / a / r / g / c / d → white / amber / red / green / cyan / dim runs
 *   redact()  → █████ censor bar (use to make a metaphor active)
 */

const mk = (tone: Tone) => (text: string): Run => ({ text, tone });
const w = mk('white');
const a = mk('amber');
const r = mk('red');
const g = mk('green');
const c = mk('cyan');
const d = mk('dim');
const hl = mk('hlRed');
const redact = (n = 8): Run => ({ text: '█'.repeat(n), tone: 'redact' });

// silence "unused" warnings — keep the helpers exposed for future content
void c;
void d;
void redact;

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
    { kind: 'h', lines: [[g('<'), 'panopticon', g('>')]] },
    {
      kind: 'p',
      lines: [
        'States harm people in many ways — through prisons, borders, poverty, war. But some of the most effective state harm leaves no visible wounds. It works by making you uncertain whether you are being watched, and letting that uncertainty do the rest.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'In 1791, the philosopher Jeremy Bentham designed the perfect prison: a circle of cells around a central watchtower. The guard in the tower can see every cell, but no prisoner can see into the tower. Michel Foucault saw what this design actually achieves: it no longer matters whether the tower is occupied. The power of control shifts from the guard to the inmate\'s own mind.',
      ],
    },
    {
      kind: 'callout',
      lines: [
        'Foucault called this the disciplinary society. We live in its next iteration, where the watchtower has been replaced by facial recognition cameras, behavioral data profiles, and algorithms.',
      ],
    },
    {
      kind: 'source',
      text: '[Foucault (1977)](https://en.wikipedia.org/wiki/Discipline_and_Punish "Foucault, Michel. (1977). Discipline and punish: The birth of the prison (A. Sheridan, Trans.). Pantheon Books.")',
    },
  ],
};

const introPage: ZinePageDef = {
  id: 'intro',
  blocks: [
    { kind: 'h', lines: ['"I have nothing to hide"'] },
    {
      kind: 'p',
      lines: [
        'This sentence is the most effective thing surveillance has ever produced: not the files, not the arrests, but the belief that being watched only matters if you have done something wrong. That belief is the tower of the panopticon working exactly as designed.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Philosopher Slavoj Žižek distinguishes between subjective violence — a named act by an identifiable agent, like a police raid or an arrest — and two forms of objective violence that are harder to see. Symbolic violence operates through the categories systems use to sort people: who counts as a threat, who counts as a citizen, who counts as a body worth protecting. Systemic violence is the harm produced by normal social systems functioning as they were built to function: the violence of the "smooth functioning" of things.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Bourdieu makes a parallel argument about the state. What makes state power so durable, he argues, is not primarily its capacity for force but the power to name who belongs and who does not.',
      ],
    },
    {
      kind: 'callout',
      lines: [
        'So, the question is not whether you have something to hide. It is who is made visible, to whom, and at what cost. The same data trail is unremarkable for one person and catastrophic for another: for someone seeking an abortion where it is banned, for someone leaving a violent partner, for a migrant without papers, for someone who organizes against power. Surveillance follows the lines a society has already drawn around gender, race, class, and status. It does not create those lines. It deepens them and makes them harder to cross.',
      ],
    },
    {
      kind: 'source',
      text: '[Žižek (2008)](https://openlibrary.org/books/OL23092607M/Violence "Žižek, Slavoj. (2008). Violence: Six sideways reflections. Picador."); [Bourdieu et al. (1994)](https://doi.org/10.2307/202032 "Bourdieu, Pierre, Wacquant, Loic J. D., & Farage, Samar. (1994). Rethinking the state: Genesis and structure of the bureaucratic field. Sociological Theory, 12(1), 1–18.")',
    },
  ],
};

// ---------- SPREAD 2 — CASE 1 · THE BODY ----------

const case1Left: ZinePageDef = {
  id: 'case01-left',
  blocks: [
    { kind: 'tag', variant: 'warm', text: 'CASE 01 · THE BODY', rec: true },
    { kind: 'h', lines: [['Her period tracker became ', w('evidence'), '.']] },
    {
      kind: 'p',
      lines: [
        'In 2022, in Nebraska, a teenager was prosecuted for ending a pregnancy. Part of the case against her was a handful of Facebook messages she had sent her own mother. The same year, in the UK, a fifteen-year-old who lost a pregnancy was made to hand over her search history and texts so police could decide whether she had broken the law.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Tracking your cycle can feel like an act of care, so the app remembers what you would rather not have to, learns your rhythm, and offers a quiet sense of authority over your own body. There is nothing naive about wanting that. What is easy to miss is that the data does not stay with you. Information you wrote down as self-knowledge can be turned to use against you.',
      ],
    },
    {
      kind: 'callout',
      lines: [
        'This is the structure Žižek asks us to see beneath the individual prosecution. The subjective violence — the arrest, the charges — is visible and legible. The systemic violence beneath it is not. The state did not build a surveillance apparatus aimed at the body. It simply reached into the one corporations had already built.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Feminist scholars like Rachel Dubrofsky and Shoshana Magnet have long shown that the female body, the queer body, the racialized body have always been watched more closely than others. Controlling reproduction is one of the oldest forms of surveillance there is. What has changed is not the logic but the instrument, and an instrument that feels like self-care is far harder to refuse.',
      ],
    },
    {
      kind: 'source',
      text: '[Žižek (2008)](https://openlibrary.org/books/OL23092607M/Violence "Žižek, Slavoj. (2008). Violence: Six sideways reflections. Picador."); [Dubrofsky & Magnet (2015)](https://www.dukeupress.edu/feminist-surveillance-studies "Dubrofsky, Rachel Evelyn, & Magnet, Shoshana Amielle (Eds.). (2015). Feminist surveillance studies. Duke University Press.")',
    },
  ],
};

const case1Right: ZinePageDef = {
  id: 'case01-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 1 · FIVE MINUTES · [▓░░░]' },
    { kind: 'h', lines: [['Give away ', a('less'), ', starting today.']] },
    {
      kind: 'p',
      lines: [
        'The data economy requires your participation to function. Not your consent — your participation. The more data generated about you, the more complete the profile, the more useful you are to whoever buys it. The steps below are small, but they are acts of resistance.',
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
        '*uBlock Origin* (free, open source) stops the invisible scripts that record what you read and search, including health questions you never intended to share. It is not about hiding ads. It is about declining to generate the profile others make for you.',
      ],
    },
    {
      kind: 'step',
      lead: 'Change your search engine.',
      body: [
        '*DuckDuckGo* and *Startpage* do not retain identifiable histories of your queries. For anything to do with your body, your politics, or your relationships, that difference matters.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'None of this makes you invisible. But invisibility was never the goal. The goal is to be less useful to systems that were not built with your interests in mind.',
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
            '**The weak side.** Since September 2023, the revised data law (revDSG) lets you ask a company what it holds on you and demand deletion. But where the EU fines a *company* up to EUR 20 million, Switzerland fines a responsible *person* up to 250,000 CHF — pocket change for a tech giant — and lets firms process your data by default, leaving you to object after the fact. A company that harvests your data here has little to fear. That gap is not an oversight; it is a political choice. *That* is state harm: not what the state does, but what it allows.',
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
        {
          kind: 'p',
          lines: [
            '**A note on Proton.** *Proton* appears throughout this zine — for mail, VPN, passwords. Its record is solid and its Swiss base matters. But it is still a for-profit company, not a foundation: a small number of people ultimately set its direction, and no political structure holds them there. Worth using; worth not depending on alone.',
          ],
        },
      ],
    },
    {
      kind: 'source',
      text: '[revFADP (2023)](https://www.fedlex.admin.ch/eli/cc/2022/491/en "Federal Act on Data Protection (revFADP), SR 235.1 (2023).")',
    },
  ],
};

// ---------- SPREAD 3 — CASE 2 · THE PARTNER ----------

const case2Left: ZinePageDef = {
  id: 'case02-left',
  blocks: [
    { kind: 'tag', variant: 'warm', text: 'CASE 02 · THE PARTNER', rec: true },
    { kind: 'h', lines: [['The ', r('watcher'), ' in the house.']] },
    {
      kind: 'p',
      lines: [
        'Not every surveillance apparatus belongs to a government. Sometimes it belongs to the person who knows your passwords, shares your bed, and has reasons to want to know where you are at every moment.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'There is a category of apps built for exactly this. They are marketed as "child safety" or "employee monitoring" tools, but what they do is allow one person to secretly read another\'s messages, listen through their microphone, and track their real-time location. Researchers and domestic-violence shelters call this *stalkerware*, and in one survey three in four shelters reported clients who had been tracked this way. The targets are overwhelmingly women.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'The state\'s role here operates on two levels. First, it creates the legal environment in which this software is sold. Second, when survivors seek help, they must navigate institutions that routinely fail to recognize technological abuse as abuse.',
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
      text: '[Gren et al. (2024)](https://doi.org/10.25071/1920-7336.41163 "Gren, Nina, Abdelhady, Dalia, & Joormann, Martin. (2024). Unmasking the impact of bureaucratic violence. Refuge: Canada’s Journal on Refugees, 39(2), 1–13."); [Coalition Against Stalkerware (n.d.)](https://stopstalkerware.org/information-for-media/ "Coalition Against Stalkerware. (n.d.). Information for media.")',
    },
  ],
};

const case2Right: ZinePageDef = {
  id: 'case02-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 2 · ONE AFTERNOON · [▓▓░░]' },
    { kind: 'h', lines: [['Take the device ', a('back'), '.']] },
    {
      kind: 'p',
      lines: [
        'The defaults on most devices are set in the interests of the manufacturer and the companies that pay them. Changing them is not paranoia. It is the minimum act of deciding that a device you own should work for you.',
      ],
    },
    {
      kind: 'step',
      lead: 'Check what your apps can reach.',
      body: [
        'In settings, look at which apps have access to your location, microphone, and camera. Most do not need them to function. Switch off what is not necessary. An app you do not remember installing is a warning worth taking seriously.',
      ],
    },
    {
      kind: 'step',
      lead: 'Lock the way in.',
      body: [
        'Use a long passcode rather than a four-digit PIN. On any shared Apple or Google account, create your own password and enable two-factor authentication. What cannot be opened cannot be read.',
      ],
    },
    {
      kind: 'step',
      lead: 'Prefer software you can actually inspect.',
      body: [
        'Open-source code is public, meaning anyone can read it and check it for hidden functions. For messages, *Signal* is both end-to-end encrypted and open source, so its promises can be verified.',
      ],
    },
    {
      kind: 'step',
      lead: 'If you suspect stalkerware, get help from outside.',
      body: [
        'Removing it yourself can alert the person who installed it. Plan that step with a support service, not alone.',
      ],
    },
    {
      kind: 'box',
      title: 'Open source software',
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
    { kind: 'h', lines: [['What it cannot seize, it ', hl('buys'), '.']] },
    {
      kind: 'callout',
      lines: [
        'The data from the first two cases — locations, health information, behavioral profiles, the exhaust of daily digital life — does not stay with the companies that collect it. It flows to data brokers, firms whose business model is purchasing and reselling personal information. Brokers sell to marketers, insurers, landlords, employers, and governments.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'This is the legal loophole that makes the harm complete. A constitution may forbid the state from seizing your data without a court order. It says nothing about the state buying the same data on the open market. In the United States, the immigration agency ICE has used purchased location data to trace people across entire neighborhoods without ever appearing before a judge: a phone that rests somewhere each night is read as a home, the place it spends daylight hours as a workplace.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'Žižek\'s typology of violence is useful here because it describes harm with no identifiable perpetrator. The data broker operates legally. The government agency acts within its mandate. The corporation collected only what users agreed to provide. Taken individually, each step is unremarkable. Together they produce a surveillance infrastructure that lets the state classify, track, and act on populations — especially the most vulnerable — with minimal legal constraint and no single actor who can be held responsible. Simone Browne calls this *racializing surveillance*: the technology changes, but the logic of who gets watched does not.',
      ],
    },
    {
      kind: 'source',
      text: '[Žižek (2008)](https://openlibrary.org/books/OL23092607M/Violence "Žižek, Slavoj. (2008). Violence: Six sideways reflections. Picador."); [Browne (2015)](https://www.dukeupress.edu/dark-matters "Browne, Simone. (2015). Dark matters: On the surveillance of blackness. Duke University Press."); [404 Media (n.d.)](https://www.404media.co/ "404 Media. (n.d.). Investigations on ICE, Palantir systems, and data-broker loopholes."); [Associated Press (2025)](https://apnews.com/ "Associated Press. (2025). Reporting on data-sharing between CMS and DHS/ICE.")',
    },
  ],
};

const case3Right: ZinePageDef = {
  id: 'case03-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 3 · A FEW WEEKENDS · [▓▓▓░]' },
    { kind: 'h', lines: [['Leave ', a('fewer'), ' traces.']] },
    {
      kind: 'p',
      lines: [
        'Bourdieu describes state power in terms of informational capital: knowledge about a population that allows it to classify, sort, and govern. Data brokers are the private-market version of the same thing. Level 3 is about withdrawing from that economy one piece at a time.',
      ],
    },
    {
      kind: 'step',
      lead: 'Turn off your location history.',
      body: [
        'Disable the Timeline in Google Maps, then go into your phone settings and audit which apps can access your location at all, because many keep tracking in the background long after you have stopped using them.',
      ],
    },
    {
      kind: 'step',
      lead: 'Use a VPN.',
      body: [
        'It hides your IP address, and with it your approximate location and browsing habits from your internet provider. Choose a paid provider with a verified no-logs policy, because free VPNs routinely earn their money by selling the data they claim to protect.',
      ],
    },
    {
      kind: 'step',
      lead: 'Move away from Google gradually.',
      body: [
        'Replace your email with a privacy-respecting provider like *Proton Mail*, your maps with an *OpenStreetMap*-based app. One service at a time already makes a huge difference, because trying to do everything at once is how people give up.',
      ],
    },
    {
      kind: 'step',
      lead: 'Keep your identities apart.',
      body: [
        'A single email address linked to everything means a single point of exposure. Separate addresses for institutions, shopping, and personal life — maintained with an alias service like *SimpleLogin* — limit how much damage any single leak can do.',
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
        'In 2023, a climate activist in Geneva sprayed paint on a cycle path. It triggered a surveillance operation far larger than the act, which he only learned about two years later. Since then, he has changed how he lives: at meetings he leaves his phone and laptop in a locker. *You never know*, he says.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'That sentence is the whole mechanism. Surveillance does not have to catch you to work on you. It is enough to know that it could be there, and you begin to edit yourself: skipping the meeting, softening the post, staying home. This is the *chilling effect*, and it falls hardest on the people a democracy most needs: those willing to disagree. Switzerland knows the pattern well. When it emerged in 1989 that the state had maintained secret files on hundreds of thousands of people — trade unionists, peace and anti-nuclear campaigners, the women\'s movement, anyone deemed "nonconformist" — it triggered the largest protest in the country\'s postwar history.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'This is the case Žižek\'s framework was built for. The harm of the Fichenaffäre was not located in any identifiable decision or agent. There was a bureaucratic apparatus that classified people, an administrative logic that treated political difference as security risk, and citizens who had no knowledge it was happening. What Žižek calls systemic violence does not require bad intentions. It only requires a system oriented toward control.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'But surveillance also generates its own counter-practices. Simone Browne calls it *dark sousveillance*: watching from below, refusing visibility on the powerful\'s terms, using their tools against them. Refusing to be seen on someone else\'s terms has long been a political act.',
      ],
    },
    {
      kind: 'source',
      text: '[Žižek (2008)](https://openlibrary.org/books/OL23092607M/Violence "Žižek, Slavoj. (2008). Violence: Six sideways reflections. Picador."); [Browne (2015)](https://www.dukeupress.edu/dark-matters "Browne, Simone. (2015). Dark matters: On the surveillance of blackness. Duke University Press."); [Blick (2025)](https://www.blick.ch/politik/ "Blick. (2025, February 19). Reporting on covert surveillance of climate activists in Geneva."); [grundrechte.ch (n.d.)](https://grundrechte.ch/ "grundrechte.ch. (n.d.). From the fiche scandal to modern intelligence systems.")',
    },
  ],
};

const case4Right: ZinePageDef = {
  id: 'case04-right',
  blocks: [
    { kind: 'tag', variant: 'cool', text: 'LEVEL 4 · WHEN THE STAKES ARE HIGH · [▓▓▓▓]' },
    { kind: 'h', lines: [['Protect yourself, ', g('and the people beside you'), '.']] },
    {
      kind: 'p',
      lines: [
        'The chilling effect is most powerful when it is invisible: when you do not realize you have stopped doing something, only that it no longer seems worth the risk. This level is for people who are already taking risks that matter — organizing, documenting, protesting. The first principle is that no one manages this alone. Security at this level is a collective practice or it is not security.',
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
        'Carry as little sensitive data as possible. Lock it with a passcode rather than biometrics in case fingerprints and faces are compelled from you. A passcode is usually better protected in law. When the stakes are high, a cheap second phone with nothing on it is worth the cost.',
      ],
    },
    {
      kind: 'step',
      lead: 'Install updates immediately.',
      body: [
        'They close the very gaps that spy software relies on; it is the plainest and most effective defense there is.',
      ],
    },
    {
      kind: 'step',
      lead: 'Turn visibility around.',
      body: [
        'Documenting abuses, filming encounters with authorities, sharing what happened with people who were not there: this is Browne\'s *dark sousveillance* in practice. Information held collectively protects the whole network, not just the person who witnessed something.',
      ],
    },
    {
      kind: 'box',
      title: 'VPN and encryption',
      blocks: [
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
    {
      kind: 'source',
      text: '[Browne (2015)](https://www.dukeupress.edu/dark-matters "Browne, Simone. (2015). Dark matters: On the surveillance of blackness. Duke University Press."); [EFF (n.d.)](https://ssd.eff.org/ "Electronic Frontier Foundation. (n.d.). Surveillance self-defense.")',
    },
  ],
};

// ---------- SPREAD 6 — OUTRO / ESCAPE ----------

const outroPage: ZinePageDef = {
  id: 'outro',
  vCenter: true,
  blocks: [
    {
      kind: 'h',
      lines: [
        ['No one becomes ', w('invisible'), '.'],
        'That was never the goal.',
      ],
    },
    {
      kind: 'p',
      lines: [
        'What this zine has described — data brokers, stalkerware, algorithms, classified files — are not aberrations. They are the routine operation of systems built to sort populations and handed new instruments for doing it. Žižek\'s point stands: subjective violence, the kind that makes the news, is only the visible surface of an objective violence harder to name because it does not belong to anyone in particular. The harm is in the infrastructure.',
      ],
    },
    {
      kind: 'callout',
      lines: [
        'Three things worth remembering from this zine:',
        '- Individual steps such as blocking a tracker, switching to Signal, and using a VPN are real and useful tools.',
        '- Privacy is something you extend to others as much as to yourself: protect your own data and you also protect the people in your contacts, in your messages, and in your location history.',
        '- Surveillance never lands on everybody equally. It follows the already cut lines by gender, race, class, and status — and if you look away, someone else might suffer for it.',
      ],
    },
    {
      kind: 'cta',
      lines: ['Start at Level 1. Today.'],
    },
    {
      kind: 'source',
      text: '[Žižek (2008)](https://openlibrary.org/books/OL23092607M/Violence "Žižek, Slavoj. (2008). Violence: Six sideways reflections. Picador.")',
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
  { id: 'spread-6', layout: 'single', left: outroPage },
];

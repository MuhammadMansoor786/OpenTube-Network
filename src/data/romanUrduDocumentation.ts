// OpenTube Network - Complete Technical Documentation in Roman Urdu
// Is file mein project ka mukammal ta'aruf, kaam karne ka tareeqa, technology stack aur 12 phases ki tafseel mojood hai.

export interface DocSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  keyPoints?: string[];
  codeSnippet?: string;
}

export const ROMAN_URDU_DOCS: {
  title: string;
  subtitle: string;
  author: string;
  version: string;
  releaseDate: string;
  summary: string;
  sections: DocSection[];
} = {
  title: "OpenTube Network — Mukammal Technical Documentation (Roman Urdu)",
  subtitle: "Decentralized, Community-Governed Video Platform: Kaise Kaam Karta Hai Aur Kya Kya Use Huwa Hai",
  author: "Muhammad Farooq & OpenTube Core Architecture Collective",
  version: "v2.4.1 (libp2p + IPFS Protocol Edition)",
  releaseDate: "October 2026",
  summary: "Muhammad bhai, yeh project aik normal YouTube clone nahi hai balkay aik aisa decentralized, community-governed video network hai jahan kisi aik company, founder, server ya administrator ke paas poore platform ko control ya band karne ki taaqat nahi hoti. Is document mein platform ka poora workflow, technology stack, aur 12 phases Roman Urdu mein tafseel ke saath darj hain.",
  sections: [
    {
      id: "sec-intro",
      title: "1. OpenTube Network Ka Asil Maqsad Aur Falsafa",
      subtitle: "Yeh YouTube ya Doosray Centralized Platforms Se Mukhtalif Kiyun Hai?",
      content: [
        "Aam tor par YouTube, Facebook ya Vimeo jaise platforms centralized servers (Google Cloud ya AWS) par chalte hain. In mein agar company chahe to kisi bhi creator ka channel aik click mein delete kar sakti hai, unki videos demonetize kar sakti hai, ya hakoomati dabao mein aa kar poora platform block kar sakti hai.",
        "OpenTube Network ka bunyadi maqsad yeh hai ke media ki milkiyat kisi aik shakhs ya corporation ke hath mein na ho. Yeh network hajaron azaad nodes (independent servers) par mushtamil hota hai jo aapas mein peer-to-peer (P2P) mesh ke zariye jure hotay hain.",
        "Zaroori Technical Reality: Internet par physical cables aur datacenters hotay hain, is liye 100% permanently unshutdownable ka dawa karna jhoot hoga. Lekin OpenTube single point of failure ko bilkul khatam kar deta hai. Agar Pakistan ka node band ho jaye to video Germany ya Singapore ke node se foran chal paray gi. Jab tak duniya mein koi 2 nodes bhi zinda hain, video chalti rahe gi!"
      ],
      keyPoints: [
        "No Single Point of Failure: Koi aik central server nahi hai jo crash ho to sab band ho jaye.",
        "Decentralized Storage: Videos kisi aik hard drive par nahi balkay IPFS CIDs ke zariye banti hain.",
        "Zero Dictator Admin: Koi aik admi kisi video ko apni marzi se delete nahi kar sakta.",
        "Sovereign Identity: User ka account uski apni cryptographic private key ke paas hota hai."
      ]
    },
    {
      id: "sec-how-it-works",
      title: "2. OpenTube Kaam Kaise Karta Hai? (Step-by-Step Architecture)",
      subtitle: "Video Upload Se Le Kar Dekhne Tak Ka Poora Technical Safar",
      content: [
        "Step 1 - Video Chunking: Jab creator video upload karta hai, to browser us video ko 1MB ya 2MB ke chotay chotay tukron (chunks) mein kaat deta hai.",
        "Step 2 - Content Addressing & IPFS CID Hash: Har video chunk ka cryptographic SHA-256 hash banta hai. Phir UnixFS Merkle DAG tree ke zariye aik unique Content Identifier (CIDv1 jaise: bafybeic7w7w3x...) create hota hai. Is hash ki khobi yeh hai ke agar koi video mein aik frame bhi tabdeel kare to hash badal jaye ga, is liye video se chher-chhar mumkin nahi.",
        "Step 3 - Multi-Node Replication: Yeh CID hash mukhtalif shehron ke pinning nodes (jaise Lahore Mesh Relay, Frankfurt Cluster, Singapore Swarm, Bay Area Gateway) par pin ho jata hai.",
        "Step 4 - Filecoin Perpetual Storage Deal: Taweel muddat ke tahaffuz ke liye Filecoin smart contracts ke zariye multi-cloud decentralized storage deals lock ki jati hain.",
        "Step 5 - Peer-to-Peer (WebRTC) Swarm Streaming: Jab koi user video play karta hai, to video sirf server se download nahi hoti. Video dekhne wale hazaron log aapas mein WebRTC ke zariye data pieces share karte hain (bilkul BitTorrent ki tarah). Jitne zyada log video dekhenge, streaming utni hi tez aur sasti hogi!",
        "Step 6 - Automated Disaster Recovery (Failover): Agar primary server (jaise Lahore node) offline ho jaye, to browser ka libp2p client milliseconds ke andar baghair video rokay Frankfurt ya Tokyo node se chunks lena shuru kar deta hai!"
      ],
      keyPoints: [
        "UnixFS Chunks: Badi 4K video ko chotay hisson mein taqseem karna.",
        "Merkle DAG Tree: File integrity ka mathematically pakka saboot.",
        "Inverse Scaling: Traditional YouTube par zyada traffic se server slow hota hai, jabke OpenTube par zyada traffic se swarm aur zyada taqatwar hota hai!"
      ],
      codeSnippet: "Workflow: Video -> 1MB Chunks -> SHA-256 Hash -> IPFS CID (bafybei...) -> libp2p GossipSub Swarm -> WebRTC Peer Delivery"
    },
    {
      id: "sec-tech-stack",
      title: "3. Is Project Mein Kya Kya Use Huwa Hai? (Technology Stack)",
      subtitle: "Frontend, Networking, Storage, Cryptography Aur Protocols Ka Mukammal Jaiza",
      content: [
        "Is platform ko modern, production-grade aur standard open protocols par banaya gaya hai. Neeche har layer ki tafseel di gayi hai:",
        "1. Frontend Client Layer:\n- React 19: Ultra-fast state management aur interactive UI render karne ke liye.\n- TypeScript: Type-safety, robust error-free code aur strict interfaces ke liye.\n- Tailwind CSS v4: High-performance, clean cyberpunk/dark-mode styling baghair kisi bulky CSS file ke.\n- Lucide React Icons: Clean aur lightweight vector icons.\n- Canvas Confetti: Creator tips aur governance votes par celebratory micro-interactions ke liye.",
        "2. Distributed Storage Layer:\n- IPFS (InterPlanetary File System): Content-addressed peer-to-peer storage jahan files URL ke bajaye hash (CID) se pehchani jati hain.\n- Filecoin: Decentralized storage incentive network jahan independent storage providers cryptographic proofs (Proof of Spacetime) ke sath media mehfooz rakhte hain.\n- UnixFS Merkle DAG: Chunks ki integrity aur resumable chunking ke liye.",
        "3. Peer-to-Peer Networking Layer:\n- libp2p (GossipSub v1.2): Modular peer-to-peer networking protocol jo decentralized node discovery, DHT (Distributed Hash Table), aur peer reputation ke liye istemal hota hai.\n- WebRTC Data Channels: Direct browser-to-browser video segment sharing baghair kisi intermediary proxy ke.",
        "4. Cryptographic Identity & Authentication Layer:\n- W3C DIDs (Decentralized Identifiers): `did:opentube:...` identifiers jo kisi centralized login server (jaise Google/Facebook OAuth) par munhasir nahi hain.\n- ed25519 Elliptic Curve Keypairs: Fast aur secure public/private keys har comment aur vote ko digitally sign karne ke liye.\n- BIP-39 12-Word Seed Phrase: Account recovery ke liye standardized mnemonics.",
        "5. Federation Protocol:\n- ActivityPub v2.1: W3C standard protocol jo PeerTube aur Mastodon mein use hota hai. Is ke zariye mukhtalif independent instances aapas mein videos, comments aur subscriptions share karte hain.",
        "6. Community DAO & Smart Contracts:\n- Timelock Queues (48 hours) aur 5-of-7 Multisig Council jo malicious upgrades ko rokte hain.\n- OpenTube Utility Tokens (TUBE) jo direct creator tipping aur proposal voting ke liye use hotay hain."
      ],
      keyPoints: [
        "React 19 + TypeScript + Tailwind CSS",
        "IPFS (Kubo) + Filecoin Storage Deals",
        "libp2p Mesh + WebRTC Swarm Offload",
        "W3C DIDs + ed25519 WebCrypto Signatures",
        "ActivityPub Federation Relay",
        "Docker Containerized Node Runner"
      ]
    },
    {
      id: "sec-twelve-phases",
      title: "4. Mukammal 12 Phases Ki Tafseel (The 12 Phases Breakdown)",
      subtitle: "Muhammad Bhai Ke Mashwaray Par Mabni 12 Architectural Marahil",
      content: [
        "Phase 1 — Core Architecture: Poora code open-source hai, koi central master key nahi hai, aur network multiple independent nodes par chal raha hai.",
        "Phase 2 — Frontend & User Experience: Responsive video feed, custom HTML5 video player, live swarm HUD, comments, watch history, playlists, aur English/Urdu bilingual support.",
        "Phase 3 — Distributed Storage: IPFS content addressing, UnixFS resumable chunking, multi-provider pinning, aur multi-resolution video transcoding (1080p, 720p, 480p).",
        "Phase 4 — Peer-to-Peer Network: libp2p based peer discovery, live peer topology map, active seeder counters, aur distributed caching.",
        "Phase 5 — Decentralized Identity: Cryptographic keypairs, DIDs, seed phrases, aur portable account JSON bundle export/import (agar aap node change karein to data sath le ja saken).",
        "Phase 6 — Federation (ActivityPub): Multiple community hubs (jaise opentube.global, lahore.opentube.mesh, libremedia.eu) ka aapas mein jur kar global network banana.",
        "Phase 7 — Community Governance (DAO): 40% quorum requirement, 66% approval supermajority, 5-of-7 multisig council, aur 48-hour timelock execution rules.",
        "Phase 8 — Content Integrity & Moderation: SHA-256 content verification, aur illegal/harmful content ke khilaf 100 randomly chosen tokenholder jurors ka decentralized decision system (zero arbitrary admin power).",
        "Phase 9 — Cybersecurity & Disaster Recovery: Automated failover simulator (aap kisi bhi node ko offline kar ke dekh sakte hain ke stream doosre node par kaise shift hoti hai), DDoS mitigation, aur end-to-end transport encryption.",
        "Phase 10 — Creator Economy: Direct P2P micro-tipping (TUBE tokens) jahan platform ka cut 0% hai — 100% raqam direct creator ke wallet mein jati hai.",
        "Phase 11 — Search & Algorithmic Sovereignty: Koi corporate black-box algorithm nahi hai jo addiction barhaye; user khud sliders se tay karta hai ke feed Community score, Freshness, P2P seeders, ya Views ke hisab se arrange ho.",
        "Phase 12 — Deployment & Expansion: Asaan Docker CLI command ke zariye koi bhi shakhs apne computer ya VPS par independent OpenTube node chala sakta hai."
      ],
      keyPoints: [
        "12 Marahil aik doosray se juray huway hain taake system mukammal aur self-sustaining ho.",
        "Har phase ka live interactive demo is web app mein chal raha hai."
      ]
    },
    {
      id: "sec-run-node",
      title: "5. Apna Azaad Node Kaise Chalayein? (Node Operator Guide)",
      subtitle: "Ghar Ke Computer Ya VPS Par OpenTube Node Setup Karne Ka Asaan Tareeqa",
      content: [
        "Agar aap OpenTube network ko taqatwar banana chahte hain aur community media ko preserve karna chahte hain, to aap apna node run kar sakte hain:",
        "Hardware Requirements:\n- CPU: 2 vCPU cores\n- RAM: 4GB minimum (8GB recommended)\n- Storage: 500GB SSD (IPFS cache aur local video chunk storage ke liye)\n- Internet: 50+ Mbps fiber connection with port forwarding (TCP/UDP 4001).",
        "Docker Command:\nDocker ke zariye sirf aik command chala kar node start ho jata hai:"
      ],
      codeSnippet: "docker run -d --name opentube-node \\\n  -p 4001:4001 -p 8080:8080 -p 5001:5001 \\\n  -v ~/.opentube:/data/ipfs \\\n  -e RELAY_ENABLED=true \\\n  -e MESH_HUB=lahore.opentube.mesh \\\n  opentubeprotocol/node:v2.4.1",
      keyPoints: [
        "Operator Rewards: Har 1 GB video chunks seed karne par 0.05 TUBE tokens reward milte hain.",
        "Full Control: Aap tay kar sakte hain ke aap apne node par konsi categories pin karna chahte hain."
      ]
    },
    {
      id: "sec-faq",
      title: "6. Ahem Sawalat Aur Jawabat (Technical FAQs)",
      subtitle: "Aam Tor Par Poochay Jane Wale Sawalat Ke Mukhtasar Jawabat",
      content: [
        "Sawal 1: Kya OpenTube ko koi hakoomat ya company band kar sakti hai?\nJawab: Kisi aik button ya domain ko block karne se network band nahi hota. Kyunke media IPFS hash par hota hai aur nodes alag alag mumalik (Pakistan, Germany, Singapore, Japan) mein hain. Agar aik domain block ho, to users doosray node ke IP ya desktop app se direct P2P mesh connect kar sakte hain.",
        "Sawal 2: Agar koi ghalat ya ghair qanooni video upload kare to kya hoga?\nJawab: Kisi aik dictator admin ke paas delete ka button nahi hota. Lekin Phase 8 ke mutabiq community jury system hai. Jab log report karte hain to 100 randomly selected jurors ke vote se us video ke hash par local warning mask lag jata hai.",
        "Sawal 3: Kya creator ki kamai par company commission leti hai?\nJawab: Bilkul nahi! YouTube 45% tak cut leta hai, jabke OpenTube par 100% peer-to-peer tip direct creator ke cryptographic address par jati hai."
      ],
      keyPoints: [
        "Censorship Resistance: Distributed mesh prevents single-point takedowns.",
        "Decentralized Justice: Community juries replace arbitrary censorship.",
        "Fair Creator Compensation: 100% peer-to-peer monetization."
      ]
    }
  ]
};

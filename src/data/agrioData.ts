export type ToolCategory = 'reach' | 'conversion' | 'expertise' | 'engagement';
export type Goal = 'branding' | 'expertise' | 'leads' | 'product_launch';

export interface MediaTool {
  id: string;
  name: string;
  type: 'website' | 'newsletter' | 'print' | 'content' | 'database';
  description: string;
  priceType: 'CPM' | 'Fixed' | 'CPC';
  price: number;
  unit?: string;
  categories: ToolCategory[];
  strength: string;
  socialProof: string;
}

export interface Sector {
  id: string;
  name: string;
  website: string;
  sessions: number;
  views: number;
  activeUsers: number;
  tools: MediaTool[];
  image: string;
}

export const AGRIO_SECTORS: Sector[] = [
  {
    id: 'melkvee',
    name: 'Melkveehouderij',
    website: 'Melkvee.nl',
    sessions: 532177,
    views: 698145,
    activeUsers: 166468,
    image: 'https://images.unsplash.com/photo-1543333995-a78aea2eee50?auto=format&fit=crop&q=80&w=800',
    tools: [
      { 
        id: 'mv-billboard', name: 'Billboard Website', type: 'website', description: 'Grote banner bovenaan de pagina op Melkvee.nl', priceType: 'CPM', price: 36, 
        categories: ['reach'], strength: 'Maximale zichtbaarheid', 
        socialProof: '92% van de melkveehouders ziet deze uiting direct bij binnenkomst op de site.' 
      },
      { 
        id: 'mv-database', name: 'Database Marketing', type: 'database', description: 'Direct mail of e-mail naar geselecteerde adressen uit de Agrio database', priceType: 'Fixed', price: 1200, unit: 'per batch',
        categories: ['conversion'], strength: '1-op-1 communicatie',
        socialProof: 'Onze database bevat 97% van de melkveehouders met gedetailleerde kenmerken.'
      },
      { 
        id: 'mv-nb-banner', name: 'Nieuwsbrief Banner', type: 'newsletter', description: 'Banner in de dagelijkse Melkvee nieuwsbrief', priceType: 'Fixed', price: 340, unit: 'per keer', 
        categories: ['reach', 'conversion'], strength: 'Directe inbox activatie', 
        socialProof: 'De Melkvee nieuwsbrief heeft een openingsrate van ruim 31%.' 
      },
      { 
        id: 'mv-kennis', name: 'Kennispartner Artikel', type: 'content', description: 'Inhoudelijk artikel op Melkvee.nl', priceType: 'Fixed', price: 1700, unit: 'per artikel', 
        categories: ['expertise'], strength: 'Thought Leadership', 
        socialProof: '70% van de boeren ziet dit als betrouwbare bron voor technische informatie.' 
      },
      { 
        id: 'mv-print', name: '1/1 Pagina Vakblad', type: 'print', description: 'Hele pagina in Melkvee vakblad (print)', priceType: 'Fixed', price: 3175, 
        categories: ['expertise', 'reach'], strength: 'Maximale autoriteit', 
        socialProof: 'Het vakblad Melkvee bereikt ruim 10.800 ondernemers per editie.' 
      },
    ]
  },
  {
    id: 'akkerbouw',
    name: 'Akkerbouw',
    website: 'Akkerwijzer.nl',
    sessions: 204569,
    views: 361161,
    activeUsers: 87427,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    tools: [
      { id: 'aw-billboard', name: 'Billboard Website', type: 'website', description: 'Grote banner bovenaan Akkerwijzer.nl', priceType: 'CPM', price: 62, categories: ['reach'], strength: 'Dominante positie', socialProof: 'De hoogste attentiewaarde binnen de akkerbouwsector.' },
      { id: 'aw-nb-banner', name: 'Nieuwsbrief Banner', type: 'newsletter', description: 'Banner in Akkerwijzer nieuwsbrief', priceType: 'Fixed', price: 295, unit: 'per keer', categories: ['reach', 'conversion'], strength: 'Hoge attentiewaarde', socialProof: 'Bereik 9.180 betrokken akkerbouwers direct in hun inbox.' },
      { id: 'aw-kennis', name: 'Kennispartner Artikel', type: 'content', description: 'Inhoudelijk artikel op Akkerwijzer.nl', priceType: 'Fixed', price: 1440, unit: 'per artikel', categories: ['expertise'], strength: 'Inhoudelijke autoriteit', socialProof: '70% van de akkerbouwers gebruikt Akkerwijzer.nl voor technische verdieping.' },
      { id: 'aw-print', name: '1/1 Pagina Vakblad', type: 'print', description: 'Hele pagina in Akkerwijzer vakblad', priceType: 'Fixed', price: 2650, categories: ['expertise', 'reach'], strength: 'Sector autoriteit', socialProof: 'Het vakblad Akkerwijzer is al 21 jaar een begrip in de sector.' },
      { id: 'aw-database', name: 'Database Mailing', type: 'database', description: 'Gerichte mailing naar akkerbouwers', priceType: 'Fixed', price: 1100, unit: 'per batch', categories: ['conversion'], strength: 'Persoonlijk bereik', socialProof: 'Bereik specifiek akkerbouwers met een bepaald areaal of teelt.' },
    ]
  },
  {
    id: 'varkens',
    name: 'Varkenshouderij',
    website: 'Pigbusiness.nl',
    sessions: 164491,
    views: 293236,
    activeUsers: 57448,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800',
    tools: [
      { id: 'pb-billboard', name: 'Billboard Website', type: 'website', description: 'Grote banner op Pigbusiness.nl', priceType: 'CPM', price: 51, categories: ['reach'], strength: 'Top-of-mind', socialProof: 'Zorg dat u de eerste bent die de varkenshouder ziet.' },
      { id: 'pb-nb-banner', name: 'Nieuwsbrief Banner', type: 'newsletter', description: 'Banner in Pig Business nieuwsbrief', priceType: 'Fixed', price: 215, unit: 'per keer', categories: ['reach', 'conversion'], strength: 'Snelle respons', socialProof: 'De nieuwsbrief heeft een zeer actieve lezersgroep van 5.015 ontvangers.' },
      { id: 'pb-kennis', name: 'Kennispartner Artikel', type: 'content', description: 'Inhoudelijk artikel op Pigbusiness.nl', priceType: 'Fixed', price: 1595, unit: 'per artikel', categories: ['expertise'], strength: 'Geloofwaardigheid', socialProof: 'Wordt door varkenshouders gewaardeerd om de diepgang.' },
      { id: 'pb-print', name: '1/1 Pagina Vakblad', type: 'print', description: 'Hele pagina in Pig Business vakblad', priceType: 'Fixed', price: 2470, categories: ['expertise', 'reach'], strength: 'Kwaliteitsuitstraling', socialProof: 'Uw merk in een hoogwaardige redactionele omgeving.' },
    ]
  },
  {
    id: 'pluimvee',
    name: 'Pluimveehouderij',
    website: 'Pluimveeweb.nl',
    sessions: 156287,
    views: 281872,
    activeUsers: 52691,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800',
    tools: [
      { id: 'pw-billboard', name: 'Billboard Website', type: 'website', description: 'Grote banner op Pluimveeweb.nl', priceType: 'CPM', price: 62, categories: ['reach'], strength: 'Visuele impact', socialProof: 'De grootste online uiting voor maximale merkbeleving.' },
      { id: 'pw-nb-banner', name: 'Nieuwsbrief Banner', type: 'newsletter', description: 'Banner in Pluimveeweb nieuwsbrief', priceType: 'Fixed', price: 215, unit: 'per keer', categories: ['reach', 'conversion'], strength: 'Hoge relevantie', socialProof: 'Bereik 5.449 pluimveehouders op kritieke nieuwsmomenten.' },
      { id: 'pw-kennis', name: 'Kennispartner Artikel', type: 'content', description: 'Inhoudelijk artikel op Pluimveeweb.nl', priceType: 'Fixed', price: 1595, unit: 'per artikel', categories: ['expertise'], strength: 'Informatieve kliks', socialProof: 'Leid geïnteresseerden direct naar uw technische oplossingen.' },
      { id: 'pw-print', name: '1/1 Pagina Vakblad', type: 'print', description: 'Hele pagina in Pluimveeweb vakblad', priceType: 'Fixed', price: 2520, categories: ['expertise', 'reach'], strength: 'Lange levensduur', socialProof: 'Vakbladen worden bewaard en herlezen door de hele familie.' },
    ]
  },
  {
    id: 'mechanisatie',
    name: 'Mechanisatie',
    website: 'Trekkerweb.nl',
    sessions: 262370,
    views: 400226,
    activeUsers: 95160,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    tools: [
      { id: 'tw-billboard', name: 'Billboard Website', type: 'website', description: 'Grote banner op Trekkerweb.nl', priceType: 'CPM', price: 52, categories: ['reach'], strength: 'Showcase machines', socialProof: 'Ideaal voor het tonen van grote productfoto\'s van machines.' },
      { id: 'tw-nb-banner', name: 'Nieuwsbrief Banner', type: 'newsletter', description: 'Banner in Trekkerweb nieuwsbrief', priceType: 'Fixed', price: 370, unit: 'per keer', categories: ['reach', 'conversion'], strength: 'Nieuws-integratie', socialProof: 'Lift mee op de populariteit van de Trekkerweb nieuwsbrief (11.874 ontvangers).' },
      { id: 'tw-kennis', name: 'Kennispartner Artikel', type: 'content', description: 'Inhoudelijk artikel op Trekkerweb.nl', priceType: 'Fixed', price: 1125, unit: 'per artikel', categories: ['expertise'], strength: 'Liefhebbers bereik', socialProof: 'Trekkerweb lezers zijn gepassioneerde machine-gebruikers.' },
      { id: 'tw-print', name: '1/1 Pagina Vakblad', type: 'print', description: 'Hele pagina in Trekkerweb vakblad', priceType: 'Fixed', price: 725, categories: ['expertise', 'reach'], strength: 'Directe verkoop', socialProof: 'Hét vakblad voor de landbouwmechanisatie- en groensector.' },
    ]
  }
];

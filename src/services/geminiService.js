/**
 * Festivo AI - Intelligent GenAI Service
 * Seamlessly integrates with Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
 * Includes a rich built-in generative engine fallback for 100% instant, reliable execution.
 */

export const getApiKey = () => {
  return localStorage.getItem('festivo_gemini_api_key') || '';
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem('festivo_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('festivo_gemini_api_key');
  }
};

/**
 * Call Gemini REST API directly
 */
async function callGeminiApi(prompt, systemInstruction = '', jsonMode = false) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  // Model endpoint - default to gemini-1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2500,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API request failed (${response.status})`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response received from Gemini.');
  }

  return text;
}

/**
 * Clean and parse JSON from LLM output
 */
function cleanAndParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  }
}

/**
 * 1. Generate Full Event Plan
 */
export async function generateFullEventPlan({ type, title, location, guests, budget, vibe, currency = '$' }) {
  const systemInstruction = `You are an elite, world-class luxury and community event planner. Return ONLY valid JSON conforming to the requested schema.`;
  
  const prompt = `Create a comprehensive, personalized event plan for:
Event Title: "${title || `${type.toUpperCase()} Celebration`}"
Type: ${type} (wedding, birthday, community, or anniversary)
Location: ${location || 'Local venue'}
Guest Count: ${guests || 75}
Total Budget: ${currency}${budget || 15000}
Vibe / Vision: ${vibe || 'Warm, elegant, memorable and fun'}

Return a JSON object with this EXACT structure:
{
  "title": "Inspiring event title",
  "vibe": "Refined descriptive summary of aesthetic and atmosphere",
  "colorPalette": [
    {"name": "Color 1", "hex": "#HEX"},
    {"name": "Color 2", "hex": "#HEX"},
    {"name": "Color 3", "hex": "#HEX"},
    {"name": "Color 4", "hex": "#HEX"},
    {"name": "Color 5", "hex": "#HEX"}
  ],
  "ideas": {
    "signatureDrinks": [
      {"name": "Drink 1", "ingredients": "Key ingredients"},
      {"name": "Drink 2 (Mocktail)", "ingredients": "Key ingredients"}
    ],
    "decorHighlights": [
      "Decor idea 1",
      "Decor idea 2",
      "Decor idea 3",
      "Decor idea 4"
    ],
    "guestEngagement": [
      "Activity/Entertainment 1",
      "Activity/Entertainment 2",
      "Activity/Entertainment 3"
    ],
    "hashtags": ["#Tag1", "#Tag2", "#Tag3"]
  },
  "budgetItems": [
    {"category": "Venue", "name": "Name", "estimated": 4000, "actual": 0, "paid": 0, "status": "pending"},
    {"category": "Catering & Bar", "name": "Name", "estimated": 4500, "actual": 0, "paid": 0, "status": "pending"},
    {"category": "Photography & Video", "name": "Name", "estimated": 2000, "actual": 0, "paid": 0, "status": "pending"},
    {"category": "Decor & Florals", "name": "Name", "estimated": 1500, "actual": 0, "paid": 0, "status": "pending"},
    {"category": "Entertainment & Music", "name": "Name", "estimated": 1200, "actual": 0, "paid": 0, "status": "pending"},
    {"category": "Stationery & Favors", "name": "Name", "estimated": 600, "actual": 0, "paid": 0, "status": "pending"},
    {"category": "Contingency Fund", "name": "Buffer reserve", "estimated": 1200, "actual": 0, "paid": 0, "status": "pending"}
  ],
  "timeline": [
    {"timeframe": "6-12 Months Out", "title": "Milestone description", "done": false, "priority": "high"},
    {"timeframe": "3-6 Months Out", "title": "Milestone description", "done": false, "priority": "high"},
    {"timeframe": "1-2 Months Out", "title": "Milestone description", "done": false, "priority": "medium"},
    {"timeframe": "2-3 Weeks Out", "title": "Milestone description", "done": false, "priority": "high"},
    {"timeframe": "1 Week Out", "title": "Milestone description", "done": false, "priority": "high"},
    {"timeframe": "Day Before", "title": "Milestone description", "done": false, "priority": "medium"}
  ],
  "dayOfSchedule": [
    {"time": "09:00 AM", "activity": "Morning setup / Vendor load-in", "lead": "Coordinator / Lead", "location": "Main Hall"},
    {"time": "02:00 PM", "activity": "Soundcheck & Final inspection", "lead": "Tech & Host", "location": "Stage Area"},
    {"time": "04:30 PM", "activity": "Guest Arrival & Welcome Refreshment", "lead": "Greeters", "location": "Foyer"},
    {"time": "05:30 PM", "activity": "Main Program / Ceremony", "lead": "Emcee / Host", "location": "Main Stage"},
    {"time": "07:00 PM", "activity": "Dinner & Toast Service", "lead": "Catering Lead", "location": "Dining Hall"},
    {"time": "08:30 PM", "activity": "Music, Dancing & Celebration", "lead": "DJ / Band", "location": "Dance Floor"},
    {"time": "10:30 PM", "activity": "Grand Finale & Farewell", "lead": "Host Team", "location": "Exit Gateway"}
  ],
  "vendors": [
    {
      "name": "Premier Venue Partner",
      "category": "Venue",
      "contact": "inquiries@venuepartner.com",
      "cost": 4000,
      "status": "Researching",
      "notes": "Verify capacity, noise ordinance, and curfews.",
      "checkItems": ["Schedule walkthrough", "Request contract terms"]
    },
    {
      "name": "Artisanal Taste Catering",
      "category": "Catering & Bar",
      "contact": "info@tastecatering.com",
      "cost": 4500,
      "status": "Researching",
      "notes": "Includes staffing and linens.",
      "checkItems": ["Review dietary accommodations", "Sample tasting menu"]
    },
    {
      "name": "Lumina Moments Photography",
      "category": "Photography",
      "contact": "hello@luminamoments.com",
      "cost": 2000,
      "status": "Researching",
      "notes": "8 hours full coverage with digital master gallery.",
      "checkItems": ["Check portfolio gallery", "Draft shot list"]
    }
  ]
}`;

  try {
    const raw = await callGeminiApi(prompt, systemInstruction, true);
    const parsed = cleanAndParseJson(raw);
    return {
      ...parsed,
      id: `evt-gen-${Date.now()}`,
      type,
      location: location || 'Custom Venue',
      guestCount: Number(guests) || 75,
      totalBudget: Number(budget) || 15000,
      currency,
      guests: [
        { id: 'g1', name: 'Honor Guest / VIP', rsvp: 'Attending', meal: 'Standard', diet: 'None', table: 1, plusOne: true },
        { id: 'g2', name: 'Close Family / Friend', rsvp: 'Attending', meal: 'Vegetarian', diet: 'Vegetarian', table: 1, plusOne: true },
        { id: 'g3', name: 'Key Organizer', rsvp: 'Attending', meal: 'Standard', diet: 'None', table: 2, plusOne: false }
      ]
    };
  } catch (err) {
    console.warn('Gemini API call failed or no key provided, switching to intelligent heuristic generator:', err.message);
    return fallbackGenerateEventPlan({ type, title, location, guests, budget, vibe, currency });
  }
}

/**
 * 2. Generate Vendor Inquiry (RFP)
 */
export async function generateVendorInquiryEmail({ vendorType, vendorName, eventDetails, specialRequirements }) {
  const prompt = `Draft a polite, professional, and detailed Request for Proposal (RFP) inquiry email to a prospective vendor.
Vendor Name: ${vendorName || `${vendorType} Provider`}
Vendor Category: ${vendorType}
Event Title: ${eventDetails.title}
Event Date: ${eventDetails.date}
Event Location: ${eventDetails.location}
Guest Count: ${eventDetails.guestCount}
Budget Allocation for this service: ${eventDetails.currency}${specialRequirements?.budget || 'Competitive'}
Specific requirements & aesthetic: ${specialRequirements?.notes || eventDetails.vibe}

Provide a subject line, a warm opening, specific questions about availability and packages, and a clear call to action. Keep the tone warm, clear, and business-savvy.`;

  try {
    return await callGeminiApi(prompt);
  } catch {
    return fallbackGenerateVendorInquiry({ vendorType, vendorName, eventDetails, specialRequirements });
  }
}

/**
 * 3. Optimize Budget AI
 */
export async function optimizeBudgetAI({ currentBudget, budgetItems, eventType, targetSavings = 15 }) {
  const prompt = `Analyze this ${eventType} event budget and provide concrete cost-saving suggestions and rebalancing advice.
Total Budget: $${currentBudget}
Target Savings: ${targetSavings}%
Current Line Items:
${budgetItems.map(item => `- ${item.category} (${item.name}): Estimated $${item.estimated}, Actual $${item.actual}`).join('\n')}

Provide actionable, high-impact suggestions:
1. High-Impact Savings Opportunities (where to cut without diminishing guest joy).
2. Negotiation Strategies (questions to ask suppliers).
3. Creative Alternatives (e.g. signature drinks vs open bar, seasonal floral alternatives, digital RSVP).
4. Hidden Cost Alerts (gratuity, overtime fees, cake cutting fees, delivery surcharges).`;

  try {
    return await callGeminiApi(prompt);
  } catch {
    return fallbackOptimizeBudget({ currentBudget, budgetItems, eventType, targetSavings });
  }
}

/**
 * 4. Celebration Copilot Chat
 */
export async function askCopilot({ message, currentEvent, chatHistory = [] }) {
  const systemInstruction = `You are "Festivo Copilot", an empathetic, highly creative, and meticulously organized AI Event Planning Assistant. 
You are helping the user plan their celebration: "${currentEvent.title}" (${currentEvent.type}) on ${currentEvent.date} with ${currentEvent.guestCount} guests and budget ${currentEvent.currency}${currentEvent.totalBudget}.
Answer concisely with actionable suggestions, structured bullet points, checklists, or witty wording as requested.`;

  const contextPrompt = `Context:
Event: ${currentEvent.title} (${currentEvent.type})
Vibe: ${currentEvent.vibe}
Guests: ${currentEvent.guestCount} | Budget: ${currentEvent.currency}${currentEvent.totalBudget}

User question: "${message}"`;

  try {
    return await callGeminiApi(contextPrompt, systemInstruction);
  } catch {
    return fallbackAskCopilot({ message, currentEvent });
  }
}

/**
 * 5. Contingency Plan Generator
 */
export async function generateContingencyPlan({ scenario, currentEvent }) {
  const prompt = `Act as an emergency crisis-mitigation event planner.
Event: ${currentEvent.title} (${currentEvent.type})
Guest Count: ${currentEvent.guestCount}
Scenario/Disruption: "${scenario || 'Sudden rainstorm / outdoor weather emergency'}"

Provide a 3-part tactical response:
1. Immediate 15-Minute Action Items
2. Shifted Timeline & Communication protocol for guests & vendors
3. Mood-Saving Creative Pivot (how to turn the hiccup into a charming highlight)`;

  try {
    return await callGeminiApi(prompt);
  } catch {
    return fallbackContingencyPlan({ scenario, currentEvent });
  }
}

/* =========================================================================
   FALLBACK HEURISTIC GENERATORS (Zero-latency, 100% reliable offline mode)
   ========================================================================= */

function fallbackGenerateEventPlan({ type, title, location, guests, budget, vibe, currency = '$' }) {
  const gCount = Number(guests) || 80;
  const bTotal = Number(budget) || 16000;

  // Percentage allocations depending on event type
  let allocs;
  if (type === 'wedding') {
    allocs = [
      { category: 'Venue', pct: 0.30, name: 'Sanctuary or Reception Estate Rental' },
      { category: 'Catering & Bar', pct: 0.32, name: 'Dinner Service & Signature Bar Package' },
      { category: 'Photography & Video', pct: 0.12, name: 'Full-Day Photo & Teaser Film Coverage' },
      { category: 'Florals & Decor', pct: 0.10, name: 'Ceremony Arch, Bouquets & Tablescapes' },
      { category: 'Music & Entertainment', pct: 0.08, name: 'Acoustic Duo + DJ Reception Sound' },
      { category: 'Attire & Beauty', pct: 0.04, name: 'Wedding Attire, Tailoring & Hair/Makeup' },
      { category: 'Contingency & Tips', pct: 0.04, name: 'Emergency Buffer & Staff Gratuities' }
    ];
  } else if (type === 'birthday') {
    allocs = [
      { category: 'Venue & Lounge', pct: 0.35, name: 'Private Event Space / Lounge Rental' },
      { category: 'Food & Drinks', pct: 0.35, name: 'Heavy Hors d’Oeuvres & Themed Cocktail Bar' },
      { category: 'DJ & Entertainment', pct: 0.12, name: 'Live DJ, Lighting Rig & Sound Setup' },
      { category: 'Custom Cake & Sweets', pct: 0.06, name: 'Multi-Tier Showstopper Cake & Treat Bar' },
      { category: 'Decor & Photo Op', pct: 0.07, name: 'Custom Neon Sign, Balloon Arch & Photo Backdrop' },
      { category: 'Favors & Prizes', pct: 0.05, name: 'Personalized Guest Keepsakes & Party Favors' }
    ];
  } else {
    // Community event
    allocs = [
      { category: 'City Permits & Security', pct: 0.20, name: 'Park Permits, Road Closure & EMS Standby' },
      { category: 'Staging & Audio/Visual', pct: 0.22, name: 'Covered Stage, Generator & Sound Engineer' },
      { category: 'Facilities & Rentals', pct: 0.25, name: 'Tents, Tables, Waste Stations & Restrooms' },
      { category: 'Bands & Performers', pct: 0.15, name: 'Local Headliner Bands & Family Performers' },
      { category: 'Signage & Marketing', pct: 0.08, name: 'Directional Banners, Flyers & Digital Ads' },
      { category: 'Emergency Reserve', pct: 0.10, name: 'Weather Weatherization & First-Aid Buffer' }
    ];
  }

  const budgetItems = allocs.map((item, index) => ({
    id: `b-${index + 1}`,
    category: item.category,
    name: item.name,
    estimated: Math.round(bTotal * item.pct),
    actual: 0,
    paid: 0,
    status: 'pending'
  }));

  const colorPalettes = {
    wedding: [
      { name: 'Champagne Rose', hex: '#E8C5B8' },
      { name: 'Sage Mist', hex: '#9BB0A5' },
      { name: 'Warm Terracotta', hex: '#C27D60' },
      { name: 'Ivory Linen', hex: '#FDFBF7' },
      { name: 'Antique Gold', hex: '#D4AF37' }
    ],
    birthday: [
      { name: 'Electric Violet', hex: '#8B5CF6' },
      { name: 'Sunset Coral', hex: '#F43F5E' },
      { name: 'Neon Amber', hex: '#F59E0B' },
      { name: 'Midnight Blue', hex: '#0F172A' },
      { name: 'Holographic Silver', hex: '#CBD5E1' }
    ],
    community: [
      { name: 'Community Forest', hex: '#15803D' },
      { name: 'Harvest Ochre', hex: '#D97706' },
      { name: 'Sky Azure', hex: '#0284C7' },
      { name: 'Warm Brick', hex: '#B91C1C' },
      { name: 'Sunbeam Cream', hex: '#FEF3C7' }
    ]
  };

  const selectedPalette = colorPalettes[type] || colorPalettes.wedding;

  const defaultTitle = title || (
    type === 'wedding' ? 'Golden Glow Romance Celebration' :
    type === 'birthday' ? 'Milestone Jubilee Spectacular' :
    'Community Spark Unity Gathering'
  );

  return {
    id: `evt-gen-${Date.now()}`,
    title: defaultTitle,
    type,
    date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: location || 'Celebration Pavilion & Gardens',
    guestCount: gCount,
    totalBudget: bTotal,
    currency,
    vibe: vibe || 'Warm, festive, inviting, and unforgettable for all guests.',
    colorPalette: selectedPalette,
    ideas: {
      signatureDrinks: [
        { name: 'The Celebration Sparkler', ingredients: 'Sparkling wine, elderflower cordial, fresh berry skewer, lemon twist' },
        { name: 'Citrus Sunburst Mocktail', ingredients: 'Blood orange reduction, pressed mint, sparkling ginger water' }
      ],
      decorHighlights: [
        'Immersive ambient warm fairy lights strung in organic geometric canopies',
        'Lush seasonal floral arrangements featuring textured foliage and soft blooms',
        'Custom hand-lettered welcome mirror with personalized calligraphy',
        'Interactive audio or video guest memory recording station'
      ],
      guestEngagement: [
        'Live acoustic musician welcoming guests as they arrive at the entrance',
        'Curated Polaroid guestbook with metallic gel pens and washi tape',
        'Late-night comfort snack surprise (mini donuts & gourmet slider bites)'
      ],
      hashtags: [
        `#${defaultTitle.replace(/[^a-zA-Z0-9]/g, '')}`,
        `#CelebrateWithUs2026`,
        `#UnforgettableMoments`
      ]
    },
    budgetItems,
    timeline: [
      { id: 't1', timeframe: '6 Months Out', title: 'Lock in primary venue and confirm event insurance', done: true, priority: 'high' },
      { id: 't2', timeframe: '4 Months Out', title: 'Confirm caterer, bar menu, and rental supplies', done: true, priority: 'high' },
      { id: 't3', timeframe: '2 Months Out', title: 'Send digital/printed invitations and track RSVPs', done: false, priority: 'high' },
      { id: 't4', timeframe: '1 Month Out', title: 'Finalize audio/visual, DJ song list, and decor mockups', done: false, priority: 'medium' },
      { id: 't5', timeframe: '2 Weeks Out', title: 'Confirm final headcount with catering and dietary lists', done: false, priority: 'high' },
      { id: 't6', timeframe: '3 Days Out', title: 'Distribute Day-of Run-of-Show to all vendors and leads', done: false, priority: 'high' }
    ],
    dayOfSchedule: [
      { id: 'd1', time: '08:30 AM', activity: 'Venue Opens: Vendor load-in and stage/table placement', lead: 'Event Coordinator', location: 'Main Entrance' },
      { id: 'd2', time: '11:00 AM', activity: 'Soundcheck, lighting check, and microphone testing', lead: 'AV Sound Engineer', location: 'Stage / Main Room' },
      { id: 'd3', time: '02:00 PM', activity: 'Decor & floral installations complete + Photography walkthrough', lead: 'Florist & Photographer', location: 'Center Hall' },
      { id: 'd4', time: '04:00 PM', activity: 'Doors Open: Welcome cocktails, ambient music, guest arrival', lead: 'Greeters & Ushers', location: 'Foyer / Courtyard' },
      { id: 'd5', time: '05:00 PM', activity: 'Main Program / Ceremonial Highlights', lead: 'Host / Emcee', location: 'Main Pavilion' },
      { id: 'd6', time: '06:30 PM', activity: 'Dinner Service & Speeches / Video Presentation', lead: 'Catering Lead', location: 'Dining Tables' },
      { id: 'd7', time: '08:00 PM', activity: 'Dessert, Music Kickoff & Open Celebration', lead: 'DJ / Band', location: 'Dance Floor' },
      { id: 'd8', time: '10:30 PM', activity: 'Grand Exit / Send-Off and teardown initiation', lead: 'Lead Coordinator', location: 'Exit Walkway' }
    ],
    vendors: [
      {
        id: 'v1',
        name: 'The Pavilion at Green Meadows',
        category: 'Venue',
        contact: 'booking@paviliongreenmeadows.com | (555) 234-5678',
        cost: Math.round(bTotal * 0.3),
        status: 'Contract Signed',
        notes: 'Includes tables, chairs, staging, and parking attendant.',
        checkItems: ['Confirm certificate of insurance', 'Verify sound ordinance cutoff at 11pm']
      },
      {
        id: 'v2',
        name: 'Artisan Feast Catering',
        category: 'Catering & Bar',
        contact: 'chef@artisanfeast.com | (555) 876-5432',
        cost: Math.round(bTotal * 0.32),
        status: 'Proposal Review',
        notes: 'Buffet or plated service with seasonal organic ingredients.',
        checkItems: ['Confirm vegan and nut-free accommodations', 'Lock in bar package inventory']
      },
      {
        id: 'v3',
        name: 'Capture The Spark Photography',
        category: 'Photography',
        contact: 'hello@capturethespark.photo',
        cost: Math.round(bTotal * 0.12),
        status: 'Contacted',
        notes: 'Full day coverage with digital gallery and print release.',
        checkItems: ['Submit formal shot list', 'Confirm meal voucher']
      }
    ],
    guests: [
      { id: 'g1', name: 'VIP Guest & Partner', rsvp: 'Attending', meal: 'Standard Dinner', diet: 'None', table: 1, plusOne: true },
      { id: 'g2', name: 'Honorary Friend', rsvp: 'Attending', meal: 'Plant-Based Plate', diet: 'Vegan', table: 1, plusOne: true },
      { id: 'g3', name: 'Family Member', rsvp: 'Attending', meal: 'Gluten-Free Herb Chicken', diet: 'Gluten-Free', table: 2, plusOne: false },
      { id: 'g4', name: 'Colleague', rsvp: 'Pending', meal: 'TBD', diet: 'None', table: 2, plusOne: false }
    ]
  };
}

function fallbackGenerateVendorInquiry({ vendorType, vendorName, eventDetails, specialRequirements }) {
  const budgetStr = specialRequirements?.budget ? `${eventDetails.currency}${specialRequirements.budget}` : 'our allocated budget';
  return `Subject: Inquiry: Availability & Quote for ${eventDetails.title} on ${eventDetails.date}

Dear ${vendorName || `${vendorType} Team`},

I hope this message finds you well!

We are currently planning "${eventDetails.title}" and are deeply impressed by your work in ${vendorType}. We would love to discuss your availability and package options for our celebration.

Here are the key event details:
• Date: ${eventDetails.date}
• Event Type: ${eventDetails.type.toUpperCase()}
• Location: ${eventDetails.location}
• Approximate Guest Count: ${eventDetails.guestCount} guests
• Budget Target for ${vendorType}: ${budgetStr}
• Overall Aesthetic / Vibe: ${eventDetails.vibe}

${specialRequirements?.notes ? `Specific requirements to note:\n${specialRequirements.notes}\n` : ''}
Could you please share:
1. Your availability for ${eventDetails.date}?
2. Your standard service packages and price guide?
3. What is included in your setup and teardown window?
4. Your booking deposit policy and cancellation terms?

If available, we would be delighted to schedule a brief 10-minute discovery call this week to introduce ourselves and discuss next steps.

Thank you so much for your time and expertise, and we look forward to hearing from you!

Warm regards,
Event Planning Team
${eventDetails.title}`;
}

function fallbackOptimizeBudget({ currentBudget, budgetItems, eventType, targetSavings = 15 }) {
  const targetDollar = Math.round(currentBudget * (targetSavings / 100));
  return `### 💡 AI Smart Budget Optimization Report (${targetSavings}% Target Savings: ~$${targetDollar.toLocaleString()})

Based on our analysis of your **${eventType}** budget:

#### 1. High-Impact Savings Opportunities (Zero Guest Experience Loss)
* **Venue & Date Flexibility**: Shifting to a Friday or Sunday, or securing a morning/afternoon slot can immediately unlock **15% to 25%** lower venue and catering minimums.
* **Smart Bar Optimization**: Instead of an unlimited top-shelf open bar, opt for a **Curated Beer, Wine & 2 Signature Cocktails** bar. This typically trims **30% to 40%** off bar tabs while feeling much more bespoke.
* **Floral Repurposing**: Have your florist move ceremony florals, arch arrangements, or aisle markers directly into the reception dinner tables and sweetheart stage. This saves up to **$800–$1,500** in duplicate centerpiece costs.

#### 2. Strategic Vendor Negotiation Questions
* *"Can we bundle lighting or sound rentals through the DJ or venue for a preferred partner discount?"*
* *"If we pay via ACH bank transfer or pay in full early, do you offer a 3–5% courtesy discount?"*
* *"What is your off-peak or seasonal package rate for our timeline?"*

#### 3. High-Alert Hidden Fees to Inspect
* **Overtime Surcharges**: Verify exact load-out times. Venues often charge $250+/hr for past-midnight pack-down.
* **Cake Cutting & Corkage**: Ask if cake cutting or outside wine corkage fees apply ($2.50 to $5 per guest).
* **Service Charge vs. Gratuity**: Ensure whether the 20–24% venue service charge includes staff tips or if tips are extra.

#### 4. Recommended Action
Trim ~$${Math.round(targetDollar * 0.45).toLocaleString()} from Catering/Bar through curated menu selections, ~$${Math.round(targetDollar * 0.35).toLocaleString()} from Decor through floral repurposing, and reserve the remaining $${Math.round(targetDollar * 0.20).toLocaleString()} directly into your contingency buffer!`;
}

function fallbackAskCopilot({ message, currentEvent }) {
  const lower = message.toLowerCase();

  if (lower.includes('drink') || lower.includes('cocktail') || lower.includes('bar')) {
    return `🍹 **Signature Drink Ideas for "${currentEvent.title}"**:
1. **The Celebrant's Blush**: Crisp Prosecco, artisanal hibiscus syrup, lemon squeeze, and an edible gold dust swirl.
2. **Garden Rosemary Smash**: Bourbon or botanical gin, muddled blackberries, fresh rosemary syrup, topped with ginger fizz.
3. **Zero-Proof Sunshine Cooler (Mocktail)**: Pressed blood orange, sparkling coconut water, and a sprig of fresh basil.

*Tip: Display these with a personalized acrylic or wooden bar menu sign listing the custom names!*`;
  }

  if (lower.includes('rain') || lower.includes('weather') || lower.includes('emergency')) {
    return `☔ **Emergency Weather & Rain Contingency Protocol**:
1. **The 72-Hour Decision Mark**: Check NOAA weather radar 3 days prior. If precipitation exceeds 45%, trigger the clear-top tent rental hold.
2. **Umbrella Aesthetics**: Order 30 matching transparent bubble umbrellas ($8 each online) for gorgeous photo opportunities regardless of rain.
3. **Paving & Walkways**: Prepare rustic wooden duckboard walkways or outdoor mats if grass will be soggy.
4. **Shift Schedule**: Move photo portraits indoors or under covered verandas with ambient amber lighting.`;
  }

  if (lower.includes('game') || lower.includes('activity') || lower.includes('entertainment') || lower.includes('icebreaker')) {
    return `🎉 **Top Guest Engagement & Entertainment Concepts**:
1. **The "How Well Do You Know Them?" Trivia Showdown**: Use a fast mobile buzzer tool (like Kahoot or printed question cards at each table) with 7 fun, surprising questions.
2. **Audio Guestbook Phone**: Place a vintage rotary phone in a cozy corner for guests to record heartfelt voice messages after 2 drinks.
3. **Giant Lawn Games**: Personalized wooden cornhole boards, giant Jenga with prompt questions written on blocks, and bocce ball.
4. **Golden Hour Polaroid Scavenger Hunt**: Give each table a mini camera and a checklist of 5 fun photo missions (e.g. "Best dance move", "Laughter caught unawares").`;
  }

  if (lower.includes('invitation') || lower.includes('wording') || lower.includes('rsvp')) {
    return `💌 **Personalized Invitation & RSVP Wording**:

**Headline**: Together with their families / friends, join us to celebrate:
**Event**: ${currentEvent.title}
**When**: ${currentEvent.date}
**Where**: ${currentEvent.location}

*"We can’t wait to celebrate under the stars with our favorite people! Bring your dancing shoes and appetite for great memories."*

**RSVP Request**:
*"Please kindly reply by 4 weeks prior to ensure we have a seat and signature cocktail waiting for you. Kindly notify us of any dietary restrictions."*`;
  }

  return `✨ **Festivo AI Planning Advice for "${currentEvent.title}"**:

Here are 3 key recommendations tailored to your event:
1. **Timeline Pacing**: For a ${currentEvent.guestCount}-guest event, budget at least 15 minutes of buffer between major transitions (e.g. from welcome drinks to dinner). Guests always move in clusters!
2. **Vendor Alignment**: Share your Day-of Schedule with your photographer and caterer simultaneously so meal courses and golden hour photos never collide.
3. **Personal Touch**: Add one signature element that reflects your unique story—whether it's custom matchboxes, a playlist of meaningful tracks, or late-night comfort snacks.

*Ask me anything else! I can generate custom invite wording, budget rebalancing, game rules, or vendor emails.*`;
}

function fallbackContingencyPlan({ scenario, currentEvent }) {
  return `### 🚨 Rapid Tactical Contingency Plan: "${scenario}"

#### Phase 1: Immediate 15-Minute Action Items
1. **Assembly & Lead Notification**: Event coordinator huddles with venue manager, lead caterer, and MC/DJ.
2. **Power & AV Protection**: Ensure all sound cables, amps, and lighting rigs are elevated and shielded with waterproof tarps.
3. **Signage Relocation**: Move directional signs to steer guests toward covered verandas or indoor halls.

#### Phase 2: Shifted Timeline & Communication
* **+15 to +30 Minutes Buffer**: Announce a brief interlude at the bar. Serve passed hot appetizers or cider while indoor room transitions take place.
* **Digital Announcement**: Send an instant blast via group chat/RSVP portal letting guests know the revised room location.

#### Phase 3: Charm the Guests
* Play an upbeat, cozy acoustic playlist (e.g., Norah Jones, Motown classics).
* Hand out warm cider or champagne flutes at the new entrance.
* Turn the unexpected weather or delay into a romantic, intimate memory!`;
}

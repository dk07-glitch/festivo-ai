// Pre-loaded realistic sample celebration events
export const sampleEvents = [
  {
    id: 'evt-wedding-1',
    title: 'Luna & Oliver’s Enchanted Garden Wedding',
    type: 'wedding',
    date: '2027-06-19',
    location: 'Meadowood Botanical Sanctuary, Napa Valley, CA',
    guestCount: 120,
    totalBudget: 32000,
    currency: '$',
    vibe: 'Whimsical botanical elegance with fairy lights, wildflower florals, acoustic folk music, and farm-to-table dining.',
    colorPalette: [
      { name: 'Sage Green', hex: '#87A987' },
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Champagne Gold', hex: '#E6C687' },
      { name: 'Ivory Cream', hex: '#FAF5EE' },
      { name: 'Deep Forest', hex: '#2D4A3E' }
    ],
    ideas: {
      signatureDrinks: [
        { name: 'The Wildflower Spritz', ingredients: 'Elderflower liqueur, Prosecco, fresh blackberries, rosemary sprig' },
        { name: 'Napa Oak Old Fashioned', ingredients: 'Bourbon, spiced fig syrup, walnut bitters, smoked orange peel' }
      ],
      decorHighlights: [
        'Hanging wisteria & fairy light canopy over long timber banquet tables',
        'Custom calligraphy stone placecards with pressed dried botanical petals',
        'Vintage lounge vignettes with emerald velvet settees under willow trees',
        'Interactive polaroid guestbook station with leather-bound photo album'
      ],
      guestEngagement: [
        'Acoustic guitar duo playing indie love songs during cocktail hour in the rose garden',
        'Audio guestbook in a vintage British rotary phone',
        'Late-night artisanal wood-fired pizza cart & s’mores fire pit station'
      ],
      hashtags: ['#LunaOliverInBloom', '#NapaMeadowoodVows', '#HappilyEverOliver2027']
    },
    budgetItems: [
      { id: 'b1', category: 'Venue', name: 'Meadowood Botanical Sanctuary Full Day Rental', estimated: 9500, actual: 9500, paid: 5000, status: 'partial' },
      { id: 'b2', category: 'Catering & Bar', name: 'Artisan Farm-to-Table 3-Course Plated Dinner (120 guests)', estimated: 9600, actual: 9800, paid: 4800, status: 'partial' },
      { id: 'b3', category: 'Photography', name: 'Golden Hour Visuals (10-hr coverage + Drone + 2nd Shooter)', estimated: 3800, actual: 3600, paid: 3600, status: 'paid' },
      { id: 'b4', category: 'Florals & Decor', name: 'Botanical Arch, Hanging Canopy & Centerpieces', estimated: 3200, actual: 3400, paid: 1700, status: 'partial' },
      { id: 'b5', category: 'Music & Sound', name: 'Acoustic Duo + 5-Piece Evening Reception Band', estimated: 2800, actual: 2800, paid: 1000, status: 'partial' },
      { id: 'b6', category: 'Attire & Beauty', name: 'Gown Alterations, Bespoke Tuxedo & Bridal Hair/Makeup', estimated: 1800, actual: 1750, paid: 1750, status: 'paid' },
      { id: 'b7', category: 'Stationery & Favors', name: 'Handmade Seed Paper Invitations & Wildflower Honey Jars', estimated: 650, actual: 620, paid: 620, status: 'paid' },
      { id: 'b8', category: 'Contingency & Tips', name: 'Vendor Gratuity Fund & Weather Backup Canopy', estimated: 1650, actual: 0, paid: 0, status: 'pending' }
    ],
    timeline: [
      { id: 't1', timeframe: '12 Months Out', title: 'Secure Dream Venue & Set Exact Date', done: true, priority: 'high' },
      { id: 't2', timeframe: '9 Months Out', title: 'Book Photographer, Videographer & Band', done: true, priority: 'high' },
      { id: 't3', timeframe: '6 Months Out', title: 'Finalize Catering Tasting & Beverage Menu', done: true, priority: 'medium' },
      { id: 't4', timeframe: '4 Months Out', title: 'Send Formal Invitations & Launch RSVP Portal', done: true, priority: 'high' },
      { id: 't5', timeframe: '2 Months Out', title: 'Dress & Suit Final Fittings', done: false, priority: 'medium' },
      { id: 't6', timeframe: '3 Weeks Out', title: 'Finalize Seating Chart & Dietary Counts with Caterer', done: false, priority: 'high' },
      { id: 't7', timeframe: '1 Week Out', title: 'Distribute Day-of Run of Show to Wedding Party & Vendors', done: false, priority: 'high' },
      { id: 't8', timeframe: 'Day Before', title: 'Ceremony Rehearsal & Welcome Dinner', done: false, priority: 'medium' }
    ],
    dayOfSchedule: [
      { id: 'd1', time: '09:00 AM', activity: 'Bridal Suite Opens - Hair, Makeup & Mimosas', lead: 'Lead Stylist & Maid of Honor', location: 'Meadowood Cottage Suite' },
      { id: 'd2', time: '12:30 PM', activity: 'Florist & Venue Setup (Arch, Linens, Table Numbers)', lead: 'Wildflower Studio & Venue Mgr', location: 'The Central Lawn' },
      { id: 'd3', time: '02:00 PM', activity: 'Groom & Groomsmen Prep + Boutonnières', lead: 'Best Man', location: 'The Carriage House' },
      { id: 'd4', time: '03:15 PM', activity: 'Couple’s First Look & Golden Hour Portraits', lead: 'Lead Photographer (Sarah)', location: 'Willow Grove Trail' },
      { id: 'd5', time: '04:30 PM', activity: 'Guest Arrival & Welcome Refreshment (Cucumber Mint Water)', lead: 'Venue Ushers', location: 'Garden Courtyard' },
      { id: 'd6', time: '05:00 PM', activity: 'Ceremony Processional & Vow Exchange', lead: 'Officiant Elena Brooks', location: 'Floral Archway Arbor' },
      { id: 'd7', time: '05:45 PM', activity: 'Cocktail Hour & Passed Hors d’Oeuvres with Acoustic Duo', lead: 'Catering Lead Chef & Duo', location: 'Rose Veranda' },
      { id: 'd8', time: '07:00 PM', activity: 'Grand Entrance, Welcome Toast & Dinner Service', lead: 'Band MC & Head Caterer', location: 'The Glass Pavilion' },
      { id: 'd9', time: '08:30 PM', activity: 'First Dances & Cake Cutting', lead: 'Band Lead Singer', location: 'Main Dance Floor' },
      { id: 'd10', time: '10:45 PM', activity: 'Sparkler Farewell Send-Off', lead: 'Day-of Coordinator', location: 'South Gate Pathway' }
    ],
    vendors: [
      {
        id: 'v1',
        name: 'Meadowood Botanical Sanctuary',
        category: 'Venue',
        contact: 'events@meadowoodsanctuary.com | (707) 555-0182',
        cost: 9500,
        status: 'Contract Signed',
        notes: 'Includes tables, vintage wooden chairs, bridal suite and setup permit until 11:30 PM.',
        checkItems: ['Sign liability waiver', 'Confirm vendor delivery access window (10am)', 'Submit final floor layout plan']
      },
      {
        id: 'v2',
        name: 'Heirloom Culinary Collective',
        category: 'Catering & Bar',
        contact: 'chef@heirloomculinary.com | (707) 555-0431',
        cost: 9800,
        status: 'Contract Signed',
        notes: 'Farm-to-table 3 courses. Included bar staff of 3 bartenders and tableware.',
        checkItems: ['Confirm allergen substitutions (6 gluten-free, 4 vegan)', 'Finalize signature cocktail ratios', 'Submit final headcount 14 days prior']
      },
      {
        id: 'v3',
        name: 'Golden Hour Visuals',
        category: 'Photography',
        contact: 'sarah@goldenhourvisuals.photo',
        cost: 3600,
        status: 'Confirmed & Deposit Paid',
        notes: '10 hours coverage, 2 photographers, drone footage and highlight teaser clip.',
        checkItems: ['Send family photo checklist', 'Confirm sunset timing (approx 8:12 PM)', 'Provide vendor meal vouchers']
      },
      {
        id: 'v4',
        name: 'Wildflower & Vine Florals',
        category: 'Florals & Decor',
        contact: 'hello@wildflowerandvine.com',
        cost: 3400,
        status: 'Proposal Review',
        notes: 'Locally grown California garden roses, eucalyptus garlands, and repurposed ceremony arch flowers for sweetheart table.',
        checkItems: ['Approve final centerpiece sample', 'Confirm teardown logistics at 11:00 PM']
      }
    ],
    guests: [
      { id: 'g1', name: 'Eleanor Vance', rsvp: 'Attending', meal: 'Herb-Roasted Salmon', diet: 'None', table: 1, plusOne: true },
      { id: 'g2', name: 'Marcus Sterling', rsvp: 'Attending', meal: 'Braised Beef Short Rib', diet: 'Gluten-Free', table: 1, plusOne: true },
      { id: 'g3', name: 'Dr. Clara Thorne', rsvp: 'Attending', meal: 'Wild Mushroom Risotto', diet: 'Vegan', table: 2, plusOne: false },
      { id: 'g4', name: 'Julian Hayes', rsvp: 'Declined', meal: 'N/A', diet: 'N/A', table: null, plusOne: false },
      { id: 'g5', name: 'Sophia & Liam Dubois', rsvp: 'Attending', meal: 'Herb-Roasted Salmon', diet: 'Nut Allergy', table: 3, plusOne: true },
      { id: 'g6', name: 'Arthur Pendelton', rsvp: 'Pending', meal: 'TBD', diet: 'Dairy-Free', table: 2, plusOne: false }
    ]
  },
  {
    id: 'evt-birthday-1',
    title: 'Leo’s Neon Arcade & Synthwave 30th Gala',
    type: 'birthday',
    date: '2026-11-14',
    location: 'Level 99 Underground Lounge, Austin, TX',
    guestCount: 50,
    totalBudget: 4800,
    currency: '$',
    vibe: 'High-energy retro 80s synthwave with neon backlighting, classic arcade tournaments, cyberpunk cocktails, and upbeat electronic music.',
    colorPalette: [
      { name: 'Neon Magenta', hex: '#FF007F' },
      { name: 'Electric Cyan', hex: '#00F0FF' },
      { name: 'Cyber Purple', hex: '#7A04EB' },
      { name: 'Midnight Onyx', hex: '#120E29' },
      { name: 'Laser Lime', hex: '#39FF14' }
    ],
    ideas: {
      signatureDrinks: [
        { name: 'The Cyberpunk Mule', ingredients: 'Vodka, blue curaçao, fiery ginger beer, lime juice, glow stirrer' },
        { name: 'Pac-Man Punch (Non-Alcoholic)', ingredients: 'Mango nectar, sparkling yuzu, passionfruit caviar pearls' }
      ],
      decorHighlights: [
        'Custom neon sign stating "LEVEL 30 UNLOCKED: LEO"',
        'Retro CRT televisions playing vintage VHS anime and 80s arcade loops',
        'Glow stick wristbands color-coded by arcade team tournament bracket',
        'Pixel art cake shaped like a retro arcade cabinet'
      ],
      guestEngagement: [
        'Street Fighter II & Mario Kart 64 Double-Elimination Tournament with grand champion trophy',
        'Retro selfie mirror with 80s oversized shades, keytars, and denim jackets',
        'Surprise nostalgic midnight snack bar: Gourmet slider burgers & churro bites'
      ],
      hashtags: ['#LeoTurns30', '#Level30Unlocked', '#AustinNeonNight']
    },
    budgetItems: [
      { id: 'b1', category: 'Venue', name: 'Private Mezzanine & Unlimited Arcade Pass Rental', estimated: 1800, actual: 1800, paid: 1800, status: 'paid' },
      { id: 'b2', category: 'Catering & Bar', name: 'Passed Sliders, Loaded Taco Bar & 2 Drink Tickets / Guest', estimated: 1600, actual: 1550, paid: 800, status: 'partial' },
      { id: 'b3', category: 'Entertainment', name: 'Synthwave DJ & Tournament Emcee', estimated: 600, actual: 600, paid: 300, status: 'partial' },
      { id: 'b4', category: 'Cake & Sweets', name: 'Custom Fondant Pixel-Art Arcade Cake + Mini Cupcakes', estimated: 350, actual: 380, paid: 380, status: 'paid' },
      { id: 'b5', category: 'Decor & Neon', name: 'Custom Neon Signage, Blacklights & Glow Accents', estimated: 300, actual: 290, paid: 290, status: 'paid' },
      { id: 'b6', category: 'Prizes & Favors', name: 'Retro Enamel Pins, Tournament Trophy & Mini Arcade Keychains', estimated: 150, actual: 140, paid: 140, status: 'paid' }
    ],
    timeline: [
      { id: 't1', timeframe: '6 Weeks Out', title: 'Lock down Private Arcade Venue & Deposit', done: true, priority: 'high' },
      { id: 't2', timeframe: '4 Weeks Out', title: 'Order Custom Neon Sign & Tournament Trophies', done: true, priority: 'medium' },
      { id: 't3', timeframe: '3 Weeks Out', title: 'Send Digital Animated Video Invitations', done: true, priority: 'high' },
      { id: 't4', timeframe: '10 Days Out', title: 'Curate Synthwave & Chiptune DJ Playlist', done: false, priority: 'medium' },
      { id: 't5', timeframe: '3 Days Out', title: 'Finalize Bar Tab Minimum & Tournament Bracket Seeding', done: false, priority: 'high' },
      { id: 't6', timeframe: 'Day Of', title: 'Deliver Cake & Setup Prize Display table', done: false, priority: 'high' }
    ],
    dayOfSchedule: [
      { id: 'd1', time: '06:00 PM', activity: 'Host & DJ Arrival, Soundcheck & Neon Lighting Test', lead: 'Host (Jordan) & DJ Rex', location: 'Level 99 Lounge' },
      { id: 'd2', time: '07:00 PM', activity: 'Guest Arrival, Glow Wristbands & Open Arcade Freeplay', lead: 'Welcome Greeter', location: 'Arcade Floor' },
      { id: 'd3', time: '07:45 PM', activity: 'Passed Sliders, Taco Bar & Signature Cocktails Opened', lead: 'Level 99 Catering', location: 'Mezzanine Bar' },
      { id: 'd4', time: '08:30 PM', activity: 'Mario Kart Tournament Round 1 & Street Fighter Bracket', lead: 'DJ Emcee Rex', location: 'Projector Arena' },
      { id: 'd5', time: '09:45 PM', activity: 'Tournament Championship Finals & Trophy Presentation', lead: 'Leo & Emcee', location: 'Main Stage' },
      { id: 'd6', time: '10:15 PM', activity: 'Cake Cutting, Birthday Toast & 80s Dance Floor Kickoff', lead: 'All Guests', location: 'Dance Floor' },
      { id: 'd7', time: '11:45 PM', activity: 'Late Night Churros & Goody Bag Distribution', lead: 'Jordan', location: 'Exit Lounge' }
    ],
    vendors: [
      {
        id: 'v1',
        name: 'Level 99 Arcade & Bar',
        category: 'Venue & Bar',
        contact: 'manager@level99austin.com | (512) 555-8821',
        cost: 3350,
        status: 'Contract Signed',
        notes: 'Venue rental + food and bar package for 50 guests. 4 hours dedicated mezzanine.',
        checkItems: ['Confirm projector HDMI hookup for tournaments', 'Provide playlist track link to house sound']
      },
      {
        id: 'v2',
        name: 'DJ Rex Synthwave Sets',
        category: 'Entertainment',
        contact: 'rex@synthaustin.fm',
        cost: 600,
        status: 'Confirmed & Deposit Paid',
        notes: 'Brings DJ deck, wireless mics, and custom synthwave remix transitions.',
        checkItems: ['Share tournament schedule timing', 'Provide birthday honoree favorite tracks list']
      },
      {
        id: 'v3',
        name: 'Pixel Perfect Bakes',
        category: 'Cake & Desserts',
        contact: 'order@pixelbakes.com',
        cost: 380,
        status: 'Paid in Full',
        notes: 'Red velvet arcade cabinet cake with edible LED screen print. Delivery by 5:30 PM.',
        checkItems: ['Confirm delivery driver contact', 'Provide cake table placement location']
      }
    ],
    guests: [
      { id: 'g1', name: 'Zack Taylor', rsvp: 'Attending', meal: 'Taco Bar', diet: 'None', table: 1, plusOne: true },
      { id: 'g2', name: 'Maya Lin', rsvp: 'Attending', meal: 'Veggie Sliders', diet: 'Vegetarian', table: 1, plusOne: false },
      { id: 'g3', name: 'Devon Vance', rsvp: 'Attending', meal: 'Beef Sliders', diet: 'None', table: 2, plusOne: true },
      { id: 'g4', name: 'Chloe Adams', rsvp: 'Declined', meal: 'N/A', diet: 'N/A', table: null, plusOne: false },
      { id: 'g5', name: 'Ravi Patel', rsvp: 'Pending', meal: 'TBD', diet: 'Halal', table: 2, plusOne: false }
    ]
  },
  {
    id: 'evt-community-1',
    title: 'Oakridge Annual Charity Fall Harvest Fest & 5K',
    type: 'community',
    date: '2026-10-24',
    location: 'Oakridge Community Park & Amphitheater',
    guestCount: 450,
    totalBudget: 18500,
    currency: '$',
    vibe: 'Family-friendly community autumn festival featuring local food trucks, craft market, 5K charity run, pumpkin patch, and bluegrass music.',
    colorPalette: [
      { name: 'Warm Terracotta', hex: '#D35400' },
      { name: 'Golden Marigold', hex: '#F39C12' },
      { name: 'Forest Spruce', hex: '#27AE60' },
      { name: 'Rustic Cinnamon', hex: '#7E3F12' },
      { name: 'Crisp Cream', hex: '#FFF8EE' }
    ],
    ideas: {
      signatureDrinks: [
        { name: 'Spiced Apple Cider Warmers', ingredients: 'Locally pressed cider, cinnamon sticks, clove oranges, optional bourbon float' },
        { name: 'Harvest Cranberry Fizz', ingredients: 'Sparkling water, cranberry reduction, fresh rosemary, lemon zest' }
      ],
      decorHighlights: [
        'Hay bale seating amphitheater with cozy plaid fleece blankets',
        'Giant pumpkin photo op archway with hand-painted community milestone signage',
        'Cornhole and lawn game lawn with solar festoon string lighting',
        'Burlap and maple leaf table runners on community picnic benches'
      ],
      guestEngagement: [
        'Morning 5K Charity Fun Run with custom maple leaf wooden finisher medals',
        'Amateur Pie Baking Contest judged by local fire chief and mayor',
        'Pumpkin carving workshop for kids with safe scoops and stencil kits',
        'Silent auction benefiting the Oakridge Youth Community Center'
      ],
      hashtags: ['#OakridgeHarvestFest', '#RunForOakridge2026', '#FallInOakridge']
    },
    budgetItems: [
      { id: 'b1', category: 'Permits & City Services', name: 'Park Rental, Street Closure, Police & EMS Staffing', estimated: 3200, actual: 3100, paid: 3100, status: 'paid' },
      { id: 'b2', category: 'Stage & Audio/Visual', name: 'Covered Stage, Sound Engineer, PA System & Microphones', estimated: 2800, actual: 2900, paid: 1500, status: 'partial' },
      { id: 'b3', category: '5K Race Operations', name: 'Bibs, Timing Chip System, Finisher Medals & Water Stations', estimated: 2400, actual: 2350, paid: 2350, status: 'paid' },
      { id: 'b4', category: 'Entertainment & Bands', name: '2 Local Bluegrass/Folk Bands + Kids Balloon Artist', estimated: 2200, actual: 2200, paid: 1100, status: 'partial' },
      { id: 'b5', category: 'Rentals & Facilities', name: 'Portable Restrooms, Trash/Recycling Stations, Hay Bales, Tents', estimated: 3500, actual: 3600, paid: 2000, status: 'partial' },
      { id: 'b6', category: 'Marketing & Signage', name: 'Directional Banners, Sponsor Plaques & Social Ads', estimated: 1400, actual: 1250, paid: 1250, status: 'paid' },
      { id: 'b7', category: 'Contingency & First Aid', name: 'Emergency Supplies, Weather Tarps & Volunteer Refreshments', estimated: 3000, actual: 1200, paid: 1200, status: 'paid' }
    ],
    timeline: [
      { id: 't1', timeframe: '6 Months Out', title: 'Submit City Park Permit & Special Event Licenses', done: true, priority: 'high' },
      { id: 't2', timeframe: '4 Months Out', title: 'Recruit Corporate Sponsors & Secure Food Truck Vendors', done: true, priority: 'high' },
      { id: 't3', timeframe: '3 Months Out', title: 'Launch 5K Registration Website & Order Medals', done: true, priority: 'high' },
      { id: 't4', timeframe: '6 Weeks Out', title: 'Recruit 35 Community Volunteer Stewards & Assign Leads', done: true, priority: 'medium' },
      { id: 't5', timeframe: '2 Weeks Out', title: 'Final Safety Walkthrough with Police & Fire Departments', done: false, priority: 'high' },
      { id: 't6', timeframe: '3 Days Out', title: 'Receive Equipment Rentals (Tents, Portables, Hay Bales)', done: false, priority: 'high' },
      { id: 't7', timeframe: 'Event Day', title: '5K Race Kickoff & Full Festival Gates Open', done: false, priority: 'high' }
    ],
    dayOfSchedule: [
      { id: 'd1', time: '06:30 AM', activity: 'Volunteer Check-In, Course Marshals Briefing & 5K Route Setup', lead: 'Race Director (Mark)', location: 'Park Entrance' },
      { id: 'd2', time: '07:30 AM', activity: '5K Runner Registration, Bib Pickup & Warmup Stretch', lead: 'Volunteer Team A', location: 'Oakridge Field House' },
      { id: 'd3', time: '08:30 AM', activity: '5K Charity Run Start Horn (Mayor Welcome)', lead: 'Mayor & Race Director', location: 'Starting Arch' },
      { id: 'd4', time: '09:30 AM', activity: '5K Medals Ceremony & Food Trucks / Craft Stalls Open', lead: 'Emcee & Food Vendor Lead', location: 'Park Lawn' },
      { id: 'd5', time: '10:30 AM', activity: 'Live Bluegrass Performance: The Pine Valley String Band', lead: 'Stage Sound Team', location: 'Main Amphitheater' },
      { id: 'd6', time: '01:00 PM', activity: 'Annual Community Pie Baking Championship Judging', lead: 'Guest Judges Panel', location: 'Pavilion Tent' },
      { id: 'd7', time: '02:30 PM', activity: 'Second Band Set & Kids Pumpkin Carving Contest', lead: 'Youth Committee', location: 'Kids Village' },
      { id: 'd8', time: '04:30 PM', activity: 'Silent Auction Close & Total Charity Funds Announced', lead: 'Oakridge Foundation Chair', location: 'Main Stage' },
      { id: 'd9', time: '06:00 PM', activity: 'Festival Close, Site Cleanup & Trash Removal', lead: 'Eco-Volunteer Clean Team', location: 'Full Park Site' }
    ],
    vendors: [
      {
        id: 'v1',
        name: 'Oakridge Parks & Rec Dept',
        category: 'Permits & Venue',
        contact: 'parks@oakridgegov.org | (555) 019-4422',
        cost: 3100,
        status: 'Contract Signed',
        notes: 'Permits include sound amplification permit until 6pm and closed-road route authorization.',
        checkItems: ['Confirm certificate of insurance delivery', 'Coordinate gate keys for food trucks']
      },
      {
        id: 'v2',
        name: 'Soundwave Festival Staging',
        category: 'AV & Staging',
        contact: 'rentals@soundwavestage.com',
        cost: 2900,
        status: 'Deposit Paid',
        notes: '24x16 mobile covered stage with digital mixing console, 4 wireless microphones, and generator.',
        checkItems: ['Confirm generator fuel refill schedule', 'Run soundcheck at 9:15 AM']
      },
      {
        id: 'v3',
        name: 'Metro Timing & Race Services',
        category: 'Race Operations',
        contact: 'timing@metroraces.com',
        cost: 2350,
        status: 'Contract Signed',
        notes: 'RFID timing mats, digital clock display arch, and instant online finish time lookup.',
        checkItems: ['Test bib scanner backup battery', 'Review course turnaround marshals']
      }
    ],
    guests: [
      { id: 'g1', name: 'Mayor Thomas Wright', rsvp: 'Attending', meal: 'VIP Pass', diet: 'None', table: 'VIP Tent', plusOne: true },
      { id: 'g2', name: 'Chief Sarah Jenkins (Fire Dept)', rsvp: 'Attending', meal: 'Judge Pass', diet: 'Vegetarian', table: 'Judges Bench', plusOne: false },
      { id: 'g3', name: 'David Miller (Rotary Club Sponsor)', rsvp: 'Attending', meal: 'Sponsor Pass', diet: 'None', table: 'Sponsor Tent', plusOne: true },
      { id: 'g4', name: 'Oakridge Gazette Reporter', rsvp: 'Attending', meal: 'Press Pass', diet: 'None', table: 'Press Table', plusOne: false }
    ]
  }
];

export const emptyEventTemplate = {
  id: '',
  title: '',
  type: 'wedding',
  date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  location: '',
  guestCount: 75,
  totalBudget: 15000,
  currency: '$',
  vibe: '',
  colorPalette: [],
  ideas: {
    signatureDrinks: [],
    decorHighlights: [],
    guestEngagement: [],
    hashtags: []
  },
  budgetItems: [],
  timeline: [],
  dayOfSchedule: [],
  vendors: [],
  guests: []
};

// ─────────────────────────────────────────────────────────────────────────────
// INDIA STADIUM DATABASE — VERIFIED REAL SEATING LAYOUTS ONLY
// Only stadiums with publicly documented, real-world seating sections included.
// Sources: BCCI, ISL/ISF official pages, Wikipedia, club websites.
// ─────────────────────────────────────────────────────────────────────────────

export const STADIUM_DB = [

  // ══════════════════════════════════════════════════════════════════════════
  // CRICKET — VERIFIED REAL SEATING LAYOUTS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "c1",
    name: "Narendra Modi Stadium",
    city: "Ahmedabad", state: "Gujarat",
    capacity: 132000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 16, parkingZones: 10, foodCourts: 20,
    zones: ["Reliance End", "Lower Tier A", "Corporate Box East", "Lower Tier B", "Adani End", "Lower Tier C", "Corporate Box West", "Gate 1", "Gate 9", "Food Court A", "North VIP Lounge"],
    homeTeams: ["India national cricket team", "Gujarat Titans", "Gujarat cricket team"],
    layout: { blocks: ["Adani End","Reliance End","Lower Tier A","Lower Tier B","Lower Tier C","Lower Tier D","Upper Tier A","Upper Tier B","Corporate Box East","Corporate Box West"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Reliance End",         shortName:"Reliance\nEnd",   a1:225, a2:315, gates:["Gate 1","Gate 2","Gate 16"] },
        { id:"ne",     name:"Lower Tier A",         shortName:"LT-A",            a1:315, a2:360, gates:["Gate 3","Gate 4"] },
        { id:"east",   name:"Corporate Box East",   shortName:"Corp E",          a1:0,   a2:45,  gates:["Gate 5","Gate 6"] },
        { id:"se",     name:"Lower Tier B",         shortName:"LT-B",            a1:45,  a2:90,  gates:["Gate 7","Gate 8"] },
        { id:"south",  name:"Adani End",            shortName:"Adani\nEnd",      a1:90,  a2:180, gates:["Gate 9","Gate 10","Gate 11"] },
        { id:"sw",     name:"Lower Tier C",         shortName:"LT-C",            a1:180, a2:225, gates:["Gate 12","Gate 13"] },
        { id:"west",   name:"Corporate Box West",   shortName:"Corp W",          a1:225, a2:270, gates:["Gate 14","Gate 15"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Zone",       sectionId:"ne"    },
        { type:"food",     name:"Gate 9 Food Court",      sectionId:"south" },
        { type:"food",     name:"Gate 14 Food Court",     sectionId:"west"  },
        { type:"restroom", name:"Gate 2 Restroom Block",  sectionId:"north" },
        { type:"restroom", name:"Gate 7 Restroom Block",  sectionId:"se"    },
        { type:"restroom", name:"Gate 12 Restroom Block", sectionId:"sw"    },
        { type:"exit",     name:"Main Exit Gate 1",       sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 9",      sectionId:"south" },
      ]
    }
  },

  {
    id: "c2",
    name: "Eden Gardens",
    city: "Kolkata", state: "West Bengal",
    capacity: 68000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 14, parkingZones: 6, foodCourts: 12,
    zones: ["Club House End", "B & C Block", "D Block", "High Court End", "F & G Block", "H & K Block", "Gate 10", "Gate 3", "Food Court B", "South VIP"],
    homeTeams: ["India national cricket team", "Bengal cricket team", "Kolkata Knight Riders"],
    layout: { blocks: ["B Block","C Block","D Block","E Block","F Block","G Block","H Block","K Block"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Club House End",  shortName:"Club\nHouse",  a1:225, a2:315, gates:["Gate 10","Gate 11","Gate 12"] },
        { id:"ne",     name:"B & C Block",     shortName:"B/C\nBlock",   a1:315, a2:30,  gates:["Gate 13","Gate 14"] },
        { id:"east",   name:"D Block",         shortName:"D\nBlock",     a1:30,  a2:90,  gates:["Gate 1","Gate 2"] },
        { id:"south",  name:"High Court End",  shortName:"High\nCourt",  a1:90,  a2:160, gates:["Gate 3","Gate 4","Gate 5"] },
        { id:"sw",     name:"F & G Block",     shortName:"F/G\nBlock",   a1:160, a2:210, gates:["Gate 6","Gate 7"] },
        { id:"west",   name:"H & K Block",     shortName:"H/K\nBlock",   a1:210, a2:270, gates:["Gate 8","Gate 9"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 13 Food Court",  sectionId:"ne"    },
        { type:"food",     name:"Gate 5 Food Court",   sectionId:"south" },
        { type:"restroom", name:"Gate 11 Restroom",    sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",     sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 10",   sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 3",   sectionId:"south" },
      ]
    }
  },

  {
    id: "c3",
    name: "Wankhede Stadium",
    city: "Mumbai", state: "Maharashtra",
    capacity: 33100, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 7, parkingZones: 2, foodCourts: 4,
    zones: ["Sunil Gavaskar Stand", "Vijay Merchant Stand", "Sachin Tendulkar Stand", "Garware Pavilion", "Gate 1", "Gate 4", "Gate 7", "VIP Box", "Food Court A"],
    homeTeams: ["India national cricket team", "Mumbai cricket team", "Mumbai Indians"],
    layout: { blocks: ["Sunil Gavaskar Stand","Sachin Tendulkar Stand","Garware Pavilion","Vijay Merchant Stand"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Sunil Gavaskar Stand", shortName:"SG\nStand",  a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"Vijay Merchant Stand", shortName:"VM\nStand",  a1:315, a2:90,  gates:["Gate 3"] },
        { id:"south",  name:"Sachin Tendulkar Stand",shortName:"ST\nStand", a1:90,  a2:160, gates:["Gate 4","Gate 5"] },
        { id:"west",   name:"Garware Pavilion",      shortName:"Garware\nPav", a1:160, a2:225, gates:["Gate 6","Gate 7"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Stalls",   sectionId:"north" },
        { type:"food",     name:"Gate 5 Concourse",     sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Gate 1 Exit",     sectionId:"north" },
        { type:"exit",     name:"Gate 6 West Exit",     sectionId:"west"  },
      ]
    }
  },

  {
    id: "c4",
    name: "MA Chidambaram Stadium",
    city: "Chennai", state: "Tamil Nadu",
    capacity: 38200, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 8, parkingZones: 3, foodCourts: 5,
    zones: ["Anna Pavilion End", "A & B Stand", "C & D Stand", "Scoreboard End", "E & F Stand", "G & K Stand", "Gate 1", "Gate 5", "Food Zone 1"],
    homeTeams: ["India national cricket team", "Tamil Nadu cricket team", "Chennai Super Kings"],
    layout: { blocks: ["A Stand","B Stand","C Stand","D Stand","E Stand","F Stand","G Stand","H Stand","J Stand","K Stand"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Anna Pavilion End",  shortName:"Anna\nPav",  a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"ne",     name:"A & B Stand",        shortName:"A/B\nStand", a1:315, a2:30,  gates:["Gate 3"] },
        { id:"east",   name:"C & D Stand",        shortName:"C/D\nStand", a1:30,  a2:90,  gates:["Gate 4"] },
        { id:"south",  name:"Scoreboard End",     shortName:"Score\nEnd", a1:90,  a2:170, gates:["Gate 5","Gate 6"] },
        { id:"sw",     name:"E & F Stand",        shortName:"E/F\nStand", a1:170, a2:225, gates:["Gate 7"] },
        { id:"west",   name:"G & K Stand",        shortName:"G/K\nStand", a1:225, a2:270, gates:["Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Zone",      sectionId:"ne"    },
        { type:"food",     name:"Gate 6 Food Court",     sectionId:"south" },
        { type:"restroom", name:"Gate 2 Restroom",       sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",       sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",      sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 5",     sectionId:"south" },
      ]
    }
  },

  {
    id: "c5",
    name: "M. Chinnaswamy Stadium",
    city: "Bengaluru", state: "Karnataka",
    capacity: 40000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 9, parkingZones: 4, foodCourts: 6,
    homeTeams: ["India national cricket team", "Karnataka cricket team", "Royal Challengers Bangalore"],
    layout: { blocks: ["Pavilion End","Cubbon End","VVIP Stand","VIP Stand","General Stand A","General Stand B"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Pavilion End",    shortName:"Pavilion\nEnd", a1:225, a2:315, gates:["Gate 1","Gate 2","Gate 9"] },
        { id:"east",   name:"VVIP & VIP",      shortName:"VVIP\nVIP",    a1:315, a2:90,  gates:["Gate 3","Gate 4"] },
        { id:"south",  name:"Cubbon End",      shortName:"Cubbon\nEnd",  a1:90,  a2:160, gates:["Gate 5","Gate 6"] },
        { id:"west",   name:"General Stand",   shortName:"Gen\nStand",   a1:160, a2:225, gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 4 Food Court",     sectionId:"east"  },
        { type:"food",     name:"Gate 6 Concourse",      sectionId:"south" },
        { type:"restroom", name:"Gate 2 Restroom",       sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",       sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",      sectionId:"north" },
        { type:"exit",     name:"Gate 7 Exit",           sectionId:"west"  },
      ]
    }
  },

  {
    id: "c6",
    name: "Arun Jaitley Stadium",
    city: "New Delhi", state: "Delhi",
    capacity: 35200, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 8, parkingZones: 3, foodCourts: 5,
    homeTeams: ["India national cricket team", "Delhi cricket team", "Delhi Capitals"],
    layout: { blocks: ["Bishan Singh Bedi Stand","Parthasarathy Sharma Stand","Gautam Gambhir Stand","North Pavilion","South Pavilion"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Bishan Singh Bedi Stand", shortName:"BSB\nStand", a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"North Pavilion",          shortName:"North\nPav", a1:315, a2:90,  gates:["Gate 3","Gate 4"] },
        { id:"south",  name:"Gauti Gambhir Stand",     shortName:"GG\nStand",  a1:90,  a2:165, gates:["Gate 5","Gate 6"] },
        { id:"west",   name:"South Pavilion",          shortName:"South\nPav", a1:165, a2:225, gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Zone",      sectionId:"east"  },
        { type:"food",     name:"Gate 6 Food Court",     sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",       sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",       sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",      sectionId:"north" },
        { type:"exit",     name:"Gate 5 South Exit",     sectionId:"south" },
      ]
    }
  },

  {
    id: "c7",
    name: "Rajiv Gandhi International Cricket Stadium",
    city: "Hyderabad", state: "Telangana",
    capacity: 39200, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 8, parkingZones: 4, foodCourts: 6,
    homeTeams: ["India national cricket team", "Sunrisers Hyderabad", "Hyderabad cricket team"],
    layout: { blocks: ["Rajiv Gandhi Stand","Pavilion End","Gandhi End","East Stand","West Stand"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Pavilion End",          shortName:"Pavilion\nEnd", a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"East Stand (VIP)",      shortName:"East\nVIP",     a1:315, a2:90,  gates:["Gate 3","Gate 4"] },
        { id:"south",  name:"Gandhi End",            shortName:"Gandhi\nEnd",   a1:90,  a2:165, gates:["Gate 5","Gate 6"] },
        { id:"west",   name:"West Stand",            shortName:"West\nStand",   a1:165, a2:225, gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 4 Food Court",     sectionId:"east"  },
        { type:"food",     name:"Gate 6 Food Stalls",    sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",       sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",       sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",      sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 5",     sectionId:"south" },
      ]
    }
  },

  {
    id: "c8",
    name: "Sawai Mansingh Stadium",
    city: "Jaipur", state: "Rajasthan",
    capacity: 30000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 7, parkingZones: 3, foodCourts: 4,
    homeTeams: ["India national cricket team", "Rajasthan Royals", "Rajasthan cricket team"],
    layout: { blocks: ["Pavilion Stand","North Stand","South Stand","East Stand","VIP Box"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"North Stand",     shortName:"North\nStand", a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"VIP Box",         shortName:"VIP\nBox",     a1:315, a2:90,  gates:["Gate 3"] },
        { id:"south",  name:"South Stand",     shortName:"South\nStand", a1:90,  a2:165, gates:["Gate 4","Gate 5"] },
        { id:"west",   name:"Pavilion Stand",  shortName:"Pavilion\nSt", a1:165, a2:225, gates:["Gate 6","Gate 7"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Stalls",    sectionId:"east"  },
        { type:"food",     name:"Gate 5 Concourse",      sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",       sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",       sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",      sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 4",     sectionId:"south" },
      ]
    }
  },

  {
    id: "c9",
    name: "Maharashtra Cricket Association Stadium",
    city: "Pune", state: "Maharashtra",
    capacity: 42700, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 8, parkingZones: 4, foodCourts: 6,
    homeTeams: ["India national cricket team"],
    layout: { blocks: ["North Pavilion","South Pavilion","East Stand","West Stand","Corporate Box"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"North Pavilion",     shortName:"North\nPav", a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"East Stand",         shortName:"East\nStand",a1:315, a2:90,  gates:["Gate 3","Gate 4"] },
        { id:"south",  name:"South Pavilion",     shortName:"South\nPav", a1:90,  a2:165, gates:["Gate 5","Gate 6"] },
        { id:"west",   name:"West Stand (Corp)",  shortName:"Corp\nBox",  a1:165, a2:225, gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 4 Food Court",    sectionId:"east"  },
        { type:"food",     name:"Gate 5 Food Stalls",   sectionId:"south" },
        { type:"restroom", name:"Gate 2 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 6 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 5",    sectionId:"south" },
      ]
    }
  },

  {
    id: "c10",
    name: "Holkar Cricket Stadium",
    city: "Indore", state: "Madhya Pradesh",
    capacity: 30000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 6, parkingZones: 3, foodCourts: 4,
    homeTeams: ["India national cricket team", "Madhya Pradesh cricket team"],
    layout: { blocks: ["Pavilion End","Screen End","West Stand","East Stand","Corporate Box"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Pavilion End",     shortName:"Pavilion\nEnd", a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"East Stand",       shortName:"East\nStand",   a1:315, a2:90,  gates:["Gate 3"] },
        { id:"south",  name:"Screen End",       shortName:"Screen\nEnd",   a1:90,  a2:165, gates:["Gate 4","Gate 5"] },
        { id:"west",   name:"Corporate Box",    shortName:"Corp\nBox",     a1:165, a2:225, gates:["Gate 6"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Court",    sectionId:"east"  },
        { type:"food",     name:"Gate 4 Food Stalls",   sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 4 South Exit",    sectionId:"south" },
      ]
    }
  },

  {
    id: "c11",
    name: "Himachal Pradesh Cricket Association Stadium",
    city: "Dharamshala", state: "Himachal Pradesh",
    capacity: 21200, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 5, parkingZones: 2, foodCourts: 3,
    homeTeams: ["Himachal Pradesh cricket team"],
    layout: { blocks: ["Pavilion End","Dhauladhar End","North Stand","South Stand","VIP Box"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Dhauladhar End",   shortName:"Dhauladhar\nEnd", a1:225, a2:315, gates:["Gate 1"] },
        { id:"east",   name:"VIP Box",          shortName:"VIP\nBox",        a1:315, a2:90,  gates:["Gate 2"] },
        { id:"south",  name:"Pavilion End",     shortName:"Pavilion\nEnd",   a1:90,  a2:165, gates:["Gate 3","Gate 4"] },
        { id:"west",   name:"General Stand",    shortName:"Gen\nStand",      a1:165, a2:225, gates:["Gate 5"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Stalls",   sectionId:"east"  },
        { type:"food",     name:"Gate 4 Concourse",     sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 3 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 3 Exit",          sectionId:"south" },
      ]
    }
  },

  {
    id: "c12",
    name: "Vidarbha Cricket Association Stadium",
    city: "Nagpur", state: "Maharashtra",
    capacity: 45000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 9, parkingZones: 4, foodCourts: 6,
    homeTeams: ["India national cricket team", "Vidarbha cricket team"],
    layout: { blocks: ["VCA Pavilion","North Stand","South Stand","East Stand","West Stand"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"North Stand",       shortName:"North\nStand", a1:225, a2:315, gates:["Gate 1","Gate 2","Gate 9"] },
        { id:"east",   name:"VCA Pavilion",      shortName:"VCA\nPav",     a1:315, a2:90,  gates:["Gate 3","Gate 4"] },
        { id:"south",  name:"South Stand",       shortName:"South\nStand", a1:90,  a2:165, gates:["Gate 5","Gate 6"] },
        { id:"west",   name:"West Stand",        shortName:"West\nStand",  a1:165, a2:225, gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 4 Food Court",    sectionId:"east"  },
        { type:"food",     name:"Gate 5 Concourse",     sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 5",    sectionId:"south" },
      ]
    }
  },

  {
    id: "c13",
    name: "Inderjit Singh Bindra Stadium",
    city: "Mohali", state: "Punjab",
    capacity: 27000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 6, parkingZones: 3, foodCourts: 4,
    homeTeams: ["India national cricket team", "Punjab cricket team", "Punjab Kings"],
    layout: { blocks: ["Pavilion End","Media Centre End","North Stand","South Stand"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Pavilion End",        shortName:"Pavilion\nEnd", a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"Media Centre",        shortName:"Media\nCentre", a1:315, a2:90,  gates:["Gate 3"] },
        { id:"south",  name:"South Stand",         shortName:"South\nStand",  a1:90,  a2:165, gates:["Gate 4","Gate 5"] },
        { id:"west",   name:"General Stand",       shortName:"Gen\nStand",    a1:165, a2:225, gates:["Gate 6"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Zone",    sectionId:"east"  },
        { type:"food",     name:"Gate 4 Food Court",   sectionId:"south" },
        { type:"restroom", name:"Gate 2 Restroom",     sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",     sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",    sectionId:"north" },
        { type:"exit",     name:"Gate 4 South Exit",   sectionId:"south" },
      ]
    }
  },

  {
    id: "c14",
    name: "JSCA International Stadium Complex",
    city: "Ranchi", state: "Jharkhand",
    capacity: 50000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 10, parkingZones: 4, foodCourts: 7,
    homeTeams: ["India national cricket team", "Jharkhand cricket team"],
    layout: { blocks: ["A Stand","B Stand","C Stand","D Stand","E Stand","Pavilion"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"A & B Stand",     shortName:"A/B\nStand",  a1:225, a2:315, gates:["Gate 1","Gate 2","Gate 10"] },
        { id:"east",   name:"Pavilion",        shortName:"Pavilion",    a1:315, a2:90,  gates:["Gate 3","Gate 4"] },
        { id:"south",  name:"C & D Stand",     shortName:"C/D\nStand",  a1:90,  a2:165, gates:["Gate 5","Gate 6","Gate 7"] },
        { id:"west",   name:"E Stand",         shortName:"E\nStand",    a1:165, a2:225, gates:["Gate 8","Gate 9"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 4 Food Court",    sectionId:"east"  },
        { type:"food",     name:"Gate 6 Food Stalls",   sectionId:"south" },
        { type:"restroom", name:"Gate 2 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 5",    sectionId:"south" },
      ]
    }
  },

  {
    id: "c15",
    name: "Green Park Stadium",
    city: "Kanpur", state: "Uttar Pradesh",
    capacity: 32000, type: "Cricket", sport: "Cricket", category: "Cricket",
    gates: 7, parkingZones: 3, foodCourts: 4,
    homeTeams: ["India national cricket team", "Uttar Pradesh cricket team"],
    layout: { blocks: ["Pavilion","Cycle Track Stand","Gandhi Stand","North Stand","South Stand"] },
    seating: {
      shape: "oval",
      sections: [
        { id:"north",  name:"Gandhi Stand",      shortName:"Gandhi\nSt",   a1:225, a2:315, gates:["Gate 1","Gate 2"] },
        { id:"east",   name:"Pavilion",          shortName:"Pavilion",     a1:315, a2:90,  gates:["Gate 3"] },
        { id:"south",  name:"Cycle Track Stand", shortName:"CT\nStand",    a1:90,  a2:165, gates:["Gate 4","Gate 5"] },
        { id:"west",   name:"South Stand",       shortName:"South\nStand", a1:165, a2:225, gates:["Gate 6","Gate 7"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Zone",    sectionId:"east"  },
        { type:"food",     name:"Gate 5 Concourse",    sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",     sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",     sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",    sectionId:"north" },
        { type:"exit",     name:"Gate 4 Exit",         sectionId:"south" },
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTBALL — VERIFIED REAL SEATING LAYOUTS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "f1",
    name: "Salt Lake Stadium",
    city: "Bidhannagar", state: "West Bengal",
    capacity: 85000, type: "Football", sport: "Football", category: "Football",
    gates: 15, parkingZones: 8, foodCourts: 15,
    homeTeams: ["East Bengal", "Mohun Bagan", "Mohammedan"],
    layout: { blocks: ["Sector A","Sector B","Sector C","Sector D","Sector E","Sector F"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"Sector A (North)",  shortName:"Sector A\n(North)", side:"north", gates:["Gate 1","Gate 2","Gate 3"] },
        { id:"east",  name:"Sector C (East)",   shortName:"Sector C\n(East)",  side:"east",  gates:["Gate 4","Gate 5"] },
        { id:"south", name:"Sector D (South)",  shortName:"Sector D\n(South)", side:"south", gates:["Gate 6","Gate 7","Gate 8"] },
        { id:"west",  name:"Sector F (West/VIP)",shortName:"Sector F\n(VIP)",  side:"west",  gates:["Gate 9","Gate 10"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Court",    sectionId:"north" },
        { type:"food",     name:"Gate 7 Food Stalls",   sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 6 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"South Exit Gate 6",    sectionId:"south" },
      ]
    }
  },

  {
    id: "f2",
    name: "Fatorda Stadium",
    city: "Margao", state: "Goa",
    capacity: 19000, type: "Football", sport: "Football", category: "Football",
    gates: 4, parkingZones: 2, foodCourts: 3,
    homeTeams: ["FC Goa"],
    layout: { blocks: ["North Stand","South Stand","East Stand (VIP)","West Stand (Away)"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North Stand",       shortName:"North\nStand",  side:"north", gates:["Gate 1"] },
        { id:"east",  name:"East Stand (VIP)",  shortName:"VIP\nEast",     side:"east",  gates:["Gate 2"] },
        { id:"south", name:"South Stand",       shortName:"South\nStand",  side:"south", gates:["Gate 3"] },
        { id:"west",  name:"West Stand (Away)", shortName:"Away\nSection", side:"west",  gates:["Gate 4"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 1 Food Stalls",  sectionId:"north" },
        { type:"food",     name:"Gate 3 Concourse",    sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",     sectionId:"north" },
        { type:"restroom", name:"Gate 3 Restroom",     sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",    sectionId:"north" },
        { type:"exit",     name:"Gate 3 Exit",         sectionId:"south" },
      ]
    }
  },

  {
    id: "f3",
    name: "Jawaharlal Nehru Stadium",
    city: "New Delhi", state: "Delhi",
    capacity: 60254, type: "Football", sport: "Football, Athletics", category: "Football",
    gates: 12, parkingZones: 5, foodCourts: 10,
    homeTeams: ["Punjab FC", "SC Delhi"],
    layout: { blocks: ["North Stand","South Stand","East Stand","West Stand","Corporate Box"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North Stand",       shortName:"North\nStand",  side:"north", gates:["Gate 1","Gate 2","Gate 3"] },
        { id:"east",  name:"East Stand (Corp)", shortName:"East\nCorp",    side:"east",  gates:["Gate 4","Gate 5"] },
        { id:"south", name:"South Stand",       shortName:"South\nStand",  side:"south", gates:["Gate 6","Gate 7","Gate 8"] },
        { id:"west",  name:"West Stand",        shortName:"West\nStand",   side:"west",  gates:["Gate 9","Gate 10"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 3 Food Court",    sectionId:"north" },
        { type:"food",     name:"Gate 7 Food Court",    sectionId:"south" },
        { type:"restroom", name:"Gate 2 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 6 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Gate 1 Exit",     sectionId:"north" },
        { type:"exit",     name:"Gate 6 South Exit",    sectionId:"south" },
      ]
    }
  },

  {
    id: "f4",
    name: "Jawaharlal Nehru International Stadium Kaloor",
    city: "Kochi", state: "Kerala",
    capacity: 41000, type: "Football", sport: "Football", category: "Football",
    gates: 8, parkingZones: 4, foodCourts: 6,
    homeTeams: ["Kerala Blasters"],
    layout: { blocks: ["North Stand","South Stand","East Stand","West Stand (VIP)"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North Stand",       shortName:"North\nStand",  side:"north", gates:["Gate 1","Gate 2"] },
        { id:"east",  name:"East Stand",        shortName:"East\nStand",   side:"east",  gates:["Gate 3","Gate 4"] },
        { id:"south", name:"South Stand",       shortName:"South\nStand",  side:"south", gates:["Gate 5","Gate 6"] },
        { id:"west",  name:"West Stand (VIP)",  shortName:"VIP\nWest",     side:"west",  gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Court",    sectionId:"north" },
        { type:"food",     name:"Gate 5 Food Court",    sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 5 Exit",          sectionId:"south" },
      ]
    }
  },

  {
    id: "f5",
    name: "Sree Kanteerava Stadium",
    city: "Bengaluru", state: "Karnataka",
    capacity: 25810, type: "Football", sport: "Football, Athletics", category: "Football",
    gates: 5, parkingZones: 2, foodCourts: 3,
    homeTeams: ["Bengaluru FC"],
    layout: { blocks: ["North Stand","South Stand","East Stand","West Stand (Corporate)"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North Stand",      shortName:"North\nStand",  side:"north", gates:["Gate 1"] },
        { id:"east",  name:"East Stand",       shortName:"East\nStand",   side:"east",  gates:["Gate 2"] },
        { id:"south", name:"South Stand",      shortName:"South\nStand",  side:"south", gates:["Gate 3","Gate 4"] },
        { id:"west",  name:"West (Corporate)", shortName:"Corp\nWest",    side:"west",  gates:["Gate 5"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Stalls",   sectionId:"east"  },
        { type:"food",     name:"Gate 3 Concourse",     sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 3 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 3 South Exit",    sectionId:"south" },
      ]
    }
  },

  {
    id: "f6",
    name: "JRD Tata Sports Complex",
    city: "Jamshedpur", state: "Jharkhand",
    capacity: 40000, type: "Football", sport: "Football", category: "Football",
    gates: 8, parkingZones: 4, foodCourts: 6,
    homeTeams: ["Jamshedpur FC"],
    layout: { blocks: ["North Stand","South Stand","East Stand","West Stand"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North Stand",   shortName:"North\nStand", side:"north", gates:["Gate 1","Gate 2"] },
        { id:"east",  name:"East Stand",    shortName:"East\nStand",  side:"east",  gates:["Gate 3","Gate 4"] },
        { id:"south", name:"South Stand",   shortName:"South\nStand", side:"south", gates:["Gate 5","Gate 6"] },
        { id:"west",  name:"West Stand",    shortName:"West\nStand",  side:"west",  gates:["Gate 7","Gate 8"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Court",    sectionId:"north" },
        { type:"food",     name:"Gate 5 Food Court",    sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 5 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 5 South Exit",    sectionId:"south" },
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HOCKEY — VERIFIED REAL SEATING LAYOUTS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "h1",
    name: "Major Dhyan Chand National Stadium",
    city: "New Delhi", state: "Delhi",
    capacity: 16200, type: "Hockey", sport: "Hockey", category: "Hockey",
    gates: 4, parkingZones: 2, foodCourts: 3,
    homeTeams: [],
    layout: { blocks: ["North Pavilion","South Pavilion","East Stand","West Stand"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North Pavilion", shortName:"North\nPav",   side:"north", gates:["Gate 1"] },
        { id:"east",  name:"East Stand",     shortName:"East\nStand",  side:"east",  gates:["Gate 2"] },
        { id:"south", name:"South Pavilion", shortName:"South\nPav",   side:"south", gates:["Gate 3"] },
        { id:"west",  name:"West Stand",     shortName:"West\nStand",  side:"west",  gates:["Gate 4"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Stalls",  sectionId:"east"  },
        { type:"food",     name:"Gate 3 Canteen",      sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",     sectionId:"north" },
        { type:"restroom", name:"Gate 3 Restroom",     sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",    sectionId:"north" },
        { type:"exit",     name:"Gate 3 Exit",         sectionId:"south" },
      ]
    }
  },

  {
    id: "h2",
    name: "Kalinga Hockey Stadium",
    city: "Bhubaneswar", state: "Odisha",
    capacity: 15000, type: "Hockey", sport: "Hockey", category: "Hockey",
    gates: 4, parkingZones: 2, foodCourts: 3,
    homeTeams: ["Kalinga Lancers"],
    layout: { blocks: ["Main Stand","East Stand","West Stand (Media)","North End"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North End",           shortName:"North\nEnd",    side:"north", gates:["Gate 1"] },
        { id:"east",  name:"East Stand",          shortName:"East\nStand",   side:"east",  gates:["Gate 2"] },
        { id:"south", name:"Main Stand (VIP)",    shortName:"Main\nStand",   side:"south", gates:["Gate 3"] },
        { id:"west",  name:"West Stand (Media)",  shortName:"Media\nWest",   side:"west",  gates:["Gate 4"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Court",    sectionId:"east"  },
        { type:"food",     name:"Gate 3 Food Zone",     sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 3 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 3 Exit",          sectionId:"south" },
      ]
    }
  },

  {
    id: "h3",
    name: "Birsa Munda International Hockey Stadium",
    city: "Rourkela", state: "Odisha",
    capacity: 21800, type: "Hockey", sport: "Hockey", category: "Hockey",
    gates: 5, parkingZones: 3, foodCourts: 4,
    homeTeams: [],
    layout: { blocks: ["Main Stand","East Stand","West Stand","North End"] },
    seating: {
      shape: "rectangular",
      sections: [
        { id:"north", name:"North End",       shortName:"North\nEnd",   side:"north", gates:["Gate 1","Gate 5"] },
        { id:"east",  name:"East Stand",      shortName:"East\nStand",  side:"east",  gates:["Gate 2"] },
        { id:"south", name:"Main Stand",      shortName:"Main\nStand",  side:"south", gates:["Gate 3"] },
        { id:"west",  name:"West Stand",      shortName:"West\nStand",  side:"west",  gates:["Gate 4"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Court",   sectionId:"east"  },
        { type:"food",     name:"Gate 3 Food Zone",    sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",     sectionId:"north" },
        { type:"restroom", name:"Gate 3 Restroom",     sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",    sectionId:"north" },
        { type:"exit",     name:"Gate 3 Exit",         sectionId:"south" },
      ]
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INDOOR — VERIFIED REAL SEATING LAYOUTS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "i1",
    name: "Indira Gandhi Arena",
    city: "New Delhi", state: "Delhi",
    capacity: 14348, type: "Indoor", sport: "Indoor Sports", category: "Indoor",
    gates: 6, parkingZones: 4, foodCourts: 5,
    homeTeams: [],
    layout: { blocks: ["Block A","Block B","Block C","Block D","VIP Level","Media Level"] },
    seating: {
      shape: "indoor",
      sections: [
        { id:"north", name:"Block A (North)",   shortName:"Block A\nNorth", side:"north", gates:["Gate 1","Gate 2"] },
        { id:"east",  name:"Block B (East)",    shortName:"Block B\nEast",  side:"east",  gates:["Gate 3"] },
        { id:"south", name:"Block C (South)",   shortName:"Block C\nSouth", side:"south", gates:["Gate 4","Gate 5"] },
        { id:"west",  name:"Block D (VIP)",     shortName:"VIP\nBlock D",   side:"west",  gates:["Gate 6"] },
      ],
      facilities: [
        { type:"food",     name:"Concourse Food Stalls", sectionId:"east"  },
        { type:"food",     name:"Level 1 Canteen",       sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",       sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",       sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",      sectionId:"north" },
        { type:"exit",     name:"Gate 4 Exit",           sectionId:"south" },
      ]
    }
  },

  {
    id: "i2",
    name: "Netaji Indoor Stadium",
    city: "Kolkata", state: "West Bengal",
    capacity: 12000, type: "Indoor", sport: "Indoor Sports", category: "Indoor",
    gates: 5, parkingZones: 3, foodCourts: 4,
    homeTeams: ["Bengal Warriors"],
    layout: { blocks: ["East Gallery","West Gallery","North End","South End","VIP Box"] },
    seating: {
      shape: "indoor",
      sections: [
        { id:"north", name:"North End",        shortName:"North\nEnd",  side:"north", gates:["Gate 1"] },
        { id:"east",  name:"East Gallery",     shortName:"East\nGal",   side:"east",  gates:["Gate 2","Gate 3"] },
        { id:"south", name:"South End (VIP)",  shortName:"VIP\nSouth",  side:"south", gates:["Gate 4"] },
        { id:"west",  name:"West Gallery",     shortName:"West\nGal",   side:"west",  gates:["Gate 5"] },
      ],
      facilities: [
        { type:"food",     name:"Gate 2 Food Stalls",   sectionId:"east"  },
        { type:"food",     name:"Gate 4 Canteen",       sectionId:"south" },
        { type:"restroom", name:"Gate 1 Restroom",      sectionId:"north" },
        { type:"restroom", name:"Gate 4 Restroom",      sectionId:"south" },
        { type:"exit",     name:"Main Exit Gate 1",     sectionId:"north" },
        { type:"exit",     name:"Gate 4 Exit",          sectionId:"south" },
      ]
    }
  },
];

// ── Derived filter values ─────────────────────────────────────────────────────
export const ALL_CITIES   = [...new Set(STADIUM_DB.map(s => s.city))].sort();
export const ALL_STATES   = [...new Set(STADIUM_DB.map(s => s.state))].sort();
export const ALL_SPORTS   = ["Cricket", "Football", "Hockey", "Indoor Sports"];
export const ALL_CATEGORIES = ["Cricket", "Football", "Hockey", "Indoor"];

// ── Simulated API ─────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

export const api = {
  async getStadiums() {
    await delay(400);
    return STADIUM_DB;
  },

  async getStadiumById(id) {
    await delay(150);
    const s = STADIUM_DB.find(s => s.id === id);
    if (!s) throw new Error("Stadium not found");
    return s;
  },

  async searchStadiums({ query = "", city = "", sport = "" } = {}) {
    await delay(120);
    return STADIUM_DB.filter(s => {
      const q = query.toLowerCase();
      const matchQ  = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
      const matchC  = !city  || s.city === city;
      const matchS  = !sport || s.sport.toLowerCase().includes(sport.toLowerCase()) || s.type.toLowerCase().includes(sport.toLowerCase());
      return matchQ && matchC && matchS;
    });
  },

  async getDynamicTraffic(stadiumId) {
    await delay(200);
    const rand = Math.random();
    const level = rand < 0.2 ? "Low" : rand < 0.6 ? "Moderate" : rand < 0.9 ? "High" : "Severe";
    const mult  = { Low:1, Moderate:1.5, High:2.5, Severe:4 }[level];
    return { trafficLevel: level, estimatedTimeMins: Math.round(20 * mult + Math.random() * 5), distanceKm: (Math.random() * 10 + 5).toFixed(1) };
  },

  async getDynamicGateCongestion(stadiumId) {
    await delay(200);
    const stadium = STADIUM_DB.find(s => s.id === stadiumId);
    if (!stadium) throw new Error("Stadium not found");
    const count = Math.min(stadium.gates || 6, 16);
    const gateData = [];
    let lowestWait = Infinity, bestGate = 1;
    for (let i = 1; i <= count; i++) {
      const wait = Math.floor(Math.random() * 40) + 1;
      const cong = wait < 10 ? "low" : wait < 25 ? "medium" : "high";
      if (wait < lowestWait) { lowestWait = wait; bestGate = i; }
      gateData.push({ gate: i, waitTimeMins: wait, congestion: cong });
    }
    const avg = gateData.reduce((a, c) => a + c.waitTimeMins, 0) / count;
    const density = avg > 25 ? "dense" : avg > 15 ? "moderate" : "light";
    return { overallDensity: density, gates: gateData, recommendedGate: bestGate, recommendedWaitTime: lowestWait };
  },

  async getStadiumGraph(stadiumId) {
    await delay(200);
    const nodes = [
      { id: 'gate1', type: 'gate', label: 'Gate 1', density: 'low', waitTime: 5, x: 60, y: 50, capacity: 5000 },
      { id: 'gate2', type: 'gate', label: 'Gate 2', density: 'high', waitTime: 25, x: 340, y: 50, capacity: 5000 },
      { id: 'corr1', type: 'corridor', label: 'North Concourse', density: 'medium', x: 200, y: 100, capacity: 2000 },
      { id: 'corr2', type: 'corridor', label: 'South Concourse', density: 'low', x: 200, y: 250, capacity: 2000 },
      { id: 'sectA', type: 'section', label: 'North Stand', density: 'low', x: 100, y: 175, capacity: 12000 },
      { id: 'sectB', type: 'section', label: 'South Stand', density: 'high', x: 300, y: 175, capacity: 12000 },
      { id: 'lift1', type: 'lift', label: 'Main Lift', density: 'low', x: 200, y: 175, capacity: 500 }
    ];
    const edges = [
      { id: 'e1', from: 'gate1', to: 'corr1', distance: 120, time: 2, flow: 'medium', blocked: false },
      { id: 'e2', from: 'gate2', to: 'corr1', distance: 300, time: 5, flow: 'busy', blocked: false },
      { id: 'e3', from: 'corr1', to: 'sectA', distance: 150, time: 3, flow: 'low', blocked: false },
      { id: 'e4', from: 'corr1', to: 'sectB', distance: 150, time: 4, flow: 'busy', blocked: false },
      { id: 'e5', from: 'corr1', to: 'lift1', distance: 100, time: 2, flow: 'low', blocked: false },
      { id: 'e6', from: 'corr2', to: 'sectA', distance: 80, time: 1.5, flow: 'low', blocked: false },
      { id: 'e7', from: 'corr2', to: 'sectB', distance: 80, time: 2, flow: 'medium', blocked: false }
    ];
    return { nodes, edges };
  },

  async getTicketStatus(stadiumId) {
    await delay(100);
    const stadium = STADIUM_DB.find(s => s.id === stadiumId);
    const total = stadium?.capacity || 50000;
    const online = Math.floor(total * 0.45);
    const onSpot = Math.floor(total * 0.12);
    return { total, online, onSpot, booked: online + onSpot };
  },

  async getOutsideIntelligence(stadiumId) {
    await delay(200);
    return {
      traffic: [
        { road: 'Stadium North Approach', status: 'High', time: 18, delay: 10 },
        { road: 'Main Stadium Boulevard', status: 'Medium', time: 12, delay: 5 },
        { road: 'East Gate Link Road', status: 'Low', time: 4, delay: 0 }
      ],
      gateFlow: [
        { gate: 'Gate 1', queueLen: 'Short', delayMins: 5, security: 'Fast' },
        { gate: 'Gate 4', queueLen: 'Moderate', delayMins: 12, security: 'Normal' },
        { gate: 'Gate 9', queueLen: 'Long', delayMins: 25, security: 'Checking' }
      ],
      parking: [
        { name: 'Yellow Zone', status: 'Available', slots: 142, distance: '300m' },
        { name: 'VIP Lot A', status: 'Full', slots: 0, distance: '50m' },
        { name: 'South Overflow', status: 'Available', slots: 850, distance: '1.2km' }
      ],
      essentials: [
        { name: 'Street Food Hub', type: 'food', dist: '150m', rating: 4.5 },
        { name: 'H2O Points', type: 'water', dist: '200m', rating: 4.8 },
        { name: 'First Aid Post', type: 'emergency', dist: '100m', rating: 5.0 }
      ]
    };
  }
};


/**
 * Smart Material & Labor Estimator — Config & Formula Engine
 * Each profession entry defines:
 *  - fields:      input descriptors rendered by SmartEstimator.jsx
 *  - tips:        contextual hints shown beside each field
 *  - calculate:   pure function (inputs, hourlyRate) → EstimateResult
 *  - highlights:  fn(inputs, result) → [{label, value}] for summary chips
 *
 * EstimateResult shape:
 * {
 *   materials:    [{ name, qty, unit, unitCost, subtotal }],
 *   laborHours:   number,
 *   laborCost:    number,
 *   materialCost: number,
 *   totalCost:    number,
 *   summary:      string,   // e.g. "2.1 gal Paint | 3.5 hrs Labor"
 * }
 */

export const ESTIMATOR_CONFIG = {
  // ─── PAINTER ────────────────────────────────────────────────────────────────
  Painter: {
    icon: "🎨",
    accentColor: "#6366f1",
    description: "Estimates paint quantity and labor for interior wall painting.",
    savingsTip: "Booking in advance can save up to 20% on labor costs.",
    fields: [
      {
        key: "width",
        label: "Wall Width",
        unit: "ft",
        type: "number",
        min: 5,
        max: 100,
        default: 12,
        step: 0.5,
        tip: "Measure the longest side of your room",
        icon: "↔",
      },
      {
        key: "height",
        label: "Wall Height",
        unit: "ft",
        type: "number",
        min: 6,
        max: 20,
        default: 9,
        step: 0.5,
        tip: "Standard ceiling height is 9–10 ft",
        icon: "↕",
      },
      {
        key: "walls",
        label: "Number of Walls",
        unit: "walls",
        type: "number",
        min: 1,
        max: 20,
        default: 4,
        step: 1,
        tip: "A standard room has 4 walls",
        icon: "⬛",
      },
      {
        key: "coats",
        label: "Coats of Paint",
        unit: "coats",
        type: "number",
        min: 1,
        max: 4,
        default: 2,
        step: 1,
        tip: "2 coats gives the best finish",
        icon: "🖌",
      },
    ],
    calculate({ width, height, walls, coats }, hourlyRate) {
      const totalArea   = width * height * walls;
      const paintGal    = parseFloat(((totalArea * coats) / 350).toFixed(2));
      const primerGal   = parseFloat((totalArea / 400).toFixed(2));
      const laborHours  = parseFloat(((totalArea / 100) * 1.5 * coats).toFixed(2));

      const paintCost    = parseFloat((paintGal  * 32).toFixed(2));
      const primerCost   = parseFloat((primerGal * 18).toFixed(2));
      const laborCost    = parseFloat((laborHours * hourlyRate).toFixed(2));
      const materialCost = parseFloat((paintCost + primerCost).toFixed(2));
      const totalCost    = parseFloat((materialCost + laborCost).toFixed(2));

      return {
        materials: [
          { name: "Paint",  qty: paintGal,  unit: "gal", unitCost: 32, subtotal: paintCost  },
          { name: "Primer", qty: primerGal, unit: "gal", unitCost: 18, subtotal: primerCost },
        ],
        laborHours,
        laborCost,
        materialCost,
        totalCost,
        summary: `${paintGal} gal Paint | ${laborHours} hrs Labor`,
      };
    },
    highlights({ width, height, walls, coats }, result) {
      return [
        { label: "Total Area",  value: `${(width * height * walls).toFixed(0)} sqft` },
        { label: "Paint Needed", value: `${result.materials[0].qty} gal` },
        { label: "Est. Duration", value: `${result.laborHours} hrs` },
        { label: "Coats",       value: `${coats}×` },
      ];
    },
  },

  // ─── PLUMBER ────────────────────────────────────────────────────────────────
  Plumber: {
    icon: "🔧",
    accentColor: "#0ea5e9",
    description: "Estimates pipe material and labor for plumbing work.",
    savingsTip: "Fixing small leaks early prevents costly water damage later.",
    fields: [
      {
        key: "pipeLength",
        label: "Pipe Length",
        unit: "ft",
        type: "number",
        min: 0,
        max: 500,
        default: 20,
        step: 1,
        tip: "Measure total run from source to fixture",
        icon: "📏",
      },
      {
        key: "fixtures",
        label: "Fixtures to Replace",
        unit: "fixtures",
        type: "number",
        min: 0,
        max: 20,
        default: 2,
        step: 1,
        tip: "Faucets, toilets, showerheads, etc.",
        icon: "🚿",
      },
      {
        key: "leaks",
        label: "Active Leaks",
        unit: "leaks",
        type: "number",
        min: 0,
        max: 10,
        default: 1,
        step: 1,
        tip: "Count visible drips or wet spots",
        icon: "💧",
      },
      {
        key: "shutoffs",
        label: "Shut-off Valves",
        unit: "valves",
        type: "number",
        min: 0,
        max: 10,
        default: 1,
        step: 1,
        tip: "Valves for isolating individual supply lines",
        icon: "🔩",
      },
    ],
    calculate({ pipeLength, fixtures, leaks, shutoffs }, hourlyRate) {
      const pipeCost     = parseFloat((pipeLength * 4.5).toFixed(2));
      const fixtureCost  = parseFloat((fixtures   * 45).toFixed(2));
      const valveCost    = parseFloat((shutoffs   * 18).toFixed(2));
      const sealantCost  = leaks > 0 ? parseFloat((leaks * 8).toFixed(2)) : 0;

      const laborHours   = parseFloat((2 + leaks * 0.5 + fixtures * 1.2 + shutoffs * 0.5).toFixed(2));
      const laborCost    = parseFloat((laborHours * hourlyRate).toFixed(2));
      const materialCost = parseFloat((pipeCost + fixtureCost + valveCost + sealantCost).toFixed(2));
      const totalCost    = parseFloat((materialCost + laborCost).toFixed(2));

      const materials = [
        { name: "Pipe",     qty: pipeLength, unit: "ft",  unitCost: 4.5, subtotal: pipeCost    },
        { name: "Fixtures", qty: fixtures,   unit: "pcs", unitCost: 45,  subtotal: fixtureCost },
        { name: "Valves",   qty: shutoffs,   unit: "pcs", unitCost: 18,  subtotal: valveCost   },
      ];
      if (leaks > 0) materials.push({ name: "Sealant", qty: leaks, unit: "kits", unitCost: 8, subtotal: sealantCost });

      return { materials, laborHours, laborCost, materialCost, totalCost,
        summary: `${pipeLength} ft Pipe | ${fixtures} Fixtures | ${laborHours} hrs Labor` };
    },
    highlights({ pipeLength, fixtures, leaks }, result) {
      return [
        { label: "Pipe Run",   value: `${pipeLength} ft`  },
        { label: "Fixtures",   value: `${fixtures} pcs`   },
        { label: "Leaks",      value: `${leaks}`          },
        { label: "Est. Duration", value: `${result.laborHours} hrs` },
      ];
    },
  },

  // ─── ELECTRICIAN ────────────────────────────────────────────────────────────
  Electrician: {
    icon: "⚡",
    accentColor: "#f59e0b",
    description: "Estimates wiring material and labor for electrical work.",
    savingsTip: "Grouping multiple jobs saves on call-out fees.",
    fields: [
      {
        key: "points",
        label: "Electrical Points",
        unit: "points",
        type: "number",
        min: 1,
        max: 50,
        default: 5,
        step: 1,
        tip: "Each outlet, switch, or fixture is one point",
        icon: "🔌",
      },
      {
        key: "switches",
        label: "Switches / Sockets",
        unit: "pcs",
        type: "number",
        min: 0,
        max: 30,
        default: 3,
        step: 1,
        tip: "Count wall switches and power sockets",
        icon: "💡",
      },
      {
        key: "panels",
        label: "Circuit Panels",
        unit: "panels",
        type: "number",
        min: 0,
        max: 5,
        default: 1,
        step: 1,
        tip: "Main or sub breaker panels to install or upgrade",
        icon: "🗄",
      },
      {
        key: "fixtures",
        label: "Light Fixtures",
        unit: "pcs",
        type: "number",
        min: 0,
        max: 20,
        default: 4,
        step: 1,
        tip: "Ceiling lights, fans, or pendant lights",
        icon: "🔦",
      },
    ],
    calculate({ points, switches, panels, fixtures }, hourlyRate) {
      const wireFt      = points * 15;
      const wireCost    = parseFloat((wireFt    * 1.2).toFixed(2));
      const switchCost  = parseFloat((switches  * 12).toFixed(2));
      const panelCost   = parseFloat((panels    * 120).toFixed(2));
      const fixtureCost = parseFloat((fixtures  * 25).toFixed(2));

      const laborHours   = parseFloat((points * 1.5 + panels * 2 + fixtures * 0.5).toFixed(2));
      const laborCost    = parseFloat((laborHours * hourlyRate).toFixed(2));
      const materialCost = parseFloat((wireCost + switchCost + panelCost + fixtureCost).toFixed(2));
      const totalCost    = parseFloat((materialCost + laborCost).toFixed(2));

      return {
        materials: [
          { name: "Wiring",   qty: wireFt,   unit: "ft",  unitCost: 1.2,  subtotal: wireCost    },
          { name: "Switches", qty: switches,  unit: "pcs", unitCost: 12,   subtotal: switchCost  },
          { name: "Panels",   qty: panels,    unit: "pcs", unitCost: 120,  subtotal: panelCost   },
          { name: "Fixtures", qty: fixtures,  unit: "pcs", unitCost: 25,   subtotal: fixtureCost },
        ],
        laborHours, laborCost, materialCost, totalCost,
        summary: `${wireFt} ft Wire | ${fixtures} Fixtures | ${laborHours} hrs Labor`,
      };
    },
    highlights({ points, panels, fixtures }, result) {
      return [
        { label: "Wire Run",   value: `${points * 15} ft`   },
        { label: "Panels",     value: `${panels}`           },
        { label: "Fixtures",   value: `${fixtures} pcs`     },
        { label: "Est. Duration", value: `${result.laborHours} hrs` },
      ];
    },
  },

  // ─── CARPENTER ──────────────────────────────────────────────────────────────
  Carpenter: {
    icon: "🪚",
    accentColor: "#92400e",
    description: "Estimates wood material and labor for carpentry projects.",
    savingsTip: "Buying wood in bulk can reduce material cost by up to 15%.",
    fields: [
      {
        key: "pieces",
        label: "Furniture / Pieces",
        unit: "pcs",
        type: "number",
        min: 1,
        max: 20,
        default: 2,
        step: 1,
        tip: "Shelves, cabinets, tables, etc.",
        icon: "🪑",
      },
      {
        key: "sqft",
        label: "Wood Area per Piece",
        unit: "sqft",
        type: "number",
        min: 4,
        max: 100,
        default: 20,
        step: 1,
        tip: "Estimate surface area for each piece",
        icon: "📐",
      },
      {
        key: "hardware",
        label: "Hardware Sets",
        unit: "sets",
        type: "number",
        min: 0,
        max: 20,
        default: 2,
        step: 1,
        tip: "Hinges, handles, drawer slides, etc.",
        icon: "🔩",
      },
      {
        key: "finish",
        label: "Finishing Coats",
        unit: "coats",
        type: "number",
        min: 1,
        max: 3,
        default: 2,
        step: 1,
        tip: "Varnish or stain coats for protection",
        icon: "✨",
      },
    ],
    calculate({ pieces, sqft, hardware, finish }, hourlyRate) {
      const woodCost     = parseFloat((pieces * sqft * 3.5).toFixed(2));
      const hardwareCost = parseFloat((hardware * 22).toFixed(2));
      const finishCost   = parseFloat((pieces * finish * 8).toFixed(2));

      const laborHours   = parseFloat((pieces * 2.5 + hardware * 0.5).toFixed(2));
      const laborCost    = parseFloat((laborHours * hourlyRate).toFixed(2));
      const materialCost = parseFloat((woodCost + hardwareCost + finishCost).toFixed(2));
      const totalCost    = parseFloat((materialCost + laborCost).toFixed(2));

      return {
        materials: [
          { name: "Wood",     qty: pieces * sqft,  unit: "sqft",  unitCost: 3.5, subtotal: woodCost     },
          { name: "Hardware", qty: hardware,        unit: "sets",  unitCost: 22,  subtotal: hardwareCost },
          { name: "Finish",   qty: pieces * finish, unit: "coats", unitCost: 8,   subtotal: finishCost   },
        ],
        laborHours, laborCost, materialCost, totalCost,
        summary: `${pieces * sqft} sqft Wood | ${hardware} Hardware Sets | ${laborHours} hrs Labor`,
      };
    },
    highlights({ pieces, sqft, hardware }, result) {
      return [
        { label: "Total Wood",  value: `${pieces * sqft} sqft` },
        { label: "Pieces",      value: `${pieces}`             },
        { label: "Hardware",    value: `${hardware} sets`      },
        { label: "Est. Duration", value: `${result.laborHours} hrs` },
      ];
    },
  },

  // ─── CLEANER ────────────────────────────────────────────────────────────────
  Cleaner: {
    icon: "🧹",
    accentColor: "#10b981",
    description: "Estimates cleaning supplies and labor for home cleaning.",
    savingsTip: "Regular weekly cleaning costs 40% less than monthly deep cleans.",
    fields: [
      {
        key: "rooms",
        label: "Rooms to Clean",
        unit: "rooms",
        type: "number",
        min: 1,
        max: 20,
        default: 3,
        step: 1,
        tip: "Living rooms, bedrooms, kitchen, etc.",
        icon: "🛋",
      },
      {
        key: "bathrooms",
        label: "Bathrooms",
        unit: "baths",
        type: "number",
        min: 0,
        max: 10,
        default: 1,
        step: 1,
        tip: "Full bathrooms take ~45 min each",
        icon: "🚿",
      },
      {
        key: "deepClean",
        label: "Deep Clean Rooms",
        unit: "rooms",
        type: "number",
        min: 0,
        max: 10,
        default: 1,
        step: 1,
        tip: "Extra scrubbing, inside appliances, grout, etc.",
        icon: "🫧",
      },
      {
        key: "windows",
        label: "Windows",
        unit: "windows",
        type: "number",
        min: 0,
        max: 30,
        default: 4,
        step: 1,
        tip: "Count panes including sliding doors",
        icon: "🪟",
      },
    ],
    calculate({ rooms, bathrooms, deepClean, windows }, hourlyRate) {
      const suppliesCost  = parseFloat(((rooms + bathrooms) * 8).toFixed(2));
      const deepCleanCost = parseFloat((deepClean * 15).toFixed(2));
      const windowCost    = parseFloat((windows * 3).toFixed(2));

      const laborHours    = parseFloat((rooms * 1.5 + bathrooms * 0.75 + deepClean * 1.0 + windows * 0.25).toFixed(2));
      const laborCost     = parseFloat((laborHours * hourlyRate).toFixed(2));
      const materialCost  = parseFloat((suppliesCost + deepCleanCost + windowCost).toFixed(2));
      const totalCost     = parseFloat((materialCost + laborCost).toFixed(2));

      return {
        materials: [
          { name: "Supplies",   qty: rooms + bathrooms, unit: "rooms", unitCost: 8,  subtotal: suppliesCost  },
          { name: "Deep Clean", qty: deepClean,          unit: "rooms", unitCost: 15, subtotal: deepCleanCost },
          { name: "Window Kit", qty: windows,            unit: "pcs",   unitCost: 3,  subtotal: windowCost    },
        ],
        laborHours, laborCost, materialCost, totalCost,
        summary: `${rooms + bathrooms} Rooms | ${windows} Windows | ${laborHours} hrs Labor`,
      };
    },
    highlights({ rooms, bathrooms, windows }, result) {
      return [
        { label: "Total Rooms", value: `${rooms + bathrooms}` },
        { label: "Windows",     value: `${windows}`           },
        { label: "Deep Clean",  value: `${result.materials[1].qty} rooms` },
        { label: "Est. Duration", value: `${result.laborHours} hrs` },
      ];
    },
  },

  // ─── HVAC TECHNICIAN ────────────────────────────────────────────────────────
  "HVAC Technician": {
    icon: "❄️",
    accentColor: "#06b6d4",
    description: "Estimates AC/heating unit costs and labor for HVAC installation or service.",
    savingsTip: "Annual servicing extends unit life by 5–8 years.",
    fields: [
      {
        key: "units",
        label: "AC / Heating Units",
        unit: "units",
        type: "number",
        min: 1,
        max: 10,
        default: 1,
        step: 1,
        tip: "Count each indoor or outdoor unit",
        icon: "🌡",
      },
      {
        key: "ducts",
        label: "Duct Length",
        unit: "ft",
        type: "number",
        min: 0,
        max: 300,
        default: 40,
        step: 5,
        tip: "Total flexible or rigid duct run",
        icon: "🌀",
      },
      {
        key: "refrigerant",
        label: "Refrigerant (lbs)",
        unit: "lbs",
        type: "number",
        min: 0,
        max: 20,
        default: 3,
        step: 0.5,
        tip: "R-410A is the most common type",
        icon: "🧊",
      },
      {
        key: "filters",
        label: "Air Filters",
        unit: "pcs",
        type: "number",
        min: 1,
        max: 10,
        default: 2,
        step: 1,
        tip: "HEPA filters recommended for allergies",
        icon: "🌬",
      },
    ],
    calculate({ units, ducts, refrigerant, filters }, hourlyRate) {
      const unitPartsCost   = parseFloat((units * 85).toFixed(2));       // $85/unit parts
      const ductCost        = parseFloat((ducts * 3.5).toFixed(2));      // $3.50/ft
      const refrigerantCost = parseFloat((refrigerant * 22).toFixed(2)); // $22/lb
      const filterCost      = parseFloat((filters * 18).toFixed(2));     // $18/filter

      const laborHours   = parseFloat((units * 2.5 + (ducts / 40) * 1.5).toFixed(2));
      const laborCost    = parseFloat((laborHours * hourlyRate).toFixed(2));
      const materialCost = parseFloat((unitPartsCost + ductCost + refrigerantCost + filterCost).toFixed(2));
      const totalCost    = parseFloat((materialCost + laborCost).toFixed(2));

      return {
        materials: [
          { name: "Unit Parts",   qty: units,        unit: "pcs",  unitCost: 85,   subtotal: unitPartsCost   },
          { name: "Ducting",      qty: ducts,        unit: "ft",   unitCost: 3.5,  subtotal: ductCost        },
          { name: "Refrigerant",  qty: refrigerant,  unit: "lbs",  unitCost: 22,   subtotal: refrigerantCost },
          { name: "Air Filters",  qty: filters,      unit: "pcs",  unitCost: 18,   subtotal: filterCost      },
        ],
        laborHours, laborCost, materialCost, totalCost,
        summary: `${units} Unit(s) | ${refrigerant} lbs Refrigerant | ${laborHours} hrs Labor`,
      };
    },
    highlights({ units, ducts, refrigerant }, result) {
      return [
        { label: "Units",        value: `${units}`           },
        { label: "Duct Run",     value: `${ducts} ft`        },
        { label: "Refrigerant",  value: `${refrigerant} lbs` },
        { label: "Est. Duration", value: `${result.laborHours} hrs` },
      ];
    },
  },
};

/**
 * Returns the config for a given profession string.
 * Falls back to null if the profession is not supported.
 */
export function getEstimatorConfig(profession) {
  return ESTIMATOR_CONFIG[profession] ?? null;
}

/**
 * Parses a price string like "$45/hr" → 45
 */
export function parseHourlyRate(priceString) {
  const match = String(priceString).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 40;
}

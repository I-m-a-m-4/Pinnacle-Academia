export interface JambSyllabusTopic {
  id: string;
  title: string;
  objectives?: string[];
}

export interface JambSyllabusSection {
  title: string;
  topics: JambSyllabusTopic[];
}

export interface JambSyllabusSubject {
  id: string;
  name: string;
  code: string;
  category: 'Compulsory' | 'Science' | 'Arts' | 'Commercial & Social Sciences';
  questionCount: number;
  description: string;
  sections: JambSyllabusSection[];
}

export const JAMB_SYLLABUS: JambSyllabusSubject[] = [
  {
    id: 'jamb-use-of-english',
    name: 'Use of English',
    code: 'ENG',
    category: 'Compulsory',
    questionCount: 60,
    description: 'Compulsory for all JAMB UTME candidates. Covers comprehension, lexis & structure, oral forms, and recommended literary text.',
    sections: [
      {
        title: 'Section A: Comprehension & Summary',
        topics: [
          { id: 'eng-1', title: 'Comprehension Passages (Description, Narration, Exposition, Argumentation)', objectives: ['Identify main points and topic sentences', 'Deduce implied meanings and author tone', 'Determine meanings of words and expressions in context'] },
          { id: 'eng-2', title: 'Cloze Passage', objectives: ['Identify appropriate lexical and grammatical items to complete passages'] },
          { id: 'eng-3', title: 'Reading Text (JAMB Recommended Novel)', objectives: ['Analyze plot, themes, characters, setting, and literary devices in the prescribed JAMB novel'] },
        ],
      },
      {
        title: 'Section B: Lexis and Structure',
        topics: [
          { id: 'eng-4', title: 'Synonyms & Antonyms', objectives: ['Identify words nearest in meaning and opposite in meaning in context'] },
          { id: 'eng-5', title: 'Sentence Interpretation, Idioms & Figurative Usage', objectives: ['Interpret idiomatic expressions, proverbs, and figurative statements accurately'] },
          { id: 'eng-6', title: 'Parts of Speech, Concord & Sentence Structure', objectives: ['Apply subject-verb agreement, tenses, prepositions, clauses, and modifiers correctly'] },
          { id: 'eng-7', title: 'Registers & Vocabulary Development', objectives: ['Use appropriate vocabulary for medicine, law, commerce, agriculture, journalism, and technology'] },
        ],
      },
      {
        title: 'Section C: Oral Forms',
        topics: [
          { id: 'eng-8', title: 'Vowels (Monophthongs, Diphthongs & Triphthongs)', objectives: ['Distinguish vowel sounds and identify words with identical vowel sounds'] },
          { id: 'eng-9', title: 'Consonants & Consonant Clusters', objectives: ['Identify voiced/voiceless consonants, silent letters, and rhymes'] },
          { id: 'eng-10', title: 'Word Stress, Emphatic Stress & Intonation', objectives: ['Identify primary stress in polysyllabic words and determine emphatic stress answers'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-mathematics',
    name: 'Mathematics',
    code: 'MTH',
    category: 'Science',
    questionCount: 40,
    description: 'Covers Number & Numeration, Algebra, Geometry & Trigonometry, Calculus, and Statistics.',
    sections: [
      {
        title: 'Section I: Number and Numeration',
        topics: [
          { id: 'mth-1', title: 'Number Bases (Conversion & Operations)', objectives: ['Perform arithmetic operations in bases 2 to 10', 'Convert numbers between bases including bicimals'] },
          { id: 'mth-2', title: 'Fractions, Decimals, Approximations & Percentages', objectives: ['Compute percentage error, profit/loss, simple & compound interest, ratio and proportion'] },
          { id: 'mth-3', title: 'Indices, Logarithms & Surds', objectives: ['Apply laws of indices and logarithms', 'Rationalize denominators and simplify surds'] },
          { id: 'mth-4', title: 'Sets & Venn Diagrams', objectives: ['Solve real-world problems involving up to 3 sets using Venn diagrams'] },
        ],
      },
      {
        title: 'Section II: Algebra',
        topics: [
          { id: 'mth-5', title: 'Polynomials, Factorization & Remainder Theorem', objectives: ['Factorize polynomials up to degree 3 and apply factor/remainder theorems'] },
          { id: 'mth-6', title: 'Variation (Direct, Inverse, Joint & Partial)', objectives: ['Formulate and solve variation equations'] },
          { id: 'mth-7', title: 'Inequalities (Linear & Quadratic)', objectives: ['Solve and represent linear and quadratic inequalities graphically'] },
          { id: 'mth-8', title: 'Progressions (AP & GP)', objectives: ['Find nth term, sum of n terms, and sum to infinity of GP'] },
          { id: 'mth-9', title: 'Binary Operations, Matrices & Determinants', objectives: ['Determine identity/inverse elements', 'Compute 2x2 and 3x3 determinants and matrix inverses'] },
        ],
      },
      {
        title: 'Section III: Geometry & Trigonometry',
        topics: [
          { id: 'mth-10', title: 'Euclidean Geometry & Circle Theorems', objectives: ['Apply angle properties of polygons, parallel lines, chords, and tangents'] },
          { id: 'mth-11', title: 'Mensuration (Areas & Volumes of Plane/Solid Shapes)', objectives: ['Calculate surface area and volume of cylinders, cones, spheres, pyramids, and frustums'] },
          { id: 'mth-12', title: 'Coordinate Geometry & Loci', objectives: ['Find distance, midpoint, gradient, parallel/perpendicular line equations'] },
          { id: 'mth-13', title: 'Trigonometry, Bearings & Angles of Elevation/Depression', objectives: ['Apply sine/cosine rules, trig identities, and solve bearing problems'] },
        ],
      },
      {
        title: 'Section IV: Calculus & Statistics',
        topics: [
          { id: 'mth-14', title: 'Differentiation & Applications (Maxima, Minima, Rates)', objectives: ['Differentiate algebraic and trig functions; find turning points and tangent equations'] },
          { id: 'mth-15', title: 'Integration & Area Under Curves', objectives: ['Evaluate definite and indefinite integrals'] },
          { id: 'mth-16', title: 'Statistics, Measures of Dispersion, Permutations & Probability', objectives: ['Compute mean, median, mode, variance, standard deviation, nPr, nCr, and probabilities'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-physics',
    name: 'Physics',
    code: 'PHY',
    category: 'Science',
    questionCount: 40,
    description: 'Covers Mechanics, Thermal Physics, Waves & Optics, Electricity & Magnetism, and Modern Physics.',
    sections: [
      {
        title: 'Mechanics & Properties of Matter',
        topics: [
          { id: 'phy-1', title: 'Measurements, Units, Dimensions & Scalars/Vectors', objectives: ['Use vernier calipers, micrometer screw gauge, and resolve vectors'] },
          { id: 'phy-2', title: 'Kinematics, Motion, Projectiles & Newton\'s Laws', objectives: ['Apply equations of motion, momentum conservation, and projectile formulas'] },
          { id: 'phy-3', title: 'Work, Energy, Power & Simple Machines', objectives: ['Calculate mechanical advantage, velocity ratio, and efficiency'] },
          { id: 'phy-4', title: 'Equilibrium of Forces, Elasticity (Hooke\'s Law) & Pressure', objectives: ['Apply moments, Young\'s modulus, Archimedes\' principle, and Pascal\'s principle'] },
          { id: 'phy-5', title: 'Gravitational Field & Simple Harmonic Motion', objectives: ['Apply Newton\'s law of gravitation, escape velocity, and pendulum period'] },
        ],
      },
      {
        title: 'Heat & Thermodynamics',
        topics: [
          { id: 'phy-6', title: 'Temperature, Thermal Expansion & Gas Laws', objectives: ['Solve problems on linear/volume expansivity, Boyle\'s, Charles\', and ideal gas laws'] },
          { id: 'phy-7', title: 'Quantity of Heat, Latent Heat, Vapours & Heat Transfer', objectives: ['Apply specific heat capacity, latent heat, relative humidity, conduction, convection, radiation'] },
        ],
      },
      {
        title: 'Waves, Sound & Light',
        topics: [
          { id: 'phy-8', title: 'Wave Motion, Properties of Waves & Sound Waves', objectives: ['Use progressive wave equation, resonance, beats, and Doppler effect'] },
          { id: 'phy-9', title: 'Reflection, Refraction, Lenses, Optical Instruments & Dispersion', objectives: ['Apply mirror/lens formulas, Snell\'s law, critical angle, and defects of vision'] },
        ],
      },
      {
        title: 'Electricity, Magnetism & Modern Physics',
        topics: [
          { id: 'phy-10', title: 'Electrostatics, Capacitors & Current Electricity', objectives: ['Apply Coulomb\'s law, Ohm\'s law, Kirchhoff\'s laws, resistors/capacitors in series & parallel'] },
          { id: 'phy-11', title: 'Magnetic Fields, Electromagnetic Induction & A.C. Circuits', objectives: ['Apply Faraday\'s/Lenz\'s laws, transformers, impedance, and resonance in RLC circuits'] },
          { id: 'phy-12', title: 'Atomic Structure, Photoelectric Effect, Radioactivity & Electronics', objectives: ['Solve half-life, nuclear binding energy, Einstein\'s photoelectric equation, and p-n junctions'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-chemistry',
    name: 'Chemistry',
    code: 'CHM',
    category: 'Science',
    questionCount: 40,
    description: 'Covers Physical Chemistry, Inorganic Chemistry, Organic Chemistry, and Environmental Chemistry.',
    sections: [
      {
        title: 'General & Physical Chemistry',
        topics: [
          { id: 'chm-1', title: 'Separation of Mixtures & Purification of Substances', objectives: ['Distinguish physical/chemical changes and select appropriate separation techniques'] },
          { id: 'chm-2', title: 'Chemical Combination, Stoichiometry & Mole Concept', objectives: ['Calculate empirical/molecular formulas, molarity, and reacting masses/volumes'] },
          { id: 'chm-3', title: 'Kinetic Theory of Matter & Gas Laws', objectives: ['Apply Boyle\'s, Charles\', Graham\'s law of diffusion, and Dalton\'s law of partial pressures'] },
          { id: 'chm-4', title: 'Atomic Structure, Periodicity & Chemical Bonding', objectives: ['Write electronic configurations, predict periodic trends, and explain hybridization/bonding'] },
          { id: 'chm-5', title: 'Acids, Bases, Salts, pH & Volumetric Analysis', objectives: ['Compute pH/pOH, titration calculations, buffer solutions, and salt hydrolysis'] },
          { id: 'chm-6', title: 'Oxidation-Reduction (Redox) & Electrochemistry', objectives: ['Balance redox equations, apply Faraday\'s laws of electrolysis, and electrode potentials'] },
          { id: 'chm-7', title: 'Rates of Reaction, Chemical Equilibrium & Thermochemistry', objectives: ['Apply Le Chatelier\'s principle, collision theory, enthalpy, entropy, and Gibbs free energy'] },
        ],
      },
      {
        title: 'Inorganic & Organic Chemistry',
        topics: [
          { id: 'chm-8', title: 'Non-Metals & Their Compounds (H, O, N, S, C, Halogens)', objectives: ['Explain laboratory/industrial preparations (Haber, Contact, Solvay) and properties'] },
          { id: 'chm-9', title: 'Metals & Their Compounds (Alkali, Alkaline Earth, Al, Fe, Cu, Transition)', objectives: ['Explain extraction processes (blast furnace, electrolysis) and qualitative analysis tests'] },
          { id: 'chm-10', title: 'Organic Chemistry: Hydrocarbons, Functional Groups & IUPAC Naming', objectives: ['Name and describe reactions of alkanes, alkenes, alkynes, alkanols, alkanoic acids, esters, amines'] },
          { id: 'chm-11', title: 'Polymers, Carbohydrates, Proteins, Fats & Petroleum Chemistry', objectives: ['Distinguish addition/condensation polymers, cracking, reforming, and octane number'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-biology',
    name: 'Biology',
    code: 'BIO',
    category: 'Science',
    questionCount: 40,
    description: 'Covers Variety of Organisms, Form & Functions, Ecology, Heredity & Variations, and Evolution.',
    sections: [
      {
        title: 'Section A: Variety of Organisms',
        topics: [
          { id: 'bio-1', title: 'Living Organisms, Cell Structure & Functions', objectives: ['Compare plant and animal cells, organelles, and levels of organization'] },
          { id: 'bio-2', title: 'Classification of Living Things (Monera, Protista, Fungi, Plantae, Animalia)', objectives: ['Identify diagnostic features and evolutionary progression across kingdoms'] },
        ],
      },
      {
        title: 'Section B: Form and Functions',
        topics: [
          { id: 'bio-3', title: 'Nutrition (Photosynthesis, Mineral Nutrition & Animal Digestion)', objectives: ['Explain light/dark reactions, food tests, digestive enzymes, and balanced diet'] },
          { id: 'bio-4', title: 'Transport System (Circulatory System & Plant Translocation)', objectives: ['Describe heart structure, blood components, xylem/phloem transport, and transpiration'] },
          { id: 'bio-5', title: 'Respiration, Excretion & Homeostasis', objectives: ['Compare aerobic/anaerobic respiration, nephron function, liver, and skin regulation'] },
          { id: 'bio-6', title: 'Support, Movement & Nervous/Hormonal Coordination', objectives: ['Identify skeletal bones, joints, reflex arc, sense organs, and endocrine glands'] },
          { id: 'bio-7', title: 'Reproduction, Growth & Development in Plants and Animals', objectives: ['Describe pollination, fertilization, menstrual cycle, metamorphosis, and germination'] },
        ],
      },
      {
        title: 'Section C: Ecology, Genetics & Evolution',
        topics: [
          { id: 'bio-8', title: 'Ecosystems, Food Webs, Nutrient Cycles & Nigerian Biomes', objectives: ['Analyze energy flow, ecological pyramids, carbon/nitrogen cycles, and conservation'] },
          { id: 'bio-9', title: 'Micro-organisms, Health, Pollution & Adaptation', objectives: ['Identify disease vectors, immunization, adaptive coloration, and structural adaptations'] },
          { id: 'bio-10', title: 'Heredity, Mendelian Genetics, Sex-Linkage & Variation', objectives: ['Solve monohybrid/dihybrid crosses, blood group inheritance, and sickle-cell anemia'] },
          { id: 'bio-11', title: 'Theories of Evolution (Lamarck, Darwin & Modern Synthesis)', objectives: ['Evaluate evidence for evolution: fossils, comparative anatomy, and embryology'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-government',
    name: 'Government',
    code: 'GOV',
    category: 'Arts',
    questionCount: 40,
    description: 'Covers Elements of Government, Political Development in Nigeria, Foreign Policy, and International Organizations.',
    sections: [
      {
        title: 'Part 1: Elements of Government',
        topics: [
          { id: 'gov-1', title: 'Basic Concepts (Power, Authority, Legitimacy, Sovereignty, Democracy)', objectives: ['Differentiate key political concepts and ideologies'] },
          { id: 'gov-2', title: 'Systems & Forms of Government (Federal, Unitary, Presidential, Parliamentary)', objectives: ['Compare structures, merits, and demerits of systems of government'] },
          { id: 'gov-3', title: 'Organs of Government, Separation of Powers & Rule of Law', objectives: ['Examine legislature, executive, judiciary, checks and balances, and fundamental rights'] },
          { id: 'gov-4', title: 'Political Parties, Pressure Groups, Public Opinion & Electoral Systems', objectives: ['Evaluate franchise, electoral commissions, party systems, and civil service'] },
        ],
      },
      {
        title: 'Part 2: Nigerian Political & Constitutional Development',
        topics: [
          { id: 'gov-5', title: 'Pre-Colonial Political Systems (Hausa/Fulani, Yoruba, Igbo)', objectives: ['Compare centralized and decentralized traditional administrations'] },
          { id: 'gov-6', title: 'Colonial Administration (Indirect Rule vs Assimilation) & Nationalism', objectives: ['Contrast British and French colonial policies and trace nationalist movements'] },
          { id: 'gov-7', title: 'Constitutional Development (Clifford 1922 to 1999 Constitution)', objectives: ['Identify key features, merits, and defects of each Nigerian constitution'] },
          { id: 'gov-8', title: 'Nigerian Federalism, Military Rule & Local Government Reforms', objectives: ['Analyze revenue allocation, state creation, military coups, and 1976 LG reform'] },
        ],
      },
      {
        title: 'Part 3: Foreign Policy & International Organizations',
        topics: [
          { id: 'gov-9', title: 'Nigeria\'s Foreign Policy & Non-Alignment', objectives: ['Examine Africa as the centerpiece of Nigeria\'s foreign policy'] },
          { id: 'gov-10', title: 'International Organizations (UN, AU, ECOWAS, Commonwealth, OPEC)', objectives: ['Identify organs, objectives, achievements, and challenges of global/regional bodies'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-economics',
    name: 'Economics',
    code: 'ECO',
    category: 'Commercial & Social Sciences',
    questionCount: 40,
    description: 'Covers Microeconomic theory, Macroeconomics, Public Finance, Money & Banking, and International Trade.',
    sections: [
      {
        title: 'Microeconomics',
        topics: [
          { id: 'eco-1', title: 'Economics as a Science, Basic Concepts & Economic Systems', objectives: ['Explain scarcity, choice, opportunity cost, and production possibility curve'] },
          { id: 'eco-2', title: 'Theory of Demand, Supply, Price Determination & Elasticity', objectives: ['Compute price/income/cross elasticity and analyze equilibrium shifts'] },
          { id: 'eco-3', title: 'Theory of Consumer Behaviour (Utility & Indifference Curves)', objectives: ['Apply law of diminishing marginal utility and consumer equilibrium'] },
          { id: 'eco-4', title: 'Theory of Production, Cost, Revenue & Market Structures', objectives: ['Distinguish perfect competition, monopoly, monopolistic competition, and oligopoly'] },
        ],
      },
      {
        title: 'Macroeconomics & Development',
        topics: [
          { id: 'eco-5', title: 'National Income Accounting & Multiplier', objectives: ['Compute GDP, GNP, NNP, per capita income, and marginal propensity to consume'] },
          { id: 'eco-6', title: 'Money, Inflation, Deflation & Banking Institutions', objectives: ['Analyze CBN monetary policy tools, commercial banks, and causes/control of inflation'] },
          { id: 'eco-7', title: 'Public Finance, Taxation, Budgets & National Debt', objectives: ['Differentiate direct/indirect taxes, fiscal policy, and budget deficit/surplus'] },
          { id: 'eco-8', title: 'Population, Labour Market, Agriculture & Industrialization', objectives: ['Apply Malthusian theory, dependency ratio, and trade union roles'] },
          { id: 'eco-9', title: 'International Trade, Balance of Payments & Economic Integration', objectives: ['Apply comparative advantage, exchange rate regimes, ECOWAS, IMF, and World Bank'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-literature',
    name: 'Literature in English',
    code: 'LIT',
    category: 'Arts',
    questionCount: 40,
    description: 'Covers Drama, Prose, Poetry (African & Non-African), General Literary Principles, and Literary Appreciation.',
    sections: [
      {
        title: 'Drama, Prose & Poetry',
        topics: [
          { id: 'lit-1', title: 'Types & Elements of Drama (Tragedy, Comedy, Tragicomedy, Farce)', objectives: ['Identify dramatic techniques: soliloquy, aside, dramatic irony, catharsis, hubris'] },
          { id: 'lit-2', title: 'Prescribed African & Non-African Drama Texts', objectives: ['Analyze plot, themes, characterization, and dramatic significance of prescribed plays'] },
          { id: 'lit-3', title: 'Prose Fiction & Non-Fiction (African & Non-African Novels)', objectives: ['Examine narrative techniques, point of view, setting, and thematic concerns'] },
          { id: 'lit-4', title: 'African & Non-African Poetry', objectives: ['Analyze poetic devices, rhyme schemes, meter, mood, tone, and imagery'] },
          { id: 'lit-5', title: 'Literary Appreciation & Unseen Passages', objectives: ['Identify figures of speech (metaphor, oxymoron, synecdoche, metonymy, litotes) in unseen texts'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-accounting',
    name: 'Financial Accounting',
    code: 'ACC',
    category: 'Commercial & Social Sciences',
    questionCount: 40,
    description: 'Covers Principles of Accounting, Books of Original Entry, Final Accounts, Partnerships, Companies, and Public Sector Accounting.',
    sections: [
      {
        title: 'Core Financial Accounting',
        topics: [
          { id: 'acc-1', title: 'Nature of Accounting, Concepts, Conventions & Double Entry', objectives: ['Apply accounting equation, accrual, prudence, consistency, and going concern concepts'] },
          { id: 'acc-2', title: 'Books of Original Entry, Cash Book & Bank Reconciliation', objectives: ['Prepare three-column cash book, petty cash book, and bank reconciliation statements'] },
          { id: 'acc-3', title: 'Trial Balance, Correction of Errors & Control Accounts', objectives: ['Prepare suspense account and sales/purchases ledger control accounts'] },
          { id: 'acc-4', title: 'Depreciation, Accruals, Prepayments & Final Accounts of Sole Trader', objectives: ['Compute straight-line/reducing balance depreciation and prepare trading, P&L, and balance sheet'] },
          { id: 'acc-5', title: 'Incomplete Records, Non-Profit Organizations & Manufacturing Accounts', objectives: ['Prepare receipts & payments, income & expenditure, and prime cost calculations'] },
          { id: 'acc-6', title: 'Partnership Accounts, Company Accounts & Accounting Ratios', objectives: ['Handle goodwill, revaluation, share issue, liquidity/profitability ratios, and public sector accounting'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-commerce',
    name: 'Commerce',
    code: 'COM',
    category: 'Commercial & Social Sciences',
    questionCount: 40,
    description: 'Covers Trade, Aids to Trade, Business Organizations, Consumer Protection, Marketing, and Business Law.',
    sections: [
      {
        title: 'Commercial Activities & Business Management',
        topics: [
          { id: 'com-1', title: 'Commerce, Occupation, Production & Trade (Home & Foreign)', objectives: ['Distinguish retail, wholesale, entrepot trade, and customs procedures'] },
          { id: 'com-2', title: 'Business Units (Sole Proprietorship, Partnership, Companies, Cooperatives)', objectives: ['Compare formation, capital raising, liability, and dissolution of business units'] },
          { id: 'com-3', title: 'Aids to Trade (Banking, Insurance, Warehousing, Transport, Advertising)', objectives: ['Explain principles of insurance, types of warehouses, and modes of transport'] },
          { id: 'com-4', title: 'Stock Exchange, Capital Market & Elements of Business Law', objectives: ['Explain shares, debentures, law of contract, agency, sale of goods, and consumer protection'] },
          { id: 'com-5', title: 'Marketing, E-Commerce & Business Communication', objectives: ['Apply the 4Ps of marketing, customer service, and digital commerce'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-crs',
    name: 'Christian Religious Studies',
    code: 'CRS',
    category: 'Arts',
    questionCount: 40,
    description: 'Covers Themes from Creation to the Exile, the Gospels & Acts of the Apostles, and Epistles.',
    sections: [
      {
        title: 'Old & New Testament Themes',
        topics: [
          { id: 'crs-1', title: 'Creation, Sovereignty of God & The Covenant (Abraham, Moses, Joshua)', objectives: ['Trace God\'s covenant relationship with Israel and lessons of obedience'] },
          { id: 'crs-2', title: 'Leadership, Kingship & Prophecy (Samuel, Saul, David, Solomon, Elijah, Amos, Hosea)', objectives: ['Evaluate leadership qualities, social justice, and prophetic messages'] },
          { id: 'crs-3', title: 'The Synoptic Gospels & Gospel of John', objectives: ['Examine baptism, temptation, parables, miracles, Sermon on the Mount, crucifixion & resurrection'] },
          { id: 'crs-4', title: 'Acts of the Apostles & Early Church Mission', objectives: ['Trace Pentecost, Stephen\'s martyrdom, Paul\'s missionary journeys, and Council of Jerusalem'] },
          { id: 'crs-5', title: 'Selected Epistles (Romans, Galatians, Corinthians, James, 1 Peter)', objectives: ['Explain justification by faith, spiritual gifts, Christian living, and civic responsibility'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-irk',
    name: 'Islamic Religious Studies',
    code: 'IRK',
    category: 'Arts',
    questionCount: 40,
    description: 'Covers The Qur\'an and Hadith, Tawhid and Fiqh, and Islamic History & Civilization.',
    sections: [
      {
        title: 'Qur\'an, Hadith, Fiqh & History',
        topics: [
          { id: 'irk-1', title: 'Revelation, Preservation & Selected Surahs of the Glorious Qur\'an', objectives: ['Explain Makkan/Madinan revelations and lessons from prescribed Surahs'] },
          { id: 'irk-2', title: 'Hadith Literature, Classification & An-Nawawi\'s Collection', objectives: ['Distinguish Sahih, Hasan, Da\'if, and apply teachings of selected Ahadith'] },
          { id: 'irk-3', title: 'Tawhid (Articles of Faith) & Fiqh (Five Pillars, Shariah, Family Law)', objectives: ['Explain Iman, Salah, Zakah, Sawm, Hajj, Nikah, Talaq, and Mirath'] },
          { id: 'irk-4', title: 'Sirah of Prophet Muhammad (SAW), Khulafa\'ur-Rashidun & Islam in West Africa', objectives: ['Trace Hijrah, major battles, Rightly Guided Caliphs, and Usman dan Fodio\'s Jihad'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-geography',
    name: 'Geography',
    code: 'GEO',
    category: 'Science',
    questionCount: 40,
    description: 'Covers Practical Geography (Map Reading), Physical Geography, Human Geography, and Regional Geography of Nigeria & West Africa.',
    sections: [
      {
        title: 'Practical, Physical & Regional Geography',
        topics: [
          { id: 'geo-1', title: 'Map Reading, Scale, Contours, Cross-Sections & Bearings', objectives: ['Calculate gradients, intervisibility, drainage patterns, and settlement layouts'] },
          { id: 'geo-2', title: 'The Earth, Rocks, Landforms, Weathering & Denudation', objectives: ['Explain plate tectonics, volcanicity, river/coastal/desert landforms'] },
          { id: 'geo-3', title: 'Weather, Climate, Vegetation & Soils', objectives: ['Classify world climatic zones, Koppen classification, and soil profiles'] },
          { id: 'geo-4', title: 'Human Geography (Population, Settlement, Trade & Transport)', objectives: ['Analyze migration, urbanization, agriculture, and manufacturing industries'] },
          { id: 'geo-5', title: 'Regional Geography of Nigeria & ECOWAS', objectives: ['Identify relief, drainage, mineral resources, and population distribution in Nigeria'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-agric-science',
    name: 'Agricultural Science',
    code: 'AGR',
    category: 'Science',
    questionCount: 40,
    description: 'Covers General Agriculture, Agronomy, Animal Production, Agricultural Economics, and Agricultural Engineering.',
    sections: [
      {
        title: 'Agronomy, Livestock & Agric Economics',
        topics: [
          { id: 'agr-1', title: 'General Agriculture, Land Tenure & Agricultural Ecology', objectives: ['Analyze farming systems, biotic/abiotic factors, and soil formation'] },
          { id: 'agr-2', title: 'Soil Science, Crop Production, Pests & Diseases', objectives: ['Explain soil fertility, fertilizers, crop propagation, weeds, and disease control'] },
          { id: 'agr-3', title: 'Animal Production, Nutrition, Health & Genetics', objectives: ['Describe livestock management, digestive systems, parasites, and breeding methods'] },
          { id: 'agr-4', title: 'Agricultural Economics, Extension & Farm Mechanization', objectives: ['Compute farm records, demand/supply of farm produce, and tractor maintenance'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-history',
    name: 'History',
    code: 'HIS',
    category: 'Arts',
    questionCount: 40,
    description: 'Covers Nigerian History (Pre-colonial to Post-Independence) and Africa & the Wider World.',
    sections: [
      {
        title: 'Nigeria & Africa History',
        topics: [
          { id: 'his-1', title: 'Pre-Colonial States & Empires in Nigeria (Kanem-Borno, Hausa, Oyo, Benin, Igbo)', objectives: ['Examine socio-political organization, trade, and external relations'] },
          { id: 'his-2', title: '19th Century Transformations (Sokoto Jihad, Yoruba Wars, Abolition of Slave Trade)', objectives: ['Analyze causes and impacts of the jihad, legitimate trade, and missionary activities'] },
          { id: 'his-3', title: 'British Conquest, Colonial Rule, Nationalism & Independence', objectives: ['Trace amalgamation of 1914, nationalist struggles, and First Republic politics'] },
          { id: 'his-4', title: 'Post-Independence Nigeria & Pan-Africanism', objectives: ['Evaluate Nigerian Civil War, military regimes, ECOWAS, and OAU/AU'] },
        ],
      },
    ],
  },
  {
    id: 'jamb-civic-education',
    name: 'Civic Education',
    code: 'CIV',
    category: 'Arts',
    questionCount: 40,
    description: 'Covers Values, Citizenship, Human Rights, Democracy, Rule of Law, and National Development.',
    sections: [
      {
        title: 'Citizenship, Democracy & Human Rights',
        topics: [
          { id: 'civ-1', title: 'Values, Citizenship Education & National Consciousness', objectives: ['Explain civic responsibilities, national symbols, and ways of acquiring citizenship'] },
          { id: 'civ-2', title: 'Human Rights, Rule of Law & Constitutional Democracy', objectives: ['Identify UDHR principles, limitations to human rights, and pillars of democracy'] },
          { id: 'civ-3', title: 'Social Issues (Cultism, Drug Abuse, Human Trafficking, HIV/AIDS)', objectives: ['Analyze causes, consequences, and government agencies (NDLEA, NAPTIP, EFCC, ICPC)'] },
        ],
      },
    ],
  },
];


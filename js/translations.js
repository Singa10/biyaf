// Multi-language Translation System for Biyaf Architecture Studio
const Translations = {
  // Current language (default: English)
  currentLang: localStorage.getItem('biyaf_language') || 'en',

  // All translations
  data: {
    en: {
      // Navigation
      nav: {
        home: 'Home',
        about: 'About Us',
        projects: 'Projects',
        services: 'Services',
        contact: 'Contact'
      },
      
      // Hero Section
      hero: {
        eyebrow: 'Biyaf Architecture Studio',
        title: 'We design<br>buildings that<br><em>hold their ground</em>.',
        description: 'Biyaf is a design-led architecture practice shaping residential, commercial and public buildings across Ethiopia — built on precision, material honesty, and a deep read of site and climate.',
        btnProjects: 'View Projects',
        btnContact: 'Start a Project',
        coordinates: 'N 09°02\' E 38°45\'',
        figure: 'FIG. 01 — RESIDENCE'
      },

      // Approach Section
      approach: {
        eyebrow: 'Our Approach',
        title: 'Every site tells you what it wants to become — <em>we listen first</em>, then we draw.',
        description: 'Founded in Bale Robe Biyaf works across residential, commercial, hospitality and public-sector projects. We pair rigorous structural thinking with a material palette drawn from the Ethiopian landscape — stone, timber, concrete and light.'
      },

      // Statistics
      stats: {
        years: 'Years in Practice',
        projects: 'Projects Delivered',
        cities: 'Cities Built In',
        team: 'Team Members'
      },

      // Featured Projects
      featured: {
        eyebrow: 'Selected Work',
        title: 'Featured Projects',
        btnAll: 'All Projects',
        residential: 'Residential',
        commercial: 'Commercial',
        public: 'Public'
      },

      // Services
      services: {
        eyebrow: 'What We Do',
        title: 'Studio Capabilities',
        service1Title: 'Architectural Design',
        service1Desc: 'Full concept-to-construction design for residential, commercial and institutional buildings.',
        service2Title: 'Interior Architecture',
        service2Desc: 'Spatial planning, material selection and custom joinery that carries the building\'s language inward.',
        service3Title: 'Urban & Masterplanning',
        service3Desc: 'Site strategy, density studies and masterplans for mixed-use developments.',
        service4Title: 'Renovation & Restoration',
        service4Desc: 'Adaptive reuse and structural renewal for existing buildings and heritage sites.'
      },

      // CTA
      cta: {
        eyebrow: 'Have a site in mind?',
        title: 'Let\'s put it on the drawing board.',
        button: 'Start a Conversation'
      },

      // Footer
      footer: {
        tagline: 'An architecture studio in Bale Robe designing buildings that respond to site, climate and community.',
        studioTitle: 'Studio',
        contactTitle: 'Contact',
        hoursTitle: 'Studio Hours',
        getInTouch: 'Get in Touch',
        hours: 'Mon – Fri, 8:30 – 18:00',
        location: 'Wako Gutu Adebabay, Bale Robe',
        copyright: '© 2026 Biyaf Architecture Studio. All rights reserved.',
        credits: 'Design & Build'
      },

      // About Page
      about: {
        pageTitle: 'About Biyaf Architecture Studio',
        storyEyebrow: 'Our Story',
        storyTitle: 'Designing with the land, not over it',
        storyP1: 'Biyaf was founded by a small group of architects who trained across Ethiopia and abroad, and came home with one question: why did so much new construction ignore the climate, materials and craft already available on site?',
        storyP2: 'Today the studio works across residential, commercial and public-sector commissions, but the founding question still shapes every project brief — read the site first, then design.',
        valuesTitle: 'Core Values',
        value1Title: 'Site First',
        value1Desc: 'Topography, light and wind studies happen before a single wall is sketched.',
        value2Title: 'Material Honesty',
        value2Desc: 'We build in materials that age well and are sourced close to where they\'re used.',
        value3Title: 'Built to Last',
        value3Desc: 'Structures designed to outlive trends, with maintenance and climate resilience in mind.',
        timelineTitle: 'Our Journey',
        teamEyebrow: 'The Team',
        teamTitle: 'Meet the Studio',
        teamDesc: 'A multidisciplinary team of architects, designers, engineers and project managers working together to deliver exceptional built environments.'
      },

      // Projects Page
      projects: {
        pageTitle: 'Our Projects',
        subtitle: 'Explore our portfolio of residential, commercial and public architecture',
        filterAll: 'All Projects',
        filterResidential: 'Residential',
        filterCommercial: 'Commercial',
        filterPublic: 'Public',
        project1Title: 'Kebena Residence',
        project1Desc: 'A terraced concrete home stepping down a ridge in Bale Robe.',
        project2Title: 'Bole Commerce Hub',
        project2Desc: 'Mixed-use tower with a ventilated stone facade and public plaza.',
        project3Title: 'Entoto Cultural Pavilion',
        project3Desc: 'A timber-framed civic hall referencing traditional roof forms.',
        project4Title: 'Sarbet Courtyard House',
        project4Desc: 'Two volumes wrapped around a shaded internal courtyard.',
        project5Title: 'Mercato Office Block',
        project5Desc: 'A stacked-slab office building with deep shading fins.',
        project6Title: 'Piassa Public Library',
        project6Desc: 'A single-storey reading hall with a folded timber roof.'
      },

      // Services Page
      servicesPage: {
        pageTitle: 'Our Services',
        subtitle: 'Comprehensive architectural services from concept to completion',
        service1Full: 'Full concept-to-construction design services — from feasibility studies and concept massing through to detailed construction drawings, for homes, offices, retail and institutional buildings.',
        service2Full: 'Spatial planning, material palettes, lighting design and custom joinery that carry a building\'s architectural language through to its interior spaces.',
        service3Full: 'Site strategy, density and massing studies, and full masterplans for mixed-use and multi-phase developments.',
        service4Full: 'Adaptive reuse, structural renewal and sensitive restoration for existing buildings and heritage sites.',
        service5Title: 'Construction Administration',
        service5Full: 'On-site oversight through the build phase, coordinating contractors and engineers to keep a project true to its drawings.',
        processTitle: 'Our Process',
        process1: 'Initial Consultation',
        process2: 'Site Analysis',
        process3: 'Concept Design',
        process4: 'Development',
        process5: 'Construction',
        process6: 'Completion'
      },

      // Contact Page
      contactPage: {
        pageTitle: 'Get in Touch',
        subtitle: 'Let\'s discuss your project',
        addressTitle: 'Visit Us',
        phoneTitle: 'Call Us',
        emailTitle: 'Email Us',
        emailNote: 'Response within 2 business days',
        hoursTitle: 'Studio Hours',
        socialTitle: 'Follow Us',
        formTitle: 'Send a Message',
        formName: 'Your Name',
        formEmail: 'Your Email',
        formPhone: 'Phone Number',
        formSubject: 'Subject',
        formMessage: 'Message',
        formSend: 'Send Message',
        formSending: 'Sending...'
      },

      // Timeline
      timeline: {
        milestone1: 'Studio Founded',
        milestone1Desc: 'Biyaf opens as a three-person practice in Bole, taking on its first residential commissions.',
        milestone2: 'First Commercial Tower',
        milestone2Desc: 'Delivery of a mixed-use building in Bale Robe introduces the studio\'s ventilated-facade approach.',
        milestone3: 'Public Sector Work Begins',
        milestone3Desc: 'Biyaf is commissioned for its first civic project, a community pavilion referencing traditional roof forms.',
        milestone4: '86+ Projects Delivered',
        milestone4Desc: 'The studio now works across 12 cities with a team of 23 architects, designers and engineers.'
      }
    },

    am: {
      // አማርኛ - Amharic
      nav: {
        home: 'መነሻ',
        about: 'ስለ እኛ',
        projects: 'ፕሮጀክቶች',
        services: 'አገልግሎቶች',
        contact: 'ያግኙን'
      },

      hero: {
        eyebrow: 'ብያፍ የሕንፃ ስቱዲዮ',
        title: 'በጠንካራ መሠረት<br>ላይ የሚቆሙ<br><em>ሕንፃዎችን</em> እንነድፋለን።',
        description: 'ብያፍ በኢትዮጵያ የመኖሪያ፣ የንግድ እና የህዝብ ሕንፃዎችን የሚቀርፅ በዲዛይን የሚመራ የሕንፃ ግንባታ ተግባር ነው - በትክክለኛነት፣ በቁሳቁስ እውነተኝነት እና በቦታና በአየር ሁኔታ ጥልቅ ግንዛቤ ላይ የተመሠረተ።',
        btnProjects: 'ፕሮጀክቶችን ይመልከቱ',
        btnContact: 'ፕሮጀክት ይጀምሩ',
        coordinates: 'ሰ 09°02\' ም 38°45\'',
        figure: 'ምስል 01 — መኖሪያ'
      },

      approach: {
        eyebrow: 'አካሄዳችን',
        title: 'እያንዳንዱ ቦታ ምን መሆን እንደሚፈልግ ይነግርዎታል — <em>መጀመሪያ እናዳምጣለን</em>፣ ከዚያም እንሳላለን።',
        description: 'በባሌ ሮቤ የተመሰረተው ብያፍ በመኖሪያ፣ በንግድ፣ በእንግዳ ተቀባይነት እና በህዝብ ዘርፍ ፕሮጀክቶች ላይ ይሰራል። ከኢትዮጵያ መልክዓ ምድር የተወሰደ የቁሳቁስ ስብስብ - ድንጋይ፣ እንጨት፣ ኮንክሪት እና ብርሃን ጋር ጥብቅ የሆነ መዋቅራዊ አስተሳሰብን እናጣምራለን።'
      },

      stats: {
        years: 'የልምድ ዓመታት',
        projects: 'የተላለፉ ፕሮጀክቶች',
        cities: 'የተገነቡ ከተሞች',
        team: 'የቡድን አባላት'
      },

      featured: {
        eyebrow: 'የተመረጡ ስራዎች',
        title: 'ተለይተው የቀረቡ ፕሮጀክቶች',
        btnAll: 'ሁሉም ፕሮጀክቶች',
        residential: 'መኖሪያ',
        commercial: 'ንግድ',
        public: 'ህዝባዊ'
      },

      services: {
        eyebrow: 'የምንሰራቸው',
        title: 'የስቱዲዮ ችሎታዎች',
        service1Title: 'የሕንፃ ዲዛይን',
        service1Desc: 'ለመኖሪያ፣ ለንግድ እና ለተቋማት ሕንፃዎች ሙሉ ከጽንሰ-ሃሳብ-እስከ-ግንባታ ዲዛይን።',
        service2Title: 'የውስጥ አርክቴክቸር',
        service2Desc: 'የሕንፃውን ቋንቋ ወደ ውስጥ የሚያስተላልፉ የቦታ እቅድ፣ የቁሳቁስ ምርጫ እና ብጁ አንጓ።',
        service3Title: 'ከተማ እና ዋና እቅድ',
        service3Desc: 'የቦታ ስትራቴጂ፣ የጥግግት ጥናቶች እና ለድብልቅ አጠቃቀም ልማቶች ዋና እቅዶች።',
        service4Title: 'ጥገናና መልሶ ማቋቋም',
        service4Desc: 'ለነባር ሕንፃዎች እና ቅርስ ቦታዎች አስቀድመው ጥቅም ላይ የማዋል እና መዋቅራዊ እድሳት።'
      },

      cta: {
        eyebrow: 'ቦታ አስበው ነው?',
        title: 'በስዕል ሰሌዳ ላይ እናስቀምጠው።',
        button: 'ውይይት ይጀምሩ'
      },

      footer: {
        tagline: 'በባሌ ሮቤ የሚገኝ ለቦታ፣ ለአየር ሁኔታ እና ለማህበረሰብ ምላሽ የሚሰጡ ሕንፃዎችን የሚነድፍ የሕንፃ ስቱዲዮ።',
        studioTitle: 'ስቱዲዮ',
        contactTitle: 'ያግኙን',
        hoursTitle: 'የስቱዲዮ ሰዓታት',
        getInTouch: 'ይገናኙ',
        hours: 'ሰኞ – አርብ፣ 8:30 – 18:00',
        location: 'ዋኮ ጉቱ አደባባይ፣ ባሌ ሮቤ',
        copyright: '© 2026 ብያፍ የሕንፃ ስቱዲዮ። ሁሉም መብቶች የተጠበቁ ናቸው።',
        credits: 'ዲዛይን እና ግንባታ'
      },

      about: {
        pageTitle: 'ስለ ብያፍ የሕንፃ ስቱዲዮ',
        storyEyebrow: 'ታሪካችን',
        storyTitle: 'ከመሬት ጋር እንዲዛይን እንጂ በላዩ አይደለም',
        storyP1: 'ብያፍ በኢትዮጵያ እና በውጭ አገር የሰለጠኑ እና በአንድ ጥያቄ ወደ ቤት የተመለሱ አርክቴክቶች ትንሽ ቡድን ነው የተመሰረተው፡ ለምንድነው ብዙ አዲስ ግንባታዎች በቦታው ላይ ቀድሞውኑ የሚገኙትን የአየር ሁኔታ፣ ቁሳቁሶች እና ችሎታዎች ችላ የሚሉት?',
        storyP2: 'ዛሬ ስቱዲዮው በመኖሪያ፣ በንግድ እና በህዝብ ዘርፍ ኮሚሽኖች ላይ ይሰራል፣ ነገር ግን መስራች ጥያቄው አሁንም እያንዳንዱን የፕሮጀክት ሕጋዊነት ቅርጽ ይሰጠዋል - መጀመሪያ ቦታውን ያንብቡ፣ ከዚያ ዲዛይን።',
        valuesTitle: 'ዋና እሴቶች',
        value1Title: 'ቦታ በመጀመሪያ',
        value1Desc: 'አንድ ግድግዳ ከመሳል በፊት የመልክዓ ምድር፣ የብርሃን እና የንፋስ ጥናቶች ይከናወናሉ።',
        value2Title: 'የቁሳቁስ እውነተኝነት',
        value2Desc: 'በደንብ የሚያረጁ እና ጥቅም ላይ ከሚውሉት ቦታ አጠገብ ከሚገኙ ቁሳቁሶች እንገነባለን።',
        value3Title: 'ለመቆየት የተገነባ',
        value3Desc: 'ከአዝማሚያዎች በላይ እንዲቆዩ የተዘጋጁ መዋቅሮች፣ ጥገናና የአየር ንብረት ጥንካሬን ከግምት ውስጥ በማስገባት።',
        timelineTitle: 'ጉዞአችን',
        teamEyebrow: 'ቡድኑ',
        teamTitle: 'ስቱዲዮውን ይገናኙ',
        teamDesc: 'ልዩ የተገነቡ አካባቢዎችን ለማቅረብ አንድ ላይ የሚሰሩ የአርክቴክቶች፣ ዲዛይነሮች፣ መሐንዲሶች እና የፕሮጀክት አስተዳዳሪዎች ብዙ ዘርፍ ቡድን።'
      },

      projects: {
        pageTitle: 'ፕሮጀክቶቻችን',
        subtitle: 'የመኖሪያ፣ የንግድ እና የህዝብ አርክቴክቸር ፖርትፎሊዮአችንን ያስሱ',
        filterAll: 'ሁሉም ፕሮጀክቶች',
        filterResidential: 'መኖሪያ',
        filterCommercial: 'ንግድ',
        filterPublic: 'ህዝባዊ',
        project1Title: 'ከበና መኖሪያ',
        project1Desc: 'በባሌ ሮቤ ራስ ላይ ወደ ታች የሚወርድ ደረጃ ኮንክሪት ቤት።',
        project2Title: 'ቦሌ የንግድ ማዕከል',
        project2Desc: 'በአየር የሚተላለፍ የድንጋይ ፊት እና የህዝብ አደባባይ ያለው ድብልቅ አጠቃቀም ማማ።',
        project3Title: 'እንጦጦ ባህላዊ አዳራሽ',
        project3Desc: 'ባህላዊ የጣሪያ ቅርጾችን የሚያመለክት እንጨት ፍሬም ያለው የዜጎች አዳራሽ።',
        project4Title: 'ሰርበት ግቢ ቤት',
        project4Desc: 'በጥላ በታች ባለው ውስጣዊ ግቢ ዙሪያ የተጠቀለሉ ሁለት ቦታዎች።',
        project5Title: 'መርካቶ ቢሮ ህንፃ',
        project5Desc: 'ጥልቅ የጥላ ክንፎች ያላቸው የተደረደሩ-ስሌብ ቢሮ ሕንፃ።',
        project6Title: 'ፒያሳ የህዝብ ቤተ-መጻህፍት',
        project6Desc: 'የታጠፈ የእንጨት ጣሪያ ያለው የአንድ ፎቅ የንባብ አዳራሽ።'
      },

      servicesPage: {
        pageTitle: 'አገልግሎቶቻችን',
        subtitle: 'ከጽንሰ-ሃሳብ እስከ ማጠናቀቅ አጠቃላይ የሕንፃ አገልግሎቶች',
        service1Full: 'ሙሉ ከጽንሰ-ሃሳብ-እስከ-ግንባታ የዲዛይን አገልግሎቶች - ከዕድል ጥናቶች እና ከጽንሰ-ሃሳብ ጅምር እስከ ዝርዝር የግንባታ ስዕሎች፣ ለቤቶች፣ ለቢሮዎች፣ ለችርቻሮ እና ለተቋማት ሕንፃዎች።',
        service2Full: 'የቦታ እቅድ፣ የቁሳቁስ ቤተ-ቀለም፣ የብርሃን ዲዛይን እና የሕንፃውን የአርክቴክቸር ቋንቋ ወደ ውስጥ ቦታዎች የሚያስተላልፉ ብጁ አንጓ።',
        service3Full: 'የቦታ ስትራቴጂ፣ የጥግግት እና የመዋቅር ጥናቶች እና ለድብልቅ አጠቃቀም እና ለብዙ ደረጃ ልማቶች ሙሉ ዋና እቅዶች።',
        service4Full: 'ለነባር ሕንፃዎች እና ቅርስ ቦታዎች አስቀድመው ጥቅም ላይ የማዋል፣ መዋቅራዊ እድሳት እና ስሜታዊ መልሶ ማቋቋም።',
        service5Title: 'የግንባታ አስተዳደር',
        service5Full: 'በግንባታ ደረጃ በቦታው ላይ ቁጥጥር፣ ኮንትራክተሮችን እና መሐንዲሶችን ማስተባበር ፕሮጀክትን ከስዕሎቹ ጋር እውነተኛ እንዲሆን።',
        processTitle: 'ሂደታችን',
        process1: 'የመጀመሪያ ምክክር',
        process2: 'የቦታ ትንተና',
        process3: 'የጽንሰ-ሃሳብ ዲዛይን',
        process4: 'ልማት',
        process5: 'ግንባታ',
        process6: 'ማጠናቀቅ'
      },

      contactPage: {
        pageTitle: 'ያግኙን',
        subtitle: 'ፕሮጀክትዎን እንወያይ',
        addressTitle: 'ይጎብኙን',
        phoneTitle: 'ይደውሉልን',
        emailTitle: 'ኢሜል ያድርጉልን',
        emailNote: 'በ2 የስራ ቀናት ውስጥ ምላሽ',
        hoursTitle: 'የስቱዲዮ ሰዓታት',
        socialTitle: 'ይከተሉን',
        formTitle: 'መልእክት ይላኩ',
        formName: 'ስምዎ',
        formEmail: 'ኢሜልዎ',
        formPhone: 'ስልክ ቁጥር',
        formSubject: 'ጉዳይ',
        formMessage: 'መልእክት',
        formSend: 'መልዕክት ላክ',
        formSending: 'በመላክ ላይ...'
      },

      timeline: {
        milestone1: 'ስቱዲዮ መስራች',
        milestone1Desc: 'ብያፍ በቦሌ የመጀመሪያ የመኖሪያ ኮሚሽኖችን የሚወስድ ሶስት ሰው ልምምድ ይከፍታል።',
        milestone2: 'የመጀመሪያ የንግድ ማማ',
        milestone2Desc: 'በባሌ ሮቤ ውስጥ ድብልቅ አጠቃቀም ሕንፃ አቅርቦት የስቱዲዮውን በአየር የሚተላለፍ-ፊት አቀራረብ ያስተዋውቃል።',
        milestone3: 'የህዝብ ዘርፍ ስራ ይጀምራል',
        milestone3Desc: 'ብያፍ ለመጀመሪያው የዜጎች ፕሮጀክት፣ ባህላዊ የጣሪያ ቅርጾችን የሚያመለክት የማህበረሰብ አዳራሽ ተሾመ።',
        milestone4: '86+ ፕሮጀክቶች ተላልፈዋል',
        milestone4Desc: 'ስቱዲዮው አሁን በ12 ከተሞች ላይ ከ23 አርክቴክቶች፣ ዲዛይነሮች እና መሐንዲሶች ቡድን ጋር ይሰራል።'
      }
    },

    om: {
      // Afaan Oromoo
      nav: {
        home: 'Fuula Jalqabaa',
        about: 'Waa\'ee Keenya',
        projects: 'Pirojektoota',
        services: 'Tajaajiloota',
        contact: 'Nu Quunnamaa'
      },

      hero: {
        eyebrow: 'Istuudiyoo Aartikektarii Biyaaf',
        title: 'Nu gamoo bu\'uuraa<br>jabaa irratti<br><em>dhaabbatan</em> dizaayinii goona.',
        description: 'Biyaaf gamoo jireenyaa, daldalaa fi ummataa guutuu Itoophiyaa keessatti kan bocuu, hojiiwwan aartikektarii kallattiidhaan kan eegamu - sirrii ta\'uu, dhugaa meeshaalee fi hubannoo gad-fagoo bakkaafi haala qilleensaa irratti hundaa\'e.',
        btnProjects: 'Pirojektoota Ilaalaa',
        btnContact: 'Pirojektii Jalqabaa',
        coordinates: 'K 09°02\' B 38°45\'',
        figure: 'FIG. 01 — MANA JIREENYAA'
      },

      approach: {
        eyebrow: 'Malli Keenya',
        title: 'Bakki hunduu maal ta\'uu akka barbaadu sitti hima — <em>jalqaba dhageeffanna</em>, achiis ni kaasa.',
        description: 'Baalii Roobee keessatti hundeeffame Biyaaf pirojektoota jireenyaa, daldalaa, simachuu fi damee ummataaf hojjeta. Yaada caasaa cimaa meeshaalee biyyoota Itoophiyaa irraa fudhatan waliin makna - dhagaa, mukaa, konkiraataa fi ifa.'
      },

      stats: {
        years: 'Waggoota Muuxannoo',
        projects: 'Pirojektoota Xumuraman',
        cities: 'Magaaloota Ijaaran',
        team: 'Miseensota Garee'
      },

      featured: {
        eyebrow: 'Hojii Filannoo',
        title: 'Pirojektoota Addaan Ba\'an',
        btnAll: 'Pirojektoota Hunda',
        residential: 'Jireenyaa',
        commercial: 'Daldala',
        public: 'Ummataa'
      },

      services: {
        eyebrow: 'Waan Hojjennu',
        title: 'Dandeettii Istuudiyoo',
        service1Title: 'Dizaayinii Aartikektarii',
        service1Desc: 'Tajaajila dizaayinii guutuu yaada ijaarsaa hanga ijaarsaatti - gamoo jireenyaa, daldalaa fi dhaabbilee ijaarsa.',
        service2Title: 'Aartikektarii Keessoo',
        service2Desc: 'Karoora iddoo, filannoo meeshaalee fi walnyaataa haala gamoo qaama keessaatti kan geessu.',
        service3Title: 'Magaalaa fi Karoora Guddaa',
        service3Desc: 'Tarsiimoo bakka, qorannoo baay\'innaa fi karoorota guddoo misooma wal-makaa.',
        service4Title: 'Haaromsa fi Deebisuu',
        service4Desc: 'Itti fayyadama haaromfamaa, haaromsa caasaa fi deebisuu of eeggannoo gamoo jiranii fi bakkeewwan dhaalaa.'
      },

      cta: {
        eyebrow: 'Bakka sammuu keessaa qabdaa?',
        title: 'Mee gabatee kaasaa irratti haa kaa\'u.',
        button: 'Haasawa Jalqabaa'
      },

      footer: {
        tagline: 'Istuudiyoo aartikektarii Baalii Roobee keessatti argamu gamoo bakka, haala qilleensaa fi hawaasaaf deebii kennan dizaayinii godhu.',
        studioTitle: 'Istuudiyoo',
        contactTitle: 'Quunnamtii',
        hoursTitle: 'Sa\'aatii Istuudiyoo',
        getInTouch: 'Nu Quunnamaa',
        hours: 'Wiixata – Jimaata, 8:30 – 18:00',
        location: 'Waaqoo Guutuu Adebaabay, Baalii Roobee',
        copyright: '© 2026 Istuudiyoo Aartikektarii Biyaaf. Mirgi hunduu eegame.',
        credits: 'Dizaayinii fi Ijaarsa'
      },

      about: {
        pageTitle: 'Waa\'ee Istuudiyoo Aartikektarii Biyaaf',
        storyEyebrow: 'Seenaa Keenya',
        storyTitle: 'Lafaan dizaayinii godha malee irra miti',
        storyP1: 'Biyaaf garee xinnoo aartikektootaa guutuu Itoophiyaa fi biyyoota alaa keessatti leenji\'amanii fi gaaffii tokkoon gara manatti deebi\'an hundeeffame: maaliif ijaarsi haaraan haala qilleensaa, meeshaalee fi ogummaa bakka sanatti jiru baay\'een tuffata ree?',
        storyP2: 'Har\'a istuudiyoon sun tajaajila jireenyaa, daldalaa fi dameewwan ummataa irratti hojjeta, garuu gaaffiin bu\'uraa amma illee hojii pirojektii hunda bocuu - jalqaba bakka dubbisaa, achiis dizaayinii godhaa.',
        valuesTitle: 'Gatii Bu\'uuraa',
        value1Title: 'Bakka Dursa',
        value1Desc: 'Qorannoon bakkaa, ifaa fi qilleensaa keenyan tokko utuu hin kaafamiin dura ni rawwata.',
        value2Title: 'Dhugaa Meeshaalee',
        value2Desc: 'Meeshaalee gaarii dulloomuu fi iddoo itti fayyadaman biratti argaman keessatti ijaarraa.',
        value3Title: 'Tursiisaaf Kan Ijaarame',
        value3Desc: 'Caasaa kallacha caala jiraachuu, kunuunsa fi ciminaa haala qilleensaa yaada keessa galchuun kan qophaa\'e.',
        timelineTitle: 'Imala Keenya',
        teamEyebrow: 'Gareen',
        teamTitle: 'Istuudiyoo Isiniif Beeksisaa',
        teamDesc: 'Garee damee hedduu aartikektootaa, dizaayinoota, injinoota fi bulchitoota pirojektii waliin naannoo ijaarsa addaa kennuuf hojjetaa.'
      },

      projects: {
        pageTitle: 'Pirojektoota Keenya',
        subtitle: 'Poortifoooliyoo aartikektarii jireenyaa, daldalaa fi ummataa keenya qoradhaa',
        filterAll: 'Pirojektoota Hunda',
        filterResidential: 'Jireenyaa',
        filterCommercial: 'Daldala',
        filterPublic: 'Ummataa',
        project1Title: 'Mana Jireenyaa Kabeenaa',
        project1Desc: 'Mana konkiraataa sadarkaa fiixee Baalii Roobee irratti gad bu\'u.',
        project2Title: 'Bakka Daldala Boolii',
        project2Desc: 'Gamoo ol ka\'aa wal-makaa fuula dhagaa qilleensa darbuu fi bakka ummataa qabu.',
        project3Title: 'Intoo Daandii Aadaa',
        project3Desc: 'Daandii lammii jalqaba mukaa bocaa aadaa yaadachiisu qabu.',
        project4Title: 'Mana Oobdii Saarbeet',
        project4Desc: 'Qaamni lama naannoo keessaa gaaddisaan marsame.',
        project5Title: 'Gamoo Waajjira Markaatoo',
        project5Desc: 'Gamoo waajjira salaabii gubbaa qindeessame qoochoo gaaddisa gad-fagoo qabu.',
        project6Title: 'Mana Kitaabaa Ummataa Piyaasaa',
        project6Desc: 'Daandii dubbisaa sadarkaa tokko qotiyyoo mukaa marsame qabu.'
      },

      servicesPage: {
        pageTitle: 'Tajaajiloota Keenya',
        subtitle: 'Tajaajiloota aartikektarii guutuu yaada ijaarsaa hanga xumuraatti',
        service1Full: 'Tajaajiloota dizaayinii guutuu yaada-ijaarsaa-hanga-ijaarsa - qorannoo carraa fi yaada jalqabaa hanga kaasaa ijaarsa bal\'aatti, manaaf, waajjiraf, daldalaafi ijaarsa dhaabbilee.',
        service2Full: 'Karoora iddoo, paleetii meeshaalee, dizaayinii ibsaa fi walnyaataa haala kan afaan aartikektarii gamoo gara qaamota keessaatti geessu.',
        service3Full: 'Tarsiimoo bakka, qorannoo baay\'innaa fi qindeessuu fi karoorota misooma wal-makaa fi sadarkaa hedduu guutuu.',
        service4Full: 'Itti fayyadama haaromfamaa, haaromsa caasaa fi deebisuu of eeggannoo gamoo jiranii fi bakkeewwan dhaalaa.',
        service5Title: 'Bulchiinsa Ijaarsaa',
        service5Full: 'To\'annoo bakka ijaarsa keessatti, kontraaktarootaa fi injinoota qindeessuun pirojektii dhugaa kaasaa isaa akka ta\'u taasisuu.',
        processTitle: 'Adeemsaa Keenya',
        process1: 'Mariʼannoo Jalqabaa',
        process2: 'Xiinxala Bakka',
        process3: 'Dizaayinii Yaadaa',
        process4: 'Guddina',
        process5: 'Ijaarsa',
        process6: 'Xumura'
      },

      contactPage: {
        pageTitle: 'Nu Quunnamaa',
        subtitle: 'Mee pirojektii kee haa mari\'annu',
        addressTitle: 'Nu Daawwadhaa',
        phoneTitle: 'Nu Bilbilaa',
        emailTitle: 'Email Nuuf Ergaa',
        emailNote: 'Deebii guyyaa hojii 2 keessatti',
        hoursTitle: 'Sa\'aatii Istuudiyoo',
        socialTitle: 'Nu Hordofaa',
        formTitle: 'Ergaa Ergaa',
        formName: 'Maqaa Kee',
        formEmail: 'Email Kee',
        formPhone: 'Lakkoofsa Bilbilaa',
        formSubject: 'Mata-duree',
        formMessage: 'Ergaa',
        formSend: 'Ergaa Ergaa',
        formSending: 'Ergamaa jira...'
      },

      timeline: {
        milestone1: 'Istuudiyoo Hundaa\'e',
        milestone1Desc: 'Biyaaf akka shaakala nama sadii Boolii keessatti pirojektoota jireenyaa jalqabaa fudhachuun ni banama.',
        milestone2: 'Gamoo Daldala Jalqabaa',
        milestone2Desc: 'Dhiyeessuun gamoo wal-makaa Baalii Roobee keessatti mala fuula-qilleensa-darbuu istuudiyoo yaadachiisa.',
        milestone3: 'Hojiin Damee Ummataa Jalqabama',
        milestone3Desc: 'Biyaaf pirojektii lammii jalqabaa, daandii hawaasaa bocaa aadaa yaadachiisuuf ni filama.',
        milestone4: '86+ Pirojektoota Xumuraman',
        milestone4Desc: 'Istuudiyoon amma magaalota 12 keessatti garee aartikektootaa, dizaayinoota fi injinoota 23 waliin hojjeta.'
      }
    }
  },

  // Get translation
  t(path) {
    const keys = path.split('.');
    let value = this.data[this.currentLang];
    
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return path; // Return path if translation not found
      }
    }
    
    return value || path;
  },

  // Set language
  setLanguage(lang) {
    if (this.data[lang]) {
      this.currentLang = lang;
      localStorage.setItem('biyaf_language', lang);
      this.updatePage();
    }
  },

  // Update page with current language
  updatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Check if element should use innerHTML (for <br> tags and <em> tags)
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update active language indicator
    document.querySelectorAll('.lang-option').forEach(option => {
      if (option.getAttribute('data-lang') === this.currentLang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  },

  // Initialize
  init() {
    // Set initial language
    const savedLang = localStorage.getItem('biyaf_language') || 'en';
    this.currentLang = savedLang;
    
    // Update page when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.updatePage());
    } else {
      this.updatePage();
    }
  }
};

// Auto-initialize
Translations.init();

import { Language } from '../types';

export interface UIStrings {
  appName: string;
  tagline: string;
  motto: string;
  beginJourney: string;
  
  // Home
  continueReading: string;
  lastRead: string;
  allChapters: string;
  viewAll: string;
  dailyQuoteTitle: string;
  todayVerse: string;
  
  // Chapter & Shloka
  chaptersTitle: string;
  chapterLabel: string;
  shlokaLabel: string;
  shlokasCountLabel: string;
  meaningTitle: string;    // భావార్థం
  purportTitle: string;    // సారాంశం
  play: string;
  stop: string;
  bookmark: string;
  bookmarked: string;
  share: string;
  textSize: string;
  prevShloka: string;
  nextShloka: string;
  
  // Settings
  settingsTitle: string;
  languageSection: string;
  displaySection: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  notificationsSection: string;
  dailyReminder: string;
  
  // Bookmarks & History
  myBookmarks: string;
  emptyBookmarks: string;
  readingHistory: string;
  emptyHistory: string;
  searchPlaceholder: string;
  
  // Daily Verse Modal
  readInContext: string;
  
  // More
  moreTitle: string;
  seekLearnLive: string;
  closerToBetterYou: string;
  languageOption: string;
  appearanceOption: string;
  aboutGita: string;
  rateApp: string;
  shareWithFriends: string;
  
  // Bottom Nav
  tabHome: string;
  tabChapters: string;
  tabStreaks: string;
  tabBookmarks: string;
  tabMore: string;
  sadhanaCircle: string;
  walkingTogether: string;
}

export const UI_TRANSLATIONS: Record<Language, UIStrings> = {
  te: {
    appName: "Gita",
    tagline: "Timeless Wisdom for a Better You",
    motto: "ధర్మో రక్షతి రక్షితః ।",
    beginJourney: "Begin the Journey →",
    continueReading: "Continue Reading",
    lastRead: "Last read",
    allChapters: "All Chapters",
    viewAll: "View All",
    dailyQuoteTitle: "నేటి శ్లోక వివేకం",
    todayVerse: "Today's Verse",
    chaptersTitle: "అధ్యాయాలు",
    chapterLabel: "అధ్యాయం",
    shlokaLabel: "శ్లోకం",
    shlokasCountLabel: "శ్లోకాలు",
    meaningTitle: "భావార్థం",
    purportTitle: "సారాంశం",
    play: "వినండి",
    stop: "ఆపండి",
    bookmark: "బుక్‌మార్క్",
    bookmarked: "సేవ్ చేయబడింది",
    share: "షేర్",
    textSize: "పరిమాణం",
    prevShloka: "ముందు శ్లోకం",
    nextShloka: "తరువాత శ్లోకం",
    settingsTitle: "భాష & సెట్టింగ్స్",
    languageSection: "భాష (Language)",
    displaySection: "Display",
    themeLabel: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System",
    notificationsSection: "Notifications",
    dailyReminder: "Daily Verse Reminder",
    myBookmarks: "My Bookmarks",
    emptyBookmarks: "ఇంకా బుక్‌మార్క్‌లు ఏవీ లేవు",
    readingHistory: "Reading History",
    emptyHistory: "పఠన చరిత్ర ఖాళీగా ఉంది",
    searchPlaceholder: "శ్లోకం లేదా అధ్యాయాన్ని శోధించండి...",
    readInContext: "Read in Context →",
    moreTitle: "More",
    seekLearnLive: "Seek. Learn. Live.",
    closerToBetterYou: "A step closer to a better you.",
    languageOption: "Language",
    appearanceOption: "Appearance",
    aboutGita: "About Gita",
    rateApp: "Rate the App",
    shareWithFriends: "Share with Friends",
    tabHome: "Home",
    tabChapters: "Chapters",
    tabStreaks: "Streaks",
    tabBookmarks: "Bookmarks",
    tabMore: "More",
    sadhanaCircle: "సాధనా సర్కిల్",
    walkingTogether: "తోటి సాధకులు"
  },
  en: {
    appName: "Gita",
    tagline: "Timeless Wisdom for a Better You",
    motto: "Dharmo Rakshati Rakshitah ।",
    beginJourney: "Begin the Journey →",
    continueReading: "Continue Reading",
    lastRead: "Last read",
    allChapters: "All Chapters",
    viewAll: "View All",
    dailyQuoteTitle: "Daily Wisdom Quote",
    todayVerse: "Today's Verse",
    chaptersTitle: "Chapters",
    chapterLabel: "Chapter",
    shlokaLabel: "Verse",
    shlokasCountLabel: "Verses",
    meaningTitle: "Translation",
    purportTitle: "Essence & Purport",
    play: "Play",
    stop: "Stop",
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    share: "Share",
    textSize: "Text Size",
    prevShloka: "Previous Verse",
    nextShloka: "Next Verse",
    settingsTitle: "Language & Settings",
    languageSection: "Language",
    displaySection: "Display",
    themeLabel: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System",
    notificationsSection: "Notifications",
    dailyReminder: "Daily Verse Reminder",
    myBookmarks: "My Bookmarks",
    emptyBookmarks: "No bookmarked verses yet",
    readingHistory: "Reading History",
    emptyHistory: "No reading history recorded yet",
    searchPlaceholder: "Search chapter, verse, or keyword...",
    readInContext: "Read in Context →",
    moreTitle: "More",
    seekLearnLive: "Seek. Learn. Live.",
    closerToBetterYou: "A step closer to a better you.",
    languageOption: "Language",
    appearanceOption: "Appearance",
    aboutGita: "About Gita",
    rateApp: "Rate the App",
    shareWithFriends: "Share with Friends",
    tabHome: "Home",
    tabChapters: "Chapters",
    tabStreaks: "Streaks",
    tabBookmarks: "Bookmarks",
    tabMore: "More",
    sadhanaCircle: "Sadhana Circle",
    walkingTogether: "Walking the path together"
  },
  hi: {
    appName: "Gita",
    tagline: "Timeless Wisdom for a Better You",
    motto: "धर्मो रक्षति रक्षितः ।",
    beginJourney: "यात्रा आरंभ करें →",
    continueReading: "पढ़ना जारी रखें",
    lastRead: "अंतिम पढ़ा हुआ",
    allChapters: "सभी अध्याय",
    viewAll: "सभी देखें",
    dailyQuoteTitle: "दैनिक श्लोक विचार",
    todayVerse: "आज का श्लोक",
    chaptersTitle: "अध्याय",
    chapterLabel: "अध्याय",
    shlokaLabel: "श्लोक",
    shlokasCountLabel: "श्लोक",
    meaningTitle: "भावार्थ",
    purportTitle: "सारांश एवं व्याख्या",
    play: "सुनें",
    stop: "रोकें",
    bookmark: "बुकमार्क",
    bookmarked: "सुरक्षित",
    share: "साझा करें",
    textSize: "अक्षर आकार",
    prevShloka: "पिछला श्लोक",
    nextShloka: "अगला श्लोक",
    settingsTitle: "भाषा एवं सेटिंग्स",
    languageSection: "भाषा (Language)",
    displaySection: "डिस्प्ले",
    themeLabel: "थीम",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System",
    notificationsSection: "सूचनाएं",
    dailyReminder: "दैनिक श्लोक स्मरण",
    myBookmarks: "मेरे बुकमार्क",
    emptyBookmarks: "कोई सहेजा हुआ श्लोक नहीं",
    readingHistory: "पठन इतिहास",
    emptyHistory: "पठन इतिहास खाली है",
    searchPlaceholder: "श्लोक या अध्याय खोजें...",
    readInContext: "संदर्भ में पढ़ें →",
    moreTitle: "अन्य",
    seekLearnLive: "Seek. Learn. Live.",
    closerToBetterYou: "A step closer to a better you.",
    languageOption: "भाषा (Language)",
    appearanceOption: "दिखावट (Appearance)",
    aboutGita: "गीता के बारे में",
    rateApp: "ऐप को स्टार दें",
    shareWithFriends: "मित्रों से साझा करें",
    tabHome: "होम",
    tabChapters: "अध्याय",
    tabStreaks: "साधना",
    tabBookmarks: "बुकमार्क",
    tabMore: "अन्य",
    sadhanaCircle: "साधना मंडल",
    walkingTogether: "एक ही पथ के पथिक"
  },
  ta: {
    appName: "Gita",
    tagline: "Timeless Wisdom for a Better You",
    motto: "தர்மம் காப்பவனை தர்மமே காக்கும் ।",
    beginJourney: "பயணத்தை தொடங்குக →",
    continueReading: "தொடர்ந்து படிக்கவும்",
    lastRead: "கடைசியாக படித்தது",
    allChapters: "அனைத்து அத்தியாயங்கள்",
    viewAll: "அனைத்தும்",
    dailyQuoteTitle: "இன்றைய பொன்மொழி",
    todayVerse: "இன்றைய சுலோகம்",
    chaptersTitle: "அத்தியாயங்கள்",
    chapterLabel: "அத்தியாயம்",
    shlokaLabel: "சுலோகம்",
    shlokasCountLabel: "சுலோகங்கள்",
    meaningTitle: "பொருள்",
    purportTitle: "சாராம்சம் & விளக்கம்",
    play: "கேளுங்கள்",
    stop: "நிறுத்து",
    bookmark: "புக்மார்க்",
    bookmarked: "சேமிக்கப்பட்டது",
    share: "பகிர்",
    textSize: "எழுத்து அளவு",
    prevShloka: "முந்தைய சுலோகம்",
    nextShloka: "அடுத்த சுலோகம்",
    settingsTitle: "மொழி & அமைப்புகள்",
    languageSection: "மொழி (Language)",
    displaySection: "காட்சி",
    themeLabel: "தீம்",
    lightTheme: "வெளிச்சம்",
    darkTheme: "இருள்",
    systemTheme: "தானியங்கு",
    notificationsSection: "அறிவிப்புகள்",
    dailyReminder: "தினசரி சுலோக நினைவூட்டல்",
    myBookmarks: "எனது புக்மார்க்குகள்",
    emptyBookmarks: "புக்மார்க்குகள் எதுவும் இல்லை",
    readingHistory: "படித்த வரலாறு",
    emptyHistory: "வரலாறு காலியாக உள்ளது",
    searchPlaceholder: "சுலோகம் அல்லது அத்தியாயம் தேடவும்...",
    readInContext: "முழுமையாகப் படிக்க →",
    moreTitle: "மேலும்",
    seekLearnLive: "Seek. Learn. Live.",
    closerToBetterYou: "A step closer to a better you.",
    languageOption: "மொழி",
    appearanceOption: "தோற்றம்",
    aboutGita: "கீதையைப் பற்றி",
    rateApp: "மதிப்பிடுங்கள்",
    shareWithFriends: "நண்பர்களுடன் பகிரவும்",
    tabHome: "முகப்பு",
    tabChapters: "அத்தியாயங்கள்",
    tabStreaks: "சாதனா",
    tabBookmarks: "புக்மார்க்",
    tabMore: "மேலும்",
    sadhanaCircle: "சாதனா வட்டம்",
    walkingTogether: "ஆன்மீகப் பயணிகள்"
  },
  kn: {
    appName: "Gita",
    tagline: "Timeless Wisdom for a Better You",
    motto: "ಧರ್ಮೋ ರಕ್ಷತಿ ರಕ್ಷಿತಃ ।",
    beginJourney: "ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ →",
    continueReading: "ಓದುವುದನ್ನು ಮುಂದುವರಿಸಿ",
    lastRead: "ಕೊನೆಯದಾಗಿ ಓದಿದ್ದು",
    allChapters: "ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    dailyQuoteTitle: "ದೈನಂದಿನ ಶ್ಲೋಕ ಜ್ಞಾನ",
    todayVerse: "ಇಂದಿನ ಶ್ಲೋಕ",
    chaptersTitle: "ಅಧ್ಯಾಯಗಳು",
    chapterLabel: "ಅಧ್ಯಾಯ",
    shlokaLabel: "ಶ್ಲೋಕ",
    shlokasCountLabel: "ಶ್ಲೋಕಗಳು",
    meaningTitle: "ಭಾವಾರ್ಥ",
    purportTitle: "ಸಾರಾಂಶ & ವಿವರಣೆ",
    play: "ಕೇಳಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    bookmark: "ಬುಕ್‌ಮಾರ್ಕ್",
    bookmarked: "ಉಳಿಸಲಾಗಿದೆ",
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    textSize: "ಅಕ್ಷರ ಗಾತ್ರ",
    prevShloka: "ಹಿಂದಿನ ಶ್ಲೋಕ",
    nextShloka: "ಮುಂದಿನ ಶ್ಲೋಕ",
    settingsTitle: "ಭಾಷೆ & ಸೆಟ್ಟಿಂಗ್ಸ್",
    languageSection: "ಭಾಷೆ (Language)",
    displaySection: "ಡಿಸ್ಪ್ಲೇ",
    themeLabel: "ಥೀಮ್",
    lightTheme: "ಲೈಟ್",
    darkTheme: "ಡಾರ್ಕ್",
    systemTheme: "ಸಿಸ್ಟಮ್",
    notificationsSection: "ಸೂಚನೆಗಳು",
    dailyReminder: "ದೈನಂದಿನ ಶ್ಲೋಕ ನೆನಪೋಲೆ",
    myBookmarks: "ನನ್ನ ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು",
    emptyBookmarks: "ಯಾವುದೇ ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳಿಲ್ಲ",
    readingHistory: "ಓದಿದ ಇತಿಹಾಸ",
    emptyHistory: "ಇತಿಹಾಸ ಖಾಲಿಯಾಗಿದೆ",
    searchPlaceholder: "ಶ್ಲೋಕ ಅಥವಾ ಅಧ್ಯಾಯ ಹುಡುಕಿ...",
    readInContext: "ಸಂದರ್ಭದಲ್ಲಿ ಓದಿ →",
    moreTitle: "ಇನ್ನಷ್ಟು",
    seekLearnLive: "Seek. Learn. Live.",
    closerToBetterYou: "A step closer to a better you.",
    languageOption: "ಭಾಷೆ",
    appearanceOption: "ಗೋಚರತೆ",
    aboutGita: "ಗೀತೆಯ ಬಗ್ಗೆ",
    rateApp: "ರೇಟಿಂಗ್ ನೀಡಿ",
    shareWithFriends: "ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ",
    tabHome: "ಮುಖಪುಟ",
    tabChapters: "ಅಧ್ಯಾಯಗಳು",
    tabStreaks: "ಸಾಧನಾ",
    tabBookmarks: "ಬುಕ್‌ಮಾರ್ಕ್",
    tabMore: "ಇನ್ನಷ್ಟು",
    sadhanaCircle: "ಸಾಧನಾ ವೃತ್ತ",
    walkingTogether: "ಜೊತೆಯಾಗಿ ನಡೆಯುವ ಸಾಧಕರು"
  }
};

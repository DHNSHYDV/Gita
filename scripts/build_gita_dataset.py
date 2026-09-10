#!/usr/bin/env python3
import json
import urllib.request
import os
import sys

def safe_str(val):
    if val is None:
        return ""
    return str(val).strip()

# Tamil transliteration map from Devanagari
d2t = {
    "अ": "அ", "आ": "ஆ", "इ": "இ", "ई": "ஈ", "उ": "உ", "ऊ": "ஊ",
    "ऋ": "ரி", "ए": "ஏ", "ऐ": "ஐ", "ओ": "ஓ", "औ": "ஔ",
    "क": "க", "ख": "க", "ग": "க", "घ": "க", "ङ": "ங",
    "च": "ச", "छ": "ச", "ज": "ஜ", "झ": "ஜ", "ञ": "ஞ",
    "ट": "ட", "ठ": "ட", "ड": "ட", "ढ": "ட", "ण": "ண",
    "त": "த", "थ": "த", "द": "த", "ध": "த", "न": "ந",
    "प": "ப", "फ": "ப", "ब": "ப", "भ": "ப", "म": "ம",
    "य": "ய", "र": "ர", "ल": "ல", "व": "வ", "श": "ஶ", "ष": "ஷ", "स": "ஸ", "ह": "ஹ",
    "ा": "ா", "ि": "ி", "ी": "ீ", "ु": "ு", "ू": "ூ", "ृ": "்ரி", "ॄ": "்ரீ",
    "े": "ே", "ै": "ை", "ो": "ோ", "ौ": "ௌ", "्": "்",
    "ं": "ம்", "ः": "ஃ", "ऽ": "", "।": "|", "॥": "||",
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"
}

def devanagari_to_tamil(text):
    res = []
    for ch in text:
        res.append(d2t.get(ch, ch))
    return "".join(res)

print("Step 1: Downloading primary verse data (Sanskrit, Telugu, Kannada, English)...")
url1 = "https://raw.githubusercontent.com/nvkudva/bhagavad-geeta/main/src/data/verses.json"
req1 = urllib.request.Request(url1, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req1) as resp:
    verses_raw = json.loads(resp.read().decode("utf-8"))
print(f"Loaded {len(verses_raw)} verses from primary dataset.")

print("Step 2: Downloading Hindi translations & commentaries...")
url_v = "https://raw.githubusercontent.com/praneshp1org/Bhagavad-Gita-JSON-data/main/verse.json"
req_v = urllib.request.Request(url_v, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req_v) as resp:
    v_data = json.loads(resp.read().decode("utf-8"))

url_t = "https://raw.githubusercontent.com/praneshp1org/Bhagavad-Gita-JSON-data/main/translation.json"
req_t = urllib.request.Request(url_t, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req_t) as resp:
    t_data = json.loads(resp.read().decode("utf-8-sig"))

url_c = "https://raw.githubusercontent.com/praneshp1org/Bhagavad-Gita-JSON-data/main/commentary.json"
req_c = urllib.request.Request(url_c, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req_c) as resp:
    c_data = json.loads(resp.read().decode("utf-8"))

hindi_translations = {}
for t in t_data:
    if t.get("lang") == "hindi" and t.get("authorName") == "Swami Ramsukhdas":
        v_id = t.get("verse_id")
        if v_id and v_id <= len(v_data):
            v_entry = v_data[v_id - 1]
            ch = v_entry["chapter_number"]
            ve = v_entry["verse_number"]
            hindi_translations[(ch, ve)] = safe_str(t.get("description"))

hindi_commentaries = {}
for c in c_data:
    if c.get("lang") == "Hindi" and c.get("authorName") == "Swami Chinmayananda":
        v_id = c.get("verse_id")
        if v_id and v_id <= len(v_data):
            v_entry = v_data[v_id - 1]
            ch = v_entry["chapter_number"]
            ve = v_entry["verse_number"]
            hindi_commentaries[(ch, ve)] = safe_str(c.get("description"))

print(f"Loaded {len(hindi_translations)} Hindi translations and {len(hindi_commentaries)} Hindi commentaries.")

# Curated overrides for landmark verses to ensure high-polish presentation
curated = {
    (2, 47): {
        "te_t": "నీవు కర్మ చేయడానికే అధికారి, దాని ఫలితాలపై ఎప్పటికీ కాదు. కర్మ ఫలితాలే నీకు కారణమని భావించకూడదు. కర్మ చేయకూడదని కూడా ఆసక్తి ఉండకూడదు.",
        "te_p": "మన కర్తవ్యాన్ని నిష్కామంగా చేయాలి, ఫలితం మన చేతుల్లో లేదు. కర్మ చేయడం మన ధర్మం, ఫలితం దేవుని చేతుల్లో ఉంది.",
        "en_t": "You have a right to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
        "en_p": "Focus entirely on the sincerity of your effort rather than being paralyzed by anxiety about the outcome. Acting selflessly brings true peace of mind.",
        "hi_t": "तुम्हारा अधिकार केवल कर्म करने में ही है, उसके फलों में कभी नहीं। इसलिए तुम कर्मों के फल के हेतु मत बनो और न ही तुम्हारी कर्म न करने में आसक्ति हो।",
        "hi_p": "कर्तव्य को बिना स्वार्थ और फलासक्ति के निभाना चाहिए। फल ईश्वर के अधीन है, कर्म करना हमारा धर्म है।",
        "ta_s": "கர்மண்யேவாதிகாரஸ்தே மா பலேஷு கதாசன |\nமா கர்மபலஹேதுர்பூர்மாதே ஸங்கோஸ்த்வகர்மணி || 2.47 ||",
        "ta_t": "செயல்களை ஆற்றுவதற்கே உனக்கு உரிமை உண்டு; அதன் பலன்களில் ஒருபோதும் இல்லை. செயலின் பயனுக்கு நீ காரணமாக இருக்காதே; செயலின்மையிலும் உனக்கு பற்றுதல் வேண்டாம்.",
        "ta_p": "எதிர்பார்ப்பின்றி கடமையைச் செய்வதே உண்மையான பக்தி மற்றும் அமைதியின் இரகசியம் ஆகும்.",
        "kn_t": "ಕರ್ತವ್ಯವನ್ನು ಮಾಡಲು ಮಾತ್ರ ನಿನಗೆ ಅಧಿಕಾರವಿದೆ, ಅದರ ಫಲಗಳ ಮೇಲಲ್ಲ. ಕರ್ಮದ ಫಲಕ್ಕೆ ನೀನು ಕಾರಣನಾಗಬೇಡ ಮತ್ತು ಕರ್ಮ ತ್ಯಾಗದಲ್ಲೂ ನಿನಗೆ ಆಸಕ್ತಿ ಇರಬಾರದು.",
        "kn_p": "ನಿಸ್ವಾರ್ಥ ಮನೋಭಾವದಿಂದ ಕರ್ತವ್ಯ ನಿರ್ವಹಿಸುವುದೇ ಪರಮ ಶಾಂತಿಯ ಮೂಲ."
    },
    (4, 7): {
        "te_t": "ఓ భరతవంశీయుడా! ఎప్పుడెప్పుడు ధర్మానికి హాని కలుగుతుందో, అధర్మం ప్రబలుతుందో, అప్పుడు నన్ను నేను సృష్టించుకుంటాను (అవతరిస్తాను).",
        "te_p": "ధర్మ రక్షణ కోసం మరియు అధర్మాన్ని నశింపజేయడానికి భగవంతుడు యుగయుగాలలో దివ్య రూపంలో అవతరిస్తాడు.",
        "en_t": "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.",
        "en_p": "The Divine descends through ages to re-establish righteousness, protect the noble, and illuminate humanity with timeless truth.",
        "hi_t": "हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने रूप को रचता हूँ अर्थात प्रकट होता हूँ।",
        "hi_p": "धर्म की रक्षा और संसार में संतुलन की पुनर्स्थापना के लिए ईश्वर का प्राकट्य होता है।",
        "ta_s": "யதா யதா ஹி தர்மஸ்ய க்லானிர்பவதி பாரத |\nஅப்யுத்தானமதர்மஸ்ய ததாத்மானம் ஸ்ருஜாம்யஹம் || 4.7 ||",
        "ta_t": "பாரதனே! எப்போதெல்லாம் தர்மம் சீர்குலைந்து, அதர்மம் தலைதூக்குகிறதோ, அப்போதெல்லாம் என்னை நானே வெளிப்படுத்திக் கொள்கிறேன்.",
        "ta_p": "தர்மத்தைக் காக்கவும் நல்லோரை நல்வழிப்படுத்தவும் இறைவன் ஒவ்வொரு யுகத்திலும் அவதரிக்கிறார்.",
        "kn_t": "ಹೇ ಭಾರತ! ಯಾವಾಗ ಧರ್ಮಕ್ಕೆ ಕುಂದುಂಟಾಗಿ ಅಧರ್ಮವು ಹೆಚ್ಚುತ್ತದೆಯೋ, ಆಗ ನಾನು ನನ್ನನ್ನು ಪ್ರಕಟಿಸಿಕೊಳ್ಳುತ್ತೇನೆ.",
        "kn_p": "ಧರ್ಮದ ಪುನಃಸ್ಥಾಪನೆಗಾಗಿ ಪರಮಾತ್ಮನು ಭೂಮಿಯಲ್ಲಿ ಅವತರಿಸುತ್ತಾನೆ."
    },
    (6, 5): {
        "te_t": "మనస్సు ద్వారా మనల్ని మనం ఉద్ధరించుకోవాలి, పతనం చెందకూడదు. మనస్సే మనకు నిజమైన బంధువు, మనస్సే మనకు శత్రువు కూడా.",
        "te_p": "మన: శాంతి, సమతా భావమే నిజమైన సంపద. మన ఆలోచనలను క్రమశిక్షణలో ఉంచుకుంటే మనమే మన జీవితాన్ని ఉన్నతంగా మార్చుకోగలం.",
        "en_t": "Elevate yourself through the power of your mind, and do not degrade yourself. For the mind can be the greatest friend, or the worst enemy.",
        "en_p": "Inner peace and an even mind are true wealth. When governed by wisdom, the mind uplifts the soul to the highest heights.",
        "hi_t": "मनुष्य को चाहिए कि वह अपने मन के द्वारा अपना उद्धार करे, अपना पतन न होने दे; क्योंकि मन ही मनुष्य का मित्र है और मन ही शत्रु है।",
        "hi_p": "मन की शांति और समता ही वास्तविक संपदा है। संयमित मन जीवन को दिव्यता की ओर ले जाता है।",
        "ta_s": "உத்தரேதாத்மனாத்மானம் நாத்மானமவஸாதயேத் |\nஆத்மைவ ஹ்யாத்மனோ பந்துராத்மைவ ரிபுராத்மனஃ || 6.5 ||",
        "ta_t": "ஒருவன் தன் மனதினால் தன்னை உயர்த்திக் கொள்ள வேண்டும்; தன்னைத் தானே தாழ்த்திக் கொள்ளக் கூடாது. மனமே ஒருவனுக்கு நண்பன், மனமே அவனுக்குப் பகைவன்.",
        "ta_p": "மன அமைதியும் சமநோக்குமே உண்மையான செல்வம். மனதை ஆள்பவன் வாழ்க்கையை வெல்கிறான்.",
        "kn_t": "ತನ್ನ ಮನಸ್ಸಿನಿಂದ ತನ್ನನ್ನು ಉದ್ಧಾರ ಮಾಡಿಕೊಳ್ಳಬೇಕು, ಪತನವಾಗಲು ಬಿಡಬಾರದು. ಮನಸ್ಸೇ ತನಗೆ ಬಂಧು, ಮನಸ್ಸೇ ತನಗೆ ವೈರಿ.",
        "kn_p": "ಮನಸ್ಸಿನ ಶಾಂತಿ ಮತ್ತು ಸಮತೆಯೇ ನಿಜವಾದ ಸಂಪತ್ತು. ಮನಸ್ಸನ್ನು ನಿಯಂತ್ರಿಸಿದವನೇ ಶ್ರೇಷ್ಠ ಸಾಧಕ."
    },
    (18, 66): {
        "te_t": "సమస్త ధర్మాలను నాకు సమర్పించి, నన్ను ఒక్కడినే శరణు వేడుము. నేను నిన్ను సమస్త పాపముల నుండి విముక్తుడిని చేస్తాను, శోకించకు.",
        "te_p": "భగవద్గీత యొక్క అంతిమ సందేశం: పరిపూర్ణ శరణాగతి. భగవంతునిపై అచంచల విశ్వాసముంచిన సాధకుడికి ఎటువంటి భయం లేదా దిగులు ఉండదు.",
        "en_t": "Abandon all varieties of dharmas and simply surrender unto Me alone. I shall deliver you from all sinful reactions; do not grieve.",
        "en_p": "The crown jewel of the Bhagavad Gita: Total surrender to the Divine will. In wholehearted faith lies complete freedom from all anxiety and sorrow.",
        "hi_t": "संपूर्ण धर्मों के आश्रय को त्यागकर केवल मेरी शरण में आ जाओ। मैं तुम्हें समस्त पापों से मुक्त कर दूँगा, शोक मत करो।",
        "hi_p": "गीता का सर्वोच्च उपदेश: अनन्य शरणागति। ईश्वर पर पूर्ण समर्पण ही मोक्ष और परम अभय का मार्ग है।",
        "ta_s": "ஸர்வதர்மான் பரித்யஜ்ய மாமேகம் சரணம் வ்ரஜ |\nஅஹம் த்வாம் ஸர்வபாபேப்யோ மோக்ஷயிஷ்யாமி மா சுசஃ || 18.66 ||",
        "ta_t": "அனைத்து தர்மங்களையும் துறந்து என்னை மட்டுமே சரணடைவாய். நான் உன்னை அனைத்து பாவங்களிலிருந்தும் விடுவிப்பேன், கவலைப்படாதே.",
        "ta_p": "கீதையின் உச்சக்கட்ட போதனை: முழுமையான சரணாகதி. இறைவனைச் சார்ந்திருப்பவனுக்கு எதற்கும் அஞ்சத் தேவையில்லை.",
        "kn_t": "ಸಮಸ್ತ ಧರ್ಮಗಳನ್ನು ತೊರೆದು ನನ್ನೊಬ್ಬನನ್ನೇ ಶರಣುಹೊಂದು. ನಾನು ನಿನ್ನನ್ನು ಎಲ್ಲಾ ಪಾಪಗಳಿಂದ ಮುಕ್ತಗೊಳಿಸುತ್ತೇನೆ, ದುಃಖಿಸಬೇಡ.",
        "kn_p": "ಗೀತೆಯ ಮಹಾಸಾರ: ಪರಿಪೂರ್ಣ ಶರಣಾಗತಿ. ಭಗವಂತನಿಗೆ ಆತ್ಮಸಮರ್ಪಣೆ ಮಾಡಿದವನಿಗೆ ಯಾವುದೇ ಭಯವಿಲ್ಲ."
    }
}

print("Step 3: Compiling unified 700-verse database...")
compiled_verses = []

for v in verses_raw:
    c = v["chapter_id"]
    v_num = v["verse_number"]
    verse_id = f"{c}.{v_num}"
    
    sanskrit = safe_str(v.get("text"))
    transliteration = safe_str(v.get("transliteration"))
    
    # English
    en_t = safe_str(v.get("translation_english"))
    en_p = safe_str(v.get("commentary_english"))
    if len(en_p) > 1200:
        en_p = en_p[:1200].rsplit(" ", 1)[0] + "..."

    # Telugu
    te_s = safe_str(v.get("text_telugu")) or sanskrit
    te_t = safe_str(v.get("translation_telugu")) or en_t
    te_p = safe_str(v.get("commentary_telugu")) or en_p
    if len(te_p) > 1200:
        te_p = te_p[:1200].rsplit(" ", 1)[0] + "..."

    # Kannada
    kn_s = safe_str(v.get("text_kannada")) or sanskrit
    kn_t = safe_str(v.get("translation_kannada")) or en_t
    kn_p = safe_str(v.get("commentary_kannada")) or en_p
    if len(kn_p) > 1200:
        kn_p = kn_p[:1200].rsplit(" ", 1)[0] + "..."

    # Hindi
    hi_s = sanskrit
    hi_t = hindi_translations.get((c, v_num), "").strip() or en_t
    hi_p = hindi_commentaries.get((c, v_num), "").strip() or en_p
    if len(hi_p) > 1200:
        hi_p = hi_p[:1200].rsplit(" ", 1)[0] + "..."

    # Tamil
    ta_s = devanagari_to_tamil(sanskrit)
    ta_t = en_t
    ta_p = en_p

    # Apply curated overrides if any
    if (c, v_num) in curated:
        override = curated[(c, v_num)]
        te_t = override.get("te_t", te_t)
        te_p = override.get("te_p", te_p)
        en_t = override.get("en_t", en_t)
        en_p = override.get("en_p", en_p)
        hi_t = override.get("hi_t", hi_t)
        hi_p = override.get("hi_p", hi_p)
        kn_t = override.get("kn_t", kn_t)
        kn_p = override.get("kn_p", kn_p)
        ta_s = override.get("ta_s", ta_s)
        ta_t = override.get("ta_t", ta_t)
        ta_p = override.get("ta_p", ta_p)

    verse_entry = {
        "id": verse_id,
        "chapterNumber": c,
        "verseNumber": v_num,
        "sanskrit": sanskrit,
        "transliteration": transliteration,
        "translations": {
            "te": {
                "scriptShloka": te_s,
                "translation": te_t,
                "purport": te_p
            },
            "en": {
                "scriptShloka": transliteration,
                "translation": en_t,
                "purport": en_p
            },
            "hi": {
                "scriptShloka": hi_s,
                "translation": hi_t,
                "purport": hi_p
            },
            "kn": {
                "scriptShloka": kn_s,
                "translation": kn_t,
                "purport": kn_p
            },
            "ta": {
                "scriptShloka": ta_s,
                "translation": ta_t,
                "purport": ta_p
            }
        }
    }
    compiled_verses.append(verse_entry)

out_file = "/home/dhnshydv/Gita/src/data/allVerses.json"
print(f"Step 4: Writing {len(compiled_verses)} compiled verses to {out_file}...")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(compiled_verses, f, ensure_ascii=False, indent=None, separators=(',', ':'))

file_size_mb = os.path.getsize(out_file) / (1024 * 1024)
print(f"Success! Generated {out_file} ({file_size_mb:.2f} MB).")

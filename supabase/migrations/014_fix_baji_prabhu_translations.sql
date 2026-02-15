-- ==========================================
-- FIX BAJI PRABHU TRANSLATIONS (Story Title Mismatch)
-- ==========================================

-- Story Title Update
UPDATE public.stories
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'बाजी प्रभु देशपांडे: पावनखिंड की अंतिम लड़ाई',
        'description', 'वह दर्रा जिसे 300 वीरों ने 10,000 दुश्मन सैनिकों के खिलाफ 18 घंटे तक रोके रखा। शिवाजी महाराज की सुरक्षा सुनिश्चित करने के लिए बाजी प्रभु के साथ खड़े हों।',
        'character_name', 'बाजी प्रभु'
    ),
    'mr', jsonb_build_object(
        'title', 'बाजी प्रभू देशपांडे: पावनखिंडचा रणसंग्राम',
        'description', 'ती खिंड जिथे ३०० शूरवीर १०,००० शत्रू सैनिकांविद्ध १८ तास लढले. शिवाजी महाराजांच्या सुरक्षेसाठी बाजी प्रभूंच्या सोबत उभे राहा.',
        'character_name', 'बाजी प्रभू'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Baji Prabhu Deshpande: Pavankhind ki Last Stand',
        'description', 'Woh pass jise 300 brave warriors ne 10,000 enemy soldiers ke against 18 hours tak hold kiya. Shivaji Maharaj ki safety ensure karne ke liye Baji Prabhu ke saath khade hon.',
        'character_name', 'Baji Prabhu'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Baji Prabhu Deshpande: Pavankhind cha Ransangram',
        'description', 'Ti khind jithe 300 shurveera 10,000 shatru sainikanviruddha 18 taasan paryant ladhle. Shivaji Maharajanchya surakshe sathi Baji Prabhunchya sobat ubhe raha.',
        'character_name', 'Baji Prabhu'
    )
)
WHERE title = 'Baji Prabhu Deshpande: The Last Stand';

-- Scene 1: The Patriot's Calling
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'देशभक्त की पुकार',
        'content', 'शिवाजी महाराज आपके सामने खड़े हैं, हाथ में तलवार लिए। वे आपसे स्वराज्य के लिए निष्ठा मांग रहे हैं। यह सिर्फ एक तलवार नहीं, यह एक जिम्मेदारी है। क्या आप इसे स्वीकार करेंगे?',
        'overview', 'क्या आप स्वराज्य के प्रति अपना जीवन समर्पित करेंगे?'
    ),
    'mr', jsonb_build_object(
        'title', 'देशभक्ताची हाक',
        'content', 'शिवाजी महाराज तुमच्या समोर उभे आहेत, हातात तलवार घेऊन. ते तुमच्याकडून स्वराज्यासाठी निष्ठा मागत आहेत. ही फक्त तलवार नाही, ही एक जबाबदारी आहे. तुम्ही ती स्वीकाराल का?',
        'overview', 'तुम्ही स्वराज्यासाठी तुमचे जीवन अर्पण कराल का?'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Deshbhakt ki Pukaar',
        'content', 'Shivaji Maharaj aapke saamne khade hain, haath mein sword liye. Woh aapse Swarajya ke liye loyalty maang rahe hain. Yeh sirf ek sword nahi, yeh ek responsibility hai. Kya aap isse accept karenge?',
        'overview', 'Kya aap Swarajya ke prati apna jeevan samarpan karenge?'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Deshbhaktachi Haak',
        'content', 'Shivaji Maharaj tumchya samor ubhe ahet, hatat talwar gheun. Te tumchkadun Swarajyasathi nishtha magat ahet. Hi fakt talwar nahi, hi ek jababdari ahe. Tumhi ti swikaral ka?',
        'overview', 'Tumhi Swarajyasathi tumche jivan arpan karal ka?'
    )
)
WHERE scene_number = 1 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 2: The Trap at Panhala
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'पन्हाळा का जाल',
        'content', 'आप पन्हाळा किले में घिर चुके हैं। सिद्दी जौहर की सेना ने किले को घेर रखा है। रसद खत्म हो रही है। या तो भूख से मरना होगा या आत्मसमर्पण करना होगा। या शायद कोई तीसरा रास्ता है?',
        'overview', 'भुखमरी या आत्मसमर्पण निकट लग रहा है। आपकी सलाह क्या है?'
    ),
    'mr', jsonb_build_object(
        'title', 'पन्हाळ्याचा सापळा',
        'content', 'तुम्ही पन्हाळा किलेत अडकला आहात. सिद्दी जौहरच्या सैन्याने किल्ल्याला वेढा घातला आहे. रसद संपत चालली आहे. एकतर उपाशी मरावे लागेल किंवा शरण जावे लागेल. किंवा कदाचित दुसरा मार्ग आहे?',
        'overview', 'उपासमार किंवा शरणागती जवळ दिसत आहे. तुमचा सल्ला काय आहे?'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Panhala ka Jaal',
        'content', 'Aap Panhala fort mein ghir chuke hain. Siddi Jauhar ki army ne fort ko gher rakha hai. Supplies khatam ho rahi hain. Ya toh bhookh se marna hoga ya surrender karna hoga. Ya shayad koi teesra raasta hai?',
        'overview', 'Starvation ya surrender paas lag raha hai. Aapki advice kya hai?'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Panhalyacha Sapla',
        'content', 'Tumhi Panhala killyat adakla ahat. Siddi Jauhar chya sainyane killyala vedha ghatla ahe. Rasad sampat challi ahe. Ek tar upashi marave lagel kimva sharan jave lagel. Kimva kadachit dusra marg ahe?',
        'overview', 'Upasmar kimva sharanagati javal disat ahe. Tumcha salla kay ahe?'
    )
)
WHERE scene_number = 2 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 3: The Grand Deception
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'महान धोखा',
        'content', 'शिवा नावी, जो बिल्कुल शिवाजी महाराज जैसे दिखते हैं, ने एक जोखिम भरा सुझाव दिया है। वह दुश्मन का ध्यान भटकाने के लिए खुद को बलिदान करने को तैयार हैं। यह एक खतरनाक योजना है।',
        'overview', 'क्या आप इस योजना का समर्थन करते हैं?'
    ),
    'mr', jsonb_build_object(
        'title', 'मोठी फसवणूक',
        'content', 'शिवा न्हावी, जे हुबेहूब शिवाजी महाराजांसारखे दिसतात, त्यांनी एक अत्यंत धोक्याचा प्रस्ताव दिला आहे. शत्रूचे लक्ष विचलित करण्यासाठी ते स्वतःचे बलिदान दे करण्यास तयार आहेत. ही एक धोकादायक योजना आहे.',
        'overview', 'तुम्ही या योजनेला पाठिंबा देता का?'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Grand Deception',
        'content', 'Shiva Nhavi, jo bilkul Shivaji Maharaj jaise dikhte hain, unhone ek risky suggestion diya hai. Woh enemy ka dhyan bhatkane ke liye khud ko sacrifice karne ko taiyar hain. Yeh ek dangerous plan hai.',
        'overview', 'Kya aap is plan ka support karte hain?'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Mothi Fasavnuk',
        'content', 'Shiva Nhavi, je hubehub Shivaji Maharajansarkhe distat, tyanni ek atyant dhokyacha prastav dila ahe. Shatruche laksha vichalit karnyasathi te swatahache balidan denyas tayar ahet. Hi ek dhokadayak yojana ahe.',
        'overview', 'Tumhi ya yojnele pathimba deta ka?'
    )
)
WHERE scene_number = 3 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 4: The Decoy's Sacrifice
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'मुखौटे का बलिदान',
        'content', 'शिवा नावी पकड़े गए और मारे गए। उनका बलिदान व्यर्थ नहीं जाना चाहिए। दुश्मन अभी भ्रमित है। यही निकलने का मौका है।',
        'overview', 'हमें उनकी मृत्यु को व्यर्थ नहीं जाने देना चाहिए।',
        'valid_actions_hint', jsonb_build_object('hi', jsonb_build_array('भागो', 'निकलें', 'सम्मान'), 'mr', jsonb_build_array('पळा', 'निघा', 'सन्मान'))
    ),
    'mr', jsonb_build_object(
        'title', 'सोंगड्याचे बलिदान',
        'content', 'शिवा न्हावी पकडले गेले आणि मारले गेले. त्यांचे बलिदान वाया जाऊ देऊ नये. शत्रू अजून गोंधळलेला आहे. हीच निसटण्याची संधी आहे.',
        'overview', 'आपल्याला त्यांचा मृत्यू व्यर्थ जाऊ देता कामा नये.',
        'valid_actions_hint', jsonb_build_object('hi', jsonb_build_array('bhago', 'nikla'), 'mr', jsonb_build_array('pala', 'nigha'))
    ),
    'hi-en', jsonb_build_object(
        'title', 'Decoy ka Balidan',
        'content', 'Shiva Nhavi pakde gaye aur maare gaye. Unka sacrifice waste nahi jaana chahiye. Enemy abhi confused hai. Yahi nikalne ka chance hai.',
        'overview', 'Humein unki death ko waste nahi jaane dena chahiye.'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Songadyache Balidan',
        'content', 'Shiva Nhavi pakadle gele ani marle gele. Tyanche balidan vaya jau deu naye. Shatru ajun gondhalela ahe. Hich nisatnyachi sandhi ahe.',
        'overview', 'Aplyala tyancha mrutyu vyrtha jau deta kama naye.'
    )
)
WHERE scene_number = 4 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 5: The Race to Ghod Khind
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'घोड़ खिंड की दौड़',
        'content', 'तूफान और बारिश के बीच आप घोड़े दौड़ा रहे हैं। दुश्मन पीछे लगा हुआ है। कीचड़ और अंधेरे में हर पल कीमती है। तेज! और तेज!',
        'overview', 'तूफान के बीच से सवारी करें!'
    ),
    'mr', jsonb_build_object(
        'title', 'घोडखिंडीची शर्यत',
        'content', 'वादळ आणि पावसात तुम्ही घोडे दौडत आहात. शत्रू पाठलाग करत आहे. चिखल आणि अंधारात प्रत्येक क्षण मोलाचा आहे. वेगाने! अजून वेगाने!',
        'overview', 'वादळातून घोडी दौडा!'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Ghod Khind ki Race',
        'content', 'Toofan aur baarish ke beech aap ghode daunda rahe hain. Enemy peeche laga hua hai. Keechad aur andhere mein har pal keemti hai. Tez! Aur tez!',
        'overview', 'Storm ke beech se ride karein!'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Ghodkhindichi Sharyat',
        'content', 'Vadal ani pavsat tumhi ghode daudat ahat. Shatru pathlag karat ahe. Chikhal ani andharat pratyek kshan molacha ahe. Vegane! Ajun vegane!',
        'overview', 'Vadalatun ghodi dauda!'
    )
)
WHERE scene_number = 5 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 6: The Ultimate Volunteer
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'अंतिम स्वयंसेवक',
        'content', 'विशालगढ़ अभी दूर है। दुश्मन बहुत करीब आ गया है। किसी को इस संकरी खिंड (दर्रे) में रुककर उन्हें रोकना होगा ताकि महाराज सुरक्षित पहुंच सकें।',
        'overview', 'किसी को उन्हें पीछे रोकना होगा।'
    ),
    'mr', jsonb_build_object(
        'title', 'अंतिम स्वयंसेवक',
        'content', 'विशाळगड अजून दूर आहे. शत्रू खूप जवळ आला आहे. कुणाला तरी या अरुंद खिंडीत थांबून त्यांना रोखावे लागेल जेणेकरून महाराज सुरक्षित पोहोचू शकतील.',
        'overview', 'कुणाला तरी त्यांना मागे रोखावे लागेल.'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Ultimate Volunteer',
        'content', 'Vishalgad abhi door hai. Enemy bahut kareeb aa gaya hai. Kisi ko is narrow pass mein rukkar unhe rokna hoga taaki Maharaj safe pahunch sakein.',
        'overview', 'Kisi ko unhe peeche rokna hoga.'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Antim Swayamsevak',
        'content', 'Vishalgad ajun dur ahe. Shatru khup javal ala ahe. Kunala tari ya arund khindit thambun tyanna rokhave lagel jenekarun Maharaj surakshit sochu shaktil.',
        'overview', 'Kunala tari tyanna mage rokhave lagel.'
    )
)
WHERE scene_number = 6 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 7: The Towering Stand
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'अडिग चट्टान',
        'content', '300 मावले बनाम 10,000 दुश्मन। आप खिंड के मुहाने पर एक चट्टान की तरह खड़े हैं। हर बार जब वे ऊपर आते हैं, तो उन्हें आपकी तलवार का सामना करना पड़ता है।',
        'overview', 'लाइन को थामे रखें (Hold the line)!'
    ),
    'mr', jsonb_build_object(
        'title', 'अडिग कडा',
        'content', '३०० मावळे विरुद्ध १०,००० शत्रू. तुम्ही खिंडीच्या तोंडावर एका कड्यासारखे उभे आहात. प्रत्येक वेळी जेव्हा ते वर येतात, तेव्हा त्यांना तुमच्या तलवारीचा सामना करावा लागतो.',
        'overview', 'खिंड लढवा (Hold the line)!'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Adig Chattan',
        'content', '300 Mavale vs 10,000 enemy. Aap khind ke muhane par ek rock ki tarah khade hain. Har baar jab woh upar aate hain, toh unhe aapki sword ka saamna karna padta hai.',
        'overview', 'Line ko thaame rakhein (Hold the line)!'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Adig Kada',
        'content', '300 Mavale viruddha 10,000 shatru. Tumhi khindichya tondavar eka kadyasarkhe ubhe ahat. Pratyek veli jenvha te var yetat, tenvha tyanna tumchya talwaricha samna karava lagto.',
        'overview', 'Khind ladhva!'
    )
)
WHERE scene_number = 7 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 8: The Final Push
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'अंतिम प्रयास',
        'content', 'आप खून से लथपथ हैं। शरीर का हर अंग दर्द कर रहा है, लेकिन आत्मा अभी भी जल रही है। आपको तब तक नहीं मरना है जब तक आप तोपों की आवाज न सुन लें।',
        'overview', 'आप खून बह रहे हैं। आपको तोप के संकेत का इंतजार करना होगा।'
    ),
    'mr', jsonb_build_object(
        'title', 'अंतिम शर्थ',
        'content', 'तुम्ही रक्ताने माखलेले आहात. शरीराचा प्रत्येक अवयव वेदना करत आहे, पण आत्मा अजूनही धगधगत आहे. जोपर्यंत तुम्हाला तोफांचा आवाज ऐकू येत नाही तोपर्यंत तुम्हाला मरायचे नाहीये.',
        'overview', 'तुमचे रक्त वाहत आहे. तुम्हाला तोफेच्या इशार्याची वाट पहावी लागेल.'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Antim Prayas',
        'content', 'Aap khoon se lathpath hain. Body ka har part pain kar raha hai, lekin soul abhi bhi jal rahi hai. Aapko tab tak nahi marna hai jab tak aap cannons ki aawaz na sun lein.',
        'overview', 'Aap khoon baha rahe hain. Aapko cannon signal ka wait karna hoga.'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Antim Sharth',
        'content', 'Tumhi raktane makhlele ahat. Shariracha pratyek avayav vedna karat ahe, pan atma ajunahi dhagdhagat ahe. joparyant tumhala tofancha aawaz aiku yet nahi toparyant tumhala marayche nahiye.',
        'overview', 'Tumche rakat vahat ahe. Tumhala tofechya isharyachi vat pahavi lagel.'
    )
)
WHERE scene_number = 8 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 9: The Smile of Victory
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'विजय की मुस्कान',
        'content', 'बूम! बूम! बूम! विशालगढ़ से तोपों की गर्जना सुनाई देती है। महाराज सुरक्षित हैं। आपने अपना वचन निभाया है।',
        'overview', 'आपका मिशन पूरा हुआ।'
    ),
    'mr', jsonb_build_object(
        'title', 'विजयाचे हास्य',
        'content', 'धडाम! धडाम! धडाम! विशाळगडावरून तोफांचा कडकडाट ऐकू येतो. महाराज सुरक्षित आहेत. तुम्ही तुमचे वचन पाळले आहे.',
        'overview', 'तुमची मोहीम फत्ते झाली.'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Vijay ki Muskaan',
        'content', 'Boom! Boom! Boom! Vishalgad se cannons ki roar sunai deti hai. Maharaj safe hain. Aapne apna promise nibhaya hai.',
        'overview', 'Aapka mission poora hua.'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Vijayache Hasya',
        'content', 'Dhadam! Dhadam! Dhadam! Vishalgadavarun tofancha kadkadat aiku yeto. Maharaj surakshit ahet. Tumhi tumche vachan palle ahe.',
        'overview', 'Tumchi mohim fatte jhali.'
    )
)
WHERE scene_number = 9 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

-- Scene 10: Pavan Khind (Ending)
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'पावनखिंड',
        'content', 'आपकी अंतिम सांस के साथ, वह दर्रा पवित्र हो गया। आपके बलिदान के सम्मान में इसे "पावनखिंड" का नाम दिया गया। आपका नाम हमेशा के लिए अमर हो गया।',
        'overview', 'यात्रा पूरी हुई।'
    ),
    'mr', jsonb_build_object(
        'title', 'पावनखिंड',
        'content', 'तुमच्या शेवटच्या श्वासाने, ती खिंड पावन झाली. तुमच्या बलिदानाच्या सन्मानार्थ तिला "पावनखिंड" असे नाव देण्यात आले. तुमचे नाव कायमचे अमर झाले.',
        'overview', 'प्रवास पूर्ण झाला.'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Pavankhind',
        'content', 'Aapki last breath ke saath, woh pass holy ho gaya. Aapke sacrifice ke honor mein isse "Pavankhind" ka naam diya gaya. Aapka naam hamesha ke liye immortal ho gaya.',
        'overview', 'Journey Complete.'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Pavankhind',
        'content', 'Tumchya shevatchya shwasane, ti khind pavan jhali. Tumchya balidanachya sanmanartha tila "Pavankhind" ase nav denyat ale. Tumche nav kayamche amar jhale.',
        'overview', 'Pravas Purna Jhala.'
    )
)
WHERE scene_number = 10 AND story_id = (SELECT id FROM public.stories WHERE title = 'Baji Prabhu Deshpande: The Last Stand');

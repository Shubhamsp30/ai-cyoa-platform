-- Update Story Translations for Tanaji
UPDATE public.stories
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'तानाजी मालुसरे: सिंहगढ़ की विजय',
        'description', 'अभेद्य किले सिंहगढ़ को वापस जीतने के लिए बहादुर मराठा योद्धाओं का नेतृत्व करें।',
        'character_name', 'तानाजी'
    ),
    'mr', jsonb_build_object(
        'title', 'तानाजी मालुसरे: सिंहगडाचा विजय',
        'description', 'अजिंक्य सिंहगड किल्ला परत मिळवण्यासाठी शुर मराठा मावळ्यांचे नेतृत्व करा.',
        'character_name', 'तानाजी'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Tanaji Malusare: Sinhagad ki Conquest',
        'description', 'Sinhagad ke impregnable fort ko wapas jitne ke liye brave Maratha warriors ko lead karein.',
        'character_name', 'Tanaji'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Tanaji Malusare: Sinhagad cha Vijay',
        'description', 'Ajinkya Sinhagad killa parat milvnyasathi shur Maratha mavlyanche netrutva kara.',
        'character_name', 'Tanaji'
    )
)
WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad';

-- Update Scene 1 Translations
UPDATE public.scenes
SET translations = jsonb_build_object(
    'hi', jsonb_build_object(
        'title', 'पुरंदर का दंश',
        'content', '1665 में पुरंदर की संधि मराठा साम्राज्य के लिए एक अत्यंत अपमानजनक घटना थी। शिवाजी महाराज को 23 किले मुगलों को सौंपने पड़े, जिसमें सामरिक रूप से महत्वपूर्ण सिंहगढ़ भी शामिल था। इन किलों का खोना स्वराज्य आंदोलन के लिए एक बड़ा झटका था। मुगल सेनापति उदयभान राठौड़ के नियंत्रण में सिंहगढ़ का विचार एक ताजा घाव की तरह चुभता है। जीजाबाई, शिवाजी की माँ, राजगढ़ की खिड़की से बाहर देखती हैं, उनकी नज़रें सिंहगढ़ की दूर की आकृति पर टिकी हैं। वह शिवाजी के विश्वसनीय सेनापति और बचपन के दोस्त तानाजी मालुसरे की ओर मुड़ती हैं। "तानाजी," वह भावना से कांपती हुई आवाज़ में कहती हैं, "सिंहगढ़ को वापस लेना होगा। यह हमारे सम्मान पर एक दाग है। उदयभान वहां अपनी क्रूर सत्ता चला रहा है, हमारी लाचारी का मजाक उड़ा रहा है। क्या तुम यह भार उठा सकते हो? क्या तुम सिंहगढ़ को वापस स्वराज्य में लाओगे?"',
        'overview', 'क्या आप इस अपमान का बदला लेने और जो खो गया था उसे पुनः प्राप्त करने के लिए तैयार हैं?'
    ),
    'mr', jsonb_build_object(
        'title', 'पुरंदरचा सल',
        'content', '१६६५ मधील पुरंदरचा तह मराठा साम्राज्यासाठी अत्यंत अपमानकारक घटना होती. शिवाजी महाराजांना २३ किल्ले मुघलांना द्यावे लागले, त्यात अत्यंत महत्त्वाचा आणि बळकट सिंहगड सुद्धा होता. हे किल्ले जाणे स्वराज्यासाठी मोठा धक्का होता. मुघल किल्लेदार उदयभान राठोडच्या ताब्यात असलेला सिंहगड एखाद्या ताज्या जखमेसारखा सलत होता. जिजाबाई, शिवाजी महाराजांच्या आई, राजगडाच्या खिडकीतून बाहेर बघत होत्या, त्यांची नजर सिंहगडाच्या आकृतीवर खिळली होती. त्या तानाजी मालुसरे, शिवाजींचे विश्वासू सेनापती आणि बालपणीचे मित्र, यांच्याकडे वळल्या. "तानाजी," त्या भरल्या आवाजात म्हणाल्या, "सिंहगड परत मिळवावाच लागेल. हा आपल्या सन्मानावर लागलेला डाग आहे. उदयभान तिथे जुलमी राज्य करत आहे, आपल्या हतबलतेची चेष्टा करत आहे. हे शिवधनुष्य तू पेलशील का? सिंहगड तू पुन्हा स्वराज्यात आणशील का?"',
        'overview', 'हा अपमान धुवून काढण्यासाठी आणि जे गमावले आहे ते परत मिळवण्यासाठी तुम्ही तयार आहात का?'
    ),
    'hi-en', jsonb_build_object(
        'title', 'Purandar ka Zakhm',
        'content', '1665 mein Purandar ki Treaty Maratha Empire ke liye ek deeply humiliating event thi. Shivaji Maharaj ko 23 forts surrender karne pade, jisme strategic aur formidable Sinhagad bhi shamil tha. In forts ka khona Swarajya movement ke liye ek severe blow tha. Sinhagad, jo ab Mughal commander Udaybhan Rathod ke control mein tha, ek fresh wound ki tarah chubhta tha. Jijabai, Shivaji ki maa, Rajgad ki window se bahar dekh rahi thi, unki aankein Sinhagad par tiki thi. Woh Tanaji Malusare, Shivaji ke trusted general aur childhood friend ki taraf mudi. "Tanaji," unhone emotion se kaanpti aawaz mein kaha, "Sinhagad ko wapas lena hi hoga. Yeh hamare honor par ek stain hai. Udaybhan wahan iron fist se rule kar raha hai, hamari helplessness ka mazaak uda raha hai. Kya tum yeh burden utha sakte ho? Kya tum Sinhagad ko wapas Swarajya mein laoge?"',
        'overview', 'Kya aap is humiliation ka badla lene aur jo kho gaya tha use wapas paane ke liye taiyar hain?'
    ),
    'mr-en', jsonb_build_object(
        'title', 'Purandar cha Sal',
        'content', '1665 madhe Purandar cha tah Maratha Empire sathi khup apmanakarak hota. Shivaji Maharaj anna 23 kille surrender karave lagle, jyamadhe strategic Sinhagad pan hota. He forts jane Swarajya sathi khup mottha blow hota. Sinhagad, jo ata Mughal commander Udaybhan Rathod chya control madhe hota, ek fresh jakhme sarkha salat hota. Jijabai, Shivaji chya aai, Rajgad chya khidki tun baher baghat hotya, tyanche dole Sinhagad var tikle hote. Tya Tanaji Malusare, Shivaji che trusted general ani childhood friend kade vallya. "Tanaji," tya bharlelya awajat mhanya, "Sinhagad parat milvavach lagel. Ha aaplya honor var ek dag ahe. Uyadbhan tithe iron fist ne rule karat ahe, aaplya helplessness chi cheshta karat ahe. Tu he burden gheu shakshil ka? Tu Sinhagad parat Swarajya madhe anshil ka?"',
        'overview', 'Ha apman dhuvun kadhnyasathi ani je gamavle ahe te parat milvnyasathi tumhi tayar ahat ka?'
    )
)
WHERE scene_number = 1 
AND story_id = (SELECT id FROM public.stories WHERE title = 'Tanaji Malusare: The Conquest of Sinhagad');

/* Oldest Surviving website: interface words in the 4 starting languages (Mike, 2026-11-12: en, es, el, de),
   and the visitor's language choice (kept in this browser only; no cookies). */
var OS = (function () {
  var LANGS = ["en", "es", "el", "de"];
  var T = {
    en: {
      language: "Language", headline: "Where did it happen?",
      tagline: "Real stories behind everyday things, with subtitles in your language.",
      cat_history: "History", cat_how: "How things work", cat_money: "Money", cat_psychology: "Psychology",
      map_hint: "Tap a country to see the stories that happened there.",
      search: "Search stories", all: "All", shorts: "Shorts", long: "Long videos",
      clear: "All countries", n_stories: "{n} stories", n_story: "1 story", no_results: "No stories match.",
      on_youtube: "On YouTube", subtitled: "Subtitles",
      coming_soon: "{channel} is coming to this website soon. Watch it on YouTube now.",
      open_channel: "Open the channel", subscribe: "Subscribe", watch_on_youtube: "Watch on YouTube",
      all_stories: "All stories", subtitles: "Subtitles", off: "Off", story: "The story",
      translated_note: "Translated from English by AI. Numbers, dates and names are checked by code.",
      sources: "Sources",
      sources_note: "Each fact is checked against two sources. The small numbers after a sentence point to them.",
      credits: "Pictures and credits", changes: "Changes", source_link: "source", voice: "Voice", music: "Music",
      music_none: "None in this version (voice only).",
      disclosure: "Researched from museum and archive records with AI tools; every fact checked against at least two sources and reviewed by a second AI model. Narration: AI voice.",
      ai_pictures: "AI reconstructions are labelled on screen.",
      privacy: "Privacy", no_cookies: "No cookies, no sign-in, no ads.", worldwide: "No single place"
    },
    es: {
      language: "Idioma", headline: "¿Dónde ocurrió?",
      tagline: "Historias reales detrás de las cosas de cada día, con subtítulos en tu idioma.",
      cat_history: "Historia", cat_how: "Cómo funcionan las cosas", cat_money: "Dinero", cat_psychology: "Psicología",
      map_hint: "Toca un país para ver las historias que ocurrieron allí.",
      search: "Buscar historias", all: "Todo", shorts: "Shorts", long: "Vídeos largos",
      clear: "Todos los países", n_stories: "{n} historias", n_story: "1 historia", no_results: "Ninguna historia coincide.",
      on_youtube: "En YouTube", subtitled: "Subtítulos",
      coming_soon: "{channel} llegará pronto a esta web. Míralo ya en YouTube.",
      open_channel: "Abrir el canal", subscribe: "Suscribirse", watch_on_youtube: "Ver en YouTube",
      all_stories: "Todas las historias", subtitles: "Subtítulos", off: "Desactivados", story: "La historia",
      translated_note: "Traducido del inglés con IA. Un programa comprueba números, fechas y nombres.",
      sources: "Fuentes",
      sources_note: "Cada dato se comprueba con dos fuentes. Los números pequeños tras cada frase remiten a ellas.",
      credits: "Imágenes y créditos", changes: "Cambios", source_link: "fuente", voice: "Voz", music: "Música",
      music_none: "Ninguna en esta versión (solo voz).",
      disclosure: "Investigado en registros de museos y archivos con herramientas de IA; cada dato se comprueba con al menos dos fuentes y lo revisa un segundo modelo de IA. Narración: voz de IA.",
      ai_pictures: "Las reconstrucciones con IA se indican en pantalla.",
      privacy: "Privacidad", no_cookies: "Sin cookies, sin registro, sin anuncios.", worldwide: "Sin un lugar concreto"
    },
    el: {
      language: "Γλώσσα", headline: "Πού συνέβη;",
      tagline: "Αληθινές ιστορίες πίσω από τα καθημερινά πράγματα, με υπότιτλους στη γλώσσα σου.",
      cat_history: "Ιστορία", cat_how: "Πώς λειτουργούν τα πράγματα", cat_money: "Χρήμα", cat_psychology: "Ψυχολογία",
      map_hint: "Πάτα σε μια χώρα για να δεις τις ιστορίες που συνέβησαν εκεί.",
      search: "Αναζήτηση ιστοριών", all: "Όλα", shorts: "Shorts", long: "Μεγάλα βίντεο",
      clear: "Όλες οι χώρες", n_stories: "{n} ιστορίες", n_story: "1 ιστορία", no_results: "Καμία ιστορία δεν ταιριάζει.",
      on_youtube: "Στο YouTube", subtitled: "Υπότιτλοι",
      coming_soon: "Το {channel} έρχεται σύντομα σε αυτόν τον ιστότοπο. Δες το τώρα στο YouTube.",
      open_channel: "Άνοιξε το κανάλι", subscribe: "Εγγραφή", watch_on_youtube: "Δες το στο YouTube",
      all_stories: "Όλες οι ιστορίες", subtitles: "Υπότιτλοι", off: "Χωρίς", story: "Η ιστορία",
      translated_note: "Μετάφραση από τα αγγλικά με τεχνητή νοημοσύνη. Ένα πρόγραμμα ελέγχει αριθμούς, ημερομηνίες και ονόματα.",
      sources: "Πηγές",
      sources_note: "Κάθε στοιχείο ελέγχεται με δύο πηγές. Οι μικροί αριθμοί μετά από κάθε πρόταση παραπέμπουν σε αυτές.",
      credits: "Εικόνες και δημιουργοί", changes: "Αλλαγές", source_link: "πηγή", voice: "Φωνή", music: "Μουσική",
      music_none: "Καμία σε αυτή την έκδοση (μόνο φωνή).",
      disclosure: "Έρευνα σε αρχεία μουσείων και αρχείων με εργαλεία τεχνητής νοημοσύνης· κάθε στοιχείο ελέγχεται με τουλάχιστον δύο πηγές και το ξαναελέγχει ένα δεύτερο μοντέλο ΤΝ. Αφήγηση: φωνή ΤΝ.",
      ai_pictures: "Οι αναπαραστάσεις με ΤΝ σημειώνονται στην οθόνη.",
      privacy: "Απόρρητο", no_cookies: "Χωρίς cookies, χωρίς σύνδεση, χωρίς διαφημίσεις.", worldwide: "Χωρίς συγκεκριμένο τόπο"
    },
    de: {
      language: "Sprache", headline: "Wo ist es passiert?",
      tagline: "Wahre Geschichten hinter Alltagsdingen, mit Untertiteln in deiner Sprache.",
      cat_history: "Geschichte", cat_how: "Wie Dinge funktionieren", cat_money: "Geld", cat_psychology: "Psychologie",
      map_hint: "Tippe auf ein Land, um die Geschichten zu sehen, die dort passiert sind.",
      search: "Geschichten suchen", all: "Alle", shorts: "Shorts", long: "Lange Videos",
      clear: "Alle Länder", n_stories: "{n} Geschichten", n_story: "1 Geschichte", no_results: "Keine passenden Geschichten.",
      on_youtube: "Auf YouTube", subtitled: "Untertitel",
      coming_soon: "{channel} kommt bald auf diese Website. Jetzt auf YouTube ansehen.",
      open_channel: "Kanal öffnen", subscribe: "Abonnieren", watch_on_youtube: "Auf YouTube ansehen",
      all_stories: "Alle Geschichten", subtitles: "Untertitel", off: "Aus", story: "Die Geschichte",
      translated_note: "Mit KI aus dem Englischen übersetzt. Zahlen, Daten und Namen prüft ein Programm.",
      sources: "Quellen",
      sources_note: "Jede Angabe ist mit zwei Quellen geprüft. Die kleinen Zahlen nach einem Satz verweisen darauf.",
      credits: "Bilder und Nachweise", changes: "Änderungen", source_link: "Quelle", voice: "Stimme", music: "Musik",
      music_none: "Keine in dieser Fassung (nur Stimme).",
      disclosure: "Recherchiert in Museums- und Archivunterlagen mit KI-Werkzeugen; jede Angabe ist mit mindestens zwei Quellen geprüft und von einem zweiten KI-Modell kontrolliert. Sprecher: KI-Stimme.",
      ai_pictures: "KI-Rekonstruktionen sind im Bild gekennzeichnet.",
      privacy: "Datenschutz", no_cookies: "Keine Cookies, keine Anmeldung, keine Werbung.", worldwide: "Kein einzelner Ort"
    }
  };

  // Game, passport and navigation words (Mike, 2026-11-12: "a bit of gaming", easy navigation)
  var MORE = {
    en: {
      nav_map: "Map", hub_title: "Games", hub_lede: "Short games about the stories. Play as often as you like.", all_games: "All games", g_older_d: "Two pictures. Tap the older one.", tl_title: "Timeline", tl_d: "Put four moments in order, oldest first.", tl_hint: "Tap the oldest first, then the next one. Tap again to take it back.", tl_check: "Check", tl_result: "{r} of 4 in the right place.", tl_perfect: "Perfect order!", tl_again: "New timeline", wh_d: "See a story and pick the country where it happened.", wh_q: "In which country did this happen?", wh_next: "Next story", wh_watch: "Watch the story", wh_place: "It happened in {p}.", wh_done: "You found {r} of {n}.", wh_again: "Play again", acc_title: "Save your progress", acc_text: "Sign in with Google to keep your points, levels and stamps on every device. Playing without an account works too.", acc_signin: "Sign in with Google", acc_age: "For ages 14 and up, or with a parent's OK. We save only your game progress. See Privacy.", acc_signed: "Signed in. Your progress is saved to your account.", acc_signout: "Sign out", acc_delete: "Delete my account", acc_delete_confirm: "Delete your account and all saved progress? This cannot be undone.", acc_deleted: "Your account and progress were deleted.", acc_error: "That did not work. Please try again.", acc_synced: "Progress saved to your account", comment_btn: "Comment on YouTube", comment_copied: "Copied. Paste it in the comments under the video.", comment_right: "I knew it: {a}!", comment_wrong: "I didn't know this one: {a}!", quick_q: "Quick question", q_wrong: "Not quite.", q_answered_right: "You got this one right.", q_answered: "You answered this one. The right answer is marked.", q_hint: "The answer is in the video and in the story text.", play_label: "Play the video", yt_note: "Plays in YouTube's player. Tapping play loads YouTube, and Google's privacy policy applies.", passport_how: "Answer a story's quick question and its country gets a stamp.", choose_country: "Choose a country", nav_play: "Play", nav_passport: "Passport", nav_search: "Search",
      board_count: "{c} countries · {n} stories", play_title: "Which is older?", play_first: "Which came first?",
      play_hint: "Tap the one you think is older.", play_hint_first: "Tap the one you think came first.",
      play_promo: "Two pictures. One is older. Can you tell?", play_start: "Play",
      right: "Right!", wrong: "Not this time.", older_is: "Older: {x}", first_is: "First: {x}",
      stamp_older: "OLDER", stamp_first: "FIRST", watch_answer: "Watch the answer", watch_answer_yt: "Watch the answer on YouTube",
      next_pair: "Next pair", round: "Pair {i} of {n}", score: "{r} of {n} right",
      done: "You've played every pair for now. New pairs come with new videos.", play_again: "Play again",
      passport_title: "Your passport", passport_count: "You've visited {v} of {n} countries",
      passport_mini: "{v} of {n} countries stamped",
      
      passport_local: "Saved only in this browser. No account.", passport_clear: "Clear passport",
      passport_confirm: "Clear all your stamps?", stamped_toast: "Stamp! {c} is in your passport.",
      stamped: "Stamped", not_yet: "No stamp yet", close: "Close", read_story: "Read the story",
      stories_here: "{n} stories here", story_here: "1 story here", picture: "Picture"
    },
    es: {
      nav_map: "Mapa", hub_title: "Juegos", hub_lede: "Juegos cortos sobre las historias. Juega cuanto quieras.", all_games: "Todos los juegos", g_older_d: "Dos imágenes. Toca la más antigua.", tl_title: "Línea del tiempo", tl_d: "Ordena cuatro momentos, del más antiguo al más reciente.", tl_hint: "Toca primero el más antiguo y luego el siguiente. Vuelve a tocar para quitarlo.", tl_check: "Comprobar", tl_result: "{r} de 4 en su sitio.", tl_perfect: "¡Orden perfecto!", tl_again: "Nueva línea del tiempo", wh_d: "Mira una historia y elige el país donde ocurrió.", wh_q: "¿En qué país ocurrió esto?", wh_next: "Siguiente historia", wh_watch: "Ver la historia", wh_place: "Ocurrió en {p}.", wh_done: "Acertaste {r} de {n}.", wh_again: "Jugar otra vez", acc_title: "Guarda tu progreso", acc_text: "Inicia sesión con Google para conservar tus puntos, niveles y sellos en todos tus dispositivos. También puedes jugar sin cuenta.", acc_signin: "Iniciar sesión con Google", acc_age: "Para mayores de 14 años o con permiso de un padre o madre. Solo guardamos tu progreso en el juego. Ver Privacidad.", acc_signed: "Sesión iniciada. Tu progreso se guarda en tu cuenta.", acc_signout: "Cerrar sesión", acc_delete: "Eliminar mi cuenta", acc_delete_confirm: "¿Eliminar tu cuenta y todo el progreso guardado? No se puede deshacer.", acc_deleted: "Tu cuenta y tu progreso se eliminaron.", acc_error: "No ha funcionado. Inténtalo de nuevo.", acc_synced: "Progreso guardado en tu cuenta", comment_btn: "Comentar en YouTube", comment_copied: "Copiado. Pégalo en los comentarios bajo el vídeo.", comment_right: "¡Lo sabía: {a}!", comment_wrong: "¡Esta no la sabía: {a}!", quick_q: "Pregunta rápida", q_wrong: "No exactamente.", q_answered_right: "Acertaste esta.", q_answered: "Ya respondiste esta. La respuesta correcta está marcada.", q_hint: "La respuesta está en el vídeo y en el texto de la historia.", play_label: "Reproducir el vídeo", yt_note: "Se reproduce en el reproductor de YouTube. Al pulsar, se carga YouTube y se aplica la política de privacidad de Google.", passport_how: "Responde la pregunta rápida de una historia y su país recibe un sello.", choose_country: "Elige un país", nav_play: "Jugar", nav_passport: "Pasaporte", nav_search: "Buscar",
      board_count: "{c} países · {n} historias", play_title: "¿Qué es más antiguo?", play_first: "¿Qué fue primero?",
      play_hint: "Toca el que creas que es más antiguo.", play_hint_first: "Toca el que creas que fue primero.",
      play_promo: "Dos imágenes. Una es más antigua. ¿Sabes cuál?", play_start: "Jugar",
      right: "¡Correcto!", wrong: "Esta vez no.", older_is: "Más antiguo: {x}", first_is: "Primero: {x}",
      stamp_older: "MÁS ANTIGUO", stamp_first: "PRIMERO", watch_answer: "Ver la respuesta", watch_answer_yt: "Ver la respuesta en YouTube",
      next_pair: "Siguiente pareja", round: "Pareja {i} de {n}", score: "{r} de {n} correctas",
      done: "Has jugado todas las parejas por ahora. Llegarán más con nuevos vídeos.", play_again: "Jugar otra vez",
      passport_title: "Tu pasaporte", passport_count: "Has visitado {v} de {n} países",
      passport_mini: "{v} de {n} países sellados",
      
      passport_local: "Se guarda solo en este navegador. Sin cuenta.", passport_clear: "Borrar pasaporte",
      passport_confirm: "¿Borrar todos tus sellos?", stamped_toast: "¡Sello! {c} ya está en tu pasaporte.",
      stamped: "Sellado", not_yet: "Aún sin sello", close: "Cerrar", read_story: "Leer la historia",
      stories_here: "{n} historias aquí", story_here: "1 historia aquí", picture: "Imagen"
    },
    el: {
      nav_map: "Χάρτης", hub_title: "Παιχνίδια", hub_lede: "Μικρά παιχνίδια για τις ιστορίες. Παίξε όσο θέλεις.", all_games: "Όλα τα παιχνίδια", g_older_d: "Δύο εικόνες. Πάτα την παλαιότερη.", tl_title: "Χρονολόγιο", tl_d: "Βάλε τέσσερις στιγμές στη σειρά, από την παλαιότερη.", tl_hint: "Πάτα πρώτα το παλαιότερο και μετά το επόμενο. Πάτα ξανά για να το βγάλεις.", tl_check: "Έλεγχος", tl_result: "{r} από 4 στη σωστή θέση.", tl_perfect: "Τέλεια σειρά!", tl_again: "Νέο χρονολόγιο", wh_d: "Δες μια ιστορία και διάλεξε τη χώρα όπου συνέβη.", wh_q: "Σε ποια χώρα συνέβη αυτό;", wh_next: "Επόμενη ιστορία", wh_watch: "Δες την ιστορία", wh_place: "Συνέβη εδώ: {p}.", wh_done: "Βρήκες {r} από {n}.", wh_again: "Παίξε ξανά", acc_title: "Αποθήκευσε την πρόοδό σου", acc_text: "Συνδέσου με Google για να κρατάς πόντους, επίπεδα και σφραγίδες σε κάθε συσκευή. Μπορείς να παίζεις και χωρίς λογαριασμό.", acc_signin: "Σύνδεση με Google", acc_age: "Για 14 ετών και πάνω, ή με την άδεια γονέα. Κρατάμε μόνο την πρόοδό σου στο παιχνίδι. Δες το Απόρρητο.", acc_signed: "Συνδέθηκες. Η πρόοδός σου αποθηκεύεται στον λογαριασμό σου.", acc_signout: "Αποσύνδεση", acc_delete: "Διαγραφή λογαριασμού", acc_delete_confirm: "Να διαγραφεί ο λογαριασμός σου και όλη η αποθηκευμένη πρόοδος; Δεν αναιρείται.", acc_deleted: "Ο λογαριασμός και η πρόοδός σου διαγράφηκαν.", acc_error: "Δεν πέτυχε. Δοκίμασε ξανά.", acc_synced: "Η πρόοδος αποθηκεύτηκε στον λογαριασμό σου", comment_btn: "Σχόλιο στο YouTube", comment_copied: "Αντιγράφηκε. Επικόλλησέ το στα σχόλια κάτω από το βίντεο.", comment_right: "Το ήξερα: {a}!", comment_wrong: "Αυτό δεν το ήξερα: {a}!", quick_q: "Γρήγορη ερώτηση", q_wrong: "Όχι ακριβώς.", q_answered_right: "Την απάντησες σωστά.", q_answered: "Την έχεις απαντήσει. Η σωστή απάντηση είναι σημειωμένη.", q_hint: "Η απάντηση είναι στο βίντεο και στο κείμενο της ιστορίας.", play_label: "Παίξε το βίντεο", yt_note: "Παίζει στο πρόγραμμα αναπαραγωγής του YouTube. Πατώντας play φορτώνει το YouTube και ισχύει η πολιτική απορρήτου της Google.", passport_how: "Απάντησε στη γρήγορη ερώτηση μιας ιστορίας και η χώρα της παίρνει σφραγίδα.", choose_country: "Διάλεξε χώρα", nav_play: "Παιχνίδι", nav_passport: "Διαβατήριο", nav_search: "Αναζήτηση",
      board_count: "{c} χώρες · {n} ιστορίες", play_title: "Τι είναι παλαιότερο;", play_first: "Τι έγινε πρώτα;",
      play_hint: "Πάτα αυτό που νομίζεις ότι είναι παλαιότερο.", play_hint_first: "Πάτα αυτό που νομίζεις ότι έγινε πρώτα.",
      play_promo: "Δύο εικόνες. Η μία είναι παλαιότερη. Το βρίσκεις;", play_start: "Παίξε",
      right: "Σωστά!", wrong: "Όχι αυτή τη φορά.", older_is: "Παλαιότερο: {x}", first_is: "Πρώτο: {x}",
      stamp_older: "ΠΑΛΑΙΟΤΕΡΟ", stamp_first: "ΠΡΩΤΟ", watch_answer: "Δες την απάντηση", watch_answer_yt: "Δες την απάντηση στο YouTube",
      next_pair: "Επόμενο ζευγάρι", round: "Ζευγάρι {i} από {n}", score: "{r} από {n} σωστά",
      done: "Έπαιξες όλα τα ζευγάρια για τώρα. Νέα έρχονται με τα νέα βίντεο.", play_again: "Παίξε ξανά",
      passport_title: "Το διαβατήριό σου", passport_count: "Έχεις επισκεφτεί {v} από {n} χώρες",
      passport_mini: "{v} από {n} χώρες με σφραγίδα",
      
      passport_local: "Αποθηκεύεται μόνο σε αυτόν τον browser. Χωρίς λογαριασμό.", passport_clear: "Καθαρισμός διαβατηρίου",
      passport_confirm: "Να σβηστούν όλες οι σφραγίδες σου;", stamped_toast: "Σφραγίδα! Νέα χώρα στο διαβατήριό σου: {c}.",
      stamped: "Με σφραγίδα", not_yet: "Χωρίς σφραγίδα ακόμα", close: "Κλείσιμο", read_story: "Διάβασε την ιστορία",
      stories_here: "{n} ιστορίες εδώ", story_here: "1 ιστορία εδώ", picture: "Εικόνα"
    },
    de: {
      nav_map: "Karte", hub_title: "Spiele", hub_lede: "Kurze Spiele zu den Geschichten. Spiel, so oft du willst.", all_games: "Alle Spiele", g_older_d: "Zwei Bilder. Tippe auf das ältere.", tl_title: "Zeitstrahl", tl_d: "Bring vier Momente in die richtige Reihenfolge, das älteste zuerst.", tl_hint: "Tippe zuerst auf das älteste, dann auf das nächste. Nochmal tippen nimmt es zurück.", tl_check: "Prüfen", tl_result: "{r} von 4 an der richtigen Stelle.", tl_perfect: "Perfekte Reihenfolge!", tl_again: "Neuer Zeitstrahl", wh_d: "Sieh dir eine Geschichte an und wähle das Land, in dem sie passierte.", wh_q: "In welchem Land ist das passiert?", wh_next: "Nächste Geschichte", wh_watch: "Geschichte ansehen", wh_place: "Es passierte hier: {p}.", wh_done: "Du hast {r} von {n} gefunden.", wh_again: "Nochmal spielen", acc_title: "Fortschritt speichern", acc_text: "Melde dich mit Google an, um Punkte, Level und Stempel auf allen Geräten zu behalten. Spielen ohne Konto geht auch.", acc_signin: "Mit Google anmelden", acc_age: "Ab 14 Jahren oder mit Erlaubnis der Eltern. Wir speichern nur deinen Spielfortschritt. Siehe Datenschutz.", acc_signed: "Angemeldet. Dein Fortschritt wird in deinem Konto gespeichert.", acc_signout: "Abmelden", acc_delete: "Konto löschen", acc_delete_confirm: "Konto und gesamten gespeicherten Fortschritt löschen? Das lässt sich nicht rückgängig machen.", acc_deleted: "Dein Konto und dein Fortschritt wurden gelöscht.", acc_error: "Das hat nicht geklappt. Bitte versuch es noch einmal.", acc_synced: "Fortschritt im Konto gespeichert", comment_btn: "Auf YouTube kommentieren", comment_copied: "Kopiert. Füge es unter dem Video in die Kommentare ein.", comment_right: "Wusste ich: {a}!", comment_wrong: "Das wusste ich nicht: {a}!", quick_q: "Kurze Frage", q_wrong: "Nicht ganz.", q_answered_right: "Die hast du richtig beantwortet.", q_answered: "Die hast du schon beantwortet. Die richtige Antwort ist markiert.", q_hint: "Die Antwort steckt im Video und im Text der Geschichte.", play_label: "Video abspielen", yt_note: "Läuft im YouTube-Player. Beim Tippen auf Play wird YouTube geladen, und es gilt die Datenschutzerklärung von Google.", passport_how: "Beantworte die kurze Frage einer Geschichte, und ihr Land bekommt einen Stempel.", choose_country: "Land wählen", nav_play: "Spielen", nav_passport: "Reisepass", nav_search: "Suche",
      board_count: "{c} Länder · {n} Geschichten", play_title: "Was ist älter?", play_first: "Was war zuerst?",
      play_hint: "Tippe auf das, was du für älter hältst.", play_hint_first: "Tippe auf das, was deiner Meinung nach zuerst war.",
      play_promo: "Zwei Bilder. Eins ist älter. Erkennst du es?", play_start: "Spielen",
      right: "Richtig!", wrong: "Diesmal nicht.", older_is: "Älter: {x}", first_is: "Zuerst: {x}",
      stamp_older: "ÄLTER", stamp_first: "ZUERST", watch_answer: "Antwort ansehen", watch_answer_yt: "Antwort auf YouTube ansehen",
      next_pair: "Nächstes Paar", round: "Paar {i} von {n}", score: "{r} von {n} richtig",
      done: "Du hast alle Paare gespielt. Neue kommen mit neuen Videos.", play_again: "Nochmal spielen",
      passport_title: "Dein Reisepass", passport_count: "Du hast {v} von {n} Ländern besucht",
      passport_mini: "{v} von {n} Ländern gestempelt",
      
      passport_local: "Nur in diesem Browser gespeichert. Kein Konto.", passport_clear: "Reisepass leeren",
      passport_confirm: "Alle deine Stempel löschen?", stamped_toast: "Stempel! {c} ist jetzt in deinem Reisepass.",
      stamped: "Gestempelt", not_yet: "Noch kein Stempel", close: "Schließen", read_story: "Geschichte lesen",
      stories_here: "{n} Geschichten hier", story_here: "1 Geschichte hier", picture: "Bild"
    }
  };
  for (var lg in MORE) for (var key in MORE[lg]) T[lg][key] = MORE[lg][key];

  // Points, levels, badges and unlocks (Mike, 2026-11-12). Earned only by things done on this website, never by
  // YouTube likes, subscribes or views (that would be fake engagement). Saved only in this browser.
  var GAME = {
    en: { levels: ["Visitor", "Explorer", "Collector", "Curator", "Archivist", "Historian", "Time traveller", "Legend"],
      level: "Level", points: "{p} points", to_next: "{n} points to the next level", max_level: "Top level reached",
      plus: "+{p} points", level_up: "Level {l}: {name}!", unlocked: "Unlocked: {x}",
      badges: "Badges", unlocks: "Unlocks", at_level: "From level {l}",
      fair: "No streaks, no timers, nothing to buy. Points come only from your answers here, never from watching videos, likes or subscribes.",
      u_oldmap: "Old map style", u_oldmap_d: "The board as an old paper map",
      challenge: "Challenge a friend", challenge_text: "I got {r} of {n} in “Which is older?”. Can you beat me?",
      challenge_intro: "A friend got {r} of {n}. Can you beat that?", challenge_result: "You: {a} · Your friend: {b}", copied: "Link copied",
      b_first_q: ["First question", "Answer a story's quick question"], b_first_stamp: ["First stamp", "Get your first country stamp"],
      b_five: ["Globetrotter", "Stamps from 5 countries"], b_sharp: ["Sharp eye", "3 right answers in a row"],
      b_perfect: ["Perfect game", "Every pair right in one game"], b_poly: ["Polyglot", "Answer a question in a language other than English"], b_time: ["Time keeper", "Put 4 moments in the right order"], b_nav: ["Navigator", "Find the country of 5 stories"], b_explorer: ["Game explorer", "Play all 3 games"] },
    es: { levels: ["Visitante", "Explorador", "Coleccionista", "Conservador", "Archivero", "Historiador", "Viajero del tiempo", "Leyenda"],
      level: "Nivel", points: "{p} puntos", to_next: "{n} puntos para el siguiente nivel", max_level: "Nivel máximo",
      plus: "+{p} puntos", level_up: "¡Nivel {l}: {name}!", unlocked: "Desbloqueado: {x}",
      badges: "Insignias", unlocks: "Desbloqueos", at_level: "Desde el nivel {l}",
      fair: "Sin rachas, sin relojes, nada que comprar. Los puntos solo vienen de tus respuestas aquí, nunca de ver vídeos, «me gusta» ni suscripciones.",
      u_oldmap: "Mapa antiguo", u_oldmap_d: "El tablero como un mapa de papel antiguo",
      challenge: "Reta a un amigo", challenge_text: "He acertado {r} de {n} en «¿Qué es más antiguo?». ¿Me superas?",
      challenge_intro: "Un amigo acertó {r} de {n}. ¿Lo superas?", challenge_result: "Tú: {a} · Tu amigo: {b}", copied: "Enlace copiado",
      b_first_q: ["Primera pregunta", "Responde la pregunta rápida de una historia"], b_first_stamp: ["Primer sello", "Consigue tu primer sello"],
      b_five: ["Trotamundos", "Sellos de 5 países"], b_sharp: ["Buen ojo", "3 aciertos seguidos"],
      b_perfect: ["Partida perfecta", "Todas las parejas bien en una partida"], b_poly: ["Políglota", "Responde una pregunta en un idioma que no sea el inglés"], b_time: ["Guardián del tiempo", "Ordena bien 4 momentos"], b_nav: ["Navegante", "Encuentra el país de 5 historias"], b_explorer: ["Explorador de juegos", "Juega a los 3 juegos"] },
    el: { levels: ["Επισκέπτης", "Εξερευνητής", "Συλλέκτης", "Επιμελητής", "Αρχειοφύλακας", "Ιστορικός", "Ταξιδιώτης στον χρόνο", "Θρύλος"],
      level: "Επίπεδο", points: "{p} πόντοι", to_next: "{n} πόντοι για το επόμενο επίπεδο", max_level: "Ανώτατο επίπεδο",
      plus: "+{p} πόντοι", level_up: "Επίπεδο {l}: {name}!", unlocked: "Ξεκλείδωσε: {x}",
      badges: "Διακρίσεις", unlocks: "Ξεκλειδώματα", at_level: "Από το επίπεδο {l}",
      fair: "Χωρίς σερί, χωρίς χρονόμετρα, τίποτα για αγορά. Οι πόντοι έρχονται μόνο από τις απαντήσεις σου εδώ, ποτέ από την προβολή βίντεο, likes ή εγγραφές.",
      u_oldmap: "Παλιός χάρτης", u_oldmap_d: "Το ταμπλό σαν παλιός χάρτινος χάρτης",
      challenge: "Προκάλεσε έναν φίλο", challenge_text: "Βρήκα {r} από {n} στο «Τι είναι παλαιότερο;». Με περνάς;",
      challenge_intro: "Ένας φίλος βρήκε {r} από {n}. Μπορείς καλύτερα;", challenge_result: "Εσύ: {a} · Ο φίλος σου: {b}", copied: "Ο σύνδεσμος αντιγράφηκε",
      b_first_q: ["Πρώτη ερώτηση", "Απάντησε στη γρήγορη ερώτηση μιας ιστορίας"], b_first_stamp: ["Πρώτη σφραγίδα", "Πάρε την πρώτη σου σφραγίδα"],
      b_five: ["Κοσμογυρισμένος", "Σφραγίδες από 5 χώρες"], b_sharp: ["Κοφτερό μάτι", "3 σωστές απαντήσεις στη σειρά"],
      b_perfect: ["Τέλειο παιχνίδι", "Όλα τα ζευγάρια σωστά σε ένα παιχνίδι"], b_poly: ["Πολύγλωσσος", "Απάντησε σε μια ερώτηση σε γλώσσα άλλη από τα αγγλικά"], b_time: ["Φύλακας του χρόνου", "Βάλε 4 στιγμές στη σωστή σειρά"], b_nav: ["Πλοηγός", "Βρες τη χώρα 5 ιστοριών"], b_explorer: ["Εξερευνητής παιχνιδιών", "Παίξε και τα 3 παιχνίδια"] },
    de: { levels: ["Besucher", "Entdecker", "Sammler", "Kurator", "Archivar", "Historiker", "Zeitreisender", "Legende"],
      level: "Level", points: "{p} Punkte", to_next: "{n} Punkte bis zum nächsten Level", max_level: "Höchstes Level erreicht",
      plus: "+{p} Punkte", level_up: "Level {l}: {name}!", unlocked: "Freigeschaltet: {x}",
      badges: "Abzeichen", unlocks: "Freischaltungen", at_level: "Ab Level {l}",
      fair: "Keine Serien, keine Uhren, nichts zu kaufen. Punkte gibt es nur für deine Antworten hier, nie fürs Videoschauen, Likes oder Abos.",
      u_oldmap: "Alte Karte", u_oldmap_d: "Das Spielbrett als alte Papierkarte",
      challenge: "Freund herausfordern", challenge_text: "Ich habe {r} von {n} bei „Was ist älter?“. Schaffst du mehr?",
      challenge_intro: "Ein Freund hatte {r} von {n}. Schaffst du mehr?", challenge_result: "Du: {a} · Dein Freund: {b}", copied: "Link kopiert",
      b_first_q: ["Erste Frage", "Beantworte die kurze Frage einer Geschichte"], b_first_stamp: ["Erster Stempel", "Hol dir deinen ersten Stempel"],
      b_five: ["Weltenbummler", "Stempel aus 5 Ländern"], b_sharp: ["Scharfes Auge", "3 richtige Antworten hintereinander"],
      b_perfect: ["Perfektes Spiel", "Alle Paare richtig in einem Spiel"], b_poly: ["Polyglott", "Beantworte eine Frage in einer anderen Sprache als Englisch"], b_time: ["Zeithüter", "Bring 4 Momente in die richtige Reihenfolge"], b_nav: ["Navigator", "Finde das Land von 5 Geschichten"], b_explorer: ["Spiele-Entdecker", "Spiel alle 3 Spiele"] }
  };
  var LEVELS = [0, 40, 100, 180, 300, 450, 650, 900];
  var BADGES = ["first_q", "first_stamp", "five", "sharp", "perfect", "poly", "time", "nav", "explorer"];
  var UNLOCKS = [{ id: "oldmap", level: 2 }];

  function gt(l, key) { return (GAME[l] || GAME.en)[key] || GAME.en[key]; }
  function cur() { return document.documentElement.lang || "en"; }

  var progress = {
    get: function () {
      var p; try { p = JSON.parse(store("os-progress") || "{}") || {}; } catch (e) { p = {}; }
      p.points = p.points || 0; p.done = p.done || {}; p.badges = p.badges || {}; p.prefs = p.prefs || {};
      return p;
    },
    // quiet: do not send to the account (used when the account itself just filled it)
    save: function (p, quiet) { store("os-progress", JSON.stringify(p)); if (!quiet && window.OS && OS.cloud) OS.cloud.schedule(); },
    level: function (points) { var n = 1; LEVELS.forEach(function (t, i) { if (points >= t) n = i + 1; }); return n; },
    // add points once per thing (key), then check levels and badges; returns the message shown
    add: function (key, pts, extra) {
      var p = progress.get();
      var before = progress.level(p.points), msgs = [];
      if (key && !p.done[key]) { p.done[key] = pts; p.points += pts; msgs.push(gt(cur(), "plus").replace("{p}", pts)); }
      if (extra) extra(p);
      checkBadges(p, msgs);
      var after = progress.level(p.points);
      if (after > before) {
        msgs.push(gt(cur(), "level_up").replace("{l}", after).replace("{name}", gt(cur(), "levels")[after - 1]));
        UNLOCKS.forEach(function (u) { if (u.level > before && u.level <= after) msgs.push(gt(cur(), "unlocked").replace("{x}", gt(cur(), "u_" + u.id))); });
      }
      progress.save(p);
      if (msgs.length) toast(msgs.join(" · "));
      paintLevel();
      return p;
    },
    clear: function () { try { localStorage.removeItem("os-progress"); } catch (e) { /* nothing saved */ } }
  };
  function checkBadges(p, msgs) {
    var pass = passport.get(), have = Object.keys(pass).length, answered = Object.keys(p.answers || {}).length;
    var rules = { first_q: answered >= 1, first_stamp: have >= 1, five: have >= 5, sharp: (p.bestRun || 0) >= 3,
                  perfect: !!p.perfect, poly: !!p.poly,
                  // the game hub keeps its marks in "done" (0 points) so they merge across devices like everything else
                  time: Object.keys(p.done).some(function (k) { return k.indexOf("t:") === 0; }),
                  nav: Object.keys(p.done).filter(function (k) { return k.indexOf("w:") === 0; }).length >= 5,
                  explorer: !!(p.done["g:older"] !== undefined && p.done["g:timeline"] !== undefined && p.done["g:where"] !== undefined) };
    BADGES.forEach(function (b) {
      if (rules[b] && !p.badges[b]) { p.badges[b] = new Date().toISOString().slice(0, 10); msgs.push("★ " + gt(cur(), "b_" + b)[0]); }
    });
  }
  function paintLevel() {
    var el = document.getElementById("lvl");
    var p = progress.get(), n = progress.level(p.points);
    if (el) {
      el.hidden = false;
      el.innerHTML = '<span class="ln">' + n + '</span><span class="lw">' + gt(cur(), "points").replace("{p}", p.points) + "</span>";
      el.setAttribute("aria-label", gt(cur(), "level") + " " + n + ", " + gt(cur(), "points").replace("{p}", p.points));
    }
    document.body.classList.toggle("map-old", !!p.prefs.oldmap && n >= 2);
  }
  var RTL = ["ar", "he", "fa", "ur"];

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // Passport: stamps live only in this browser ({country: {first: "2026-11-12", stories: [...]}}); no account.
  var passport = {
    get: function () { try { return JSON.parse(store("os-passport") || "{}") || {}; } catch (e) { return {}; } },
    stamp: function (countries, id) {
      var p = passport.get(), fresh = [], day = new Date().toISOString().slice(0, 10);
      (countries || []).forEach(function (c) {
        if (!p[c]) { p[c] = { first: day, stories: [] }; fresh.push(c); }
        if (p[c].stories.indexOf(id) < 0) p[c].stories.push(id);
      });
      store("os-passport", JSON.stringify(p));
      if (window.OS && OS.cloud) OS.cloud.schedule();
      return fresh;
    },
    clear: function () { try { localStorage.removeItem("os-passport"); } catch (e) { /* nothing saved */ } }
  };

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("on"); }, 3200);
  }



  function lang(available) {
    var ok = available || LANGS, saved = store("os-lang");
    if (saved && ok.indexOf(saved) >= 0) return saved;
    var prefs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var p = String(prefs[i]).toLowerCase().split("-")[0];
      if (ok.indexOf(p) >= 0) return p;
    }
    return "en";
  }

  function t(l, key, vars) {
    var s = (T[l] && T[l][key]) || T.en[key] || key;
    for (var k in vars || {}) s = s.replace("{" + k + "}", vars[k]);
    return s;
  }

  function apply(l, root) {
    root = root || document;
    document.documentElement.lang = l;
    document.documentElement.dir = RTL.indexOf(l) >= 0 ? "rtl" : "ltr";
    root.querySelectorAll("[data-i]").forEach(function (el) { el.textContent = t(l, el.getAttribute("data-i")); });
    root.querySelectorAll("[data-ph]").forEach(function (el) { el.placeholder = t(l, el.getAttribute("data-ph")); });
    var sel = document.getElementById("lang");
    if (sel) sel.value = l;
    if (typeof paintLevel === "function") paintLevel();
  }

  function country(l, code) {
    try { return new Intl.DisplayNames([l], { type: "region" }).of(code); } catch (e) { return code; }
  }

  function boot(onChange) {
    var l = lang();
    apply(l);
    var sel = document.getElementById("lang");
    if (sel) sel.addEventListener("change", function () {
      store("os-lang", sel.value);
      apply(sel.value);
      if (onChange) onChange(sel.value);
    });
    return l;
  }

  return { LANGS: LANGS, t: t, lang: lang, apply: apply, country: country, boot: boot, store: store,
           passport: passport, toast: toast,
           progress: progress, gt: gt, LEVELS: LEVELS, BADGES: BADGES, UNLOCKS: UNLOCKS, paintLevel: paintLevel };
})();

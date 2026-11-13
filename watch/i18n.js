/* Oldest Surviving website: interface words in the 4 starting languages (Mike, 2026-11-12: en, es, el, de),
   and the visitor's language choice (kept in this browser only; no cookies). */
var OS = (function () {
  var LANGS = ["en", "es", "el", "de", "fr", "pt", "it"];
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
      privacy: "Privacy", no_cookies: "No ads. This site sets no cookies.", worldwide: "No single place"
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
      privacy: "Privacidad", no_cookies: "Sin anuncios. Este sitio no usa cookies.", worldwide: "Sin un lugar concreto"
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
      privacy: "Απόρρητο", no_cookies: "Χωρίς διαφημίσεις. Ο ιστότοπος δεν βάζει cookies.", worldwide: "Χωρίς συγκεκριμένο τόπο"
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
      privacy: "Datenschutz", no_cookies: "Keine Werbung. Diese Seite setzt keine Cookies.", worldwide: "Kein einzelner Ort"
    }
  };

  // Game, passport and navigation words (Mike, 2026-11-12: "a bit of gaming", easy navigation)
  var MORE = {
    en: {
      nav_map: "Map", our_channels: "Our channels", pop_title: "Sign in to play along", pop_text: "Sign in free with Google to play the games, answer the quick questions and keep your points, stamps and badges on all your devices. Watching and reading stay free.", pop_later: "Not now", full_screen: "Full screen", exit_full: "Exit full screen", sub_alt: "Open on YouTube", gate_title: "Sign in to play", q_signin: "Sign in to answer", gate_text: "Games and quick questions save your points, stamps and badges to your account. Watching and reading stay free.", hub_title: "Games", hub_lede: "Short games about the stories. Play as often as you like.", all_games: "All games", g_older_d: "Two pictures. Tap the older one.", tl_title: "Timeline", tl_d: "Put four moments in order, oldest first.", tl_hint: "Tap the oldest first, then the next one. Tap again to take it back.", tl_check: "Check", tl_result: "{r} of 4 in the right place.", tl_perfect: "Perfect order!", tl_again: "New timeline", wh_d: "See a story and pick the country where it happened.", wh_q: "In which country did this happen?", wh_next: "Next story", wh_watch: "Watch the story", wh_place: "It happened in {p}.", wh_done: "You found {r} of {n}.", wh_again: "Play again", acc_title: "Save your progress",acc_signin: "Sign in with Google", acc_age: "For ages 14 and up, or with a parent's OK. We save only your game progress. See Privacy.", acc_signed: "Signed in. Your progress is saved to your account.", acc_signout: "Sign out", acc_delete: "Delete my account", acc_delete_confirm: "Delete your account and all saved progress? This cannot be undone.", acc_deleted: "Your account and progress were deleted.", acc_error: "That did not work. Please try again.", acc_synced: "Progress saved to your account", comment_btn: "Comment on YouTube", comment_copied: "Copied. Paste it in the comments under the video.", comment_right: "I knew it: {a}!", comment_wrong: "I didn't know this one: {a}!", quick_q: "Quick question", q_wrong: "Not quite.", q_answered_right: "You got this one right.", q_answered: "You answered this one. The right answer is marked.", q_hint: "The answer is in the video and in the story text.", play_label: "Play the video", yt_note: "Plays in YouTube's player. Tapping play loads YouTube, and Google's privacy policy applies.", passport_how: "Answer a story's quick question and its country gets a stamp.", choose_country: "Choose a country", nav_play: "Play", nav_passport: "Passport",
      board_count: "{c} countries · {n} stories", play_title: "Which is older?", play_first: "Which came first?",
      play_hint: "Tap the one you think is older.", play_hint_first: "Tap the one you think came first.",
      play_promo: "Two pictures. One is older. Can you tell?", play_start: "Play",
      right: "Right!", wrong: "Not this time.", older_is: "Older: {x}", first_is: "First: {x}",
      stamp_older: "OLDER", stamp_first: "FIRST", watch_answer: "Watch the answer", watch_answer_yt: "Watch the answer on YouTube",
      next_pair: "Next pair", round: "Pair {i} of {n}", score: "{r} of {n} right",
      done: "You've played every pair for now. New pairs come with new videos.", play_again: "Play again",
      passport_title: "Your passport", passport_count: "You've visited {v} of {n} countries",
      passport_mini: "{v} of {n} countries stamped",
      
passport_clear: "Clear passport",
      passport_confirm: "Clear all your stamps?", stamped_toast: "Stamp! {c} is in your passport.",
      stamped: "Stamped", not_yet: "No stamp yet", close: "Close", read_story: "Read the story",
      stories_here: "{n} stories here", story_here: "1 story here", picture: "Picture"
    },
    es: {
      nav_map: "Mapa", our_channels: "Nuestros canales", pop_title: "Inicia sesión para jugar", pop_text: "Inicia sesión gratis con Google para jugar a los juegos, responder las preguntas rápidas y guardar tus puntos, sellos e insignias en todos tus dispositivos. Ver y leer sigue siendo libre.", pop_later: "Ahora no", full_screen: "Pantalla completa", exit_full: "Salir de pantalla completa", sub_alt: "Abrir en YouTube", gate_title: "Inicia sesión para jugar", q_signin: "Inicia sesión para responder", gate_text: "Los juegos y las preguntas rápidas guardan tus puntos, sellos e insignias en tu cuenta. Ver y leer sigue siendo libre.", hub_title: "Juegos", hub_lede: "Juegos cortos sobre las historias. Juega cuanto quieras.", all_games: "Todos los juegos", g_older_d: "Dos imágenes. Toca la más antigua.", tl_title: "Línea del tiempo", tl_d: "Ordena cuatro momentos, del más antiguo al más reciente.", tl_hint: "Toca primero el más antiguo y luego el siguiente. Vuelve a tocar para quitarlo.", tl_check: "Comprobar", tl_result: "{r} de 4 en su sitio.", tl_perfect: "¡Orden perfecto!", tl_again: "Nueva línea del tiempo", wh_d: "Mira una historia y elige el país donde ocurrió.", wh_q: "¿En qué país ocurrió esto?", wh_next: "Siguiente historia", wh_watch: "Ver la historia", wh_place: "Ocurrió en {p}.", wh_done: "Acertaste {r} de {n}.", wh_again: "Jugar otra vez", acc_title: "Guarda tu progreso",acc_signin: "Iniciar sesión con Google", acc_age: "Para mayores de 14 años o con permiso de un padre o madre. Solo guardamos tu progreso en el juego. Ver Privacidad.", acc_signed: "Sesión iniciada. Tu progreso se guarda en tu cuenta.", acc_signout: "Cerrar sesión", acc_delete: "Eliminar mi cuenta", acc_delete_confirm: "¿Eliminar tu cuenta y todo el progreso guardado? No se puede deshacer.", acc_deleted: "Tu cuenta y tu progreso se eliminaron.", acc_error: "No ha funcionado. Inténtalo de nuevo.", acc_synced: "Progreso guardado en tu cuenta", comment_btn: "Comentar en YouTube", comment_copied: "Copiado. Pégalo en los comentarios bajo el vídeo.", comment_right: "¡Lo sabía: {a}!", comment_wrong: "¡Esta no la sabía: {a}!", quick_q: "Pregunta rápida", q_wrong: "No exactamente.", q_answered_right: "Acertaste esta.", q_answered: "Ya respondiste esta. La respuesta correcta está marcada.", q_hint: "La respuesta está en el vídeo y en el texto de la historia.", play_label: "Reproducir el vídeo", yt_note: "Se reproduce en el reproductor de YouTube. Al pulsar, se carga YouTube y se aplica la política de privacidad de Google.", passport_how: "Responde la pregunta rápida de una historia y su país recibe un sello.", choose_country: "Elige un país", nav_play: "Jugar", nav_passport: "Pasaporte",
      board_count: "{c} países · {n} historias", play_title: "¿Qué es más antiguo?", play_first: "¿Qué fue primero?",
      play_hint: "Toca el que creas que es más antiguo.", play_hint_first: "Toca el que creas que fue primero.",
      play_promo: "Dos imágenes. Una es más antigua. ¿Sabes cuál?", play_start: "Jugar",
      right: "¡Correcto!", wrong: "Esta vez no.", older_is: "Más antiguo: {x}", first_is: "Primero: {x}",
      stamp_older: "MÁS ANTIGUO", stamp_first: "PRIMERO", watch_answer: "Ver la respuesta", watch_answer_yt: "Ver la respuesta en YouTube",
      next_pair: "Siguiente pareja", round: "Pareja {i} de {n}", score: "{r} de {n} correctas",
      done: "Has jugado todas las parejas por ahora. Llegarán más con nuevos vídeos.", play_again: "Jugar otra vez",
      passport_title: "Tu pasaporte", passport_count: "Has visitado {v} de {n} países",
      passport_mini: "{v} de {n} países sellados",
      
passport_clear: "Borrar pasaporte",
      passport_confirm: "¿Borrar todos tus sellos?", stamped_toast: "¡Sello! {c} ya está en tu pasaporte.",
      stamped: "Sellado", not_yet: "Aún sin sello", close: "Cerrar", read_story: "Leer la historia",
      stories_here: "{n} historias aquí", story_here: "1 historia aquí", picture: "Imagen"
    },
    el: {
      nav_map: "Χάρτης", our_channels: "Τα κανάλια μας", pop_title: "Συνδέσου για να παίξεις", pop_text: "Συνδέσου δωρεάν με Google για να παίζεις τα παιχνίδια, να απαντάς στις γρήγορες ερωτήσεις και να κρατάς πόντους, σφραγίδες και διακρίσεις σε όλες τις συσκευές σου. Η προβολή και η ανάγνωση μένουν ελεύθερες.", pop_later: "Όχι τώρα", full_screen: "Πλήρης οθόνη", exit_full: "Έξοδος από πλήρη οθόνη", sub_alt: "Άνοιγμα στο YouTube", gate_title: "Συνδέσου για να παίξεις", q_signin: "Συνδέσου για να απαντήσεις", gate_text: "Τα παιχνίδια και οι γρήγορες ερωτήσεις αποθηκεύουν πόντους, σφραγίδες και διακρίσεις στον λογαριασμό σου. Η προβολή και η ανάγνωση μένουν ελεύθερες.", hub_title: "Παιχνίδια", hub_lede: "Μικρά παιχνίδια για τις ιστορίες. Παίξε όσο θέλεις.", all_games: "Όλα τα παιχνίδια", g_older_d: "Δύο εικόνες. Πάτα την παλαιότερη.", tl_title: "Χρονολόγιο", tl_d: "Βάλε τέσσερις στιγμές στη σειρά, από την παλαιότερη.", tl_hint: "Πάτα πρώτα το παλαιότερο και μετά το επόμενο. Πάτα ξανά για να το βγάλεις.", tl_check: "Έλεγχος", tl_result: "{r} από 4 στη σωστή θέση.", tl_perfect: "Τέλεια σειρά!", tl_again: "Νέο χρονολόγιο", wh_d: "Δες μια ιστορία και διάλεξε τη χώρα όπου συνέβη.", wh_q: "Σε ποια χώρα συνέβη αυτό;", wh_next: "Επόμενη ιστορία", wh_watch: "Δες την ιστορία", wh_place: "Συνέβη εδώ: {p}.", wh_done: "Βρήκες {r} από {n}.", wh_again: "Παίξε ξανά", acc_title: "Αποθήκευσε την πρόοδό σου",acc_signin: "Σύνδεση με Google", acc_age: "Για 14 ετών και πάνω, ή με την άδεια γονέα. Κρατάμε μόνο την πρόοδό σου στο παιχνίδι. Δες το Απόρρητο.", acc_signed: "Συνδέθηκες. Η πρόοδός σου αποθηκεύεται στον λογαριασμό σου.", acc_signout: "Αποσύνδεση", acc_delete: "Διαγραφή λογαριασμού", acc_delete_confirm: "Να διαγραφεί ο λογαριασμός σου και όλη η αποθηκευμένη πρόοδος; Δεν αναιρείται.", acc_deleted: "Ο λογαριασμός και η πρόοδός σου διαγράφηκαν.", acc_error: "Δεν πέτυχε. Δοκίμασε ξανά.", acc_synced: "Η πρόοδος αποθηκεύτηκε στον λογαριασμό σου", comment_btn: "Σχόλιο στο YouTube", comment_copied: "Αντιγράφηκε. Επικόλλησέ το στα σχόλια κάτω από το βίντεο.", comment_right: "Το ήξερα: {a}!", comment_wrong: "Αυτό δεν το ήξερα: {a}!", quick_q: "Γρήγορη ερώτηση", q_wrong: "Όχι ακριβώς.", q_answered_right: "Την απάντησες σωστά.", q_answered: "Την έχεις απαντήσει. Η σωστή απάντηση είναι σημειωμένη.", q_hint: "Η απάντηση είναι στο βίντεο και στο κείμενο της ιστορίας.", play_label: "Παίξε το βίντεο", yt_note: "Παίζει στο πρόγραμμα αναπαραγωγής του YouTube. Πατώντας play φορτώνει το YouTube και ισχύει η πολιτική απορρήτου της Google.", passport_how: "Απάντησε στη γρήγορη ερώτηση μιας ιστορίας και η χώρα της παίρνει σφραγίδα.", choose_country: "Διάλεξε χώρα", nav_play: "Παιχνίδι", nav_passport: "Διαβατήριο",
      board_count: "{c} χώρες · {n} ιστορίες", play_title: "Τι είναι παλαιότερο;", play_first: "Τι έγινε πρώτα;",
      play_hint: "Πάτα αυτό που νομίζεις ότι είναι παλαιότερο.", play_hint_first: "Πάτα αυτό που νομίζεις ότι έγινε πρώτα.",
      play_promo: "Δύο εικόνες. Η μία είναι παλαιότερη. Το βρίσκεις;", play_start: "Παίξε",
      right: "Σωστά!", wrong: "Όχι αυτή τη φορά.", older_is: "Παλαιότερο: {x}", first_is: "Πρώτο: {x}",
      stamp_older: "ΠΑΛΑΙΟΤΕΡΟ", stamp_first: "ΠΡΩΤΟ", watch_answer: "Δες την απάντηση", watch_answer_yt: "Δες την απάντηση στο YouTube",
      next_pair: "Επόμενο ζευγάρι", round: "Ζευγάρι {i} από {n}", score: "{r} από {n} σωστά",
      done: "Έπαιξες όλα τα ζευγάρια για τώρα. Νέα έρχονται με τα νέα βίντεο.", play_again: "Παίξε ξανά",
      passport_title: "Το διαβατήριό σου", passport_count: "Έχεις επισκεφτεί {v} από {n} χώρες",
      passport_mini: "{v} από {n} χώρες με σφραγίδα",
      
passport_clear: "Καθαρισμός διαβατηρίου",
      passport_confirm: "Να σβηστούν όλες οι σφραγίδες σου;", stamped_toast: "Σφραγίδα! Νέα χώρα στο διαβατήριό σου: {c}.",
      stamped: "Με σφραγίδα", not_yet: "Χωρίς σφραγίδα ακόμα", close: "Κλείσιμο", read_story: "Διάβασε την ιστορία",
      stories_here: "{n} ιστορίες εδώ", story_here: "1 ιστορία εδώ", picture: "Εικόνα"
    },
    de: {
      nav_map: "Karte", our_channels: "Unsere Kanäle", pop_title: "Melde dich an und spiel mit", pop_text: "Melde dich kostenlos mit Google an, um die Spiele zu spielen, die kurzen Fragen zu beantworten und deine Punkte, Stempel und Abzeichen auf allen Geräten zu behalten. Schauen und Lesen bleibt frei.", pop_later: "Jetzt nicht", full_screen: "Vollbild", exit_full: "Vollbild beenden", sub_alt: "Auf YouTube öffnen", gate_title: "Melde dich an, um zu spielen", q_signin: "Zum Antworten anmelden", gate_text: "Spiele und kurze Fragen speichern deine Punkte, Stempel und Abzeichen in deinem Konto. Schauen und Lesen bleibt frei.", hub_title: "Spiele", hub_lede: "Kurze Spiele zu den Geschichten. Spiel, so oft du willst.", all_games: "Alle Spiele", g_older_d: "Zwei Bilder. Tippe auf das ältere.", tl_title: "Zeitstrahl", tl_d: "Bring vier Momente in die richtige Reihenfolge, das älteste zuerst.", tl_hint: "Tippe zuerst auf das älteste, dann auf das nächste. Nochmal tippen nimmt es zurück.", tl_check: "Prüfen", tl_result: "{r} von 4 an der richtigen Stelle.", tl_perfect: "Perfekte Reihenfolge!", tl_again: "Neuer Zeitstrahl", wh_d: "Sieh dir eine Geschichte an und wähle das Land, in dem sie passierte.", wh_q: "In welchem Land ist das passiert?", wh_next: "Nächste Geschichte", wh_watch: "Geschichte ansehen", wh_place: "Es passierte hier: {p}.", wh_done: "Du hast {r} von {n} gefunden.", wh_again: "Nochmal spielen", acc_title: "Fortschritt speichern",acc_signin: "Mit Google anmelden", acc_age: "Ab 14 Jahren oder mit Erlaubnis der Eltern. Wir speichern nur deinen Spielfortschritt. Siehe Datenschutz.", acc_signed: "Angemeldet. Dein Fortschritt wird in deinem Konto gespeichert.", acc_signout: "Abmelden", acc_delete: "Konto löschen", acc_delete_confirm: "Konto und gesamten gespeicherten Fortschritt löschen? Das lässt sich nicht rückgängig machen.", acc_deleted: "Dein Konto und dein Fortschritt wurden gelöscht.", acc_error: "Das hat nicht geklappt. Bitte versuch es noch einmal.", acc_synced: "Fortschritt im Konto gespeichert", comment_btn: "Auf YouTube kommentieren", comment_copied: "Kopiert. Füge es unter dem Video in die Kommentare ein.", comment_right: "Wusste ich: {a}!", comment_wrong: "Das wusste ich nicht: {a}!", quick_q: "Kurze Frage", q_wrong: "Nicht ganz.", q_answered_right: "Die hast du richtig beantwortet.", q_answered: "Die hast du schon beantwortet. Die richtige Antwort ist markiert.", q_hint: "Die Antwort steckt im Video und im Text der Geschichte.", play_label: "Video abspielen", yt_note: "Läuft im YouTube-Player. Beim Tippen auf Play wird YouTube geladen, und es gilt die Datenschutzerklärung von Google.", passport_how: "Beantworte die kurze Frage einer Geschichte, und ihr Land bekommt einen Stempel.", choose_country: "Land wählen", nav_play: "Spielen", nav_passport: "Reisepass",
      board_count: "{c} Länder · {n} Geschichten", play_title: "Was ist älter?", play_first: "Was war zuerst?",
      play_hint: "Tippe auf das, was du für älter hältst.", play_hint_first: "Tippe auf das, was deiner Meinung nach zuerst war.",
      play_promo: "Zwei Bilder. Eins ist älter. Erkennst du es?", play_start: "Spielen",
      right: "Richtig!", wrong: "Diesmal nicht.", older_is: "Älter: {x}", first_is: "Zuerst: {x}",
      stamp_older: "ÄLTER", stamp_first: "ZUERST", watch_answer: "Antwort ansehen", watch_answer_yt: "Antwort auf YouTube ansehen",
      next_pair: "Nächstes Paar", round: "Paar {i} von {n}", score: "{r} von {n} richtig",
      done: "Du hast alle Paare gespielt. Neue kommen mit neuen Videos.", play_again: "Nochmal spielen",
      passport_title: "Dein Reisepass", passport_count: "Du hast {v} von {n} Ländern besucht",
      passport_mini: "{v} von {n} Ländern gestempelt",
      
passport_clear: "Reisepass leeren",
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
      b_perfect: ["Perfect game", "Every pair right in one game"], b_poly: ["Polyglot", "Answer a question in a language other than English"], b_time: ["Time keeper", "Put 4 moments in the right order"], b_nav: ["Navigator", "Find the country of 5 stories"], b_explorer: ["Game explorer", "Play all 3 games"],
      b_continents: ["Three continents", "Stamps from 3 continents"], b_ten_q: ["Curious mind", "Answer 10 quick questions"], b_right8: ["Bookworm", "Get 8 quick questions right"], b_pairs10: ["Date detective", "Get 10 different pairs right"],
      b_europe: ["European tour", "Stamps from 5 European countries"], b_time3: ["Time master", "3 different timelines in perfect order"], b_nav12: ["Cartographer", "Find the country of 12 stories"], b_level4: ["Museum pass", "Reach level 4"] },
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
      b_perfect: ["Partida perfecta", "Todas las parejas bien en una partida"], b_poly: ["Políglota", "Responde una pregunta en un idioma que no sea el inglés"], b_time: ["Guardián del tiempo", "Ordena bien 4 momentos"], b_nav: ["Navegante", "Encuentra el país de 5 historias"], b_explorer: ["Explorador de juegos", "Juega a los 3 juegos"],
      b_continents: ["Tres continentes", "Sellos de 3 continentes"], b_ten_q: ["Mente curiosa", "Responde 10 preguntas rápidas"], b_right8: ["Ratón de biblioteca", "Acierta 8 preguntas rápidas"], b_pairs10: ["Detective de fechas", "Acierta 10 parejas distintas"],
      b_europe: ["Gira europea", "Sellos de 5 países europeos"], b_time3: ["Maestro del tiempo", "Ordena bien 3 líneas del tiempo distintas"], b_nav12: ["Cartógrafo", "Encuentra el país de 12 historias"], b_level4: ["Pase de museo", "Llega al nivel 4"] },
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
      b_perfect: ["Τέλειο παιχνίδι", "Όλα τα ζευγάρια σωστά σε ένα παιχνίδι"], b_poly: ["Πολύγλωσσος", "Απάντησε σε μια ερώτηση σε γλώσσα άλλη από τα αγγλικά"], b_time: ["Φύλακας του χρόνου", "Βάλε 4 στιγμές στη σωστή σειρά"], b_nav: ["Πλοηγός", "Βρες τη χώρα 5 ιστοριών"], b_explorer: ["Εξερευνητής παιχνιδιών", "Παίξε και τα 3 παιχνίδια"],
      b_continents: ["Τρεις ήπειροι", "Σφραγίδες από 3 ηπείρους"], b_ten_q: ["Περίεργο μυαλό", "Απάντησε σε 10 γρήγορες ερωτήσεις"], b_right8: ["Βιβλιοφάγος", "Απάντησε σωστά σε 8 γρήγορες ερωτήσεις"], b_pairs10: ["Ντετέκτιβ του χρόνου", "Βρες σωστά 10 διαφορετικά ζευγάρια"],
      b_europe: ["Γύρος της Ευρώπης", "Σφραγίδες από 5 χώρες της Ευρώπης"], b_time3: ["Άρχοντας του χρόνου", "3 διαφορετικά χρονολόγια σε τέλεια σειρά"], b_nav12: ["Χαρτογράφος", "Βρες τη χώρα 12 ιστοριών"], b_level4: ["Πάσο μουσείου", "Φτάσε στο επίπεδο 4"] },
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
      b_perfect: ["Perfektes Spiel", "Alle Paare richtig in einem Spiel"], b_poly: ["Polyglott", "Beantworte eine Frage in einer anderen Sprache als Englisch"], b_time: ["Zeithüter", "Bring 4 Momente in die richtige Reihenfolge"], b_nav: ["Navigator", "Finde das Land von 5 Geschichten"], b_explorer: ["Spiele-Entdecker", "Spiel alle 3 Spiele"],
      b_continents: ["Drei Kontinente", "Stempel von 3 Kontinenten"], b_ten_q: ["Neugieriger Kopf", "Beantworte 10 kurze Fragen"], b_right8: ["Bücherwurm", "Beantworte 8 kurze Fragen richtig"], b_pairs10: ["Zeitdetektiv", "10 verschiedene Paare richtig"],
      b_europe: ["Europareise", "Stempel aus 5 Ländern Europas"], b_time3: ["Meister der Zeit", "3 verschiedene Zeitstrahlen perfekt geordnet"], b_nav12: ["Kartograf", "Finde das Land von 12 Geschichten"], b_level4: ["Museumspass", "Erreiche Level 4"] }
  };
  // French, Portuguese (Brazilian) and Italian (Mike, 2026-11-12: "do the suggested languages"). Written by Claude.
  var EXTRA = {
    fr: {
      T: {
        language: "Langue", headline: "Où cela s'est-il passé ?",
        tagline: "De vraies histoires derrière les objets du quotidien, sous-titrées dans votre langue.",
        cat_history: "Histoire", cat_how: "Comment ça marche", cat_money: "Argent", cat_psychology: "Psychologie",
        map_hint: "Touchez un pays pour voir les histoires qui s'y sont passées.",
        search: "Rechercher des histoires", all: "Tout", shorts: "Shorts", long: "Vidéos longues",
        clear: "Tous les pays", n_stories: "{n} histoires", n_story: "1 histoire", no_results: "Aucune histoire ne correspond.",
        on_youtube: "Sur YouTube", subtitled: "Sous-titres",
        coming_soon: "{channel} arrive bientôt sur ce site. Regardez-la dès maintenant sur YouTube.",
        open_channel: "Ouvrir la chaîne", subscribe: "S'abonner", watch_on_youtube: "Regarder sur YouTube",
        all_stories: "Toutes les histoires", subtitles: "Sous-titres", off: "Désactivés", story: "L'histoire",
        translated_note: "Traduit de l'anglais par IA. Les nombres, les dates et les noms sont vérifiés par un programme.",
        sources: "Sources",
        sources_note: "Chaque fait est vérifié avec deux sources. Les petits chiffres après une phrase renvoient vers elles.",
        credits: "Images et crédits", changes: "Modifications", source_link: "source", voice: "Voix", music: "Musique",
        music_none: "Aucune dans cette version (voix seule).",
        disclosure: "Recherches dans des archives et des collections de musées avec des outils d'IA ; chaque fait est vérifié avec au moins deux sources et relu par un second modèle d'IA. Narration : voix d'IA.",
        ai_pictures: "Les reconstitutions par IA sont signalées à l'écran.",
        privacy: "Confidentialité", no_cookies: "Pas de publicité. Ce site ne dépose aucun cookie.", worldwide: "Pas de lieu unique",
        nav_map: "Carte", our_channels: "Nos chaînes", pop_title: "Connectez-vous pour jouer", pop_text: "Connectez-vous gratuitement avec Google pour jouer aux jeux, répondre aux questions rapides et garder vos points, tampons et badges sur tous vos appareils. Regarder et lire restent libres.", pop_later: "Plus tard", full_screen: "Plein écran", exit_full: "Quitter le plein écran", sub_alt: "Ouvrir sur YouTube",
        gate_title: "Connectez-vous pour jouer", q_signin: "Connectez-vous pour répondre",
        gate_text: "Les jeux et les questions rapides enregistrent vos points, tampons et badges dans votre compte. Regarder et lire restent libres.",
        hub_title: "Jeux", hub_lede: "Des jeux courts autour des histoires. Jouez autant que vous voulez.", all_games: "Tous les jeux",
        g_older_d: "Deux images. Touchez la plus ancienne.", tl_title: "Frise chronologique",
        tl_d: "Remettez quatre moments dans l'ordre, du plus ancien au plus récent.",
        tl_hint: "Touchez d'abord le plus ancien, puis le suivant. Touchez à nouveau pour annuler.", tl_check: "Vérifier",
        tl_result: "{r} sur 4 à la bonne place.", tl_perfect: "Ordre parfait !", tl_again: "Nouvelle frise",
        wh_d: "Découvrez une histoire et choisissez le pays où elle s'est passée.", wh_q: "Dans quel pays cela s'est-il passé ?",
        wh_next: "Histoire suivante", wh_watch: "Voir l'histoire", wh_place: "Cela s'est passé ici : {p}.", wh_done: "Vous avez trouvé {r} sur {n}.",
        wh_again: "Rejouer",
        acc_title: "Enregistrez votre progression",

        acc_signin: "Se connecter avec Google",
        acc_age: "À partir de 14 ans, ou avec l'accord d'un parent. Nous enregistrons seulement votre progression dans le jeu. Voir Confidentialité.",
        acc_signed: "Connecté. Votre progression est enregistrée dans votre compte.", acc_signout: "Se déconnecter",
        acc_delete: "Supprimer mon compte", acc_delete_confirm: "Supprimer votre compte et toute la progression enregistrée ? C'est définitif.",
        acc_deleted: "Votre compte et votre progression ont été supprimés.", acc_error: "Cela n'a pas marché. Réessayez.",
        acc_synced: "Progression enregistrée dans votre compte",
        comment_btn: "Commenter sur YouTube", comment_copied: "Copié. Collez-le dans les commentaires sous la vidéo.",
        comment_right: "Je le savais : {a} !", comment_wrong: "Je ne le savais pas : {a} !",
        quick_q: "Question rapide", q_wrong: "Pas tout à fait.", q_answered_right: "Vous avez trouvé la bonne réponse.",
        q_answered: "Vous avez déjà répondu. La bonne réponse est indiquée.",
        q_hint: "La réponse est dans la vidéo et dans le texte de l'histoire.", play_label: "Lire la vidéo",
        yt_note: "Lecture dans le lecteur de YouTube. Toucher « lecture » charge YouTube, et la politique de confidentialité de Google s'applique.",
        passport_how: "Répondez à la question rapide d'une histoire et son pays reçoit un tampon.",
        choose_country: "Choisir un pays", nav_play: "Jouer", nav_passport: "Passeport",
        board_count: "{c} pays · {n} histoires", play_title: "Lequel est le plus ancien ?", play_first: "Lequel est venu en premier ?",
        play_hint: "Touchez celui qui vous semble le plus ancien.", play_hint_first: "Touchez celui qui vous semble venu en premier.",
        play_promo: "Deux images. L'une est plus ancienne. Laquelle ?", play_start: "Jouer",
        right: "Bravo !", wrong: "Pas cette fois.", older_is: "Plus ancien : {x}", first_is: "En premier : {x}",
        stamp_older: "PLUS ANCIEN", stamp_first: "EN PREMIER", watch_answer: "Voir la réponse", watch_answer_yt: "Voir la réponse sur YouTube",
        next_pair: "Paire suivante", round: "Paire {i} sur {n}", score: "{r} sur {n} correctes",
        done: "Vous avez joué toutes les paires pour l'instant. De nouvelles arrivent avec les nouvelles vidéos.", play_again: "Rejouer",
        passport_title: "Votre passeport", passport_count: "Vous avez visité {v} pays sur {n}", passport_mini: "{v} pays tamponnés sur {n}",
passport_clear: "Vider le passeport",
        passport_confirm: "Effacer tous vos tampons ?", stamped_toast: "Tampon ! Nouveau pays dans votre passeport : {c}.",
        stamped: "Tamponné", not_yet: "Pas encore de tampon", close: "Fermer", read_story: "Lire l'histoire",
        stories_here: "{n} histoires ici", story_here: "1 histoire ici", picture: "Image"
      },
      G: {
        levels: ["Visiteur", "Explorateur", "Collectionneur", "Conservateur", "Archiviste", "Historien", "Voyageur du temps", "Légende"],
        level: "Niveau", points: "{p} points", to_next: "{n} points avant le niveau suivant", max_level: "Niveau maximum atteint",
        plus: "+{p} points", level_up: "Niveau {l} : {name} !", unlocked: "Débloqué : {x}", badges: "Badges", unlocks: "Déblocages",
        at_level: "Dès le niveau {l}",
        fair: "Pas de séries, pas de chrono, rien à acheter. Les points viennent seulement de vos réponses ici, jamais des vidéos regardées, des « j'aime » ou des abonnements.",
        u_oldmap: "Carte ancienne", u_oldmap_d: "Le plateau comme une vieille carte en papier",
        challenge: "Défier un ami", challenge_text: "J'ai eu {r} sur {n} à « Lequel est le plus ancien ? ». Tu fais mieux ?",
        challenge_intro: "Un ami a eu {r} sur {n}. Pouvez-vous faire mieux ?", challenge_result: "Vous : {a} · Votre ami : {b}", copied: "Lien copié",
        b_first_q: ["Première question", "Répondez à la question rapide d'une histoire"], b_first_stamp: ["Premier tampon", "Obtenez votre premier tampon"],
        b_five: ["Globe-trotteur", "Des tampons de 5 pays"], b_sharp: ["Œil de lynx", "3 bonnes réponses d'affilée"],
        b_perfect: ["Partie parfaite", "Toutes les paires justes en une partie"], b_poly: ["Polyglotte", "Répondez à une question dans une autre langue que l'anglais"],
        b_time: ["Gardien du temps", "Remettez 4 moments dans le bon ordre"], b_nav: ["Navigateur", "Trouvez le pays de 5 histoires"],
        b_explorer: ["Explorateur de jeux", "Jouez aux 3 jeux"],
        b_continents: ["Trois continents", "Des tampons de 3 continents"], b_ten_q: ["Esprit curieux", "Répondez à 10 questions rapides"], b_right8: ["Rat de bibliothèque", "8 bonnes réponses aux questions rapides"], b_pairs10: ["Détective du temps", "10 paires différentes justes"],
        b_europe: ["Tour d'Europe", "Des tampons de 5 pays d'Europe"], b_time3: ["Maître du temps", "3 frises différentes dans l'ordre parfait"], b_nav12: ["Cartographe", "Trouvez le pays de 12 histoires"], b_level4: ["Pass musée", "Atteignez le niveau 4"]
      }
    },
    pt: {
      T: {
        language: "Idioma", headline: "Onde aconteceu?",
        tagline: "Histórias reais por trás das coisas do dia a dia, com legendas no seu idioma.",
        cat_history: "História", cat_how: "Como as coisas funcionam", cat_money: "Dinheiro", cat_psychology: "Psicologia",
        map_hint: "Toque em um país para ver as histórias que aconteceram lá.",
        search: "Buscar histórias", all: "Tudo", shorts: "Shorts", long: "Vídeos longos",
        clear: "Todos os países", n_stories: "{n} histórias", n_story: "1 história", no_results: "Nenhuma história encontrada.",
        on_youtube: "No YouTube", subtitled: "Legendas",
        coming_soon: "{channel} chega em breve a este site. Assista agora no YouTube.",
        open_channel: "Abrir o canal", subscribe: "Inscrever-se", watch_on_youtube: "Assistir no YouTube",
        all_stories: "Todas as histórias", subtitles: "Legendas", off: "Desativadas", story: "A história",
        translated_note: "Traduzido do inglês por IA. Números, datas e nomes são conferidos por um programa.",
        sources: "Fontes",
        sources_note: "Cada fato é conferido em duas fontes. Os números pequenos depois de cada frase apontam para elas.",
        credits: "Imagens e créditos", changes: "Alterações", source_link: "fonte", voice: "Voz", music: "Música",
        music_none: "Nenhuma nesta versão (só voz).",
        disclosure: "Pesquisado em acervos de museus e arquivos com ferramentas de IA; cada fato é conferido em pelo menos duas fontes e revisado por um segundo modelo de IA. Narração: voz de IA.",
        ai_pictures: "As reconstruções feitas com IA são indicadas na tela.",
        privacy: "Privacidade", no_cookies: "Sem anúncios. Este site não usa cookies.", worldwide: "Sem um lugar único",
        nav_map: "Mapa", our_channels: "Nossos canais", pop_title: "Entre para jogar", pop_text: "Entre de graça com o Google para jogar os jogos, responder às perguntas rápidas e manter seus pontos, carimbos e conquistas em todos os aparelhos. Assistir e ler continuam livres.", pop_later: "Agora não", full_screen: "Tela cheia", exit_full: "Sair da tela cheia", sub_alt: "Abrir no YouTube",
        gate_title: "Entre para jogar", q_signin: "Entre para responder",
        gate_text: "Os jogos e as perguntas rápidas salvam seus pontos, carimbos e conquistas na sua conta. Assistir e ler continuam livres.",
        hub_title: "Jogos", hub_lede: "Jogos curtos sobre as histórias. Jogue quantas vezes quiser.", all_games: "Todos os jogos",
        g_older_d: "Duas imagens. Toque na mais antiga.", tl_title: "Linha do tempo",
        tl_d: "Coloque quatro momentos em ordem, do mais antigo ao mais recente.",
        tl_hint: "Toque primeiro no mais antigo e depois no seguinte. Toque de novo para desfazer.", tl_check: "Conferir",
        tl_result: "{r} de 4 no lugar certo.", tl_perfect: "Ordem perfeita!", tl_again: "Nova linha do tempo",
        wh_d: "Veja uma história e escolha o país onde ela aconteceu.", wh_q: "Em que país isso aconteceu?",
        wh_next: "Próxima história", wh_watch: "Ver a história", wh_place: "Aconteceu aqui: {p}.", wh_done: "Você acertou {r} de {n}.",
        wh_again: "Jogar de novo",
        acc_title: "Salve seu progresso",

        acc_signin: "Entrar com o Google",
        acc_age: "A partir de 14 anos, ou com a permissão de um responsável. Salvamos só o seu progresso no jogo. Veja Privacidade.",
        acc_signed: "Conectado. Seu progresso fica salvo na sua conta.", acc_signout: "Sair",
        acc_delete: "Excluir minha conta", acc_delete_confirm: "Excluir sua conta e todo o progresso salvo? Isso não pode ser desfeito.",
        acc_deleted: "Sua conta e seu progresso foram excluídos.", acc_error: "Não funcionou. Tente de novo.",
        acc_synced: "Progresso salvo na sua conta",
        comment_btn: "Comentar no YouTube", comment_copied: "Copiado. Cole nos comentários abaixo do vídeo.",
        comment_right: "Eu sabia: {a}!", comment_wrong: "Essa eu não sabia: {a}!",
        quick_q: "Pergunta rápida", q_wrong: "Não exatamente.", q_answered_right: "Você acertou esta.",
        q_answered: "Você já respondeu esta. A resposta certa está marcada.",
        q_hint: "A resposta está no vídeo e no texto da história.", play_label: "Reproduzir o vídeo",
        yt_note: "Reproduz no player do YouTube. Ao tocar em reproduzir, o YouTube é carregado e vale a política de privacidade do Google.",
        passport_how: "Responda à pergunta rápida de uma história e o país dela ganha um carimbo.",
        choose_country: "Escolha um país", nav_play: "Jogar", nav_passport: "Passaporte",
        board_count: "{c} países · {n} histórias", play_title: "O que é mais antigo?", play_first: "O que veio primeiro?",
        play_hint: "Toque no que você acha mais antigo.", play_hint_first: "Toque no que você acha que veio primeiro.",
        play_promo: "Duas imagens. Uma é mais antiga. Qual?", play_start: "Jogar",
        right: "Certo!", wrong: "Não desta vez.", older_is: "Mais antigo: {x}", first_is: "Primeiro: {x}",
        stamp_older: "MAIS ANTIGO", stamp_first: "PRIMEIRO", watch_answer: "Ver a resposta", watch_answer_yt: "Ver a resposta no YouTube",
        next_pair: "Próximo par", round: "Par {i} de {n}", score: "{r} de {n} certas",
        done: "Você jogou todos os pares por enquanto. Novos pares chegam com os novos vídeos.", play_again: "Jogar de novo",
        passport_title: "Seu passaporte", passport_count: "Você visitou {v} de {n} países", passport_mini: "{v} de {n} países carimbados",
passport_clear: "Limpar passaporte",
        passport_confirm: "Apagar todos os seus carimbos?", stamped_toast: "Carimbo! Novo país no seu passaporte: {c}.",
        stamped: "Carimbado", not_yet: "Ainda sem carimbo", close: "Fechar", read_story: "Ler a história",
        stories_here: "{n} histórias aqui", story_here: "1 história aqui", picture: "Imagem"
      },
      G: {
        levels: ["Visitante", "Explorador", "Colecionador", "Curador", "Arquivista", "Historiador", "Viajante do tempo", "Lenda"],
        level: "Nível", points: "{p} pontos", to_next: "{n} pontos para o próximo nível", max_level: "Nível máximo alcançado",
        plus: "+{p} pontos", level_up: "Nível {l}: {name}!", unlocked: "Desbloqueado: {x}", badges: "Conquistas", unlocks: "Desbloqueios",
        at_level: "A partir do nível {l}",
        fair: "Sem sequências, sem cronômetro, nada para comprar. Os pontos vêm só das suas respostas aqui, nunca de vídeos assistidos, curtidas ou inscrições.",
        u_oldmap: "Mapa antigo", u_oldmap_d: "O tabuleiro como um velho mapa de papel",
        challenge: "Desafiar um amigo", challenge_text: "Fiz {r} de {n} em “O que é mais antigo?”. Consegue me superar?",
        challenge_intro: "Um amigo fez {r} de {n}. Consegue superar?", challenge_result: "Você: {a} · Seu amigo: {b}", copied: "Link copiado",
        b_first_q: ["Primeira pergunta", "Responda à pergunta rápida de uma história"], b_first_stamp: ["Primeiro carimbo", "Ganhe seu primeiro carimbo"],
        b_five: ["Viajante do mundo", "Carimbos de 5 países"], b_sharp: ["Olho afiado", "3 respostas certas seguidas"],
        b_perfect: ["Partida perfeita", "Todos os pares certos numa partida"], b_poly: ["Poliglota", "Responda a uma pergunta em um idioma que não seja o inglês"],
        b_time: ["Guardião do tempo", "Coloque 4 momentos na ordem certa"], b_nav: ["Navegador", "Encontre o país de 5 histórias"],
        b_explorer: ["Explorador de jogos", "Jogue os 3 jogos"],
        b_continents: ["Três continentes", "Carimbos de 3 continentes"], b_ten_q: ["Mente curiosa", "Responda a 10 perguntas rápidas"], b_right8: ["Rato de biblioteca", "Acerte 8 perguntas rápidas"], b_pairs10: ["Detetive das datas", "Acerte 10 pares diferentes"],
        b_europe: ["Giro pela Europa", "Carimbos de 5 países europeus"], b_time3: ["Mestre do tempo", "3 linhas do tempo diferentes na ordem certa"], b_nav12: ["Cartógrafo", "Encontre o país de 12 histórias"], b_level4: ["Passe de museu", "Chegue ao nível 4"]
      }
    },
    it: {
      T: {
        language: "Lingua", headline: "Dove è successo?",
        tagline: "Storie vere dietro le cose di tutti i giorni, con i sottotitoli nella tua lingua.",
        cat_history: "Storia", cat_how: "Come funzionano le cose", cat_money: "Soldi", cat_psychology: "Psicologia",
        map_hint: "Tocca un paese per vedere le storie successe lì.",
        search: "Cerca storie", all: "Tutto", shorts: "Shorts", long: "Video lunghi",
        clear: "Tutti i paesi", n_stories: "{n} storie", n_story: "1 storia", no_results: "Nessuna storia trovata.",
        on_youtube: "Su YouTube", subtitled: "Sottotitoli",
        coming_soon: "{channel} arriverà presto su questo sito. Guardalo subito su YouTube.",
        open_channel: "Apri il canale", subscribe: "Iscriviti", watch_on_youtube: "Guarda su YouTube",
        all_stories: "Tutte le storie", subtitles: "Sottotitoli", off: "Disattivati", story: "La storia",
        translated_note: "Tradotto dall'inglese con l'IA. Numeri, date e nomi sono controllati da un programma.",
        sources: "Fonti",
        sources_note: "Ogni fatto è controllato con due fonti. I numeri piccoli dopo ogni frase rimandano a esse.",
        credits: "Immagini e crediti", changes: "Modifiche", source_link: "fonte", voice: "Voce", music: "Musica",
        music_none: "Nessuna in questa versione (solo voce).",
        disclosure: "Ricerche su archivi e collezioni museali con strumenti di IA; ogni fatto è controllato con almeno due fonti e rivisto da un secondo modello di IA. Narrazione: voce IA.",
        ai_pictures: "Le ricostruzioni con l'IA sono indicate sullo schermo.",
        privacy: "Privacy", no_cookies: "Niente pubblicità. Questo sito non usa cookie.", worldwide: "Nessun luogo preciso",
        nav_map: "Mappa", our_channels: "I nostri canali", pop_title: "Accedi per giocare", pop_text: "Accedi gratis con Google per giocare, rispondere alle domande rapide e tenere punti, timbri e distintivi su tutti i tuoi dispositivi. Guardare e leggere restano liberi.", pop_later: "Non ora", full_screen: "Schermo intero", exit_full: "Esci da schermo intero", sub_alt: "Apri su YouTube",
        gate_title: "Accedi per giocare", q_signin: "Accedi per rispondere",
        gate_text: "I giochi e le domande rapide salvano punti, timbri e distintivi nel tuo account. Guardare e leggere restano liberi.",
        hub_title: "Giochi", hub_lede: "Giochi brevi sulle storie. Gioca quanto vuoi.", all_games: "Tutti i giochi",
        g_older_d: "Due immagini. Tocca la più antica.", tl_title: "Linea del tempo",
        tl_d: "Metti in ordine quattro momenti, dal più antico al più recente.",
        tl_hint: "Tocca prima il più antico, poi il successivo. Tocca di nuovo per annullare.", tl_check: "Controlla",
        tl_result: "{r} su 4 al posto giusto.", tl_perfect: "Ordine perfetto!", tl_again: "Nuova linea del tempo",
        wh_d: "Guarda una storia e scegli il paese in cui è successa.", wh_q: "In quale paese è successo?",
        wh_next: "Storia successiva", wh_watch: "Guarda la storia", wh_place: "È successo qui: {p}.", wh_done: "Ne hai trovate {r} su {n}.",
        wh_again: "Gioca ancora",
        acc_title: "Salva i tuoi progressi",

        acc_signin: "Accedi con Google",
        acc_age: "Dai 14 anni in su, o con il permesso di un genitore. Salviamo solo i tuoi progressi nel gioco. Vedi Privacy.",
        acc_signed: "Accesso effettuato. I tuoi progressi sono salvati nel tuo account.", acc_signout: "Esci",
        acc_delete: "Elimina il mio account", acc_delete_confirm: "Eliminare l'account e tutti i progressi salvati? Non si può annullare.",
        acc_deleted: "Il tuo account e i tuoi progressi sono stati eliminati.", acc_error: "Non ha funzionato. Riprova.",
        acc_synced: "Progressi salvati nel tuo account",
        comment_btn: "Commenta su YouTube", comment_copied: "Copiato. Incollalo nei commenti sotto il video.",
        comment_right: "Lo sapevo: {a}!", comment_wrong: "Questa non la sapevo: {a}!",
        quick_q: "Domanda rapida", q_wrong: "Non proprio.", q_answered_right: "Hai risposto giusto.",
        q_answered: "Hai già risposto. La risposta giusta è segnata.",
        q_hint: "La risposta è nel video e nel testo della storia.", play_label: "Riproduci il video",
        yt_note: "Si riproduce nel player di YouTube. Toccando play si carica YouTube e vale l'informativa sulla privacy di Google.",
        passport_how: "Rispondi alla domanda rapida di una storia e il suo paese riceve un timbro.",
        choose_country: "Scegli un paese", nav_play: "Gioca", nav_passport: "Passaporto",
        board_count: "{c} paesi · {n} storie", play_title: "Cosa è più antico?", play_first: "Cosa è venuto prima?",
        play_hint: "Tocca quello che secondo te è più antico.", play_hint_first: "Tocca quello che secondo te è venuto prima.",
        play_promo: "Due immagini. Una è più antica. Quale?", play_start: "Gioca",
        right: "Giusto!", wrong: "Non stavolta.", older_is: "Più antico: {x}", first_is: "Prima: {x}",
        stamp_older: "PIÙ ANTICO", stamp_first: "PRIMA", watch_answer: "Guarda la risposta", watch_answer_yt: "Guarda la risposta su YouTube",
        next_pair: "Coppia successiva", round: "Coppia {i} di {n}", score: "{r} su {n} giuste",
        done: "Hai giocato tutte le coppie per ora. Ne arriveranno altre con i nuovi video.", play_again: "Gioca ancora",
        passport_title: "Il tuo passaporto", passport_count: "Hai visitato {v} paesi su {n}", passport_mini: "{v} paesi timbrati su {n}",
passport_clear: "Svuota il passaporto",
        passport_confirm: "Cancellare tutti i tuoi timbri?", stamped_toast: "Timbro! Nuovo paese nel tuo passaporto: {c}.",
        stamped: "Timbrato", not_yet: "Ancora nessun timbro", close: "Chiudi", read_story: "Leggi la storia",
        stories_here: "{n} storie qui", story_here: "1 storia qui", picture: "Immagine"
      },
      G: {
        levels: ["Visitatore", "Esploratore", "Collezionista", "Curatore", "Archivista", "Storico", "Viaggiatore nel tempo", "Leggenda"],
        level: "Livello", points: "{p} punti", to_next: "{n} punti al prossimo livello", max_level: "Livello massimo raggiunto",
        plus: "+{p} punti", level_up: "Livello {l}: {name}!", unlocked: "Sbloccato: {x}", badges: "Distintivi", unlocks: "Sblocchi",
        at_level: "Dal livello {l}",
        fair: "Niente serie, niente timer, niente da comprare. I punti arrivano solo dalle tue risposte qui, mai dai video guardati, dai «mi piace» o dalle iscrizioni.",
        u_oldmap: "Mappa antica", u_oldmap_d: "Il tabellone come una vecchia mappa di carta",
        challenge: "Sfida un amico", challenge_text: "Ho fatto {r} su {n} a «Cosa è più antico?». Riesci a battermi?",
        challenge_intro: "Un amico ha fatto {r} su {n}. Riesci a fare meglio?", challenge_result: "Tu: {a} · Il tuo amico: {b}", copied: "Link copiato",
        b_first_q: ["Prima domanda", "Rispondi alla domanda rapida di una storia"], b_first_stamp: ["Primo timbro", "Ottieni il tuo primo timbro"],
        b_five: ["Giramondo", "Timbri da 5 paesi"], b_sharp: ["Occhio di lince", "3 risposte giuste di fila"],
        b_perfect: ["Partita perfetta", "Tutte le coppie giuste in una partita"], b_poly: ["Poliglotta", "Rispondi a una domanda in una lingua diversa dall'inglese"],
        b_time: ["Custode del tempo", "Metti 4 momenti nell'ordine giusto"], b_nav: ["Navigatore", "Trova il paese di 5 storie"],
        b_explorer: ["Esploratore di giochi", "Gioca a tutti e 3 i giochi"],
        b_continents: ["Tre continenti", "Timbri da 3 continenti"], b_ten_q: ["Mente curiosa", "Rispondi a 10 domande rapide"], b_right8: ["Topo di biblioteca", "8 risposte giuste alle domande rapide"], b_pairs10: ["Detective delle date", "Indovina 10 coppie diverse"],
        b_europe: ["Giro d'Europa", "Timbri da 5 paesi europei"], b_time3: ["Maestro del tempo", "3 linee del tempo diverse in ordine perfetto"], b_nav12: ["Cartografo", "Trova il paese di 12 storie"], b_level4: ["Pass del museo", "Raggiungi il livello 4"]
      }
    }
  };
  for (var xl in EXTRA) { T[xl] = EXTRA[xl].T; GAME[xl] = EXTRA[xl].G; }
  // Fable 5.2 review (Mike, 2026-11-12): newest stories, next story, country buttons, the app-browser sign-in tip,
  // three wordings for the YouTube comment, and texts that had become untrue (games now need sign-in).
  var REVIEW = {
    en: {"newest": "Newest stories", "see_all": "See all stories", "soon": "Soon", "more_stories": "More stories", "next_story": "Next story", "watch_here": "Watch here with subtitles", "subs_n": "Subtitles in {n} languages", "subs_hint": "Subtitles show here", "inapp": "To sign in, open this page in your browser: tap the ⋮ or ··· menu and choose “Open in browser”.", "nav_search": "Stories", "acc_text": "Sign in with Google to play the games, answer the quick questions and keep your points and stamps on every device. Watching and reading stay free.", "passport_local": "Sign in to collect stamps and keep them on every device.", "comment_right2": "Got this one right: {a}.", "comment_right3": "{a}, I guessed it!", "comment_wrong2": "Wow, I had no idea: {a}.", "comment_wrong3": "I guessed wrong. It's {a}!", "site_title": "Oldest Surviving: history in your language"},
    es: {"newest": "Historias más recientes", "see_all": "Ver todas las historias", "soon": "Pronto", "more_stories": "Más historias", "next_story": "Siguiente historia", "watch_here": "Ver aquí con subtítulos", "subs_n": "Subtítulos en {n} idiomas", "subs_hint": "Aquí aparecen los subtítulos", "inapp": "Para iniciar sesión, abre esta página en tu navegador: toca el menú ⋮ o ··· y elige «Abrir en el navegador».", "nav_search": "Historias", "acc_text": "Inicia sesión con Google para jugar, responder las preguntas rápidas y guardar tus puntos y sellos en todos tus dispositivos. Ver y leer sigue siendo libre.", "passport_local": "Inicia sesión para coleccionar sellos y tenerlos en todos tus dispositivos.", "comment_right2": "Acerté esta: {a}.", "comment_right3": "{a}, ¡lo adiviné!", "comment_wrong2": "Vaya, no tenía ni idea: {a}.", "comment_wrong3": "Me equivoqué. ¡Es {a}!", "site_title": "Oldest Surviving: historia en tu idioma"},
    el: {"newest": "Οι πιο πρόσφατες ιστορίες", "see_all": "Όλες οι ιστορίες", "soon": "Σύντομα", "more_stories": "Περισσότερες ιστορίες", "next_story": "Επόμενη ιστορία", "watch_here": "Δες εδώ με υπότιτλους", "subs_n": "Υπότιτλοι σε {n} γλώσσες", "subs_hint": "Εδώ εμφανίζονται οι υπότιτλοι", "inapp": "Για να συνδεθείς, άνοιξε αυτή τη σελίδα στο πρόγραμμα περιήγησής σου: πάτα το μενού ⋮ ή ··· και διάλεξε «Άνοιγμα σε πρόγραμμα περιήγησης».", "nav_search": "Ιστορίες", "acc_text": "Συνδέσου με Google για να παίζεις, να απαντάς στις γρήγορες ερωτήσεις και να κρατάς πόντους και σφραγίδες σε όλες τις συσκευές σου. Η προβολή και η ανάγνωση μένουν ελεύθερες.", "passport_local": "Συνδέσου για να μαζεύεις σφραγίδες και να τις έχεις σε όλες τις συσκευές σου.", "comment_right2": "Το βρήκα: {a}.", "comment_right3": "{a}, το μάντεψα!", "comment_wrong2": "Δεν είχα ιδέα: {a}.", "comment_wrong3": "Έκανα λάθος. Είναι {a}!", "site_title": "Oldest Surviving: ιστορία στη γλώσσα σου"},
    de: {"newest": "Neueste Geschichten", "see_all": "Alle Geschichten", "soon": "Bald", "more_stories": "Mehr Geschichten", "next_story": "Nächste Geschichte", "watch_here": "Hier mit Untertiteln ansehen", "subs_n": "Untertitel in {n} Sprachen", "subs_hint": "Hier erscheinen die Untertitel", "inapp": "Zum Anmelden öffne diese Seite in deinem Browser: tippe auf das Menü ⋮ oder ··· und wähle „Im Browser öffnen“.", "nav_search": "Geschichten", "acc_text": "Melde dich mit Google an, um zu spielen, die kurzen Fragen zu beantworten und deine Punkte und Stempel auf allen Geräten zu behalten. Schauen und Lesen bleibt frei.", "passport_local": "Melde dich an, um Stempel zu sammeln und sie auf allen Geräten zu behalten.", "comment_right2": "Richtig geraten: {a}.", "comment_right3": "{a} – wusste ich!", "comment_wrong2": "Davon hatte ich keine Ahnung: {a}.", "comment_wrong3": "Falsch geraten. Es ist {a}!", "site_title": "Oldest Surviving: Geschichte in deiner Sprache"},
    fr: {"newest": "Histoires les plus récentes", "see_all": "Toutes les histoires", "soon": "Bientôt", "more_stories": "Plus d'histoires", "next_story": "Histoire suivante", "watch_here": "À regarder ici avec sous-titres", "subs_n": "Sous-titres en {n} langues", "subs_hint": "Les sous-titres s'affichent ici", "inapp": "Pour vous connecter, ouvrez cette page dans votre navigateur : touchez le menu ⋮ ou ··· et choisissez « Ouvrir dans le navigateur ».", "nav_search": "Histoires", "acc_text": "Connectez-vous avec Google pour jouer, répondre aux questions rapides et garder vos points et tampons sur tous vos appareils. Regarder et lire restent libres.", "passport_local": "Connectez-vous pour collectionner des tampons et les garder sur tous vos appareils.", "comment_right2": "Bien trouvé : {a}.", "comment_right3": "{a}, je l'avais deviné !", "comment_wrong2": "Je n'en avais aucune idée : {a}.", "comment_wrong3": "Raté. C'est {a} !", "site_title": "Oldest Surviving : l'histoire dans votre langue"},
    pt: {"newest": "Histórias mais recentes", "see_all": "Ver todas as histórias", "soon": "Em breve", "more_stories": "Mais histórias", "next_story": "Próxima história", "watch_here": "Assista aqui com legendas", "subs_n": "Legendas em {n} idiomas", "subs_hint": "As legendas aparecem aqui", "inapp": "Para entrar, abra esta página no seu navegador: toque no menu ⋮ ou ··· e escolha “Abrir no navegador”.", "nav_search": "Histórias", "acc_text": "Entre com o Google para jogar, responder às perguntas rápidas e manter seus pontos e carimbos em todos os aparelhos. Assistir e ler continuam livres.", "passport_local": "Entre para colecionar carimbos e mantê-los em todos os aparelhos.", "comment_right2": "Acertei esta: {a}.", "comment_right3": "{a}, eu chutei certo!", "comment_wrong2": "Eu não fazia ideia: {a}.", "comment_wrong3": "Errei. É {a}!", "site_title": "Oldest Surviving: história no seu idioma"},
    it: {"newest": "Storie più recenti", "see_all": "Tutte le storie", "soon": "Presto", "more_stories": "Altre storie", "next_story": "Storia successiva", "watch_here": "Guarda qui con i sottotitoli", "subs_n": "Sottotitoli in {n} lingue", "subs_hint": "Qui compaiono i sottotitoli", "inapp": "Per accedere, apri questa pagina nel tuo browser: tocca il menu ⋮ o ··· e scegli «Apri nel browser».", "nav_search": "Storie", "acc_text": "Accedi con Google per giocare, rispondere alle domande rapide e tenere punti e timbri su tutti i tuoi dispositivi. Guardare e leggere restano liberi.", "passport_local": "Accedi per collezionare timbri e tenerli su tutti i tuoi dispositivi.", "comment_right2": "Indovinata: {a}.", "comment_right3": "{a}: ci ho preso!", "comment_wrong2": "Non ne avevo idea: {a}.", "comment_wrong3": "Sbagliato. È {a}!", "site_title": "Oldest Surviving: la storia nella tua lingua"}
  };
  for (var rl in REVIEW) for (var rk in REVIEW[rl]) T[rl][rk] = REVIEW[rl][rk];
  // the research line of the other three channels (Mike, 2026-11-13: all channels on the website)
  var CHANNEL_WORDS = {
    en: {"disclosure_how": "Researched from engineering and official sources with AI tools; every fact checked against at least two sources and reviewed by a second AI model. Narration: AI voice.", "disclosure_money": "Researched from company reports, official statistics and reputable press with AI tools; every fact checked against at least two sources and reviewed by a second AI model. Narration: AI voice. Not financial advice.", "disclosure_psychology": "Researched from published studies and reputable science reporting with AI tools; every fact checked against at least two sources and reviewed by a second AI model. Narration: AI voice. Educational content, not medical advice."},
    es: {"disclosure_how": "Investigado en fuentes técnicas y oficiales con herramientas de IA; cada dato se comprueba con al menos dos fuentes y lo revisa un segundo modelo de IA. Narración: voz de IA.", "disclosure_money": "Investigado en informes de empresas, estadísticas oficiales y prensa fiable con herramientas de IA; cada dato se comprueba con al menos dos fuentes y lo revisa un segundo modelo de IA. Narración: voz de IA. No es asesoramiento financiero.", "disclosure_psychology": "Investigado en estudios publicados y divulgación científica fiable con herramientas de IA; cada dato se comprueba con al menos dos fuentes y lo revisa un segundo modelo de IA. Narración: voz de IA. Contenido educativo, no es consejo médico."},
    el: {"disclosure_how": "Έρευνα σε τεχνικές και επίσημες πηγές με εργαλεία ΤΝ· κάθε στοιχείο ελέγχεται σε τουλάχιστον δύο πηγές και το ελέγχει ένα δεύτερο μοντέλο ΤΝ. Αφήγηση: φωνή ΤΝ.", "disclosure_money": "Έρευνα σε εκθέσεις εταιρειών, επίσημες στατιστικές και αξιόπιστο Τύπο με εργαλεία ΤΝ· κάθε στοιχείο ελέγχεται σε τουλάχιστον δύο πηγές και το ελέγχει ένα δεύτερο μοντέλο ΤΝ. Αφήγηση: φωνή ΤΝ. Δεν αποτελεί οικονομική συμβουλή.", "disclosure_psychology": "Έρευνα σε δημοσιευμένες μελέτες και αξιόπιστη επιστημονική δημοσιογραφία με εργαλεία ΤΝ· κάθε στοιχείο ελέγχεται σε τουλάχιστον δύο πηγές και το ελέγχει ένα δεύτερο μοντέλο ΤΝ. Αφήγηση: φωνή ΤΝ. Εκπαιδευτικό περιεχόμενο, όχι ιατρική συμβουλή."},
    de: {"disclosure_how": "Recherchiert aus technischen und offiziellen Quellen mit KI-Werkzeugen; jede Angabe wird an mindestens zwei Quellen geprüft und von einem zweiten KI-Modell kontrolliert. Sprecher: KI-Stimme.", "disclosure_money": "Recherchiert aus Geschäftsberichten, amtlichen Statistiken und seriöser Presse mit KI-Werkzeugen; jede Angabe wird an mindestens zwei Quellen geprüft und von einem zweiten KI-Modell kontrolliert. Sprecher: KI-Stimme. Keine Finanzberatung.", "disclosure_psychology": "Recherchiert aus veröffentlichten Studien und seriösem Wissenschaftsjournalismus mit KI-Werkzeugen; jede Angabe wird an mindestens zwei Quellen geprüft und von einem zweiten KI-Modell kontrolliert. Sprecher: KI-Stimme. Bildungsinhalt, keine medizinische Beratung."},
    fr: {"disclosure_how": "Recherches dans des sources techniques et officielles avec des outils d'IA ; chaque fait est vérifié avec au moins deux sources et relu par un second modèle d'IA. Narration : voix d'IA.", "disclosure_money": "Recherches dans des rapports d'entreprises, des statistiques officielles et une presse fiable avec des outils d'IA ; chaque fait est vérifié avec au moins deux sources et relu par un second modèle d'IA. Narration : voix d'IA. Ceci n'est pas un conseil financier.", "disclosure_psychology": "Recherches dans des études publiées et un journalisme scientifique fiable avec des outils d'IA ; chaque fait est vérifié avec au moins deux sources et relu par un second modèle d'IA. Narration : voix d'IA. Contenu éducatif, pas un avis médical."},
    pt: {"disclosure_how": "Pesquisado em fontes técnicas e oficiais com ferramentas de IA; cada fato é conferido em pelo menos duas fontes e revisado por um segundo modelo de IA. Narração: voz de IA.", "disclosure_money": "Pesquisado em relatórios de empresas, estatísticas oficiais e imprensa confiável com ferramentas de IA; cada fato é conferido em pelo menos duas fontes e revisado por um segundo modelo de IA. Narração: voz de IA. Não é recomendação financeira.", "disclosure_psychology": "Pesquisado em estudos publicados e jornalismo científico confiável com ferramentas de IA; cada fato é conferido em pelo menos duas fontes e revisado por um segundo modelo de IA. Narração: voz de IA. Conteúdo educativo, não é orientação médica."},
    it: {"disclosure_how": "Ricerche su fonti tecniche e ufficiali con strumenti di IA; ogni fatto è controllato con almeno due fonti e rivisto da un secondo modello di IA. Narrazione: voce IA.", "disclosure_money": "Ricerche su bilanci aziendali, statistiche ufficiali e stampa affidabile con strumenti di IA; ogni fatto è controllato con almeno due fonti e rivisto da un secondo modello di IA. Narrazione: voce IA. Non è una consulenza finanziaria.", "disclosure_psychology": "Ricerche su studi pubblicati e divulgazione scientifica affidabile con strumenti di IA; ogni fatto è controllato con almeno due fonti e rivisto da un secondo modello di IA. Narrazione: voce IA. Contenuto educativo, non è un consiglio medico."}
  };
  for (var cl in CHANNEL_WORDS) for (var ck in CHANNEL_WORDS[cl]) T[cl][ck] = CHANNEL_WORDS[cl][ck];
  // Story Snake, Symbol Sudoku, Story Memory (Mike, 2026-11-13; games.js)
  var GAME_WORDS = {
    en: {"theme": "Theme", "g_snake": "Story Snake", "g_snake_d": "Steer the snake to the right answer. A, B or C?", "g_sudoku": "Symbol Sudoku", "g_sudoku_d": "Each symbol once in every row, column and box.", "g_memory": "Story Memory", "g_memory_d": "Find the pairs of story pictures.", "video_rule": "Every 10 right moves open a story video. You start it yourself with play: videos never start on their own, and watching gives no points.", "next_video": "{n} / 10 to the next story video", "rw_toast": "10 right! Here is a story for you. Tap play to watch.", "lives": "Lives", "your_score": "Right answers: {n}", "tap_start": "Tap to start", "paused": "Paused · tap to continue", "game_over": "Game over", "new_board": "New board", "solved": "Solved!", "pick_cell": "Tap an empty square, then a symbol.", "matched": "Pair found: {t}", "dir_up": "Up", "dir_down": "Down", "dir_left": "Left", "dir_right": "Right"},
    es: {"theme": "Tema", "g_snake": "La serpiente de las historias", "g_snake_d": "Lleva la serpiente a la respuesta correcta. ¿A, B o C?", "g_sudoku": "Sudoku de símbolos", "g_sudoku_d": "Cada símbolo una vez en cada fila, columna y cuadro.", "g_memory": "Memoria de historias", "g_memory_d": "Encuentra las parejas de imágenes de las historias.", "video_rule": "Cada 10 aciertos se abre el vídeo de una historia. Lo inicias tú con el botón de play: los vídeos nunca empiezan solos y verlos no da puntos.", "next_video": "{n} / 10 para el próximo vídeo", "rw_toast": "¡10 aciertos! Aquí tienes una historia. Pulsa play para verla.", "lives": "Vidas", "your_score": "Aciertos: {n}", "tap_start": "Toca para empezar", "paused": "En pausa · toca para seguir", "game_over": "Fin del juego", "new_board": "Nuevo tablero", "solved": "¡Resuelto!", "pick_cell": "Toca una casilla vacía y luego un símbolo.", "matched": "Pareja encontrada: {t}", "dir_up": "Arriba", "dir_down": "Abajo", "dir_left": "Izquierda", "dir_right": "Derecha"},
    el: {"theme": "Θέμα", "g_snake": "Το φίδι των ιστοριών", "g_snake_d": "Οδήγησε το φίδι στη σωστή απάντηση. A, B ή C;", "g_sudoku": "Σουντόκου με σύμβολα", "g_sudoku_d": "Κάθε σύμβολο μία φορά σε κάθε γραμμή, στήλη και κουτί.", "g_memory": "Μνήμη ιστοριών", "g_memory_d": "Βρες τα ζευγάρια με τις εικόνες των ιστοριών.", "video_rule": "Κάθε 10 σωστές κινήσεις ανοίγει ένα βίντεο ιστορίας. Το ξεκινάς εσύ με το play: τα βίντεο δεν ξεκινούν ποτέ μόνα τους και η προβολή δεν δίνει πόντους.", "next_video": "{n} / 10 για το επόμενο βίντεο", "rw_toast": "10 σωστά! Ορίστε μια ιστορία για σένα. Πάτα play για να τη δεις.", "lives": "Ζωές", "your_score": "Σωστές απαντήσεις: {n}", "tap_start": "Πάτα για να ξεκινήσεις", "paused": "Σε παύση · πάτα για να συνεχίσεις", "game_over": "Τέλος παιχνιδιού", "new_board": "Νέος πίνακας", "solved": "Λύθηκε!", "pick_cell": "Πάτα ένα άδειο τετράγωνο και μετά ένα σύμβολο.", "matched": "Βρέθηκε ζευγάρι: {t}", "dir_up": "Πάνω", "dir_down": "Κάτω", "dir_left": "Αριστερά", "dir_right": "Δεξιά"},
    de: {"theme": "Thema", "g_snake": "Geschichten-Schlange", "g_snake_d": "Steuere die Schlange zur richtigen Antwort. A, B oder C?", "g_sudoku": "Symbol-Sudoku", "g_sudoku_d": "Jedes Symbol einmal in jeder Zeile, Spalte und jedem Kasten.", "g_memory": "Geschichten-Memory", "g_memory_d": "Finde die Bildpaare der Geschichten.", "video_rule": "Alle 10 richtigen Züge öffnet sich ein Geschichtsvideo. Du startest es selbst mit Play: Videos starten nie von allein, und Zuschauen bringt keine Punkte.", "next_video": "{n} / 10 bis zum nächsten Video", "rw_toast": "10 richtig! Hier ist eine Geschichte für dich. Tippe auf Play, um sie anzusehen.", "lives": "Leben", "your_score": "Richtige Antworten: {n}", "tap_start": "Zum Starten tippen", "paused": "Pause · zum Weiterspielen tippen", "game_over": "Spiel vorbei", "new_board": "Neues Feld", "solved": "Gelöst!", "pick_cell": "Tippe auf ein leeres Feld, dann auf ein Symbol.", "matched": "Paar gefunden: {t}", "dir_up": "Hoch", "dir_down": "Runter", "dir_left": "Links", "dir_right": "Rechts"},
    fr: {"theme": "Thème", "g_snake": "Le serpent des histoires", "g_snake_d": "Guidez le serpent vers la bonne réponse. A, B ou C ?", "g_sudoku": "Sudoku des symboles", "g_sudoku_d": "Chaque symbole une fois par ligne, colonne et carré.", "g_memory": "Mémoire des histoires", "g_memory_d": "Retrouvez les paires d'images des histoires.", "video_rule": "Toutes les 10 bonnes réponses, une vidéo d'histoire s'ouvre. C'est vous qui la lancez avec lecture : les vidéos ne démarrent jamais seules, et les regarder ne rapporte aucun point.", "next_video": "{n} / 10 avant la prochaine vidéo", "rw_toast": "10 bonnes réponses ! Voici une histoire pour vous. Touchez lecture pour la regarder.", "lives": "Vies", "your_score": "Bonnes réponses : {n}", "tap_start": "Touchez pour commencer", "paused": "En pause · touchez pour continuer", "game_over": "Partie terminée", "new_board": "Nouvelle grille", "solved": "Résolu !", "pick_cell": "Touchez une case vide, puis un symbole.", "matched": "Paire trouvée : {t}", "dir_up": "Haut", "dir_down": "Bas", "dir_left": "Gauche", "dir_right": "Droite"},
    pt: {"theme": "Tema", "g_snake": "A cobra das histórias", "g_snake_d": "Leve a cobra até a resposta certa. A, B ou C?", "g_sudoku": "Sudoku de símbolos", "g_sudoku_d": "Cada símbolo uma vez em cada linha, coluna e quadrado.", "g_memory": "Memória de histórias", "g_memory_d": "Encontre os pares de imagens das histórias.", "video_rule": "A cada 10 acertos abre um vídeo de história. Você mesmo dá o play: os vídeos nunca começam sozinhos, e assistir não dá pontos.", "next_video": "{n} / 10 para o próximo vídeo", "rw_toast": "10 acertos! Aqui está uma história para você. Toque em play para assistir.", "lives": "Vidas", "your_score": "Acertos: {n}", "tap_start": "Toque para começar", "paused": "Pausado · toque para continuar", "game_over": "Fim de jogo", "new_board": "Novo tabuleiro", "solved": "Resolvido!", "pick_cell": "Toque num quadrado vazio e depois num símbolo.", "matched": "Par encontrado: {t}", "dir_up": "Cima", "dir_down": "Baixo", "dir_left": "Esquerda", "dir_right": "Direita"},
    it: {"theme": "Tema", "g_snake": "Il serpente delle storie", "g_snake_d": "Guida il serpente verso la risposta giusta. A, B o C?", "g_sudoku": "Sudoku dei simboli", "g_sudoku_d": "Ogni simbolo una volta in ogni riga, colonna e riquadro.", "g_memory": "Memory delle storie", "g_memory_d": "Trova le coppie di immagini delle storie.", "video_rule": "Ogni 10 mosse giuste si apre il video di una storia. Lo avvii tu con play: i video non partono mai da soli e guardarli non dà punti.", "next_video": "{n} / 10 al prossimo video", "rw_toast": "10 giuste! Ecco una storia per te. Tocca play per guardarla.", "lives": "Vite", "your_score": "Risposte giuste: {n}", "tap_start": "Tocca per iniziare", "paused": "In pausa · tocca per continuare", "game_over": "Fine partita", "new_board": "Nuova griglia", "solved": "Risolto!", "pick_cell": "Tocca una casella vuota, poi un simbolo.", "matched": "Coppia trovata: {t}", "dir_up": "Su", "dir_down": "Giù", "dir_left": "Sinistra", "dir_right": "Destra"}
  };
  for (var gl in GAME_WORDS) for (var gk in GAME_WORDS[gl]) T[gl][gk] = GAME_WORDS[gl][gk];
  var TRAP_WORDS = {   // Hidden Traps (2026-11-13)
    en: {"g_traps": "Hidden Traps", "g_traps_d": "Open the safe squares. Each number tells how many traps touch it.", "traps_hint": "Tap a square to open it. Choose Mark (or press and hold) to flag a trap.", "traps_left": "Traps: {n}", "safe_moves": "Safe moves: {n}", "mode_open": "Open", "mode_mark": "Mark", "trap_hit": "You opened a trap. Try a new board!", "board_clear": "Board cleared! You found all the traps."},
    es: {"g_traps": "Trampas ocultas", "g_traps_d": "Abre las casillas seguras. Cada número dice cuántas trampas la tocan.", "traps_hint": "Toca una casilla para abrirla. Elige Marcar (o mantén pulsado) para señalar una trampa.", "traps_left": "Trampas: {n}", "safe_moves": "Jugadas seguras: {n}", "mode_open": "Abrir", "mode_mark": "Marcar", "trap_hit": "Abriste una trampa. ¡Prueba un tablero nuevo!", "board_clear": "¡Tablero despejado! Encontraste todas las trampas."},
    el: {"g_traps": "Κρυμμένες παγίδες", "g_traps_d": "Άνοιξε τα ασφαλή τετράγωνα. Κάθε αριθμός λέει πόσες παγίδες το αγγίζουν.", "traps_hint": "Πάτα ένα τετράγωνο για να το ανοίξεις. Διάλεξε Σημάδι (ή κράτα πατημένο) για να σημαδέψεις μια παγίδα.", "traps_left": "Παγίδες: {n}", "safe_moves": "Ασφαλείς κινήσεις: {n}", "mode_open": "Άνοιγμα", "mode_mark": "Σημάδι", "trap_hit": "Άνοιξες μια παγίδα. Δοκίμασε νέο πίνακα!", "board_clear": "Ο πίνακας καθάρισε! Βρήκες όλες τις παγίδες."},
    de: {"g_traps": "Versteckte Fallen", "g_traps_d": "Öffne die sicheren Felder. Jede Zahl sagt, wie viele Fallen das Feld berühren.", "traps_hint": "Tippe auf ein Feld, um es zu öffnen. Wähle Markieren (oder halte gedrückt), um eine Falle zu markieren.", "traps_left": "Fallen: {n}", "safe_moves": "Sichere Züge: {n}", "mode_open": "Öffnen", "mode_mark": "Markieren", "trap_hit": "Du hast eine Falle geöffnet. Versuch ein neues Feld!", "board_clear": "Geschafft! Du hast alle Fallen gefunden."},
    fr: {"g_traps": "Pièges cachés", "g_traps_d": "Ouvrez les cases sûres. Chaque nombre indique combien de pièges touchent la case.", "traps_hint": "Touchez une case pour l'ouvrir. Choisissez Marquer (ou appuyez longuement) pour signaler un piège.", "traps_left": "Pièges : {n}", "safe_moves": "Coups sûrs : {n}", "mode_open": "Ouvrir", "mode_mark": "Marquer", "trap_hit": "Vous avez ouvert un piège. Essayez une nouvelle grille !", "board_clear": "Grille terminée ! Vous avez trouvé tous les pièges."},
    pt: {"g_traps": "Armadilhas escondidas", "g_traps_d": "Abra os quadrados seguros. Cada número diz quantas armadilhas tocam o quadrado.", "traps_hint": "Toque num quadrado para abri-lo. Escolha Marcar (ou segure) para marcar uma armadilha.", "traps_left": "Armadilhas: {n}", "safe_moves": "Jogadas seguras: {n}", "mode_open": "Abrir", "mode_mark": "Marcar", "trap_hit": "Você abriu uma armadilha. Tente um novo tabuleiro!", "board_clear": "Tabuleiro limpo! Você achou todas as armadilhas."},
    it: {"g_traps": "Trappole nascoste", "g_traps_d": "Apri le caselle sicure. Ogni numero dice quante trappole toccano la casella.", "traps_hint": "Tocca una casella per aprirla. Scegli Segna (o tieni premuto) per segnare una trappola.", "traps_left": "Trappole: {n}", "safe_moves": "Mosse sicure: {n}", "mode_open": "Apri", "mode_mark": "Segna", "trap_hit": "Hai aperto una trappola. Prova una nuova griglia!", "board_clear": "Griglia completata! Hai trovato tutte le trappole."}
  };
  for (var tl in TRAP_WORDS) for (var tk in TRAP_WORDS[tl]) T[tl][tk] = TRAP_WORDS[tl][tk];
  var GAME2_WORDS = {   // levels, scores, read-aloud, story videos (2026-11-13)
    en: {"level": "Level", "lvl_easy": "Easy", "lvl_medium": "Medium", "lvl_hard": "Hard", "lvl_vhard": "Very hard", "sd_goal": "Solve the board to open a story video", "mistakes": "Mistakes: {n}", "rw_solved": "Solved! Here is a story for you. Tap play to watch.", "listen": "Listen", "auto_read": "Read each question aloud", "reading": "Listening… tap to continue", "snake_hint": "Swipe on the board or use the arrows.", "next_video5": "{n} / 5 to the next story video", "rw_toast5": "5 right! Here is a story for you. Tap play to watch.", "mem_goal": "Find all the pairs to rebuild the picture and open its story", "score": "Score: {n}", "best": "Best: {n}", "lvl_n": "Level {n}", "next_level": "Next level", "new_game": "New game", "mem_done": "Picture complete! {t}", "rw_picture": "Picture complete! Here is its story. Tap play to watch.", "combo": "Combo ×{n}", "tr_goal": "Clear the board to uncover the story picture and open its video", "watch_anyway": "Watch the story anyway", "try_again": "Try again", "rw_traps": "Board cleared! Here is the story under it. Tap play to watch.", "like_yt": "Like it on YouTube", "video_rule": "Finish a board, or get 5 snake answers right, to open a story video. You start it yourself with play: videos never start on their own, and watching or liking gives no points.", "g_snake_d": "Steer the snake to the right answer. You can listen to the question.", "g_sudoku_d": "Four levels, from 4×4 to 9×9.", "g_memory_d": "Rebuild a story picture pair by pair. Levels get harder.", "g_traps_d": "Uncover a hidden story picture. Watch out for traps!"},
    es: {"level": "Nivel", "lvl_easy": "Fácil", "lvl_medium": "Medio", "lvl_hard": "Difícil", "lvl_vhard": "Muy difícil", "sd_goal": "Resuelve el tablero para abrir el vídeo de una historia", "mistakes": "Errores: {n}", "rw_solved": "¡Resuelto! Aquí tienes una historia. Pulsa play para verla.", "listen": "Escuchar", "auto_read": "Leer cada pregunta en voz alta", "reading": "Escuchando… toca para seguir", "snake_hint": "Desliza sobre el tablero o usa las flechas.", "next_video5": "{n} / 5 para el próximo vídeo", "rw_toast5": "¡5 aciertos! Aquí tienes una historia. Pulsa play para verla.", "mem_goal": "Encuentra todas las parejas para rehacer la imagen y abrir su historia", "score": "Puntos: {n}", "best": "Récord: {n}", "lvl_n": "Nivel {n}", "next_level": "Siguiente nivel", "new_game": "Nueva partida", "mem_done": "¡Imagen completa! {t}", "rw_picture": "¡Imagen completa! Aquí tienes su historia. Pulsa play para verla.", "combo": "Racha ×{n}", "tr_goal": "Despeja el tablero para descubrir la imagen de la historia y abrir su vídeo", "watch_anyway": "Ver la historia igualmente", "try_again": "Intentarlo otra vez", "rw_traps": "¡Tablero despejado! Aquí está la historia que escondía. Pulsa play para verla.", "like_yt": "Dale me gusta en YouTube", "video_rule": "Termina un tablero, o acierta 5 respuestas en la serpiente, para abrir el vídeo de una historia. Lo inicias tú con play: los vídeos nunca empiezan solos, y verlos o darles me gusta no da puntos.", "g_snake_d": "Lleva la serpiente a la respuesta correcta. Puedes escuchar la pregunta.", "g_sudoku_d": "Cuatro niveles, de 4×4 a 9×9.", "g_memory_d": "Rehaz la imagen de una historia pareja a pareja. Los niveles van subiendo.", "g_traps_d": "Descubre la imagen escondida de una historia. ¡Cuidado con las trampas!"},
    el: {"level": "Επίπεδο", "lvl_easy": "Εύκολο", "lvl_medium": "Μέτριο", "lvl_hard": "Δύσκολο", "lvl_vhard": "Πολύ δύσκολο", "sd_goal": "Λύσε τον πίνακα για να ανοίξει το βίντεο μιας ιστορίας", "mistakes": "Λάθη: {n}", "rw_solved": "Λύθηκε! Ορίστε μια ιστορία για σένα. Πάτα play για να τη δεις.", "listen": "Άκουσε", "auto_read": "Διάβαζε κάθε ερώτηση φωναχτά", "reading": "Ακούς… πάτα για να συνεχίσεις", "snake_hint": "Σύρε το δάχτυλο στον πίνακα ή χρησιμοποίησε τα βέλη.", "next_video5": "{n} / 5 για το επόμενο βίντεο", "rw_toast5": "5 σωστά! Ορίστε μια ιστορία για σένα. Πάτα play για να τη δεις.", "mem_goal": "Βρες όλα τα ζευγάρια για να ξαναφτιάξεις την εικόνα και να ανοίξει η ιστορία της", "score": "Πόντοι: {n}", "best": "Ρεκόρ: {n}", "lvl_n": "Επίπεδο {n}", "next_level": "Επόμενο επίπεδο", "new_game": "Νέο παιχνίδι", "mem_done": "Η εικόνα ολοκληρώθηκε! {t}", "rw_picture": "Η εικόνα ολοκληρώθηκε! Ορίστε η ιστορία της. Πάτα play για να τη δεις.", "combo": "Σερί ×{n}", "tr_goal": "Καθάρισε τον πίνακα για να αποκαλύψεις την εικόνα της ιστορίας και να ανοίξει το βίντεό της", "watch_anyway": "Δες την ιστορία ούτως ή άλλως", "try_again": "Ξαναπροσπάθησε", "rw_traps": "Ο πίνακας καθάρισε! Ορίστε η ιστορία που έκρυβε. Πάτα play για να τη δεις.", "like_yt": "Κάνε like στο YouTube", "video_rule": "Τελείωσε έναν πίνακα, ή απάντησε σωστά 5 φορές στο φίδι, για να ανοίξει το βίντεο μιας ιστορίας. Το ξεκινάς εσύ με το play: τα βίντεο δεν ξεκινούν ποτέ μόνα τους, και η προβολή ή το like δεν δίνουν πόντους.", "g_snake_d": "Οδήγησε το φίδι στη σωστή απάντηση. Μπορείς να ακούσεις την ερώτηση.", "g_sudoku_d": "Τέσσερα επίπεδα, από 4×4 έως 9×9.", "g_memory_d": "Ξαναφτιάξε την εικόνα μιας ιστορίας ζευγάρι-ζευγάρι. Τα επίπεδα δυσκολεύουν.", "g_traps_d": "Αποκάλυψε την κρυμμένη εικόνα μιας ιστορίας. Πρόσεχε τις παγίδες!"},
    de: {"level": "Stufe", "lvl_easy": "Leicht", "lvl_medium": "Mittel", "lvl_hard": "Schwer", "lvl_vhard": "Sehr schwer", "sd_goal": "Löse das Feld, um ein Geschichtsvideo zu öffnen", "mistakes": "Fehler: {n}", "rw_solved": "Gelöst! Hier ist eine Geschichte für dich. Tippe auf Play, um sie anzusehen.", "listen": "Anhören", "auto_read": "Jede Frage vorlesen", "reading": "Wird vorgelesen… zum Weiterspielen tippen", "snake_hint": "Wische über das Feld oder nutze die Pfeile.", "next_video5": "{n} / 5 bis zum nächsten Video", "rw_toast5": "5 richtig! Hier ist eine Geschichte für dich. Tippe auf Play, um sie anzusehen.", "mem_goal": "Finde alle Paare, um das Bild zusammenzusetzen und seine Geschichte zu öffnen", "score": "Punkte: {n}", "best": "Rekord: {n}", "lvl_n": "Stufe {n}", "next_level": "Nächste Stufe", "new_game": "Neues Spiel", "mem_done": "Bild komplett! {t}", "rw_picture": "Bild komplett! Hier ist seine Geschichte. Tippe auf Play, um sie anzusehen.", "combo": "Serie ×{n}", "tr_goal": "Räume das Feld frei, um das Bild der Geschichte aufzudecken und ihr Video zu öffnen", "watch_anyway": "Geschichte trotzdem ansehen", "try_again": "Nochmal versuchen", "rw_traps": "Feld geschafft! Hier ist die Geschichte darunter. Tippe auf Play, um sie anzusehen.", "like_yt": "Auf YouTube liken", "video_rule": "Löse ein Feld oder beantworte in der Schlange 5 Fragen richtig, dann öffnet sich ein Geschichtsvideo. Du startest es selbst mit Play: Videos starten nie von allein, und Zuschauen oder Liken bringt keine Punkte.", "g_snake_d": "Steuere die Schlange zur richtigen Antwort. Du kannst dir die Frage vorlesen lassen.", "g_sudoku_d": "Vier Stufen, von 4×4 bis 9×9.", "g_memory_d": "Setze das Bild einer Geschichte Paar für Paar zusammen. Die Stufen werden schwerer.", "g_traps_d": "Decke das versteckte Bild einer Geschichte auf. Vorsicht vor Fallen!"},
    fr: {"level": "Niveau", "lvl_easy": "Facile", "lvl_medium": "Moyen", "lvl_hard": "Difficile", "lvl_vhard": "Très difficile", "sd_goal": "Résolvez la grille pour ouvrir la vidéo d'une histoire", "mistakes": "Erreurs : {n}", "rw_solved": "Résolu ! Voici une histoire pour vous. Touchez lecture pour la regarder.", "listen": "Écouter", "auto_read": "Lire chaque question à voix haute", "reading": "Lecture en cours… touchez pour continuer", "snake_hint": "Glissez sur la grille ou utilisez les flèches.", "next_video5": "{n} / 5 avant la prochaine vidéo", "rw_toast5": "5 bonnes réponses ! Voici une histoire pour vous. Touchez lecture pour la regarder.", "mem_goal": "Trouvez toutes les paires pour reconstituer l'image et ouvrir son histoire", "score": "Score : {n}", "best": "Record : {n}", "lvl_n": "Niveau {n}", "next_level": "Niveau suivant", "new_game": "Nouvelle partie", "mem_done": "Image complète ! {t}", "rw_picture": "Image complète ! Voici son histoire. Touchez lecture pour la regarder.", "combo": "Série ×{n}", "tr_goal": "Dégagez la grille pour découvrir l'image de l'histoire et ouvrir sa vidéo", "watch_anyway": "Voir l'histoire quand même", "try_again": "Réessayer", "rw_traps": "Grille dégagée ! Voici l'histoire cachée dessous. Touchez lecture pour la regarder.", "like_yt": "Aimer sur YouTube", "video_rule": "Terminez une grille, ou trouvez 5 bonnes réponses avec le serpent, pour ouvrir la vidéo d'une histoire. C'est vous qui la lancez avec lecture : les vidéos ne démarrent jamais seules, et regarder ou aimer ne rapporte aucun point.", "g_snake_d": "Guidez le serpent vers la bonne réponse. Vous pouvez écouter la question.", "g_sudoku_d": "Quatre niveaux, de 4×4 à 9×9.", "g_memory_d": "Reconstituez l'image d'une histoire paire par paire. Les niveaux montent.", "g_traps_d": "Découvrez l'image cachée d'une histoire. Attention aux pièges !"},
    pt: {"level": "Nível", "lvl_easy": "Fácil", "lvl_medium": "Médio", "lvl_hard": "Difícil", "lvl_vhard": "Muito difícil", "sd_goal": "Resolva o tabuleiro para abrir o vídeo de uma história", "mistakes": "Erros: {n}", "rw_solved": "Resolvido! Aqui está uma história para você. Toque em play para assistir.", "listen": "Ouvir", "auto_read": "Ler cada pergunta em voz alta", "reading": "Ouvindo… toque para continuar", "snake_hint": "Deslize no tabuleiro ou use as setas.", "next_video5": "{n} / 5 para o próximo vídeo", "rw_toast5": "5 acertos! Aqui está uma história para você. Toque em play para assistir.", "mem_goal": "Ache todos os pares para remontar a imagem e abrir a história dela", "score": "Pontos: {n}", "best": "Recorde: {n}", "lvl_n": "Nível {n}", "next_level": "Próximo nível", "new_game": "Novo jogo", "mem_done": "Imagem completa! {t}", "rw_picture": "Imagem completa! Aqui está a história dela. Toque em play para assistir.", "combo": "Sequência ×{n}", "tr_goal": "Limpe o tabuleiro para revelar a imagem da história e abrir o vídeo", "watch_anyway": "Ver a história mesmo assim", "try_again": "Tentar de novo", "rw_traps": "Tabuleiro limpo! Aqui está a história escondida. Toque em play para assistir.", "like_yt": "Curtir no YouTube", "video_rule": "Termine um tabuleiro, ou acerte 5 respostas na cobra, para abrir o vídeo de uma história. Você mesmo dá o play: os vídeos nunca começam sozinhos, e assistir ou curtir não dá pontos.", "g_snake_d": "Leve a cobra até a resposta certa. Você pode ouvir a pergunta.", "g_sudoku_d": "Quatro níveis, de 4×4 a 9×9.", "g_memory_d": "Remonte a imagem de uma história par por par. Os níveis vão ficando difíceis.", "g_traps_d": "Revele a imagem escondida de uma história. Cuidado com as armadilhas!"},
    it: {"level": "Livello", "lvl_easy": "Facile", "lvl_medium": "Medio", "lvl_hard": "Difficile", "lvl_vhard": "Molto difficile", "sd_goal": "Risolvi la griglia per aprire il video di una storia", "mistakes": "Errori: {n}", "rw_solved": "Risolto! Ecco una storia per te. Tocca play per guardarla.", "listen": "Ascolta", "auto_read": "Leggi ogni domanda ad alta voce", "reading": "In ascolto… tocca per continuare", "snake_hint": "Scorri sulla griglia o usa le frecce.", "next_video5": "{n} / 5 al prossimo video", "rw_toast5": "5 giuste! Ecco una storia per te. Tocca play per guardarla.", "mem_goal": "Trova tutte le coppie per ricomporre l'immagine e aprire la sua storia", "score": "Punti: {n}", "best": "Record: {n}", "lvl_n": "Livello {n}", "next_level": "Livello successivo", "new_game": "Nuova partita", "mem_done": "Immagine completa! {t}", "rw_picture": "Immagine completa! Ecco la sua storia. Tocca play per guardarla.", "combo": "Serie ×{n}", "tr_goal": "Libera la griglia per scoprire l'immagine della storia e aprire il suo video", "watch_anyway": "Guarda comunque la storia", "try_again": "Riprova", "rw_traps": "Griglia libera! Ecco la storia nascosta sotto. Tocca play per guardarla.", "like_yt": "Metti mi piace su YouTube", "video_rule": "Completa una griglia, o rispondi giusto 5 volte con il serpente, per aprire il video di una storia. Lo avvii tu con play: i video non partono mai da soli, e guardarli o mettere mi piace non dà punti.", "g_snake_d": "Guida il serpente verso la risposta giusta. Puoi ascoltare la domanda.", "g_sudoku_d": "Quattro livelli, da 4×4 a 9×9.", "g_memory_d": "Ricomponi l'immagine di una storia coppia dopo coppia. I livelli diventano più difficili.", "g_traps_d": "Scopri l'immagine nascosta di una storia. Attenzione alle trappole!"}
  };
  for (var g2l in GAME2_WORDS) for (var g2k in GAME2_WORDS[g2l]) T[g2l][g2k] = GAME2_WORDS[g2l][g2k];
  var LEVELS = [0, 40, 100, 180, 300, 450, 650, 900];
  // Badges, from easy to hard. Ids never change (players already have them). Every rule comes from what is already
  // kept (answers, done, passport, bestRun, perfect, poly, points): no new saved fields.
  var BADGES = ["first_q", "first_stamp", "poly", "time", "explorer", "sharp", "perfect", "five", "nav",
                "continents", "ten_q", "right8", "pairs10", "europe", "time3", "nav12", "level4"];
  // Country -> continent, for the "Three continents" and "European tour" badges. A country not listed here still
  // counts as a stamp, only not for these two: add it when a story happens somewhere new.
  var CONTINENT = {};
  (function (m) { for (var k in m) m[k].split(" ").forEach(function (c) { CONTINENT[c] = k; }); })({
    eu: "AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FR GB GR HR HU IE IS IT LT LU LV MD ME MK MT NL NO PL PT RO RS RU SE SI SK UA VA",
    as: "AE AF AM AZ BD CN GE ID IL IN IQ IR JO JP KH KR KZ LB LK MM MN MY NP PH PK PS SA SG SY TH TR TW UZ VN YE",
    af: "AO CD CM DZ EG ET GH KE LY MA ML NG SD SN TN TZ UG ZA ZM ZW",
    na: "CA CR CU DO GT HN HT JM MX NI PA US",
    sa: "AR BO BR CL CO EC PE PY UY VE",
    oc: "AU FJ NZ PG"
  });
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
      if (msgs.length) toast(msgs.join(" · "), msgs.icon);
      paintLevel();
      return p;
    },
    clear: function () { try { localStorage.removeItem("os-progress"); } catch (e) { /* nothing saved */ } }
  };
  // every badge as [how far, how much is needed]; earned when the first reaches the second
  function badgeCounts(p) {
    var codes = Object.keys(passport.get()), keys = Object.keys(p.done || {}), ans = p.answers || {};
    function starts(pre) { return keys.filter(function (k) { return k.indexOf(pre) === 0; }).length; }
    var answered = Object.keys(ans).length, right = Object.keys(ans).filter(function (k) { return ans[k] === "right"; }).length;
    var conts = {}, europe = 0;
    codes.forEach(function (c) { if (CONTINENT[c]) conts[CONTINENT[c]] = 1; if (CONTINENT[c] === "eu") europe++; });
    // the game hub keeps its marks in "done" (0 points) so they merge across devices like everything else
    var games = ["older", "timeline", "where"].filter(function (g) { return keys.indexOf("g:" + g) >= 0; }).length;
    var t = starts("t:"), w = starts("w:");
    return { first_q: [answered, 1], first_stamp: [codes.length, 1], poly: [p.poly ? 1 : 0, 1], time: [t, 1], explorer: [games, 3],
             sharp: [p.bestRun || 0, 3], perfect: [p.perfect ? 1 : 0, 1], five: [codes.length, 5], nav: [w, 5],
             continents: [Object.keys(conts).length, 3], ten_q: [answered, 10], right8: [right, 8], pairs10: [starts("p:"), 10],
             europe: [europe, 5], time3: [t, 3], nav12: [w, 12], level4: [progress.level(p.points || 0), 4] };
  }
  function checkBadges(p, msgs) {
    var counts = badgeCounts(p);
    BADGES.forEach(function (b) {
      if (counts[b][0] >= counts[b][1] && !p.badges[b]) {
        p.badges[b] = new Date().toISOString().slice(0, 10); msgs.push("\u2605 " + gt(cur(), "b_" + b)[0]);
        if (!msgs.icon) msgs.icon = b;
      }
    });
  }
  // Badge pictures: hand-drawn inline SVG (no image files, so no licences). One medal shape, one emblem each. The
  // colours are CSS variables (app.css, .bsvg): full colour when earned, soft grey when locked. Classes: i = ink line,
  // pi = paper shape with ink line, f = ink shape, r = red shape, ri = red shape with ink line, rs = red line,
  // p = paper shape, ps = paper line.
  var BADGE_ART = {
    first_q: '<path class="pi" d="M15 14h18a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-7l-6 5v-5h-5a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4z"/>' +
      '<path class="rs" d="M21.2 19.6a2.9 2.9 0 1 1 4.4 2.5c-1 .6-1.6 1.1-1.6 2.2"/><circle class="r" cx="24" cy="27.4" r="1.3"/>',
    first_stamp: '<circle class="f" cx="24" cy="15.5" r="4.2"/><path class="f" d="M21.6 17h4.8l1.8 10.5h-8.4z"/>' +
      '<rect class="f" x="13.5" y="26.5" width="21" height="5.5" rx="1.8"/><path class="rs" d="M15 35.6h18"/>',
    poly: '<path class="f" d="M14 12.5h13a3 3 0 0 1 3 3V24a3 3 0 0 1-3 3h-8l-4.5 3.8V27H14a3 3 0 0 1-3-3v-8.5a3 3 0 0 1 3-3z"/>' +
      '<path class="ps" d="M16.8 23.2l3.7-7.4 3.7 7.4M18.2 20.6h4.6"/>' +
      '<path class="pi" d="M23 21.5h11a3 3 0 0 1 3 3V31a3 3 0 0 1-3 3h-.5v3.3L29.5 34H23a3 3 0 0 1-3-3v-6.5a3 3 0 0 1 3-3z"/>' +
      '<circle class="r" cx="24.6" cy="27.8" r="1.3"/><circle class="r" cx="28.5" cy="27.8" r="1.3"/><circle class="r" cx="32.4" cy="27.8" r="1.3"/>',
    time: '<path class="pi" d="M18 13h12v3c0 4-6 5.5-6 8 0 2.5 6 4 6 8v3H18v-3c0-4 6-5.5 6-8 0-2.5-6-4-6-8z"/>' +
      '<path class="r" d="M21 17.5h6c-.9 1.7-2.1 2.7-3 3.4-.9-.7-2.1-1.7-3-3.4zM19.8 33.6c.5-2.3 2.5-3.4 4.2-4.6 1.7 1.2 3.7 2.3 4.2 4.6z"/>' +
      '<path class="i" d="M15.5 13h17M15.5 35h17"/>',
    explorer: '<g transform="rotate(-12 24 24)"><rect class="pi" x="13.5" y="13.5" width="21" height="21" rx="5"/>' +
      '<circle class="f" cx="18.8" cy="18.8" r="2"/><circle class="r" cx="24" cy="24" r="2.2"/><circle class="f" cx="29.2" cy="29.2" r="2"/></g>',
    sharp: '<path class="pi" d="M10.5 24c3.6-6 8.2-9 13.5-9s9.9 3 13.5 9c-3.6 6-8.2 9-13.5 9s-9.9-3-13.5-9z"/>' +
      '<circle class="f" cx="24" cy="24" r="5.6"/><circle class="r" cx="24" cy="24" r="2.6"/><circle class="p" cx="26.3" cy="21.7" r="1.5"/>',
    perfect: '<path class="i" d="M17.5 15.5H13V17a5 5 0 0 0 5 5M30.5 15.5H35V17a5 5 0 0 1-5 5"/>' +
      '<path class="pi" d="M17 12.5h14v8a7 7 0 0 1-14 0z"/><path class="r" d="M24 15.2l1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3z"/>' +
      '<path class="i" d="M24 27.5v4"/><path class="f" d="M18.5 32h11a1.5 1.5 0 0 1 1.5 1.5V36H17v-2.5a1.5 1.5 0 0 1 1.5-1.5z"/>',
    five: '<circle class="pi" cx="24" cy="24" r="11.5"/><path class="i" d="M12.5 24h23M24 12.5c-6 6.5-6 16.5 0 23M24 12.5c6 6.5 6 16.5 0 23"/>' +
      '<circle class="r" cx="29.5" cy="18.5" r="2.3"/>',
    nav: '<circle class="pi" cx="24" cy="24" r="11.5"/><g transform="rotate(38 24 24)"><path class="r" d="M24 14.5l3.6 9.5h-7.2z"/>' +
      '<path class="f" d="M24 33.5l-3.6-9.5h7.2z"/></g><circle class="p" cx="24" cy="24" r="1.4"/>',
    continents: '<path class="pi" d="M11.5 16.5l8.3-3 8.4 3 8.3-3v18l-8.3 3-8.4-3-8.3 3z"/><path class="i" d="M19.8 13.5v18M28.2 16.5v18"/>' +
      '<circle class="r" cx="15.6" cy="22" r="1.9"/><circle class="r" cx="24" cy="26.5" r="1.9"/><circle class="r" cx="32.4" cy="21" r="1.9"/>',
    ten_q: '<path class="pi" d="M24 11.5a8.5 8.5 0 0 0-5.3 15.1c1 .8 1.6 1.8 1.6 3V31h7.4v-1.4c0-1.2.6-2.2 1.6-3A8.5 8.5 0 0 0 24 11.5z"/>' +
      '<path class="rs" d="M21 20.5l3 3 3-3M24 23.5V31"/><path class="i" d="M20.8 34h6.4M22.3 37h3.4"/>',
    right8: '<path class="pi" d="M24 17c-3.2-2.2-7.5-2.8-12-2.2v17c4.5-.6 8.8 0 12 2.2 3.2-2.2 7.5-2.8 12-2.2v-17c-4.5-.6-8.8 0-12 2.2z"/>' +
      '<path class="i" d="M24 17v17"/><path class="i" style="stroke-width:1.6" d="M15 19.6c2.2 0 4.2.4 6 1.2M15 24c2.2 0 4.2.4 6 1.2"/>' +
      '<path class="r" d="M28 15.2c1.5-.4 3-.6 4.6-.7v9.3l-2.3-2-2.3 2z"/>',
    pairs10: '<circle class="pi" cx="21.5" cy="21.5" r="8.5"/><path class="rs" d="M17.6 21.7l2.8 2.8 5-5.5"/>' +
      '<path class="i" style="stroke-width:4.2" d="M28.8 28.8l6 6"/>',
    europe: '<path class="i" d="M19.5 18v-3a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v3"/><rect class="pi" x="11.5" y="18" width="25" height="17" rx="3.5"/>' +
      '<path class="i" d="M16.5 18v17M31.5 18v17"/><path class="r" d="M24 21.3l1.5 3.1 3.4.4-2.5 2.4.6 3.4-3-1.7-3 1.7.6-3.4-2.5-2.4 3.4-.4z"/>',
    time3: '<g transform="translate(0 2.5)"><path class="i" d="M10.5 24h27M34.3 20.3l3.7 3.7-3.7 3.7"/><path class="i" style="stroke-width:1.8" d="M14.5 20v-5M22 20v-7.5M29.5 20v-5"/>' +
      '<circle class="ri" cx="14.5" cy="24" r="3.2"/><circle class="ri" cx="22" cy="24" r="3.2"/><circle class="ri" cx="29.5" cy="24" r="3.2"/></g>',
    nav12: '<path class="i" d="M15 33.5c-2 .7-3.2 1.6-3.2 2.3M33 33.5c2 .7 3.2 1.6 3.2 2.3"/>' +
      '<path class="ri" d="M24 11.5a8.7 8.7 0 0 0-8.7 8.7c0 6.3 8.7 15.3 8.7 15.3s8.7-9 8.7-15.3A8.7 8.7 0 0 0 24 11.5z"/><circle class="p" cx="24" cy="20.2" r="3.4"/>',
    level4: '<path class="pi" d="M11.5 20.5L24 12.5l12.5 8z"/><circle class="r" cx="24" cy="17.3" r="1.6"/>' +
      '<path class="i" style="stroke-width:2.6" d="M16 23.5v8M21.3 23.5v8M26.7 23.5v8M32 23.5v8"/><path class="i" d="M12 35h24"/>'
  };
  function badgeIcon(id) {
    return '<svg class="bsvg" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle class="b-edge" cx="24" cy="24" r="20"/>' +
      '<circle class="b-disc" cx="24" cy="24" r="19.5"/><circle class="b-ring" cx="24" cy="24" r="16.8"/>' + (BADGE_ART[id] || "") + "</svg>";
  }
  function paintLevel() {
    var el = document.getElementById("lvl");
    var p = progress.get(), n = progress.level(p.points);
    if (el) {
      // the level badge means something only to signed-in players (games and questions need sign-in)
      el.hidden = !!(window.OS && OS.cloud && !OS.cloud.user());
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
  function toast(msg, badge) {   // badge: the id of a badge just earned, to show its picture
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    if (badge) el.insertAdjacentHTML("afterbegin", badgeIcon(badge));
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("on"); }, 3200);
  }



  // Links to YouTube open in a new tab, so this site stays open behind them (Mike, 2026-11-12).
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (a && !a.target && /^https?:\/\/([^\/]+\.)?(youtube\.com|youtu\.be)\//.test(a.href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
  }, true);

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
           progress: progress, gt: gt, LEVELS: LEVELS, BADGES: BADGES, badgeCounts: badgeCounts, badgeIcon: badgeIcon, UNLOCKS: UNLOCKS, paintLevel: paintLevel };
})();

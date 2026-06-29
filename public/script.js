import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = document.getElementById("campScene");
const characterStage = document.getElementById("characterStage");
const characterArea = document.querySelector(".camp-character-area");
const campfireStage = document.getElementById("campfireStage");
const hunterProfileStage = document.getElementById("hunterProfileStage");

const replayButton = document.getElementById("replayButton");
const startScreen = document.getElementById("startScreen");
const startTitle = document.getElementById("startTitle");
const startHint = document.getElementById("startHint");

const languageToggle = document.getElementById("languageToggle");
const languageToggleText = document.getElementById("languageToggleText");
const audioToggle = document.getElementById("audioToggle");
const audioToggleIcon = audioToggle?.querySelector("i");

const themePicker = document.getElementById("themePicker");
const themeToggle = document.getElementById("themeToggle");
const themeCurrentLabel = document.getElementById("themeCurrentLabel");
const themeOptions = document.querySelectorAll("[data-theme-option]");

const campMenuTitle = document.getElementById("campMenuTitle");
const campSubmenuLabel = document.getElementById("campSubmenuLabel");
const campSubmenuList = document.getElementById("campSubmenuList");
const campTabsBar = document.getElementById("campTabsBar");
const felyneInteractionHint = document.getElementById("felyneInteractionHint");

const hunterPopup = document.getElementById("hunterPopup");
const hunterPopupClose = document.getElementById("hunterPopupClose");
const hunterPopupKicker = document.getElementById("hunterPopupKicker");
const hunterPopupTitle = document.getElementById("hunterPopupTitle");
const hunterInfoTitle = document.getElementById("hunterInfoTitle");
const hunterInfoDescription = document.getElementById("hunterInfoDescription");
const hunterStatsGrid = document.getElementById("hunterStatsGrid");
const hunterTags = document.getElementById("hunterTags");
const hunterInventoryStrip = document.getElementById("hunterInventoryStrip");
const equipmentSlots = document.querySelectorAll("[data-equipment]");
const campMusicPanel = document.getElementById("campMusicPanel");
const campMusicGrid = document.getElementById("campMusicGrid");
const campMusicClose = document.getElementById("campMusicClose");
const campMusicCounter = document.getElementById("campMusicCounter");
const campMusicCurrent = document.getElementById("campMusicCurrent");
const campMusicPlayerLabel = document.getElementById("campMusicPlayerLabel");
const campMusicPlayerTime = document.getElementById("campMusicPlayerTime");
const campMusicProgress = document.getElementById("campMusicProgress");
const campMusicProgressFill = document.getElementById("campMusicProgressFill");
const campMusicPrev = document.getElementById("campMusicPrev");
const campMusicPlayToggle = document.getElementById("campMusicPlayToggle");
const campMusicPlayIcon = document.getElementById("campMusicPlayIcon");
const campMusicNext = document.getElementById("campMusicNext");

let campTabs = [];
let introStarted = false;
let introFrame = null;
let hasEnteredCamp = false;
let currentRenderedTab = null;


const INTRO_DURATION = 2000;
const TRANSITION_DURATION = 600;
const LANGUAGE_STORAGE_KEY = "hunterPortfolioLanguage";
const THEME_STORAGE_KEY = "hunterPortfolioTheme";
const CAMP_MUSIC_STORAGE_KEY = "hunterPortfolioCampMusic";

const campMusicTracks = [
    {
        key: "felyne_song",
        label: "Felyne Song",
        url: "./public/sounds/songs/felyne_song.mp3",
        icon: "fa-music",
    },
    {
        key: "mh_proof_of_hero",
        label: "Proof of a Hero (original)",
        url: "./public/sounds/songs/MH_proof_of_hero.mp3",
        icon: "fa-music",
    },
    {
        key: "mhf_kokoto",
        label: "MHF Kokoto Village theme",
        url: "./public/sounds/songs/MHF_kokoto.mp3",
        icon: "fa-music",
    },
    {
        key: "mhfu_pokke",
        label: "MHFU Pokke village theme",
        url: "./public/sounds/songs/MHFU_pokke.mp3",
        icon: "fa-music",
    },
    {
        key: "mhw_asteria_night",
        label: "MHW:I Astera Night",
        url: "./public/sounds/songs/MHW_asteria_night.mp3",
        icon: "fa-music",
    },
    {
        key: "mhw_asteria_day",
        label: "MHW:I Astera Day",
        url: "./public/sounds/songs/MHW_asteria_day.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwi_gatheringhub",
        label: "MHW:I Gathering Hub",
        url: "./public/sounds/songs/MHWI_gatheringhub.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwi_proof_of_hero",
        label: "Proof of a Hero (Iceborne)",
        url: "./public/sounds/songs/MHWI_proof_of_hero.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwi_seliana_day",
        label: "Seliana Day",
        url: "./public/sounds/songs/MHWI_Seliana_day.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwi_seliana_night",
        label: "Seliana Night",
        url: "./public/sounds/songs/MHWI_Seliana_night.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwilds_diva_1",
        label: "MH Wilds Diva 1",
        url: "./public/sounds/songs/MHWilds_diva_1.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwilds_diva_2",
        label: "MH Wilds Diva 2",
        url: "./public/sounds/songs/MHWilds_diva_2.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwilds_gathering_day",
        label: "MH Wilds Gathering Day",
        url: "./public/sounds/songs/MHWilds_gathering_day.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwilds_gathering_night",
        label: "MH Wilds Gathering Night",
        url: "./public/sounds/songs/MHWilds_gathering_night.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwilds_proof_of_hero",
        label: "Proof of a Hero (MH Wilds)",
        url: "./public/sounds/songs/MHWilds_proof_of_hero.mp3",
        icon: "fa-music",
    },
    {
        key: "mhwilds_theme",
        label: "MH Wilds Theme",
        url: "./public/sounds/songs/MHWilds_theme.mp3",
        icon: "fa-music",
    },
];

const storedCampMusicKey = localStorage.getItem(CAMP_MUSIC_STORAGE_KEY);
const storedCampMusicTrack = campMusicTracks.find(
    (track) => track.key === storedCampMusicKey
);

const initialRandomCampMusicTrack =
    campMusicTracks[Math.floor(Math.random() * campMusicTracks.length)];

let currentCampMusicKey =
    (storedCampMusicTrack || initialRandomCampMusicTrack || campMusicTracks[0]).key;

let currentCampMusicAudio = null;
let campMusicProgressFrame = null;
let hasAutoStartedCampMusic = false;

const themeData = {
    mhwi: {
        label: "MHW:I",
    },
    mhwilds: {
        label: "MHWilds",
    },
};

let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || "mhwi";

if (!themeData[currentTheme]) {
    currentTheme = "mhwi";
}

const felyneSoundCount = 15;
let currentFelyneSound = null;
let lastFelyneSoundIndex = null;

const AUDIO_STORAGE_KEY = "hunterPortfolioAudioEnabled";
let isAudioEnabled = localStorage.getItem(AUDIO_STORAGE_KEY) !== "false";

const getRandomFelyneSoundIndex = () => {
    let randomIndex = Math.floor(Math.random() * felyneSoundCount) + 1;

    if (felyneSoundCount <= 1) {
        return randomIndex;
    }

    while (randomIndex === lastFelyneSoundIndex) {
        randomIndex = Math.floor(Math.random() * felyneSoundCount) + 1;
    }

    lastFelyneSoundIndex = randomIndex;
    return randomIndex;
};

const playRandomFelyneSound = () => {
    if (!isAudioEnabled) return;

    const soundIndex = getRandomFelyneSoundIndex();
    const soundPath = `./public/sounds/felyne/felyne-${soundIndex}.mp3`;

    if (currentFelyneSound) {
        currentFelyneSound.pause();
        currentFelyneSound.currentTime = 0;
    }

    currentFelyneSound = new Audio(soundPath);
    currentFelyneSound.volume = 0.65;

    currentFelyneSound.play().catch((error) => {
        console.warn("Son Felyne bloqué ou introuvable :", error);
    });
};

const stopCurrentFelyneSound = () => {
    if (!currentFelyneSound) return;

    currentFelyneSound.pause();
    currentFelyneSound.currentTime = 0;
    currentFelyneSound = null;
};

const applyAudioState = () => {
    if (!audioToggle) return;

    audioToggle.classList.toggle("is-muted", !isAudioEnabled);
    audioToggle.setAttribute("aria-pressed", String(!isAudioEnabled));
    audioToggle.setAttribute(
        "aria-label",
        isAudioEnabled ? "Désactiver l'audio" : "Activer l'audio"
    );

    if (!audioToggleIcon) return;

    audioToggleIcon.classList.toggle("fa-volume-high", isAudioEnabled);
    audioToggleIcon.classList.toggle("fa-volume-xmark", !isAudioEnabled);
};

const setAudioEnabled = (enabled) => {
    isAudioEnabled = enabled;

    localStorage.setItem(AUDIO_STORAGE_KEY, String(isAudioEnabled));

    if (!isAudioEnabled) {
        stopCurrentFelyneSound();
        stopCurrentCampMusic();
    }

    applyAudioState();

    if (isAudioEnabled && hasEnteredCamp && !currentCampMusicAudio) {
        hasAutoStartedCampMusic = false;
        startCampMusicOnEntry();
    }
};

const toggleAudio = () => {
    setAudioEnabled(!isAudioEnabled);
};

const CAMP_MUSIC_SLOT_COUNT = 32;

const getCurrentCampMusicTrack = () => {
    return (
        campMusicTracks.find((track) => track.key === currentCampMusicKey) ||
        campMusicTracks[0]
    );
};

const getCurrentCampMusicIndex = () => {
    const index = campMusicTracks.findIndex(
        (track) => track.key === currentCampMusicKey
    );

    return index >= 0 ? index : 0;
};

const getRandomCampMusicTrack = (excludedKey = null) => {
    const availableTracks = campMusicTracks.filter((track) => {
        return track.key !== excludedKey;
    });

    const source = availableTracks.length > 0 ? availableTracks : campMusicTracks;

    return source[Math.floor(Math.random() * source.length)];
};

const playRandomCampMusic = (excludedKey = null) => {
    const randomTrack = getRandomCampMusicTrack(excludedKey);

    if (!randomTrack) return;

    selectCampMusic(randomTrack.key, true);
};

const startCampMusicOnEntry = () => {
    if (!isAudioEnabled) return;
    if (hasAutoStartedCampMusic) return;
    if (currentCampMusicAudio) return;

    hasAutoStartedCampMusic = true;

    const cachedTrack = campMusicTracks.find((track) => {
        return track.key === localStorage.getItem(CAMP_MUSIC_STORAGE_KEY);
    });

    const trackToPlay = cachedTrack || getRandomCampMusicTrack();

    if (!trackToPlay) return;

    selectCampMusic(trackToPlay.key, true);
};

const formatAudioTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const updateCampMusicPlayer = () => {
    const activeTrack = getCurrentCampMusicTrack();
    const audio = currentCampMusicAudio;

    if (campMusicPlayerLabel) {
        campMusicPlayerLabel.textContent = activeTrack.label;
    }

    if (campMusicPlayerTime) {
        const currentTime = audio ? audio.currentTime : 0;
        const duration = audio ? audio.duration : 0;

        campMusicPlayerTime.textContent =
            `${formatAudioTime(currentTime)} / ${formatAudioTime(duration)}`;
    }

    if (campMusicProgressFill) {
        const currentTime = audio ? audio.currentTime : 0;
        const duration = audio ? audio.duration : 0;
        const progress =
            duration && Number.isFinite(duration)
                ? Math.min(100, (currentTime / duration) * 100)
                : 0;

        campMusicProgressFill.style.width = `${progress}%`;
    }

    if (campMusicPlayIcon) {
        const isPlaying = audio && !audio.paused;

        campMusicPlayIcon.classList.toggle("fa-play", !isPlaying);
        campMusicPlayIcon.classList.toggle("fa-pause", isPlaying);
    }
};

const startCampMusicProgressLoop = () => {
    if (campMusicProgressFrame) {
        cancelAnimationFrame(campMusicProgressFrame);
    }

    const tick = () => {
        updateCampMusicPlayer();
        campMusicProgressFrame = requestAnimationFrame(tick);
    };

    tick();
};

const stopCampMusicProgressLoop = () => {
    if (!campMusicProgressFrame) return;

    cancelAnimationFrame(campMusicProgressFrame);
    campMusicProgressFrame = null;
};

const stopCurrentCampMusic = () => {
    if (!currentCampMusicAudio) {
        updateCampMusicPlayer();
        return;
    }

    currentCampMusicAudio.pause();
    currentCampMusicAudio.currentTime = 0;
    currentCampMusicAudio = null;

    stopCampMusicProgressLoop();
    updateCampMusicPlayer();
};

const playCampMusic = (track) => {
    if (!track) return;

    if (!isAudioEnabled) {
        updateCampMusicPlayer();
        return;
    }

    stopCurrentCampMusic();

    currentCampMusicAudio = new Audio(track.url);
    currentCampMusicAudio.volume = 0.42;

    // Important : pas de loop ici.
    // Quand la musique finit, on lance une autre piste random.
    currentCampMusicAudio.loop = false;

    currentCampMusicAudio.addEventListener("loadedmetadata", updateCampMusicPlayer);
    currentCampMusicAudio.addEventListener("timeupdate", updateCampMusicPlayer);

    currentCampMusicAudio.addEventListener("play", () => {
        updateCampMusicPlayer();
        startCampMusicProgressLoop();
    });

    currentCampMusicAudio.addEventListener("pause", () => {
        updateCampMusicPlayer();
    });

    currentCampMusicAudio.addEventListener("ended", () => {
        stopCampMusicProgressLoop();
        playRandomCampMusic(track.key);
    });

    currentCampMusicAudio.play().catch((error) => {
        console.warn("Musique du camp bloquée ou introuvable :", error);
        updateCampMusicPlayer();
    });
};

const selectCampMusic = (trackKey, shouldPlay = true) => {
    const track = campMusicTracks.find((music) => music.key === trackKey);

    if (!track) return;

    currentCampMusicKey = track.key;
    localStorage.setItem(CAMP_MUSIC_STORAGE_KEY, currentCampMusicKey);

    renderCampMusicGrid();
    updateCampMusicHeader();
    updateCampMusicPlayer();

    if (shouldPlay) {
        playCampMusic(track);
    }
};

const updateCampMusicHeader = () => {
    const activeTrack = getCurrentCampMusicTrack();
    const activeIndex = getCurrentCampMusicIndex();

    if (campMusicCounter) {
        campMusicCounter.textContent = `${activeIndex + 1}/${campMusicTracks.length}`;
    }

    if (campMusicCurrent) {
        campMusicCurrent.textContent = activeTrack.label;
    }
};

const renderCampMusicGrid = () => {
    if (!campMusicGrid) return;

    campMusicGrid.innerHTML = "";

    const slotCount = Math.max(CAMP_MUSIC_SLOT_COUNT, campMusicTracks.length);

    for (let index = 0; index < slotCount; index += 1) {
        const track = campMusicTracks[index];

        if (!track) {
            const emptySlot = document.createElement("div");
            emptySlot.className = "camp-music-slot is-empty";
            campMusicGrid.appendChild(emptySlot);
            continue;
        }

        const button = document.createElement("button");

        button.className = "camp-music-slot camp-music-item";
        button.type = "button";
        button.title = track.label;
        button.dataset.musicKey = track.key;

        button.classList.toggle("is-active", track.key === currentCampMusicKey);

        button.innerHTML = `
            <i class="fa-solid ${track.icon}" aria-hidden="true"></i>
            <span class="camp-music-item-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="camp-music-item-label">${track.label}</span>
        `;

        button.addEventListener("click", (event) => {
            event.stopPropagation();
            selectCampMusic(track.key, true);
        });

        campMusicGrid.appendChild(button);
    }

    updateCampMusicHeader();
    updateCampMusicPlayer();
};

const openCampMusicPanel = () => {
    if (!campMusicPanel) return;

    campMusicPanel.classList.add("is-open");
    campMusicPanel.setAttribute("aria-hidden", "false");

    renderCampMusicGrid();
    updateCampMusicPlayer();
};

const closeCampMusicPanel = () => {
    if (!campMusicPanel) return;

    campMusicPanel.classList.remove("is-open");
    campMusicPanel.setAttribute("aria-hidden", "true");
};

const syncCampMusicPanelWithRoute = () => {
    const shouldOpen = getCurrentRoute() === "#/camp/music";

    if (shouldOpen) {
        openCampMusicPanel();
        return;
    }

    closeCampMusicPanel();
};

const closeThemeDropdown = () => {
    if (!themePicker || !themeToggle) return;

    themePicker.classList.remove("is-open");
    themeToggle.setAttribute("aria-expanded", "false");
};

const toggleThemeDropdown = () => {
    if (!themePicker || !themeToggle) return;

    const isOpen = themePicker.classList.toggle("is-open");
    themeToggle.setAttribute("aria-expanded", String(isOpen));
};

const applyTheme = () => {
    document.body.dataset.theme = currentTheme;

    if (themeCurrentLabel) {
        themeCurrentLabel.textContent = themeData[currentTheme].label;
    }

    themeOptions.forEach((option) => {
        const isActive = option.dataset.themeOption === currentTheme;

        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-selected", String(isActive));
    });
};

const setTheme = (themeKey) => {
    if (!themeData[themeKey]) return;

    currentTheme = themeKey;
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

    applyTheme();
    closeThemeDropdown();
};

const translations = {
    lang_fr: {
        meta: {
            pageTitle: "Hunter Camp Portfolio",
        },
        startScreen: {
            title: "Portfolio du chasseur",
            hint: "Clique pour entrer dans le camp",
        },
        camp: {
            menuTitle: "Menu",
            defaultSubmenuLabel: "Projets",
            felyneHint: "Parler au Felyne",
            replayButton: "↻",
        },
        popup: {
            kicker: "Guild Card",
            title: "Hunter Profile",
            closeLabel: "Fermer",
            defaultInfoTitle: "Présentation",
            defaultDescription:
                "Sélectionne un onglet pour afficher les informations associées.",
        },
        equipment: {
            head: "Tête",
            chest: "Torse",
            arms: "Bras",
            waist: "Taille",
            legs: "Jambes",
        },
        accessibility: {
            tabLabel: "Onglet {{label}}",
            switchToEnglish: "Switch to English",
            switchToFrench: "Passer en français",
        },
        menu: {
            projects: {
                label: "Quêtes",
                items: {
                    featured: "Quêtes urgentes",
                    all: "Registre de quêtes",
                    technicalCases: "Trophées de chasse",
                },
            },
            skills: {
                label: "Équipement",
                items: {
                    frontend: "Armes",
                    backend: "Armures",
                    tools: "Talents",
                },
            },
            career: {
                label: "Carnet",
                items: {
                    experience: "Rang de chasseur",
                    education: "Expéditions",
                    goals: "Objectifs de guilde",
                },
            },
            about: {
                label: "Hunter",
                items: {
                    profile: "Carte de guilde",
                    workStyle: "Style de chasse",
                    whyPortfolio: "Serment du chasseur",
                },
            },
            contact: {
                label: "Guilde",
                items: {
                    message: "Envoyer un message",
                    linkedin: "Registre de guilde",
                    github: "Github / Signal externe",
                },
            },
            camp: {
                label: "Camp",
                items: {
                    campSong: "Choisir la musique du camp",
                },
            },
        },
        popupContent: {
            projects: {
                title: "Tableau des quêtes",
                infoTitle: "Quêtes terminées",
                description:
                    "Le Felyne présente les chasses marquantes du registre : contrats accomplis, monstres affrontés, récompenses obtenues et traces laissées sur le terrain.",
                stats: [
                    ["08", "Quêtes"],
                    ["03", "Grands monstres"],
                    ["12", "Récompenses"],
                    ["A", "Rang"],
                ],
                tags: ["Chasse", "Exploration", "Stratégie", "Trophées", "Rang A"],
                inventory: ["Contrats", "Cartes", "Butins", "Rapports", "Trophées"],
            },
            skills: {
                title: "Équipement",
                infoTitle: "Arsenal du chasseur",
                description:
                    "Un aperçu de l’équipement utilisé au camp : armes, armures, talents, objets de soutien et préparation avant le départ en quête.",
                stats: [
                    ["Lame", "Arme"],
                    ["Solide", "Armure"],
                    ["Felyne", "Soutien"],
                    ["Scout", "Repérage"],
                ],
                tags: ["Armes", "Armures", "Talents", "Objets", "Préparation"],
                inventory: ["Grande épée", "Armure", "Charme", "Potion", "Carte"],
            },
            career: {
                title: "Carnet de chasse",
                infoTitle: "Progression du hunter",
                description:
                    "Le carnet retrace les expéditions, les rangs franchis, les rencontres importantes et les objectifs encore affichés au panneau de quête.",
                stats: [
                    ["HR", "Rang"],
                    ["XP", "Terrain"],
                    ["Guild", "Reconnu"],
                    ["Next", "Objectif"],
                ],
                tags: ["Expéditions", "Rang", "Guilde", "Progression"],
                inventory: ["Insignes", "Notes", "Cartes", "Souvenirs"],
            },
            about: {
                title: "Carte de guilde",
                infoTitle: "Profil du chasseur",
                description:
                    "Un chasseur calme, curieux et méthodique, attiré par les univers denses, les interfaces de jeu, les ambiances de camp et les expériences interactives.",
                stats: [
                    ["Calme", "Style"],
                    ["Focus", "Chasse"],
                    ["Lore", "Goût"],
                    ["Felyne", "Allié"],
                ],
                tags: ["Curieux", "Méthodique", "Créatif", "Chasseur"],
                inventory: ["Carte", "Badge", "Serment", "Compagnon"],
            },
            contact: {
                title: "Guilde",
                infoTitle: "Camp de ralliement",
                description:
                    "Utilise le registre de guilde pour envoyer un message, ouvrir un signal externe ou retrouver le chasseur hors du camp.",
                stats: [
                    ["SOS", "Signal"],
                    ["Mail", "Message"],
                    ["Guild", "Registre"],
                    ["Open", "Camp"],
                ],
                tags: ["Message", "Guilde", "Signal", "Camp"],
                inventory: ["Message", "Registre", "Signal externe"],
            },
            camp: {
                title: "Camp",
                infoTitle: "Ambiance du camp",
                description:
                    "Ici, tu peux choisir la musique du camp, régler l’ambiance sonore et préparer la scène avant de repartir en quête.",
                stats: [
                    ["BGM", "Musique"],
                    ["Loop", "Lecture"],
                    ["Mood", "Ambiance"],
                    ["ON", "Camp"],
                ],
                tags: ["Musique", "Camp", "Felyne", "Repos"],
                inventory: ["Musique", "Volume", "Ambiance", "Felyne"],
            },
        },
    },

    lang_eng: {
        meta: {
            pageTitle: "Hunter Camp Portfolio",
        },
        startScreen: {
            title: "Hunter's Portfolio",
            hint: "Click to enter the camp",
        },
        camp: {
            menuTitle: "Menu",
            defaultSubmenuLabel: "Projects",
            felyneHint: "Talk to the Felyne",
            replayButton: "↻",
        },
        popup: {
            kicker: "Guild Card",
            title: "Hunter Profile",
            closeLabel: "Close",
            defaultInfoTitle: "Overview",
            defaultDescription: "Select a tab to display the related information.",
        },
        equipment: {
            head: "Head",
            chest: "Chest",
            arms: "Arms",
            waist: "Waist",
            legs: "Legs",
        },
        accessibility: {
            tabLabel: "{{label}} tab",
            switchToEnglish: "Switch to English",
            switchToFrench: "Passer en français",
        },
        menu: {
            projects: {
                label: "Quests",
                items: {
                    featured: "Urgent quests",
                    all: "Quest register",
                    technicalCases: "Hunting trophies",
                },
            },
            skills: {
                label: "Equipment",
                items: {
                    frontend: "Weapons",
                    backend: "Armor",
                    tools: "Talents",
                },
            },
            career: {
                label: "Journal",
                items: {
                    experience: "Hunter rank",
                    education: "Expeditions",
                    goals: "Guild objectives",
                },
            },
            about: {
                label: "Hunter",
                items: {
                    profile: "Guild card",
                    workStyle: "Hunting style",
                    whyPortfolio: "Hunter oath",
                },
            },
            contact: {
                label: "Guild",
                items: {
                    message: "Send a message",
                    linkedin: "Guild register",
                    github: "Github /External signal",
                },
            },
            camp: {
                label: "Camp",
                items: {
                    campSong: "Choose camp music",
                },
            },
        },
        popupContent: {
            projects: {
                title: "Quest board",
                infoTitle: "Completed quests",
                description:
                    "The Felyne presents the main hunts in the register: completed contracts, monsters faced, rewards obtained, and marks left in the field.",
                stats: [
                    ["08", "Quests"],
                    ["03", "Large monsters"],
                    ["12", "Rewards"],
                    ["A", "Rank"],
                ],
                tags: ["Hunting", "Exploration", "Strategy", "Trophies", "Rank A"],
                inventory: ["Contracts", "Maps", "Loot", "Reports", "Trophies"],
            },
            skills: {
                title: "Equipment",
                infoTitle: "Hunter arsenal",
                description:
                    "A look at the equipment prepared at camp: weapons, armor, talents, support items, and quest preparation.",
                stats: [
                    ["Blade", "Weapon"],
                    ["Solid", "Armor"],
                    ["Felyne", "Support"],
                    ["Scout", "Tracking"],
                ],
                tags: ["Weapons", "Armor", "Talents", "Items", "Preparation"],
                inventory: ["Great sword", "Armor", "Charm", "Potion", "Map"],
            },
            career: {
                title: "Hunter journal",
                infoTitle: "Hunter progression",
                description:
                    "The journal records expeditions, reached ranks, important encounters, and the next objectives posted on the quest board.",
                stats: [
                    ["HR", "Rank"],
                    ["XP", "Field"],
                    ["Guild", "Known"],
                    ["Next", "Objective"],
                ],
                tags: ["Expeditions", "Rank", "Guild", "Progression"],
                inventory: ["Badges", "Notes", "Maps", "Memories"],
            },
            about: {
                title: "Guild card",
                infoTitle: "Hunter profile",
                description:
                    "A calm, curious, and methodical hunter drawn to dense worlds, game interfaces, camp atmospheres, and interactive experiences.",
                stats: [
                    ["Calm", "Style"],
                    ["Focus", "Hunt"],
                    ["Lore", "Taste"],
                    ["Felyne", "Ally"],
                ],
                tags: ["Curious", "Methodical", "Creative", "Hunter"],
                inventory: ["Card", "Badge", "Oath", "Companion"],
            },
            contact: {
                title: "Guild",
                infoTitle: "Gathering camp",
                description:
                    "Use the guild register to send a message, open an external signal, or find the hunter outside the camp.",
                stats: [
                    ["SOS", "Signal"],
                    ["Mail", "Message"],
                    ["Guild", "Register"],
                    ["Open", "Camp"],
                ],
                tags: ["Message", "Guild", "Signal", "Camp"],
                inventory: ["Message", "Register", "External signal"],
            },
            camp: {
                title: "Camp",
                infoTitle: "Camp ambience",
                description:
                    "Here, you can choose the camp music, adjust the sound mood, and prepare the scene before leaving for another quest.",
                stats: [
                    ["BGM", "Music"],
                    ["Loop", "Playback"],
                    ["Mood", "Ambience"],
                    ["ON", "Camp"],
                ],
                tags: ["Music", "Camp", "Felyne", "Rest"],
                inventory: ["Music", "Volume", "Ambience", "Felyne"],
            },
        },
        debug: {
            routeActive: "Active route:",
            activeTab: "Active tab:",
            modelLoadError: "Model loading error {{url}}:",
        },
    },
};

let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "lang_fr";

if (!translations[currentLanguage]) {
    currentLanguage = "lang_fr";
}

const getText = (path, replacements = {}) => {
    const keys = path.split(".");
    let value = translations[currentLanguage];

    for (const key of keys) {
        value = value?.[key];
    }

    if (typeof value !== "string") {
        return value;
    }

    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return replacements[key] ?? "";
    });
};

const menuStructure = {
    projects: {
        route: "#/quetes",
        icon: "./public/menu/projects.png",
        items: [
            {
                key: "featured",
                route: "#/quetes/urgentes",
            },
            {
                key: "all",
                route: "#/quetes/registre",
            },
            {
                key: "technicalCases",
                route: "#/quetes/trophees",
            },
        ],
    },

    skills: {
        route: "#/equipement",
        icon: "./public/menu/skills.png",
        items: [
            {
                key: "frontend",
                route: "#/equipement/armes",
            },
            {
                key: "backend",
                route: "#/equipement/armures",
            },
            {
                key: "tools",
                route: "#/equipement/talents",
            },
        ],
    },

    career: {
        route: "#/carnet",
        icon: "./public/menu/career.png",
        items: [
            {
                key: "experience",
                route: "#/carnet/rang",
            },
            {
                key: "education",
                route: "#/carnet/expeditions",
            },
            {
                key: "goals",
                route: "#/carnet/objectifs",
            },
        ],
    },

    about: {
        route: "#/hunter",
        icon: "./public/menu/about.png",
        items: [
            {
                key: "profile",
                route: "#/hunter/carte",
            },
            {
                key: "workStyle",
                route: "#/hunter/style",
            },
            {
                key: "whyPortfolio",
                route: "#/hunter/serment",
            },
        ],
    },

    contact: {
        route: "#/guilde",
        icon: "./public/menu/contact.png",
        items: [
            {
                key: "message",
                route: "#/guilde/message",
            },
            {
                key: "linkedin",
                icon: "./public/icons/goTo.png",
                route: "#/guilde/registre",
            },
            {
                key: "github",
                icon: "./public/icons/goTo.png",
                route: "#/guilde/signal",
            },
        ],
    },

    camp: {
        route: "#/camp",
        icon: "./public/menu/camp.png",
        items: [
            {
                key: "campSong",
                route: "#/camp/music",
            },
        ],
    },
};

const getMenuData = () => {
    const menuTranslations = getText("menu");

    return Object.fromEntries(
        Object.entries(menuStructure).map(([tabKey, tabData]) => {
            const translatedTab = menuTranslations?.[tabKey];

            return [
                tabKey,
                {
                    label: translatedTab?.label || tabKey,
                    route: tabData.route,
                    icon: tabData.icon,
                    items: tabData.items.map((item) => ({
                        label:
                            translatedTab?.items?.[item.key] ||
                            item.key,
                        route: item.route,
                        icon: item.icon,
                    })),
                },
            ];
        })
    );
};

let menuData = getMenuData();

let characterRenderer = null;
let characterScene = null;
let characterCamera = null;
let characterClock = null;
let felyneModel = null;
let felyneBaseY = 0;
let felyneBaseRotationY = 0;
let lastCharacterWidth = 0;
let lastCharacterHeight = 0;

let campfireRenderer = null;
let campfireScene = null;
let campfireCamera = null;
let campfireClock = null;
let campfireModel = null;
let campfireBaseRotationY = 0;
let campfireLight = null;
let lastCampfireWidth = 0;
let lastCampfireHeight = 0;

let hunterRenderer = null;
let hunterScene = null;
let hunterCamera = null;
let hunterClock = null;
let hunterModel = null;
let hunterBaseRotationY = 0;
let lastHunterWidth = 0;
let lastHunterHeight = 0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const mainFelyneConfig = {
    url: "./public/models/felyne.glb",
    height: 2.28,
    position: [0, 1.23, 0],
    rotation: [0, -0.34, 0],
};

const campfireConfig = {
    url: "./public/models/campfire.glb",
    height: 1.12,
    position: [-0.5, 0.08, 1],
    rotation: [0, 1.57, 0],
};

const popupHunterConfig = {
    url: "./public/models/hunter.glb",
    height: 3.45,
    position: [0, 1.68, 0],
    rotation: [0, -0.08, 0],
};

const clamp = (value, min = 0, max = 1) => {
    return Math.min(max, Math.max(min, value));
};

const easeInOutCubic = (t) => {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const degToRad = (deg) => THREE.MathUtils.degToRad(deg);

const normalizeModel = (model, targetHeight) => {
    const firstBox = new THREE.Box3().setFromObject(model);
    const firstSize = new THREE.Vector3();

    firstBox.getSize(firstSize);

    const currentHeight = Math.max(firstSize.y, 0.001);
    const scaleRatio = targetHeight / currentHeight;

    model.scale.setScalar(scaleRatio);

    const finalBox = new THREE.Box3().setFromObject(model);
    const finalCenter = new THREE.Vector3();

    finalBox.getCenter(finalCenter);

    model.position.x -= finalCenter.x;
    model.position.z -= finalCenter.z;
    model.position.y -= finalBox.min.y;
};

const tuneModelMaterials = (model) => {
    model.traverse((child) => {
        if (!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;

        if (child.geometry) {
            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
        }

        if (!child.material) return;

        if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
        }

        child.material.needsUpdate = true;
    });
};

const getAllBones = (root) => {
    const bones = [];

    root.traverse((child) => {
        if (child.isBone) {
            bones.push(child);
        }
    });

    return bones;
};

const findBone = (root, patterns = []) => {
    const bones = getAllBones(root);

    const normalizedPatterns = patterns.map((pattern) =>
        pattern.toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    return bones.find((bone) => {
        const normalizedName = bone.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        return normalizedPatterns.some((pattern) =>
            normalizedName.includes(pattern)
        );
    });
};

const setBoneRotation = (bone, x = 0, y = 0, z = 0) => {
    if (!bone) return;

    bone.rotation.x = degToRad(x);
    bone.rotation.y = degToRad(y);
    bone.rotation.z = degToRad(z);
};

const applyFelynePose = (model) => {
    const spine0 = findBone(model, ["spine0003"]);
    const spine1 = findBone(model, ["spine0104"]);
    const neck = findBone(model, ["neck0005"]);
    const head = findBone(model, ["head0006"]);

    const lArm0 = findBone(model, ["larm00018"]);
    const lArm1 = findBone(model, ["larm01019"]);
    const lArm2 = findBone(model, ["larm02020"]);

    const rArm0 = findBone(model, ["rarm00027"]);
    const rArm1 = findBone(model, ["rarm01028"]);
    const rArm2 = findBone(model, ["rarm02029"]);

    const tail0 = findBone(model, ["tail00045"]);
    const tail1 = findBone(model, ["tail01046"]);

    setBoneRotation(spine0, 0, 0, 4);
    setBoneRotation(spine1, 0, 0, 6);
    setBoneRotation(neck, -4, 10, 0);
    setBoneRotation(head, -6, 16, 0);

    setBoneRotation(lArm0, 0, 0, -36);
    setBoneRotation(lArm1, 0, 0, -18);
    setBoneRotation(lArm2, 0, 0, -10);

    setBoneRotation(rArm0, 0, 0, 36);
    setBoneRotation(rArm1, 0, 0, 18);
    setBoneRotation(rArm2, 0, 0, 10);

    setBoneRotation(tail0, 8, 0, 10);
    setBoneRotation(tail1, 10, 0, 18);
};

const loadGLBModel = (loader, config) => {
    return new Promise((resolve) => {
        loader.load(
            config.url,
            (gltf) => {
                const model = gltf.scene;

                normalizeModel(model, config.height);
                tuneModelMaterials(model);

                model.position.set(
                    config.position[0],
                    config.position[1],
                    config.position[2]
                );

                model.rotation.set(
                    config.rotation[0],
                    config.rotation[1],
                    config.rotation[2]
                );

                resolve(model);
            },
            undefined,
            (error) => {
                console.error(
                    getText("debug.modelLoadError", { url: config.url }),
                    error
                );

                resolve(null);
            }
        );
    });
};

const resizeCharacterScene = () => {
    if (!characterStage || !characterRenderer || !characterCamera) return;

    const rect = characterStage.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;
    if (width === lastCharacterWidth && height === lastCharacterHeight) return;

    lastCharacterWidth = width;
    lastCharacterHeight = height;

    characterRenderer.setSize(width, height, false);

    characterCamera.aspect = width / height;
    characterCamera.updateProjectionMatrix();
};

const renderCharacterScene = () => {
    if (!characterRenderer || !characterScene || !characterCamera) return;

    resizeCharacterScene();

    const elapsed = characterClock.getElapsedTime();

    if (felyneModel) {
        applyFelynePose(felyneModel);

        felyneModel.position.y =
            felyneBaseY + Math.sin(elapsed * 1.8) * 0.025;

        felyneModel.rotation.y =
            felyneBaseRotationY + Math.sin(elapsed * 0.8) * 0.055;
    }

    characterRenderer.render(characterScene, characterCamera);
};

const initCharacterScene = () => {
    if (!characterStage || characterRenderer) return;

    characterArea?.classList.add("is-loading-3d");

    characterScene = new THREE.Scene();

    characterCamera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    characterCamera.position.set(0, 1.52, 5.6);
    characterCamera.lookAt(0, 1.28, 0);

    characterRenderer = new THREE.WebGLRenderer({
        canvas: characterStage,
        alpha: true,
        antialias: true,
    });

    characterRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    characterRenderer.setClearColor(0x000000, 0);
    characterRenderer.shadowMap.enabled = true;
    characterRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    characterRenderer.outputColorSpace = THREE.SRGBColorSpace;
    characterRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    characterRenderer.toneMappingExposure = 1.08;

    characterClock = new THREE.Clock();

    const hemisphereLight = new THREE.HemisphereLight(0xc5d9e7, 0x080b12, 2.3);
    characterScene.add(hemisphereLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainLight.position.set(-2.4, 4.5, 3.2);
    mainLight.castShadow = true;
    characterScene.add(mainLight);

    const fireLight = new THREE.PointLight(0x89a7ff, 4.4, 8);
    fireLight.position.set(-1.5, 0.95, 2.4);
    characterScene.add(fireLight);

    const rimLight = new THREE.PointLight(0xc5d9e7, 2.5, 7);
    rimLight.position.set(2.8, 2.2, -1.8);
    characterScene.add(rimLight);

    const loader = new GLTFLoader();

    loadGLBModel(loader, mainFelyneConfig).then((model) => {
        if (!model) return;

        felyneModel = model;
        felyneBaseY = model.position.y;
        felyneBaseRotationY = model.rotation.y;

        applyFelynePose(felyneModel);
        characterScene.add(felyneModel);

        characterArea?.classList.remove("is-loading-3d");
        characterArea?.classList.add("has-3d-loaded");
    });

    resizeCharacterScene();

    window.addEventListener("resize", resizeCharacterScene);
    characterRenderer.setAnimationLoop(renderCharacterScene);
};

const resizeCampfireScene = () => {
    if (!campfireStage || !campfireRenderer || !campfireCamera) return;

    const rect = campfireStage.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;
    if (width === lastCampfireWidth && height === lastCampfireHeight) return;

    lastCampfireWidth = width;
    lastCampfireHeight = height;

    campfireRenderer.setSize(width, height, false);

    campfireCamera.aspect = width / height;
    campfireCamera.updateProjectionMatrix();
};

const renderCampfireScene = () => {
    if (!campfireRenderer || !campfireScene || !campfireCamera) return;

    resizeCampfireScene();

    const elapsed = campfireClock.getElapsedTime();

    if (campfireModel) {
        campfireModel.rotation.y =
            campfireBaseRotationY + Math.sin(elapsed * 0.45) * 0.025;
    }

    if (campfireLight) {
        campfireLight.intensity = 3.8 + Math.sin(elapsed * 6.5) * 0.45;
    }

    campfireRenderer.render(campfireScene, campfireCamera);
};

const initCampfireScene = () => {
    if (!campfireStage || campfireRenderer) return;

    campfireScene = new THREE.Scene();

    campfireCamera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    campfireCamera.position.set(0, 1.05, 6.2);
    campfireCamera.lookAt(0, 0.72, 0);

    campfireRenderer = new THREE.WebGLRenderer({
        canvas: campfireStage,
        alpha: true,
        antialias: true,
    });

    campfireRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    campfireRenderer.setClearColor(0x000000, 0);
    campfireRenderer.outputColorSpace = THREE.SRGBColorSpace;
    campfireRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    campfireRenderer.toneMappingExposure = 1.12;

    campfireClock = new THREE.Clock();

    const hemisphereLight = new THREE.HemisphereLight(0xc5d9e7, 0x050814, 1.7);
    campfireScene.add(hemisphereLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(-1.6, 3.2, 2.4);
    campfireScene.add(mainLight);

    campfireLight = new THREE.PointLight(0x89a7ff, 4.2, 6);
    campfireLight.position.set(0, 0.9, 1.1);
    campfireScene.add(campfireLight);

    const loader = new GLTFLoader();

    loadGLBModel(loader, campfireConfig).then((model) => {
        if (!model) return;

        campfireModel = model;
        campfireBaseRotationY = model.rotation.y;

        campfireScene.add(campfireModel);
    });

    resizeCampfireScene();

    window.addEventListener("resize", resizeCampfireScene);
    campfireRenderer.setAnimationLoop(renderCampfireScene);
};

const resizeHunterProfileScene = () => {
    if (!hunterProfileStage || !hunterRenderer || !hunterCamera) return;

    const rect = hunterProfileStage.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;
    if (width === lastHunterWidth && height === lastHunterHeight) return;

    lastHunterWidth = width;
    lastHunterHeight = height;

    hunterRenderer.setSize(width, height, false);

    hunterCamera.aspect = width / height;
    hunterCamera.updateProjectionMatrix();
};

const renderHunterProfileScene = () => {
    if (!hunterRenderer || !hunterScene || !hunterCamera) return;

    resizeHunterProfileScene();

    const elapsed = hunterClock.getElapsedTime();

    if (hunterModel) {
        hunterModel.rotation.y =
            hunterBaseRotationY + Math.sin(elapsed * 0.45) * 0.035;
    }

    hunterRenderer.render(hunterScene, hunterCamera);
};

const initHunterProfileScene = () => {
    if (!hunterProfileStage || hunterRenderer) {
        resizeHunterProfileScene();
        return;
    }

    hunterScene = new THREE.Scene();

    hunterCamera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    hunterCamera.position.set(0, 1.5, 7.2);
    hunterCamera.lookAt(0, 1.42, 0);

    hunterRenderer = new THREE.WebGLRenderer({
        canvas: hunterProfileStage,
        alpha: true,
        antialias: true,
    });

    hunterRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hunterRenderer.setClearColor(0x000000, 0);
    hunterRenderer.outputColorSpace = THREE.SRGBColorSpace;
    hunterRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    hunterRenderer.toneMappingExposure = 1.06;

    hunterClock = new THREE.Clock();

    const hemisphereLight = new THREE.HemisphereLight(0xc5d9e7, 0x080b12, 2.4);
    hunterScene.add(hemisphereLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.7);
    mainLight.position.set(-2.4, 4.2, 3.4);
    hunterScene.add(mainLight);

    const rimLight = new THREE.PointLight(0xc5d9e7, 2.8, 7);
    rimLight.position.set(2.8, 2.4, -1.8);
    hunterScene.add(rimLight);

    const goldLight = new THREE.PointLight(0xc8a45d, 1.6, 6);
    goldLight.position.set(-1.8, 0.8, 2.4);
    hunterScene.add(goldLight);

    const loader = new GLTFLoader();

    loadGLBModel(loader, popupHunterConfig).then((model) => {
        if (!model) return;

        hunterModel = model;
        hunterBaseRotationY = model.rotation.y;
        hunterScene.add(hunterModel);
    });

    resizeHunterProfileScene();
    window.addEventListener("resize", resizeHunterProfileScene);
    hunterRenderer.setAnimationLoop(renderHunterProfileScene);
};

const getTabFromRoute = () => {
    const route = window.location.hash || "#/projets";

    const foundEntry = Object.entries(menuData).find(([, tabData]) => {
        return route === tabData.route || route.startsWith(`${tabData.route}/`);
    });

    if (!foundEntry) {
        return "projects";
    }

    return foundEntry[0];
};

const getCurrentRoute = () => {
    return window.location.hash || "#/projets";
};

const setRoute = (route) => {
    if (window.location.hash === route) return;

    history.pushState(null, "", route);
};

const updateActiveTab = (activeTabKey) => {
    campTabs.forEach((tab) => {
        const isActive = tab.dataset.tab === activeTabKey;

        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
    });
};

const renderCampTabs = () => {
    campTabsBar.innerHTML = "";

    Object.entries(menuData).forEach(([tabKey, tabData]) => {
        const button = document.createElement("button");

        button.className = "camp-tab";
        button.type = "button";
        button.dataset.tab = tabKey;
        button.dataset.route = tabData.route;
        button.setAttribute(
            "aria-label",
            getText("accessibility.tabLabel", { label: tabData.label })
        );

        button.innerHTML = `
            <span class="camp-tab-icon">
                <img src="${tabData.icon}" alt="" />
            </span>
        `;

        campTabsBar.appendChild(button);
    });

    campTabs = [...document.querySelectorAll(".camp-tab")];
};

const renderSubmenu = (activeTabKey) => {
    const tabData = menuData[activeTabKey];
    const campSubmenu = document.querySelector(".camp-submenu");

    if (!tabData || !campSubmenu) return;

    const currentRoute = getCurrentRoute();
    const shouldAnimate = currentRenderedTab !== activeTabKey;

    if (shouldAnimate) {
        campSubmenu.classList.remove("is-loading");

        void campSubmenu.offsetWidth;

        campSubmenu.classList.add("is-loading");
    }

    currentRenderedTab = activeTabKey;

    campSubmenuLabel.textContent = tabData.label;
    campSubmenuList.innerHTML = "";

    tabData.items.forEach((item, index) => {
        const button = document.createElement("button");

        button.className = "camp-submenu-item";
        button.type = "button";
        button.dataset.route = item.route;

        const isActive =
            currentRoute === item.route ||
            (currentRoute === tabData.route && index === 0);

        button.classList.toggle("is-active", isActive);

        const glow = document.createElement("span");
        glow.className = "camp-submenu-glow";

        const label = document.createElement("span");
        label.className = "camp-submenu-text";
        label.textContent = item.label;

        button.appendChild(glow);
        button.appendChild(label);

        if (item.icon) {
            const icon = document.createElement("img");
            icon.className = "camp-submenu-icon";
            icon.src = item.icon;
            icon.alt = "";
            icon.setAttribute("aria-hidden", "true");

            button.appendChild(icon);
        }

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            setRoute(item.route);
            renderRoute();
        });

        campSubmenuList.appendChild(button);
    });
};

const renderRouteContent = (activeTabKey) => {
    console.log(getText("debug.routeActive"), window.location.hash);
    console.log(getText("debug.activeTab"), activeTabKey);

    syncCampMusicPanelWithRoute();
};

const renderRoute = () => {
    const activeTabKey = getTabFromRoute();

    updateActiveTab(activeTabKey);
    renderSubmenu(activeTabKey);
    renderRouteContent(activeTabKey);
};

const setupCampTabs = () => {
    campTabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            event.stopPropagation();

            const route = tab.dataset.route;

            if (!route) return;

            setRoute(route);
            renderRoute();
        });
    });
};

const renderHunterPopupContent = () => {
    const activeTabKey = getTabFromRoute();
    const popupContentByTab = getText("popupContent");
    const data = popupContentByTab[activeTabKey] || popupContentByTab.projects;

    hunterPopupTitle.textContent = data.title;
    hunterInfoTitle.textContent = data.infoTitle;
    hunterInfoDescription.textContent = data.description;

    hunterStatsGrid.innerHTML = "";
    data.stats.forEach(([value, label]) => {
        const stat = document.createElement("div");
        stat.className = "hunter-stat";
        stat.innerHTML = `
            <span class="hunter-stat-value">${value}</span>
            <span class="hunter-stat-label">${label}</span>
        `;

        hunterStatsGrid.appendChild(stat);
    });

    hunterTags.innerHTML = "";
    data.tags.forEach((tagText) => {
        const tag = document.createElement("span");
        tag.className = "hunter-tag";
        tag.textContent = tagText;

        hunterTags.appendChild(tag);
    });

    hunterInventoryStrip.innerHTML = "";
    data.inventory.forEach((itemText) => {
        const item = document.createElement("div");
        item.className = "inventory-item";
        item.textContent = itemText;

        hunterInventoryStrip.appendChild(item);
    });
};

const openHunterPopup = () => {
    renderHunterPopupContent();

    hunterPopup.classList.add("is-open");
    hunterPopup.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-popup");

    requestAnimationFrame(() => {
        initHunterProfileScene();
        resizeHunterProfileScene();
    });
};

const closeHunterPopup = () => {
    hunterPopup.classList.remove("is-open");
    hunterPopup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-popup");
};

const handleCharacterClick = (event) => {
    if (!felyneModel || !characterCamera || !characterStage) return;

    event.stopPropagation();

    const rect = characterStage.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, characterCamera);

    const intersects = raycaster.intersectObject(felyneModel, true);

    if (intersects.length > 0) {
        playRandomFelyneSound();
        openHunterPopup();
    }
};

const handleCharacterPointerMove = (event) => {
    if (!felyneModel || !characterCamera || !characterStage) return;

    const rect = characterStage.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, characterCamera);

    const intersects = raycaster.intersectObject(felyneModel, true);

    characterStage.style.cursor = intersects.length > 0 ? "pointer" : "default";
};

const renderCampProgress = (progress) => {
    const cinematicProgress = easeInOutCubic(progress);

    const cameraScale = 1 + cinematicProgress * 2.8;
    const cameraY = cinematicProgress * 0;
    const campOpacity = clamp((cinematicProgress - 0.04) / 0.18);
    const vignetteOpacity = 0.18 + cinematicProgress * 0.22;

    scene.style.setProperty("--camera-scale", cameraScale.toFixed(3));
    scene.style.setProperty("--camera-y", `${cameraY}vh`);
    scene.style.setProperty("--camp-opacity", campOpacity.toFixed(3));
    scene.style.setProperty("--vignette-opacity", vignetteOpacity.toFixed(3));
};

const showCampContent = () => {
    if (hasEnteredCamp) return;

    hasEnteredCamp = true;

    scene.classList.add("is-fading-out");

    setTimeout(() => {
        scene.classList.add("is-camp-content");

        scene.classList.remove("is-fading-out");
        scene.classList.add("is-fading-in");

        setTimeout(() => {
            startCampMusicOnEntry();
        }, 250);

        setTimeout(() => {
            scene.classList.remove("is-fading-in");
        }, TRANSITION_DURATION);
    }, TRANSITION_DURATION);
};

const resetCampIntro = () => {
    if (introFrame) {
        cancelAnimationFrame(introFrame);
        introFrame = null;
    }

    closeHunterPopup();
    stopCurrentCampMusic();
    hasAutoStartedCampMusic = false;

    hasEnteredCamp = false;
    introStarted = false;

    scene.classList.remove(
        "is-fading-out",
        "is-fading-in",
        "is-camp-content",
        "is-title-exiting"
    );

    renderCampProgress(0);
    buildStartTitle();
};

const startIntroFromClick = () => {
    if (introStarted || hasEnteredCamp) return;

    introStarted = true;
    scene.classList.add("is-title-exiting");

    setTimeout(() => {
        startAutoEnter();
    }, 450);
};

const startAutoEnter = () => {
    const startTime = performance.now();

    const tick = (now) => {
        const elapsed = now - startTime;
        const progress = clamp(elapsed / INTRO_DURATION);

        renderCampProgress(progress);

        if (progress < 1) {
            introFrame = requestAnimationFrame(tick);
            return;
        }

        introFrame = null;
        showCampContent();
    };

    introFrame = requestAnimationFrame(tick);
};

const buildStartTitle = () => {
    const title = startTitle.dataset.title || "";

    startTitle.innerHTML = "";

    title.split("").forEach((letter, index) => {
        const span = document.createElement("span");

        if (letter === " ") {
            span.className = "start-letter start-space";
            span.innerHTML = "&nbsp;";
        } else {
            span.className = "start-letter";
            span.textContent = letter;
        }

        span.style.setProperty("--letter-index", index);
        startTitle.appendChild(span);
    });
};

const applyStaticTranslations = () => {
    document.documentElement.lang = currentLanguage === "lang_fr" ? "fr" : "en";
    document.title = getText("meta.pageTitle");

    startTitle.dataset.title = getText("startScreen.title");
    startHint.textContent = getText("startScreen.hint");

    replayButton.textContent = getText("camp.replayButton");
    campMenuTitle.textContent = getText("camp.menuTitle");
    campSubmenuLabel.textContent = getText("camp.defaultSubmenuLabel");
    felyneInteractionHint.textContent = getText("camp.felyneHint");

    hunterPopupKicker.textContent = getText("popup.kicker");
    hunterPopupTitle.textContent = getText("popup.title");
    hunterInfoTitle.textContent = getText("popup.defaultInfoTitle");
    hunterInfoDescription.textContent = getText("popup.defaultDescription");
    hunterPopupClose.setAttribute("aria-label", getText("popup.closeLabel"));

    equipmentSlots.forEach((slot) => {
        const equipmentKey = slot.dataset.equipment;

        slot.textContent = getText(`equipment.${equipmentKey}`);
    });

    const nextLanguageLabel =
        currentLanguage === "lang_fr"
            ? getText("accessibility.switchToEnglish")
            : getText("accessibility.switchToFrench");

    languageToggleText.textContent = currentLanguage === "lang_fr" ? "EN" : "FR";
    languageToggle.setAttribute("aria-label", nextLanguageLabel);
    languageToggle.setAttribute("title", nextLanguageLabel);

    buildStartTitle();
};

const setLanguage = (languageKey) => {
    if (!translations[languageKey]) return;

    currentLanguage = languageKey;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);

    menuData = getMenuData();
    currentRenderedTab = null;

    applyStaticTranslations();
    renderCampTabs();
    setupCampTabs();
    renderRoute();

    if (hunterPopup.classList.contains("is-open")) {
        renderHunterPopupContent();
    }
};

const toggleLanguage = () => {
    const nextLanguage = currentLanguage === "lang_fr" ? "lang_eng" : "lang_fr";

    setLanguage(nextLanguage);
};

languageToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleLanguage();
});

replayButton.addEventListener("click", (event) => {
    event.stopPropagation();
    resetCampIntro();
});

themeToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleThemeDropdown();
});

themeOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
        event.stopPropagation();

        const themeKey = option.dataset.themeOption;
        setTheme(themeKey);
    });
});

document.addEventListener("click", () => {
    closeThemeDropdown();
});

themePicker?.addEventListener("click", (event) => {
    event.stopPropagation();
});

characterStage.addEventListener("click", handleCharacterClick);
characterStage.addEventListener("pointermove", handleCharacterPointerMove);

hunterPopupClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeHunterPopup();
});

hunterPopup.addEventListener("click", (event) => {
    const shouldClose = event.target.hasAttribute("data-popup-close");

    if (shouldClose) {
        closeHunterPopup();
    }
});

campMusicClose?.addEventListener("click", (event) => {
    event.stopPropagation();

    closeCampMusicPanel();

    if (getCurrentRoute() === "#/camp/music") {
        setRoute("#/camp");
        renderRoute();
    }
});

campMusicPanel?.addEventListener("click", (event) => {
    event.stopPropagation();
});

audioToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleAudio();
});

campMusicPrev?.addEventListener("click", (event) => {
    event.stopPropagation();

    const currentIndex = getCurrentCampMusicIndex();
    const previousIndex =
        currentIndex === 0 ? campMusicTracks.length - 1 : currentIndex - 1;

    selectCampMusic(campMusicTracks[previousIndex].key, true);
});

campMusicNext?.addEventListener("click", (event) => {
    event.stopPropagation();

    const currentIndex = getCurrentCampMusicIndex();
    const nextIndex =
        currentIndex === campMusicTracks.length - 1 ? 0 : currentIndex + 1;

    selectCampMusic(campMusicTracks[nextIndex].key, true);
});

campMusicPlayToggle?.addEventListener("click", (event) => {
    event.stopPropagation();

    const activeTrack = getCurrentCampMusicTrack();

    if (!currentCampMusicAudio) {
        playCampMusic(activeTrack);
        return;
    }

    if (currentCampMusicAudio.paused) {
        currentCampMusicAudio.play().catch((error) => {
            console.warn("Musique du camp bloquée :", error);
        });
        return;
    }

    currentCampMusicAudio.pause();
});

campMusicProgress?.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!currentCampMusicAudio || !currentCampMusicAudio.duration) return;

    const rect = campMusicProgress.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));

    currentCampMusicAudio.currentTime = currentCampMusicAudio.duration * ratio;
    updateCampMusicPlayer();
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeHunterPopup();
    }
});

window.addEventListener("load", () => {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    if (!window.location.hash) {
        history.replaceState(null, "", "#/projets");
    }

    renderCampProgress(0);
    applyTheme();
    applyStaticTranslations();
    applyAudioState();
    renderCampTabs();
    setupCampTabs();
    renderRoute();
    initCampfireScene();
    initCharacterScene();
});

window.addEventListener("popstate", () => {
    renderRoute();

    if (hunterPopup.classList.contains("is-open")) {
        renderHunterPopupContent();
    }
});

window.addEventListener("click", () => {
    startIntroFromClick();
});
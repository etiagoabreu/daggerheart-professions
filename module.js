const MODULE_ID = 'daggerheart-professions';

Hooks.once("ready", async () => {
  const folderName = "Daggerheart - Professions";

  let folder = game.folders.find(
    f => f.type === "Compendium" && f.name === folderName
  );

  if (!folder) {
    folder = await Folder.create({
      name: folderName,
      type: "Compendium",
      color: "#2b2b2b"
    });
  }

  const packs = [
    "professions"
  ];

  for (const packName of packs) {
    const pack = game.packs.get(
      `daggerheart-professions.${packName}`
    );

    if (pack && pack.folder !== folder.id) {
      await pack.configure({
        folder: folder.id
      });
    }
  }
});

Hooks.on('ready', async () => {
    // Only run if the system is Daggerheart
    if (game.system.id !== 'daggerheart') return;

    // Register domains in system settings
    await registerDomains();
});

async function registerDomains() {
    // Access Daggerheart Homebrew Settings
    // The system stores homebrew config in a setting named 'Homebrew' (case sensitive check needed)

    // Check if the setting exists
    let homebrewSettings;
    try {
        homebrewSettings = game.settings.get('daggerheart', 'Homebrew');
    } catch (e) {
        try {
            homebrewSettings = game.settings.get('daggerheart', 'homebrew');
        } catch (e2) {
            console.warn(`${MODULE_ID} | Could not find Daggerheart 'Homebrew' or 'homebrew' setting.`);
            return;
        }
    }

    if (!homebrewSettings) return;

    const domainData = {
        'alchemist': {
            id: 'alchemist',
            label: 'Alchemist',
            src: `modules/${MODULE_ID}/icons/svg/alchemist.svg`,
            description: 'The Alchemist domain.'
        }
    };

    let updates = false;
    // user domains are in homebrewSettings.domains
    const currentDomains = { ...(homebrewSettings.domains || {}) };

    for (const [key, data] of Object.entries(domainData)) {
        if (!currentDomains[key]) {
            console.log(`${MODULE_ID} | Registering missing domain: ${data.label}`);
            currentDomains[key] = data;
            updates = true;
        }
    }

    if (updates) {
        // Update the setting
        try {
            // We need to keep the structure of homebrewSettings intact
            const newSettings = {
                ...homebrewSettings,
                domains: currentDomains
            };

            // We need to know the Key used to set it.
            let key = 'Homebrew';
            if (game.settings.settings.has('daggerheart.homebrew')) key = 'homebrew';

            await game.settings.set('daggerheart', key, newSettings);

            ui.notifications.info(`${MODULE_ID} | Registered missing domains in Homebrew Settings.`);
        } catch (err) {
            console.error(`${MODULE_ID} | Failed to update settings:`, err);
        }
    }
}
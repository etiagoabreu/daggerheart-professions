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
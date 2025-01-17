const tier = (userData) => {
    const currentTime = Date.now()
    if (userData.premium && currentTime < (userData.premium.endDate)*1000) {
        const lastSave = (userData.saves.lastSave);
        const lastGen = (userData.generations.lastGen);
        const lastSaveDate = new Date(lastSave).setHours(0, 0, 0, 0);
        const lastGenDate = new Date(lastGen).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        if (lastSaveDate < today || lastGenDate < today) {
            userData.saves.quests = 10;
            userData.generations.count = 10;
            userData.saves.lastSave = new Date;
            userData.generations.lastGen = new Date;
        }

        let userOnboarded = userData.userPreferences === undefined;
        userData.tier = "premium"
        return {
            status: true,
            userData: userData,
            newUser: userOnboarded,
        };
    } 
    // Free tier handling
    else if (userData.freeTier && currentTime < (userData.freeTier.endDate)*1000) {
        const lastSave = (userData.saves.lastSave);
        const lastGen = (userData.generations.lastGen);
        const timeDiffSave = Math.floor((currentTime - lastSave) / 1000);
        const timeDiffGen = Math.floor((currentTime - lastGen) / 1000);

        if (timeDiffSave >= 86400 || timeDiffGen >= 86400) {
            userData.saves.quests = 3;
            userData.generations.count = 3;
            userData.saves.lastSave = new Date;
            userData.generations.lastGen = new Date;
        }
        let userOnboarded = userData.userPreferences === undefined;
        userData.tier = "free"
        return {
            status: true,
            userData: userData,
            newUser: userOnboarded,
        };
    } 
    // No active tier - reset everything to 0
    else {
        userData.generations.count = 0;
        userData.saves.quests = 0;
        userData.saves.lastSave =  Date.now();
        userData.generations.lastGen =  Date.now();
        userData.tier = "expired"
        return { 
            status: true,
            userData: userData,
            newUser: false
        };
    }
}

module.exports = { tier };
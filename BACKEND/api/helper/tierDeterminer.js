const date = (date) => {
    return date._seconds * 1000;
}

const tier = (userData) => {
    const currentTime = Date.now()
    if (userData.premium && currentTime < date(userData.premium.endDate)) {
        const lastSave = date(userData.saves.lastSave);
        const lastGen = date(userData.generations.lastGen);
        const lastSaveDate = new Date(lastSave).setHours(0, 0, 0, 0);
        const lastGenDate = new Date(lastGen).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
         console.log(lastSaveDate, lastGenDate, today)
        if (lastSaveDate < today || lastGenDate < today) {
            userData.saves.quests = 10;
            userData.generations.count = 10;
            userData.saves.lastSave = { _seconds: Math.floor(currentTime / 1000) };
            userData.generations.lastGen = { _seconds: Math.floor(currentTime / 1000) };
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
    else if (userData.freeTier && currentTime < date(userData.freeTier.endDate)) {
        const lastSave = date(userData.saves.lastSave);
        const lastGen = date(userData.generations.lastGen);
        const timeDiffSave = Math.floor((currentTime - lastSave) / 1000);
        const timeDiffGen = Math.floor((currentTime - lastGen) / 1000);

        if (timeDiffSave >= 86400 || timeDiffGen >= 86400) {
            userData.saves.quests = 3;
            userData.generations.count = 3;
            userData.saves.lastSave =  { _seconds: Math.floor(currentTime / 1000) };
            userData.generations.lastGen =  { _seconds: Math.floor(currentTime / 1000) };
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
        console.log("expired")
        userData.generations.count = 0;
        userData.saves.quests = 0;
        userData.saves.lastSave =  { _seconds: Math.floor(currentTime / 1000) };
        userData.generations.lastGen =  { _seconds: Math.floor(currentTime / 1000) };
        userData.tier = "expired"
        return { 
            status: true,
            userData: userData,
            newUser: false
        };
    }
}

module.exports = { tier };
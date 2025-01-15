function userDataMasker(userData){
    let output = {
        name: userData.name,
        email: userData.email,
        photo: userData.photo,
        categories: userData.categories,
        freeTier: userData.freeTier,
        generations: userData.generations,
        premium: {
          endDate: userData.premium ? userData.premium.endDate : null,
          startDate: userData.premium ? userData.premium.startDate : null,
        },
        publicLinks: userData.publicLinks,
        saves: userData.saves,
        tier: userData.tier,
        userPreferences: userData.userPreferences,
    }

    return output;
}

module.exports={userDataMasker};
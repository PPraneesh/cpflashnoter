function userDataMasker(userData){
    let output = {
        name: userData.name,
        email: userData.email,
        photo: userData.photo,
        categories: userData.categories ? userData.categories : [],
        freeTier: userData.freeTier,
        generations: userData.generations,
        premium: {
          endDate: userData.premium ? userData.premium.endDate : null,
          startDate: userData.premium ? userData.premium.startDate : null,
        },
        publicLinks: userData.publicLinks ? userData.publicLinks : [],
        saves: userData.saves,
        tier: userData.tier,
        userPreferences: userData.userPreferences ? userData.userPreferences : {},
        fcmToken: userData.fcmToken? userData.fcmToken: {token:"", createdAt:0},
    }

    return output;
}

module.exports={userDataMasker};
const db = require("../config/db");
const { FieldValue, Timestamp } = require('firebase-admin/firestore');


// getRevise remains unchanged as it doesn't deal with analytics
async function getRevise(req, res) {
    let user_email = req.user.email;
    const userRef = db.collection("users").doc(user_email);
    const cpCollection = userRef.collection("cp");
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    if(userData.tier == "expired"){
        res.send({
            status: false,
            reason: "Please upgrade to premium to access this feature, your free trial has expired",
        })
    }else{
    const currentDate = Date.now();
    try {
        const snapshot = await cpCollection.get();
        let questionsToRevise = [];
        snapshot.forEach(doc => {
            let data = doc.data();
            if (data.revObj && data.revObj.nextRev) {
                const nextRevDate = data.revObj.nextRev._seconds * 1000;
                if (nextRevDate <= currentDate) {
                    questionsToRevise.push({ id: doc.id, ...data });
                }
            }
        });
        res.status(200).json({status: true, questions: questionsToRevise});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }}
}

async function updateRev(req, res) {
    const {email} = req.user;
    const { 
        questionId, 
        timeSpent,
        switches = 0,
        usedHints = false,
        confidence = 3,
        shownHints = 0,
        category = []
    } = req.body;
    
    const userRef = db.collection("users").doc(email);
    const questionRef = userRef.collection("cp").doc(questionId);

    try {
        const doc = await questionRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Question not found" });

        const data = doc.data();
        const baseDelay = calculateBaseDelay(confidence, data.revObj?.revNum || 0);
        const nextRev = calculateNextRevision(baseDelay, data.revObj?.revNum || 0);
        const dateKey = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
            .toISOString().split('T')[0];

        // Get current lifetime stats for confidence calculation
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const lifetimeStats = userData.revisionAnalytics?.lifetimeStats || {
            totalRevisions: 0,
            totalConfidenceSum: 0,
            totalTimeSpent: 0,
            averageConfidence: 0
        };

        // Calculate new confidence average
        const newTotalRevisions = lifetimeStats.totalRevisions + 1;
        const newConfidenceSum = (lifetimeStats.totalConfidenceSum || 0) + confidence;
        const newAverageConfidence = parseFloat((newConfidenceSum / newTotalRevisions).toFixed(1));

        const batch = db.batch();

        // Update question revision data
        batch.update(questionRef, {
            "revObj.revNum": FieldValue.increment(1),
            "revObj.nextRev": Timestamp.fromDate(nextRev),
            "revObj.lastRev": Timestamp.fromDate(new Date()),
            "revObj.confidence": confidence,
            "revObj.timeSpent": FieldValue.increment(timeSpent),
            "revObj.switches": switches,
            "revObj.usedHints": usedHints,
            "revObj.shownHints": shownHints
        });

        // Create analytics updates
        const analyticsUpdate = {
            // Daily activity updates
            [`revisionAnalytics.dailyActivity.${dateKey}.count`]: FieldValue.increment(1),
            [`revisionAnalytics.dailyActivity.${dateKey}.timeSpent`]: FieldValue.increment(timeSpent),
            [`revisionAnalytics.dailyActivity.${dateKey}.totalSwitches`]: FieldValue.increment(switches),
            [`revisionAnalytics.dailyActivity.${dateKey}.hintsUsed`]: FieldValue.increment(usedHints ? 1 : 0),
            [`revisionAnalytics.dailyActivity.${dateKey}.averageConfidence`]: confidence,
            [`revisionAnalytics.dailyActivity.${dateKey}.date`]: dateKey,

            // Lifetime stats updates
            'revisionAnalytics.lifetimeStats.totalRevisions': FieldValue.increment(1),
            'revisionAnalytics.lifetimeStats.totalTimeSpent': FieldValue.increment(timeSpent),
            'revisionAnalytics.lifetimeStats.totalConfidenceSum': FieldValue.increment(confidence),
            'revisionAnalytics.lifetimeStats.averageConfidence': newAverageConfidence
        };

        // Update category stats
        (category || []).forEach(cat => {
            analyticsUpdate[`revisionAnalytics.categoryStats.${cat}.totalRevisions`] = FieldValue.increment(1);
            analyticsUpdate[`revisionAnalytics.categoryStats.${cat}.totalTimeSpent`] = FieldValue.increment(timeSpent);
            analyticsUpdate[`revisionAnalytics.categoryStats.${cat}.lastRevised`] = new Date();
            analyticsUpdate[`revisionAnalytics.categoryStats.${cat}.averageConfidence`] = confidence;
        });

        batch.update(userRef, analyticsUpdate);

        // Update streaks
        const streakUpdate = calculateStreakUpdate(userData.revisionAnalytics?.streaks, dateKey);
        batch.update(userRef, {
            'revisionAnalytics.streaks': streakUpdate
        });

        await batch.commit();
        await cleanupOldAnalytics(userRef);

        res.status(200).json({ 
            message: "Revision updated successfully",
            nextRevision: nextRev
        });
    } catch (error) {
        console.error("Error updating revision:", error);
        res.status(500).json({ error: error.message });
    }
}

async function getAnalytics(req, res) {
    const user_email = req.user.email;
    const userRef = db.collection("users").doc(user_email);

    try {
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = doc.data();
        const categoryDistributions = userData.categories || [];
        const analytics = userData.revisionAnalytics || {};
        const dailyActivity = analytics.dailyActivity || {};
        const lifetimeStats = analytics.lifetimeStats || {
            totalRevisions: 0,
            totalTimeSpent: 0,
            averageConfidence: 0
        };

        // Get last 7 days of activity
        const last7DaysActivity = getLast7DaysActivity(dailyActivity);

        const categoryStatsObj = analytics.categoryStats || {};
        const questionsSnapshot = await userRef.collection("cp").get();
        const numberOfQuestions = questionsSnapshot.size;
        const questions = [];
        questionsSnapshot.forEach(doc => {
            questions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const recentQuestions = questions
            .filter(q => q.revObj && q.revObj.lastRev && q.revObj.revNum > 1)
            .sort((a, b) => b.revObj.lastRev.toDate() - a.revObj.lastRev.toDate())
            .slice(0, 5)
            .map(q => ({
                questionId: q.id,
                name: q.name,
                categories: q.categories || [],
                lastRevised: q.revObj.lastRev.toDate().toISOString(),
                nextRevision: q.revObj.nextRev?.toDate()?.toISOString() || null,
                revisionCount: q.revObj.revNum || 0,
                confidence: q.revObj.confidence || 0,
                timeSpent: q.revObj.timeSpent || 0,
                switches: q.revObj.switches || 0,
                usedHints: q.revObj.usedHints || false,
                shownHints: q.revObj.shownHints || 0
            }));

        const processedCategoryStats = Object.entries(categoryStatsObj).map(([category, stats]) => ({
            category,
            totalRevisions: stats.totalRevisions || 0,
            totalTimeSpent: stats.totalTimeSpent || 0,
            averageConfidence: stats.averageConfidence || 0
        }));

        const response = {
            dailyStats: last7DaysActivity,
            categoryStats: processedCategoryStats,
            numberOfQuestions,
            recentQuestions,
            overallStats: {
                totalRevisions: lifetimeStats.totalRevisions,
                totalTimeSpent: lifetimeStats.totalTimeSpent,
                totalQuestions: numberOfQuestions,
                averageConfidence: lifetimeStats.averageConfidence
            },
            streaks: analytics.streaks || {
                currentStreak: 0,
                longestStreak: 0,
                lastRevisionDate: null
            },
            categoryDistributions
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ error: error.message });
    }
}

// Helper functions remain mostly unchanged
function getLast7DaysActivity(dailyActivity) {
    const last7Days = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        last7Days[dateKey] = dailyActivity[dateKey] || {
            count: 0,
            timeSpent: 0,
            totalSwitches: 0,
            hintsUsed: 0,
            averageConfidence: 0,
            date: dateKey
        };
    }
    
    return last7Days;
}

async function cleanupOldAnalytics(userRef) {
    try {
        const doc = await userRef.get();
        const userData = doc.data();
        const dailyActivity = userData.revisionAnalytics?.dailyActivity || {};
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        const updatedDailyActivity = {};
        Object.entries(dailyActivity)
            .filter(([date]) => date >= cutoffDate)
            .forEach(([date, data]) => {
                updatedDailyActivity[date] = data;
            });
            
        await userRef.update({
            'revisionAnalytics.dailyActivity': updatedDailyActivity
        });
    } catch (error) {
        console.error("Error cleaning up old analytics:", error);
    }
}

function calculateStreakUpdate(currentStreaks = {}, dateKey) {
    const today = new Date(dateKey);
    const lastRevision = currentStreaks.lastRevisionDate ? new Date(currentStreaks.lastRevisionDate) : null;
    let streak = currentStreaks.currentStreak || 0;
    
    if (!lastRevision) {
        streak = 1;
    } else {
        const diffDays = Math.floor((today - lastRevision) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            streak = currentStreaks.currentStreak;
        } else if (diffDays === 1) {
            streak += 1;
        } else {
            streak = 1;
        }
    }
    
    return {
        currentStreak: streak,
        longestStreak: Math.max(streak, currentStreaks.longestStreak || 0),
        lastRevisionDate: dateKey
    };
}

function calculateBaseDelay(confidence, revisionCount) {
    const confidenceDelay = confidence <= 2 ? 1 : 
                           confidence === 3 ? 2 :
                           confidence === 4 ? 3 : 4;
    
    const revisionMultiplier = revisionCount >= 4 ? 2 : 1;
    
    return confidenceDelay * revisionMultiplier;
}

function calculateNextRevision(baseDelay, revisionCount) {
    const multiplier = Math.min(Math.pow(1.5, revisionCount), 10);
    const daysToAdd = Math.round(baseDelay * multiplier);
    
    const nextRev = new Date();
    nextRev.setDate(nextRev.getDate() + daysToAdd);
    return nextRev;
}

module.exports = {
    getRevise,
    updateRev,
    getAnalytics
};
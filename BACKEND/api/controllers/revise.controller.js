const db = require("../config/db");
const { FieldValue, Timestamp } = require('firebase-admin/firestore');


async function getRevise(req, res) {
    let user_email = req.user.email;
    const userRef = db.collection("users").doc(user_email);
    const cpCollection = userRef.collection("cp");
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    try {
        const snapshot = await cpCollection.get();
        let questionsToRevise = [];
        snapshot.forEach(doc => {
            let data = doc.data();
            if (data.revObj && data.revObj.nextRev) {
                const nextRevDate = new Date(data.revObj.nextRev.toDate());
                nextRevDate.setHours(0, 0, 0, 0);
                if (nextRevDate <= currentDate) {
                    questionsToRevise.push({ id: doc.id, ...data });
                }
            }
        });
        res.status(200).json(questionsToRevise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


  
async function updateRev(req, res) {
    const user_email = req.user.email;
    const { 
        questionId, 
        timeSpent,  // Already in seconds from frontend
        switches = 0,
        usedHints = false,
        confidence = 3,
        shownHints = 0,
        category = []
    } = req.body;
    
    const userRef = db.collection("users").doc(user_email);
    const questionRef = userRef.collection("cp").doc(questionId);

    try {
        const doc = await questionRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Question not found" });

        const data = doc.data();
        
        const baseDelay = calculateBaseDelay(confidence, data.revObj?.revNum || 0);
        const nextRev = calculateNextRevision(baseDelay, data.revObj?.revNum || 0);

        const localDate = new Date();
        // Converts to YYYY-MM-DD in local time
        const dateKey = new Date().toISOString().split('T')[0]; 
        const batch = db.batch();

        // Store timestamps consistently
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

        const analyticsUpdate = createAnalyticsUpdate(dateKey, timeSpent, category, {
            switches,
            usedHints,
            confidence,
            shownHints
        });

        batch.update(userRef, analyticsUpdate);

        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const streakUpdate = calculateStreakUpdate(userData.revisionAnalytics?.streaks, dateKey);
        
        batch.update(userRef, {
            'revisionAnalytics.streaks': streakUpdate
        });

        await batch.commit();
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
        const analytics = userData.revisionAnalytics || {};
        const dailyActivity = analytics.dailyActivity || {};
        const categoryStatsObj = analytics.categoryStats || {};

        // Get all questions for this user
        const questionsSnapshot = await userRef.collection("cp").get();
        const questions = [];
        questionsSnapshot.forEach(doc => {
            questions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Build recentQuestions from questions sorted by lastRev
        const recentQuestions = questions
            .filter(q => q.revObj && q.revObj.lastRev)
            .sort((a, b) => b.revObj.lastRev.toDate() - a.revObj.lastRev.toDate())
            .slice(0, 5)
            .map(q => ({
                questionId: q.id,
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

        // Convert categoryStats object into an array for the bar chart
        const processedCategoryStats = Object.entries(categoryStatsObj).map(([category, stats]) => ({
            category,
            totalRevisions: stats.totalRevisions || 0,
            totalTimeSpent: stats.totalTimeSpent || 0,
            averageConfidence: stats.averageConfidence || 0
        }));

        // Compute overall stats from dailyActivity
        const totalRevisions = Object.values(dailyActivity)
            .reduce((sum, day) => sum + (day.count || 0), 0);

        const totalTimeSpent = Object.values(dailyActivity)
            .reduce((sum, day) => sum + (day.timeSpent || 0), 0);

        const averageConfidence = computeDailyConfidence(dailyActivity);

        const response = {
            dailyStats: dailyActivity,
            categoryStats: processedCategoryStats,
            recentQuestions,
            overallStats: {
                totalRevisions,
                totalTimeSpent,
                totalQuestions: questionsSnapshot.size,
                averageConfidence,
            },
            streaks: analytics.streaks || {
                currentStreak: 0,
                longestStreak: 0,
                lastRevisionDate: null
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ error: error.message });
    }
}

function computeDailyConfidence(dailyActivity) {
    let totalConfidence = 0;
    let revisionCount = 0;
    for (const dayKey in dailyActivity) {
        const dayData = dailyActivity[dayKey];
        if (dayData.averageConfidence && dayData.count) {
            totalConfidence += dayData.averageConfidence * dayData.count; 
            revisionCount += dayData.count;
        }
    }
    return revisionCount > 0 ? parseFloat((totalConfidence / revisionCount).toFixed(1)) : 0;
}

  

function calculateStreakUpdate(currentStreaks = {}, dateKey) {
    const today = new Date(dateKey);
    const lastRevision = currentStreaks.lastRevisionDate ? new Date(currentStreaks.lastRevisionDate) : null;
    
    let streak = currentStreaks.currentStreak || 0;
    if (!lastRevision) {
        streak = 1;
    } else {
        const diffDays = Math.floor((today - lastRevision) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) streak += 1;
        else streak = 1;
    }

    return {
        currentStreak: streak,
        longestStreak: Math.max(streak, currentStreaks.longestStreak || 0),
        lastRevisionDate: dateKey
    };
}

// Helper functions for enhanced scheduling
function calculateBaseDelay(confidence, revisionCount) {
    // Base delay increases with confidence and revision count
    const confidenceDelay = confidence <= 2 ? 1 : 
                           confidence === 3 ? 2 :
                           confidence === 4 ? 3 : 4;
    
    // After 4 revisions, increase intervals more aggressively
    const revisionMultiplier = revisionCount >= 4 ? 2 : 1;
    
    return confidenceDelay * revisionMultiplier;
}

function calculateNextRevision(baseDelay, revisionCount) {
    // Exponential spacing for later revisions
    const multiplier = Math.min(Math.pow(1.5, revisionCount), 10);
    const daysToAdd = Math.round(baseDelay * multiplier);
    
    const nextRev = new Date();
    nextRev.setDate(nextRev.getDate() + daysToAdd);
    return nextRev;
}

function createAnalyticsUpdate(dateKey, timeSpent, categories, metrics) {
    const update = {
        [`revisionAnalytics.dailyActivity.${dateKey}.count`]: FieldValue.increment(1),
        [`revisionAnalytics.dailyActivity.${dateKey}.timeSpent`]: FieldValue.increment(timeSpent),
        [`revisionAnalytics.dailyActivity.${dateKey}.totalSwitches`]: FieldValue.increment(metrics.switches),
        [`revisionAnalytics.dailyActivity.${dateKey}.hintsUsed`]: FieldValue.increment(metrics.usedHints ? 1 : 0),
        [`revisionAnalytics.dailyActivity.${dateKey}.averageConfidence`]: metrics.confidence
    };

    // Also store stats per category
    (categories || []).forEach(category => {
        update[`revisionAnalytics.categoryStats.${category}.totalRevisions`] = FieldValue.increment(1);
        update[`revisionAnalytics.categoryStats.${category}.totalTimeSpent`] = FieldValue.increment(timeSpent);
        update[`revisionAnalytics.categoryStats.${category}.lastRevised`] = new Date();
        update[`revisionAnalytics.categoryStats.${category}.averageConfidence`] = metrics.confidence;
    });

    return update;
}

function calculateAverageConfidence(categoryStats) {
    let totalConfidence = 0;
    let totalEntries = 0;

    Object.values(categoryStats).forEach(cat => {
        if (cat.averageConfidence) {
            totalConfidence += cat.averageConfidence;
            totalEntries++;
        }
    });

    return totalEntries > 0 ? Math.round((totalConfidence / totalEntries) * 10) / 10 : 0;
}

module.exports = {
    getRevise,
    updateRev,
    getAnalytics
};
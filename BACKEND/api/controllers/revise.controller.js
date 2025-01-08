const db = require("../config/db");

async function getRevise(req, res) {
    let user_email = req.user.email;
    const userRef = db.collection("users").doc(user_email);
    const cpCollection = userRef.collection("cp");
    const currentDate = new Date();
    // currentDate.setTime(0,0,0,0)

    try {
        const snapshot = await cpCollection.get();
        let questionsToRevise = [];
        snapshot.forEach(doc => {
            let data = doc.data();
            if (data.revObj && (data.revObj.nextRev) < currentDate) {
                questionsToRevise.push({ id: doc.id, ...data });
            }
        });
        res.status(200).json(questionsToRevise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateRev(req, res) {
    let user_email = req.user.email;
    const { questionId } = req.body;
    const userRef = db.collection("users").doc(user_email);
    const questionRef = userRef.collection("cp").doc(questionId);

    try {
        const doc = await questionRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Question not found" });
        }

        let data = doc.data();
        let revNum = data.revObj.revNum;
        let nextRev = new Date();
        // Set time to beginning of day
        nextRev.setHours(0, 0, 0, 0);
        
        switch (revNum) {
            case 1:
            nextRev.setDate(nextRev.getDate() + 1);
            break;
            case 2:
            nextRev.setDate(nextRev.getDate() + 3);
            break;
            case 3:
            nextRev.setDate(nextRev.getDate() + 7);
            break;
            default:
            nextRev.setMonth(nextRev.getMonth() + 1);
            break;
        }

        await questionRef.update({
            "revObj.revNum": revNum + 1,
            "revObj.nextRev": nextRev,
            "revObj.lastRev": new Date()
        });

        res.status(200).json({ message: "Revision updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getRevise, updateRev };
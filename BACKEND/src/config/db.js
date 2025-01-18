const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

const serviceAccountKey = {
"type":process.env.F_type, 
"project_id":process.env.F_project_id,
"private_key_id":process.env.F_private_key_id,
"private_key":process.env.F_private_key.replace(/\\n/g, '\n'),
"client_email":process.env.F_client_email,
"client_id":process.env.F_client_id,
"auth_uri":process.env.F_auth_uri,
"token_uri":process.env.F_token_uri,
"auth_provider_x509_cert_url":process.env.F_auth_provider_x509_cert_url,
"client_x509_cert_url":process.env.F_client_x509_cert_url,
"universe_domain":process.env.F_universe_domain
}
initializeApp({
    credential: cert(serviceAccountKey),
});
const db = getFirestore();

module.exports = db;
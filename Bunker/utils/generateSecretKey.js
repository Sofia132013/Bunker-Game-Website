export default function generateSecretKey() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let secretKey = '';
    for (let i = 0; i < 6; i++) {
        secretKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secretKey;
}
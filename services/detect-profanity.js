class DetectProfanityService {
    #badWords = [
        "fuck",
        "fucking",
        "shit",
        "bitch",
        "asshole",
        "pussy", 
        "dick",
        "bastard",
        "slut",
        "damn",
        "cunt"
    ];
    constructor(){}
    censorBadWords(string){
        const regex = new RegExp(`\\b(${this.#badWords.join("|")})\\b`, "gi");
        return string.replace(regex, "***");
    }
}

const detectProfanityService = new DetectProfanityService
module.exports = detectProfanityService
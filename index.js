const { RSA } = require("./keygen/RSA")
const {encrypt, decrypt, getAsciiArrFromFile, readFile, writeFileFromArr , readEncryptedFile, writeAsJSON} = require("./crypt/cryptor")
const commander = require('commander');
const {option} = require("commander");

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-k, --keys', 'Detects if the flag is present.')
    .option('-e, --encrypt', 'Detects if the flag is present.')
    .option('-d, --decrypt', 'Detects if the flag is present.')
    .option('-f, --file <value>', 'Overwriting value.', '')
    .option('--public <value>', 'Overwriting value.', '')
    .option('--private <value>', 'Overwriting value.', '')
    .parse(process.argv);

const options = commander.opts();

if (options.keys) {  // хотим сгенерировать ключи
    console.log('> Generating keys...')

    const rsa = new RSA();
    rsa.getKeys()

    console.log('> ...Done')
} else {
    if (options.encrypt && options.file && options.public) {
        console.log("> Encrypting...")

        const key = readFile(options.public)
        const blob = getAsciiArrFromFile(options.file)
        const enc = encrypt(blob, key)
        writeAsJSON(enc)

        console.log('> ...Done')
    } else if (options.decrypt && options.file && options.private) {
        console.log("> Decrypting")

        const key = readFile(options.private)
        const blob = readEncryptedFile(options.file)
        const decrypted = decrypt(blob, key)
        writeFileFromArr(decrypted)


        console.log('> ...Done')
    } else {
        console.log("Usage: node index.js -k |\n\t\t     -e -f [path to file]" +
            " --public [path to public key]| \n\t\t     -d -f [path to file] --private [path to private key]")
    }
}



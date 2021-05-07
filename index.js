const { Telegraf } = require('telegraf')
const fs = require('fs')
const {config} = require("dotenv");
config()
const bot = new Telegraf(process.env.BOT_TOKEN)
let user = {}

bot.start((ctx) => {
    const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
    let bormi = false
    bormi = users.some(element => {
        return element.id == ctx.message.from.id
    });
    if (bormi) {
        user = users.find(e => e.id == ctx.message.from.id)
    }
    else {
        user.id = ctx.message.from.id
        user.lang = 'uz'
        user.level = 'start'
        users.push(user)
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
    }
    ctx.telegram.sendMessage(ctx.chat.id, `Assalomu aleykum Eduz o'quv markazimizning
 rasmiy botiga xush kelibsiz `, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "tilni tanlash", callback_data: "til" },
                    { text: "kurslarni ko'rish", callback_data: "kurs" }
                ]
            ]

        }
    })
})

bot.on('callback_query', (ctx) => {
    let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
    let user = users.find(e => e.id == ctx.callbackQuery.from.id)
    user.level = "til"
    fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
    if (ctx.callbackQuery.data == 'til') {
        ctx.telegram.sendMessage(ctx.chat.id, `tilni tanlang `, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "uz", callback_data: "tanlauz" },
                        { text: "en", callback_data: "tanlaen" }
                    ],
                    [
                        { text: "ortga", callback_data: "start" }
                    ]
                ]

            }
        })
    }
    else if (ctx.callbackQuery.data == 'start') {
        const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
        let bormi = false
        bormi = users.some(element => {
            return element.id == ctx.callbackQuery.from.id
        });
        if (bormi) {
            user = users.find(e => e.id == ctx.callbackQuery.from.id)
        }
        else {
            user.id = ctx.callbackQuery.from.id
            user.lang = 'uz'
            user.level = 'start'
            users.push(user)
            fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        }
        ctx.telegram.sendMessage(ctx.chat.id, `Assalomu aleykum Eduz o'quv markazimizning
 rasmiy botimizga xush kelibsiz `, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "tilni tanlash", callback_data: "til" },
                        { text: "kurslarni ko'rish", callback_data: "kurs" }
                    ]
                ]

            }
        })
    } else if (/tanla/.test(ctx.callbackQuery.data)) {
        let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
        let user = users.find(e => e.id == ctx.callbackQuery.from.id)
        user.lang = ctx.callbackQuery.data.slice(-2)
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        ctx.telegram.sendMessage(ctx.chat.id, `Assalomu aleykum Eduz o'quv markazimizning
 rasmiy botimizga xush kelibsiz `, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "tilni tanlash", callback_data: "til" },
                        { text: "kurslarni ko'rish", callback_data: "kurs" }
                    ]
                ]

            }
        })
    } else if (ctx.callbackQuery.data == 'kurs') {

        let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
        let user = users.find(e => e.id == ctx.callbackQuery.from.id)
        user.level = 'kurs'
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        const kurslar = JSON.parse(fs.readFileSync(`${__dirname}/kurs.json`, 'utf-8'))

        let board = []
        for (let i = 0; i < kurslar.length; i += 2) {
            if (i == kurslar.length - 1) {
                board.push([{ text: kurslar[i].kurs_nomi, callback_data: kurslar[i].kurs_id + "-kurs" }])
            }
            else {
                board.push([{ text: kurslar[i].kurs_nomi, callback_data: kurslar[i].kurs_id + '-kurs' }, { text: kurslar[i + 1].kurs_nomi, callback_data: kurslar[i + 1].kurs_id + "-kurs" }])
            }
        }
        board.push([{ text: "orqaga", callback_data: "start" }])
        ctx.telegram.sendMessage(ctx.chat.id, "Hurmatli mijoz shu yerdagi kurslardan birini tanlang", {
            reply_markup: {
                inline_keyboard: board

            }
        })
    }
    else if (/-kurs/.test(ctx.callbackQuery.data)) {
        let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
        let user = users.find(e => e.id == ctx.callbackQuery.from.id)
        user.level = "ma'lumot"
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))

        const kurslar = JSON.parse(fs.readFileSync(`${__dirname}/kurs.json`, 'utf-8'))
        for (let i = 0; i < kurslar.length; i++) {
            if (ctx.callbackQuery.data == kurslar[i].kurs_id + '-kurs') {
                const html = `<b>Kurs nomi : </b> ${kurslar[i].kurs_nomi} 
               <pre>Davomiyligi : ${kurslar[i].davomiyligi} </pre>
               <pre>Narxi : ${kurslar[i].narxi} </pre>
               <pre>${kurslar[i]["ma'lumot"]} </pre>`

                ctx.telegram.sendMessage(ctx.chat.id, html, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "orqaga", callback_data: "kurs" },
                                { text: "kursni olish", callback_data: "ism" }
                            ]
                        ]
                    }

                })
            }
        }
    }
    else if (ctx.callbackQuery.data == 'ism') {
        let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
        let user = users.find(e => e.id == ctx.callbackQuery.from.id)
        user.level = 'ism'
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        ctx.telegram.sendMessage(ctx.chat.id, "<b>Ismingizni kiriting</b>", {
            parse_mode: "HTML",
        })
    }
})
bot.command('me', (ctx) => {
    const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
    let user = users.find(e => e.id == ctx.message.from.id)
    ctx.reply(!user ? "not found" : user)
})
bot.on("text", (ctx) => {
    let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
    let user = users.find(e => e.id == ctx.message.from.id)
    if (user.level == 'ism') {
        user.ism = ctx.message.text
        user.level = 'familya'
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        ctx.telegram.sendMessage(ctx.chat.id, `<b>familyangizni kiriting</b>`, {
            parse_mode: "HTML"
        })
    } else if (user.level == 'familya') {
        user.familya = ctx.message.text
        user.level = 'raqam'
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        ctx.telegram.sendMessage(ctx.chat.id, `<b>Kontaktingizni tashlang</b>`, {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [
                        { text: 'kontakt', request_contact: true }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        })
    }
    else {
        ctx.telegram.sendMessage(ctx.chat.id, "" + ctx.message.text)
    }


})
bot.on('contact', (ctx) => {
    let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
    let user = users.find(e => e.id == ctx.message.from.id)
    if (user.level == 'raqam') {
        user.raqam = ctx.message.contact.phone_number
        user.level = 'end'
        fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users))
        ctx.telegram.sendMessage(ctx.chat.id, `<b>Registratsiya uchun rahmat</b>`, {
            parse_mode: "HTML"
        })
    }
})
bot.launch().then(() => {
    console.log("bot is running")
}).catch((err)=>{
    console.log(err)
})

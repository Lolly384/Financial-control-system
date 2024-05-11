const pg = require('pg');
const { transactionPG } = pg;
const AutoIncrement = require('pg')(pg);

const transaction = new transactionPG(
    {
        id: {
            type: Number,
            required: false,
            default: null,
        },
        type: {//Тип операции
            type: String,
            required: true,
        },
        sum: {//Сумма
            type: Number,
            required: false,
            default: null,
        },
        date: { //Дата
            type: Date,
            required: false,
            default: null,
        },
        category: {//Категория
            type: String,
            required: true,
        },
        description:{//Описание
            type: String,
            required: true,
        },
        recipient:{//Получатель
            type: String,
            required: true,
        },
        sender:{ //Отправитель
            type: String,
            required: true,
        },
        status:{
            type: Number,
            required: false,
            default: null,
        },
        accounts:{//Счет
            type: Number,
            required: false,
            default: null,
        },
    },
    { _id: false, versionKey: false, strict: false }
);

weapon.plugin(AutoIncrement);

module.exports = model('Transaction', transaction);
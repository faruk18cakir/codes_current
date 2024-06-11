const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
        content_id: Number,
        content:String,
        creater:String,           
        hastags:String,
        public_date:String,
        finish_date:String,
        keywords:String,
        firm:String,
},
{collection:'contents'});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content
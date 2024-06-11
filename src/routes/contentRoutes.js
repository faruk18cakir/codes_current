const express = require('express');
const router = express.Router();


// //Yeni content oluşturmak için kullanılacak.
router.post('/createContent', async (req, res) => {
   try {
       const {
             content_id,
             content,
             hashtags,
             public_date,
             finish_date,
             keywords,
             firm } = req.body; // POST isteğinden gelen veriler
             const creater = req.creater;
         const database = client.db('stajUygulaması'); // Veritabanı adı
         const collection = database.collection('contents'); // Koleksiyon adı

        // Veriyi ekleme
         const result = await collection.insertOne(
            {
             content_id,
             content,
             creater,
             hashtags: Array.isArray(hashtags) ? hashtags : [hashtags], // Hashtags diziye dönüştürülüyor
             public_date,
             finish_date,
             keywords: Array.isArray(keywords) ? keywords : [keywords],
             firm});
         console.log(`${result.insertedCount} adet kullanıcı eklendi.`);
         res.status(201).send('Kullanıcı başarıyla eklendi.');
     } catch (error) {
         console.error('Kullanıcı ekleme sırasında bir hata oluştu:', error);
         res.status(500).send('Kullanıcı eklenirken bir hata oluştu.');
    }
});

// her kullanıcı sadece kendi contentlerini güncelleyebilme yetkisine sahiptir.
router.put('/updateContent/:content_id', async (req, res) => {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('contents'); // Koleksiyon adı
    const creater =req.creater;
    const {content_id} = req.params; 
    const {content,hashtags,public_date,finish_date,keywords,firm}=req.body;
    const contentCheck = await collection.findOne({content_id:content_id , creater:creater})

        
        const contents = await collection.updateOne(
            { content_id:content_id},
            {$set: {content,
                    hashtags: Array.isArray(hashtags) ? hashtags : [hashtags], // Hashtags diziye dönüştürülüyor
                    public_date,
                    finish_date,
                    keywords: Array.isArray(keywords) ? keywords : [keywords],
                    firm}});
            if(!contentCheck){
               return res.status(404).json({message:"böyle bir içerik bulunamadı."})
            }
        return res.status(200).json({ message: 'Updated', contents }); 
 });

router.get('/contents', async (req, res) => {
    try {
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('contents'); // Koleksiyon adı

        // Belirli bir koşula göre belirli belgeleri getirme
        const content = await collection.find({}).toArray();
        res.json(content);
        res.status(200)
    } catch (error) {
        console.error('Belgeleri getirme sırasında bir hata oluştu:', error);
        res.status(500).send('Belgeleri getirirken bir hata oluştu.');
    }
});
//kendi contentlerini getirme.
router.get('/myContents',async (req, res) => {
    try {
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('contents'); // Koleksiyon adı
        const creater= req.creater;
        // Belirli bir koşula göre belirli belgeleri getirme
        const content = await collection.find({creater:creater}).toArray();
        res.json(content);
    } catch (error) {
        console.error('Belgeleri getirme sırasında bir hata oluştu:', error);
        res.status(500).send('Belgeleri getirirken bir hata oluştu.');
    }
});

router.get('/contents/:hashtag', async(req, res) =>{
    try{
        const database = client.db('stajUygulaması');
        const collection = database.collection('contents');
        const hashtag= req.params;

        const content = await collection.find({hashtags:hashtag}).toArray();
        if(!content){
            res.status(404).send('Aranan hashtagte bir içerik bulunamamıştır.');
        }
        res.json(content);
    }catch(error){
        console.error('Belgeleri getirme sırasında bir hata oluştu.',error);
        res.status(500).send('Belgeleri getirirken bir hata oluştu.');
    }
});

module.exports = router;
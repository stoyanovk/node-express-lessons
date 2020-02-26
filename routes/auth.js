const Router = require("express");

const router = new Router();

router.get('/',(req, res)=>{
    res.render('auth',{
        title: 'Enter'
    })
})

module.exports = router;

const Koa = require('koa');
const app = new Koa();

const Router = require('@koa/router');
const router = new Router();

const bodyParser = require('koa-bodyparser');

const Kmb = require('js-kmb-api').default;
const kmb = new Kmb;




router.get('/kmbETA', async (ctx) => {
    console.log('kmbETA')
    let parm = ctx.request.query
    const route = await kmb.getRoutes(parm.route)
    
    const variants = await route.find(e => e.bound == parm.bound).getVariants()

    const stops = await variants.find(e => e.serviceType == parm.serviceType).getStoppings();


    let data = await Promise.all(stops.map(async (stop) => {
        try {
            eta = await stop.getEtas();
  
        return eta; 
        } catch(err) {
           throw err;
        }
    }));
    

    console.log(data)
    ctx.status = 200
    ctx.body = data

})



app
    .use(bodyParser({enableTypes: ['json', 'form', 'text']}))
  .use(router.routes())

app.listen(3000, () => console.log('Koa app listening on 3000'));

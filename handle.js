const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');


//爬取拉勾网职位信息
module.exports.testOne = function(){
    (async () => {
        const browser = await puppeteer.launch({
            headless:false //关闭无头模式，使浏览器可见
        });

        const page = await browser.newPage();
        //设置网页大小(分辨率)
        await page.setViewport({width: 1920, height: 1080});
        let url = 'https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91?px=default&gx=%E5%85%A8%E8%81%8C&gj=&isSchoolJob=1&city=%E5%B9%BF%E5%B7%9E#filterBox';
        await page.goto(url,{
            waitUntil: 'networkidle2'  // 网络空闲说明已加载完毕
        });

        // 结果
        const result = await page.evaluate(() => {
            //拿到页面上的jQuery
            var $ = window.$;
            let all_job = [];
            var items = $('.con_list_item');
            items.each(function(item){
                let job = $(this);
                //职位名字
                let job_name = job.find('h3').text();
                let address = job.find('.add').text();
                let money = job.find('.money').text();
                let experience = job.find('.li_b_l').text().String;  //把内容里的多余空白内容去掉
                let company_name = job.find('.company_name a').text();
                let intro = job.find('.industry').text().String;  //把内容里的多余空白内容去掉
                let feature = job.find('.li_b_r').text();

                all_job.push({
                    job_name: job_name,
                    address: address,
                    money:money,
                    experience:experience,
                    company_name:company_name,
                    intro:intro,
                    feature:feature
                });
            });

            return all_job
        });
        await browser.close();
        console.log(result)
    })();
}

/**************************************************************************/

//打开百度并搜索
module.exports.testTwo = function(){
    (async () => {
        const browser = await puppeteer.launch({
            headless:false, //关闭无头模式，使浏览器可见
            timeout: 0, // 默认超时为30秒，设置为0则表示不设置超时
        });

        const page = await browser.newPage();
        //设置网页大小(分辨率)
        await page.setViewport({width: 1440, height: 800});
        let url = 'https://www.baidu.com';
        await page.goto(url,{
            waitUntil: 'networkidle2'  //等待网络状态为空闲的时候才继续执行
        });

        //获取输入框焦点并输入搜索内容
        await page.type('#kw','哪里有铁线做的耳机卖', {
            delay: 400, //控制 keypress 也就是每个字母输入的间隔
        });

        //搜索
        await page.click('#su');

        //关闭浏览器
        //await browser.close();
    })();
}

/**************************************************************************/

//截图
module.exports.testThree = function(){
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width:1440,
            height:800
        });
        await page.goto('http://zuidazy.net/');
        await page.screenshot({path: 'example.png'});

        await browser.close();
    })();
}

/**************************************************************************/

//音乐
module.exports.testFour = function(){
    (async () => {
        const browser = await puppeteer.launch({
            headless:false
        });
        const page = await browser.newPage();
        await page.setViewport({
            width:1440,
            height:800,
            touch:true
        });
        await page.goto('https://music.163.com/',{
            waitUntil: 'networkidle2'  //等待网络状态为空闲的时候才继续执行
        });

        // //点击歌曲搜索
        // await page.click('.btn:last-child');   //.btn:last-child选择相同class中的最后一个
        // //获取输入框焦点并输入搜索内容
        // await page.type('#search-wd','隐形的翅膀',{
        //     delay: 400   //控制 keypress 也就是每个字母输入的间隔
        // });
        // //点击搜索按钮
        // await page.click('.search-submit');


        // await page.type('#srch','隐形的翅膀',{
        //     delay: 200   //控制 keypress 也就是每个字母输入的间隔
        // });
        // await page.keyboard.press('Enter');
        //等待两秒
        //await page.waitFor(2000);
        await page.click('.m-nav li:last-child');

        //await browser.close();
    })();
}

/**************************************************************************/

//生成PDF
module.exports.testFive = function(){
    (async () => {
        const browser = await puppeteer.launch({
            //headless:false
        });
        const page = await browser.newPage();
        await page.setViewport({
            width:1440,
            height:800
        });
        //打开博客页面
        await page.goto('http://es6.ruanyifeng.com/#README',{
            waitUntil: 'networkidle2'  //等待网络状态为空闲的时候才继续执行
        });
        await page.screenshot({path: 'example.png'});
        const result = await page.evaluate(()=>{
            //拿到页面上的jQuery
            let $ = window.$;
            //存储信息
            let all_msg = [];
            let items = $('ol li');

            // //循环li标签      此方法失效
            // items.each((item)=>{
            //    let book = $(this);
            //    let name = book.find('a').text();
            //    let href = book.find('a').attr('href');
            //
            //    all_msg.push({
            //        name:name,
            //        href:href
            //    });
            // });

            //循环li标签
            for(let i = 0;i<=items.length-1;i++){
                let item = $('ol li:nth-child('+(i+1)+')');  //根据i的值获取对应的li标签中a标签的内容
                let name = item.find('a').text();
                let href = item.find('a').attr('href');
                all_msg.push({
                    name:name,
                    href:href
                })
            }
            return all_msg;

        });

        //关闭当前页面
        page.close();


        //批量生成PDF
        for(let i = 1;i<result.length;i++){
            const page2 = await browser.newPage();
            await page2.goto('http://es6.ruanyifeng.com/'+result[i].href,{
                waitUntil: 'networkidle2'  //等待网络状态为空闲的时候才继续执行
            })

            //只在第一章里截取目录，其余章节隐藏目录
            if(i!=1){
                //把左侧去导航栏隐藏掉
               await page2.evaluate(()=>{
                    //左侧导航栏
                    let slider = document.querySelector('#sidebar');
                    //留言
                    let words = document.querySelector('#留言');
                    if(slider){
                        //隐藏slider
                        slider.style.display = 'none';
                        words.style.display = 'none';
                    }
                });
            }

            //生成PDF,这里需要注意一点，打印pdf需要把无头浏览器界面关掉，即把headless设为true或者不设置
            await page2.pdf({
                path: './PDF/'+i+'.'+result[i].name+'.pdf',
                format: 'A4', // 保存尺寸
            });
            //console.log(typeof result);   //判断result的返回值类型   输出为object
            console.log(result[i].name);
            //关闭当前页面
            page2.close();
        }
        console.log('所有PDF文件已生成')

        //将所有PDF文件合并为一个文件
         function Merge(){
            //配置文件路径
            let files = [];
            //配置文件路径
            for(let i = 1;i<result.length;i++){
                files.push('PDF/'+(i)+'.'+result[i].name+'.pdf')
            }
            console.log(files);
            merge(files,'ES6.pdf',function(err){
                if(err)
                    return console.log(err);
                console.log('所有文件合并完成！');

            });
        }
        Merge();
        //关闭浏览器
        //await browser.close();
    })();
}

//测试
/*module.exports.testA = function(){
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width:1440,
            height:800
        });
        await page.goto('http://es6.ruanyifeng.com/',{
            waitUntil: 'networkidle2'  //等待网络状态为空闲的时候才继续执行
        });
        //把左侧去导航栏隐藏掉
        await page.evaluate(()=>{
            //左侧导航栏
            let slider = document.querySelector('#sidebar');
            //留言
            let words = document.querySelector('#留言');
            if(slider){
                //隐藏slider
                slider.style.display = 'none';
                words.style.display = 'none';
            }

        });
        await page.pdf({path: 'testA.pdf'});

        await browser.close();
    })();
}*/
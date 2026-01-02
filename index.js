const express = require('express');
const morgan = require('morgan');
const Decimal = require('decimal.js');
const {getLogs} = require('./userDB'); // DB 가져오기 

const app = express();
const port = 3000;

app.use(express.json());

app.use(morgan('combined')); 

// ------------------------ 계산 -------------------------

app.get('/add', (req, res) => { 
    try {
        let num = req.query.num;

        if (!num) { 
           return res.status(400).json({ error: '값이 필요' }); 
        }

        if (!Array.isArray(num)) { 
           num = [num];
        }

        if (num.length < 2) { 
            return res.status(400).json({ error: '값은 2개 이상 필요' });
        } 

        let result = new Decimal(0); 

        num.forEach(n => { 
            result = result.plus(Number(n));
        });

        
        getLog("addition", num);

        res.status(200).json({ result: String(result) });
    }
     catch (error) {
        res.status(500).json({ error: '내부 오류' });
    }
});
// 덧셈



app.get('/min', (req, res) => {
    try {
        let num = req.query.num;

        if (!num) {
            return res.status(400).json({ error: '값이 필요' });
        }
        

        if (!Array.isArray(num)) {
            num = [num];
        }    
        
        if (num.length < 2) {
            return res.status(400).json({ error: '값은 2개 이상 필요' });
        }

        
        let result = new Decimal(num[0]); 

        num.slice(1).forEach(n => {
            result = result.minus(Number(n));
        });

        getLog("minus", num);

        res.status(200).json({ result: String(result) });
        
            
        
    } catch (error) {
        res.status(500).json({ error: '내부 서버 오류' });
    }
});
// 뺄셈


app.get('/mul', (req, res) => {
    try {
        let num = req.query.num;
        
        if (!num) {
            return res.status(400).json({ error: '값이 필요' });
        } 
       
        if (!Array.isArray(num)) {
            num = [num];
        }
            
        if (num.length < 2) {
            return res.status(400).json({ error: '값은 2개 이상 필요' });
        }
            
        let result = new Decimal(1);

        num.forEach(n => {

            result = result.times(Number(n));
        });

        getLog("multiplication", num);

        res.status(200).json({ result: String(result) });
            
        
    } catch (error) {
        res.status(500).json({ error: '내부 오류' });
    }
});
// 곱셈


app.get('/div', (req, res) => {
    try {
        let num = req.query.num; 

        if (!num) {
            return res.status(400).json({ error: '값이 필요' });
        }
        

        if (!Array.isArray(num)) {
            num = [num];
        }
        
        if (num.length < 2) {
            return res.status(400).json({ error: '값은 2개 이상 필요' });
        }
        
        let result = new Decimal(num[0]);

        num.slice(1).forEach(n => {
            result = result.dividedBy(Number(n));
        });

        getLog("division", num);
        res.status(200).json({ result: String(result) });
            
        
    } catch (error) {
        res.status(500).json({ error: '내부 서버 오류' });
    }
});
// 나눗셈
// ------------------------ 계산 -------------------------

// ------------------------ 로그 -------------------------

let logs = []; 
let logId = 1; 

function getLog(method, values) { 
    logs.push({
        id: logId++, 
        request_time: new Date().toISOString().replace('Z', '+09:00'), 
        method: method, 
        values: JSON.stringify(values.map(Number)) 
    });

    getLogs(method, values); // DB
}
// 로그 저장 

app.get('/logs', (req, res) => {
    try {
        let num = req.query.num;

        if (!num) { 
            return res.status(400).json({ error: '값이 필요합니다' }); 
        }

        num = Number(num); 

        if (isNaN(num) || num < 1 || num > 100) { 
            return res.status(400).json({ error: '값은 1~100이여야 합니다' });
        }

        const arrLogs = logs.toSorted((a, b) => new Date(b.request_time) - new Date(a.request_time));

        res.status(200).json({
            results: logs.length,   
            requested_num: num,     
            data: arrLogs.slice(0, num) 
        });


    } catch (err) {
        res.status(500).json({ error: '내부 서버 오류' });
    }
});
// 로그 조회
// ------------------------ 로그 -------------------------

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

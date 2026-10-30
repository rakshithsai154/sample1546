const express = require('express');
const fs = require('fs');

const app = express();
const port = 6000;

app.use(express.json());

function mywrite(data) {
    fs.writeFileSync('students.json', JSON.stringify(data, null, 2));
}

app.get('/', function(req, res) {
    res.send('<h3>Welcome to my REST API Server</h3>');
});

app.get('/list', function(req, res) {
    const stu = JSON.parse(fs.readFileSync('students.json', 'utf8'));
    res.send(stu);
});

app.post('/', function(req, res) {
    const stu = JSON.parse(fs.readFileSync('students.json', 'utf8'));

    const newStu = req.body;
    stu.push(newStu);

    mywrite(stu);
    res.send('Student Record Inserted');
});

app.put('/', function(req, res) {
    const stu = JSON.parse(fs.readFileSync('students.json', 'utf8'));
    const upstu = req.body;

    for (let s in stu) {
        if (stu[s].roll == upstu.roll) {
            stu[s].name = upstu.name;
            stu[s].branch = upstu.branch;
            stu[s].cgpa = upstu.cgpa;

            mywrite(stu);
            res.send('Student Data Updated Successfully');
            return;
        }
    }

    res.send('Student Record Not Found');
});

app.delete('/', function(req, res) {
    const stu = JSON.parse(fs.readFileSync('students.json', 'utf8'));
    const delstu = req.body;

    for (let s in stu) {
        if (stu[s].roll == delstu.roll) {
            stu.splice(s, 1);
            mywrite(stu);
            res.send('Student Record Deleted Successfully');
            return;
        }
    }

    res.send('Student Record Not Found');
});

app.listen(port, function() {
    console.log('Server started on port ' + port);
});